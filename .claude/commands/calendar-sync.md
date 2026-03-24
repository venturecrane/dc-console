# /calendar-sync - Calendar Sync

Create actual session events on Google Calendar from D1 session history. Planned events are never modified or deleted — they represent the work plan and coexist with actuals.

## Usage

```
/calendar-sync
```

## Execution

### Step 1: Fetch Session History

Call `crane_schedule(action: "session-history", days: 7)` to get ended sessions aggregated by venture and date, with sessions merged into contiguous blocks (gaps > 30 min create separate blocks).

This returns entries like:

```json
{
  "venture": "vc",
  "work_date": "2026-03-21",
  "blocks": [
    {
      "start": "2026-03-21T13:30:00Z",
      "end": "2026-03-21T16:00:00Z",
      "session_count": 2,
      "hosts": ["m16.local"],
      "repos": ["crane-console"],
      "branches": ["main"],
      "issues": []
    },
    {
      "start": "2026-03-21T19:00:00Z",
      "end": "2026-03-21T21:00:00Z",
      "session_count": 1,
      "hosts": ["m16.local"],
      "repos": ["crane-console"],
      "branches": ["main"],
      "issues": [347]
    }
  ],
  "total_sessions": 3
}
```

Only `status = 'ended'` sessions are included. Abandoned sessions are excluded (heartbeat data is unreliable).

### Step 2: Create/Update Actual Events

For each venture/day entry from session history, each **block** becomes a separate calendar event:

1. Query existing actual events: `crane_schedule(action: "planned-events", from: "{work_date}", to: "{work_date}", type: "actual")`

2. **Reconcile blocks against existing actual events:**
   - Match blocks to existing events by time proximity (closest start time)
   - **Matched event, times differ**: Update the Google Calendar event times and the D1 record: `crane_schedule(action: "planned-event-update", id: "{id}", start_time: "{block.start}", end_time: "{block.end}", sync_status: "synced")`
   - **Matched event, times match**: Skip (already synced)
   - **Unmatched block (no existing event)**: Create a new Google Calendar event with the block's venture and times, then create a D1 record: `crane_schedule(action: "planned-event-create", ...)` with type='actual'
   - **Orphaned actual event (no matching block)**: Delete the Google Calendar event and update the D1 record to type='cancelled'

**IMPORTANT: Never modify, replace, or delete planned events.** Planned events are the work schedule set by `/work-plan`. They stay on the calendar regardless of what actually happened. The calendar shows both planned blocks and actual session blocks side by side.

### Step 3: Display Summary

Show a table of synced sessions:

```
## Calendar Sync Summary

| Date | Venture | Start | End | Sessions | Action |
|------|---------|-------|-----|----------|--------|
| 2026-03-21 | VC | 6:30am | 9:00am | 2 | updated |
| 2026-03-21 | VC | 12:00pm | 2:00pm | 1 | created |
| 2026-03-20 | VC | 7:00am | 5:00pm | 3 | already synced |

Synced: 2 blocks, Already synced: 1 block
```

## Calendar Result

After sync, Google Calendar should show:

- **Past days**: Both planned blocks (from /work-plan) AND actual session blocks (from D1)
- **Future days**: Planned blocks only (from /work-plan)
- Planned and actual events coexist — they are not mutually exclusive
- Multiple actual events per venture per day are expected when work sessions have gaps > 30 minutes

## Timezone

All times stored in UTC in D1. Display conversion uses UTC-7 (America/Phoenix, no DST).
