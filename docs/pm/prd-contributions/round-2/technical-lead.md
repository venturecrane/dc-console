# Technical Lead Contribution -- PRD Rewrite Round 2

**Author:** Technical Lead (Claude Agent)
**Date:** February 6, 2026
**Scope:** Phase 0 only
**Status:** Revised after cross-role review

---

## Changes from Round 1

### Key Revisions

1. **Auto-save debounce interval changed from 5s to 2s.** The BA (US-015) specified 2 seconds. The UX Lead also described "every few seconds of inactivity." The target customer expressed acute anxiety about losing work ("If my iPad loses Wi-Fi in a hotel, do I lose what I typed?"). Two seconds is more protective and still manageable for Drive API call volume. Updated throughout the architecture, NFRs, and data model sections.

2. **Resolved the D1-vs-Drive auto-save conflict.** The BA (US-015, OQ-10) proposed saving content to D1 as the working copy with Drive for exports only. My Round 1 proposed metadata-only in D1, content flows directly to Drive on every save. These are contradictory. I am retaining the metadata-only-in-D1 approach because it aligns with the PM's Principle 2 ("user's files are sacred" -- Drive is canonical) and the project instructions ("We index and cache; we never become the canonical store"). However, I have added an explicit IndexedDB local buffer as the fast-path working copy, addressing the BA's performance concerns without adding content to D1. Added a new section clarifying the three-tier save architecture: IndexedDB (instant) -> Google Drive (on debounce) -> D1 (metadata only).

3. **Added "Try Again" to AI rewrite flow.** The UX Lead's interaction pattern (Section 5c, Step 6) shows the user requesting multiple rewrites before accepting. My Round 1 API had only `/ai/rewrite`, `/ai/accept`, and `/ai/reject`. Added detail to support iterative rewrites within a single session, referencing BA user story US-017 and UX interaction pattern 5c.

4. **Added chapter reorder API.** The UX Lead described drag-to-reorder in the sidebar (Step 6, point 7). The BA listed drag-and-drop as out of scope for Phase 0 (US-010). My Round 1 included a `PATCH /projects/:projectId/chapters/reorder` endpoint. I am retaining it because the UX Lead's persona Marcus explicitly needs this, and the technical cost is low. Flagged the discrepancy for PM resolution.

5. **Strengthened export quality risk.** The competitor analyst's "uncomfortable truth" -- that Atticus at $147.99 already does browser-based chapter editing with professional export, and DraftCrane Phase 0 export will look amateur by comparison -- elevates the PDF/EPUB risk. Updated Risk 5 with competitor context and sharpened the ADR-004 framing. Aligned with the UX Lead's emphasis on the "artifact moment" (Step 9) where seeing a professional-looking PDF creates psychological momentum.

6. **Added project description field to data model.** The UX Lead's journey (Step 3) includes a "brief description of your book" field during project setup. My Round 1 `projects` table had no `description` column. Added it.

7. **Added SSE streaming as a requirement, not optional.** My Round 1 mentioned SSE streaming. The UX Lead's AI interaction pattern (Step 7, point 4) explicitly calls for streaming text appearing word-by-word. The target customer mentioned perceived speed. The BA (US-017 Out of Scope) listed streaming as "evaluate for Phase 1 UX improvement" -- I disagree. Streaming reduces perceived wait time from 5-8 seconds to under 2 seconds (first token). This is essential for Phase 0 given the PM's risk that "AI rewrite quality is poor" (Risk 5) -- streaming makes even slower responses feel responsive. Promoted from nice-to-have to requirement.

8. **Clarified OAuth flow as redirect-based, not popup.** The UX Lead (Step 2) and BA (US-005) both flag Safari popup blocker issues. Updated the auth flow to specify redirect-based OAuth exclusively.

9. **Added `prefers-reduced-motion` as a technical requirement.** The UX Lead's accessibility section (Reduced Motion Preferences) identifies specific animations that must respect this media query. Added to NFRs.

10. **Added `description` to project creation and single-book vs. multi-book question.** UX Lead proposes one book per user in Phase 0 (Step 3). BA (OQ-4) recommends multiple projects. My data model supports multiple. Flagged for PM resolution but kept the multi-project schema since it costs nothing extra.

11. **Added chapter deletion behavior to API.** BA user story US-014 specifies chapter deletion rules (minimum one chapter, confirmation required). Updated API surface to reflect these constraints and reference the Drive file handling (trash vs. permanent delete).

12. **Added explicit `visualViewport` API reference for keyboard handling.** The UX Lead's iPad constraints (Section 4, Keyboard Handling) identify the `visualViewport` API as critical for detecting keyboard state. Added to NFRs as a specific technical requirement with a Safari compatibility note.

---

## 1. Architecture Overview (PRD Section 10 Rewrite)

### System Boundaries

DraftCrane Phase 0 has three deployment boundaries:

```
+-----------------------------------------------------------------+
|                    USER'S IPAD / BROWSER                         |
|                                                                   |
|  Next.js App (SSR + Client)                                      |
|  +------------+  +------------+  +--------------------------+    |
|  | Auth (Clerk |  | Chapter    |  | Export UI                |    |
|  | Components) |  | Editor     |  | (trigger + download)     |    |
|  +------+------+  +------+-----+  +----------+--------------+    |
|         |                |                    |                    |
|  +------+----------------+--------------------+--+                |
|  |           IndexedDB Local Buffer              |                |
|  |   (keystroke-level write-ahead log)           |                |
|  +------+----------------+--------------------+--+                |
|         |                |                    |                    |
+---------+----------------+--------------------+--------------------+
          |                |                    |
          v                v                    v
+-----------------------------------------------------------------+
|                CLOUDFLARE EDGE (dc-api Worker)                   |
|                                                                   |
|  Hono Router                                                      |
|  +------------+  +------------+  +------------+                  |
|  | /auth/*    |  | /projects/*|  | /ai/*      |                  |
|  | /drive/*   |  | /chapters/*|  | /export/*  |                  |
|  +------+-----+  +------+-----+  +------+-----+                  |
|         |                |               |                        |
|  +------+----------------+---------------+-----+                  |
|  |              Services Layer                  |                  |
|  |  DriveService | ProjectService | AIService   |                  |
|  +------+--------------+----------------+------+                  |
|         |               |                |                        |
|  +------+---+  +--------+--+  +----------+--+                    |
|  | D1       |  | R2        |  | KV           |                    |
|  | (meta)   |  | (artifacts)|  | (cache)     |                    |
|  +----------+  +-----------+  +--------------+                    |
+-----------------------------------------------------------------+
          |                |                    |
          v                v                    v
+-----------------------------------------------------------------+
|                     EXTERNAL SERVICES                            |
|                                                                   |
|  +------------+  +------------+  +------------+                  |
|  | Clerk      |  | Google Drive|  | Anthropic  |                  |
|  | (auth)     |  | API (files) |  | Claude API |                  |
|  +------------+  +------------+  +------------+                  |
+-----------------------------------------------------------------+
```

**Change from Round 1:** Added IndexedDB Local Buffer as an explicit architectural component in the browser tier. This addresses the BA's concern (US-015) about fast local saves and the target customer's anxiety about data loss. IndexedDB acts as a write-ahead log between the editor and the network save path.

### Layer Responsibilities

| Layer | Technology | Responsibility | Does NOT Do |
|-------|-----------|----------------|-------------|
| **Frontend** | Next.js + Tailwind | Rendering, editor state, IndexedDB write-ahead log, debounced save orchestration, user interactions | Store canonical content long-term, call external APIs directly, hold OAuth tokens |
| **Backend** | Hono on CF Workers | API gateway, business logic, Drive/AI orchestration, token management | Render UI, hold long-lived state, run >30s operations |
| **D1** | Cloudflare D1 (SQLite) | User metadata, project structure, chapter ordering, AI interaction logs, export job tracking | Store manuscript content (that belongs in Drive) |
| **R2** | Cloudflare R2 | Export artifacts (PDF/EPUB), cached images | Long-term content storage (Drive is canonical) |
| **KV** | Cloudflare KV | Session data, Drive API response caching, rate limit counters | Relational queries, large objects |
| **IndexedDB** | Browser-native | Keystroke-level content buffer, crash recovery, offline queue | Long-term storage, cross-device sync |
| **Clerk** | External SaaS | User authentication, session management, JWT issuance | Authorization logic (we own that) |
| **Google Drive** | External API | Canonical manuscript storage, user file ownership | Indexing, search, metadata queries |
| **Claude API** | External API | Text rewriting, expansion, simplification | Autonomous content generation, training on user data |

### Three-Tier Save Architecture

This is the core data flow design that resolves the tension between the BA's proposal (save to D1 as working copy) and the project instructions principle (Drive is canonical). References: BA US-015, PM Principle 2, UX Lead Step 6, Target Customer pain point on data loss.

```
Tier 1: IndexedDB (instant, every keystroke)
  - Purpose: Crash protection, offline buffer
  - Latency: <1ms (local write)
  - Data loss window: Zero (within browser lifetime)
  - Survives: Tab switch, app switch, brief network loss
  - Does NOT survive: iOS killing Safari under memory pressure, browser cache clear

Tier 2: Google Drive (debounced, every 2s of inactivity)
  - Purpose: Canonical persistence, user file ownership
  - Latency: 200-1500ms (network + Drive API)
  - Data loss window: Up to 2s of typing if Drive save fails AND IndexedDB is lost
  - Survives: Everything except Google account deletion
  - Triggered by: Debounce timer, tab visibility change, explicit Cmd+S, chapter switch

Tier 3: D1 Metadata (on every successful Drive save)
  - Purpose: UI rendering (chapter list, word counts, timestamps), version tracking
  - Latency: <50ms (Cloudflare edge)
  - Stores: updated_at, word_count, version counter. Never stores content.
```

**Why NOT store content in D1 (addressing BA OQ-10):** If we cache content in D1, we create a second source of truth. Every Drive save must also update D1. If one succeeds and the other fails, we have divergent state. The project instructions are explicit: "We index and cache; we never become the canonical store." IndexedDB provides the fast local buffer the BA was seeking, without the sync complexity of a server-side content cache.

### Request Flow: Core Operations

#### Flow A: User Signs In and Connects Google Drive

```
1. User opens DraftCrane in Safari -> Next.js serves the app
2. User clicks "Get Started" -> Clerk embedded component handles auth
   - "Continue with Google" is primary (per UX Lead Step 2)
   - Redirect-based OAuth, NOT popup (Safari popup blocker mitigation)
   - Per UX Lead: request only auth scopes here, not Drive scopes
3. Clerk issues a session JWT -> stored as httpOnly cookie
4. Frontend redirects to Writing Environment (not a dashboard)
   - Per UX Lead Section 3: "There is no dashboard" in Phase 0
   - First-run: redirect to Book Setup Screen (title + description)
   - Returning user: load last-edited chapter directly

5. User clicks "Connect Google Drive" (contextual banner, not blocking)
   - Per UX Lead Step 4: gentle banner, "Maybe later" option
   - Per BA US-005: redirect-based flow, not popup
6. Frontend navigates to GET /api/drive/authorize
7. dc-api builds Google OAuth URL (scope: drive.file) -> returns redirect URL
8. User grants consent on Google's OAuth screen
9. Google redirects back to /api/drive/callback?code=XXX
10. dc-api exchanges code for access_token + refresh_token
11. dc-api encrypts tokens, stores in D1 (drive_connections table)
12. dc-api calls Drive API: list root folders -> returns to frontend
13. Frontend shows folder picker (bottom sheet per UX Lead Step 4)
    - Per UX Lead: "Create New Folder" option at top
    - Per BA US-006: one Book Folder per project
14. User selects or creates a folder -> dc-api stores folder_id in D1
15. Frontend shows "Connected to Google Drive. Saving to: [folder path]"
    with a green checkmark (per UX Lead Step 4)
```

**Key design decisions:**
- OAuth tokens never reach the frontend. Stored server-side in D1, encrypted at rest.
- We request `drive.file` scope (not full Drive access) -- only files created by or explicitly shared with our app. Confirmed by BA OQ-2.
- Redirect-based OAuth only. No popups. Per UX Lead Step 2 and BA US-005.
- Refresh token rotation: dc-api handles token refresh transparently on every Drive API call.
- Drive connection is non-blocking. The user can write without connecting Drive. Content saves to IndexedDB, and once Drive is connected, existing content syncs. Per UX Lead Step 4.

#### Flow B: User Writes and Auto-Saves a Chapter

```
1. User navigates to a chapter -> frontend loads chapter metadata from dc-api
2. dc-api returns chapter metadata (title, order, drive_file_id) from D1
3. Frontend fetches chapter content:
   GET /api/chapters/:id/content
4. dc-api reads file content from Google Drive API using stored tokens
5. Content returned to frontend -> rendered in editor
6. Frontend also writes initial content to IndexedDB (Tier 1 baseline)

7. User types in editor -> every keystroke writes to IndexedDB (Tier 1)
8. Auto-save debounce triggers (2 seconds after last keystroke):
   PUT /api/chapters/:id/content
   Body: { content: "<html>...", version: 42 }
9. dc-api writes content to Google Drive via Files.update() (Tier 2)
10. dc-api updates chapter metadata in D1 (Tier 3):
    updated_at, word_count, version
11. dc-api returns { saved: true, version: 43 }
12. Frontend shows "Saved" indicator (per UX Lead Step 6: "Saved" with checkmark)

Edge cases (per BA Edge Cases section):
- Drive API fails -> dc-api returns error -> frontend retains IndexedDB buffer,
  shows "Unable to save. Your changes are stored locally. Will retry."
  (per UX Lead Step 6, BA auto-save edge case) -> exponential backoff: 2s, 4s, 8s
- Version conflict -> dc-api returns 409 -> frontend prompts user:
  "This chapter was modified elsewhere. View changes / Overwrite / Reload."
  (per BA US-015: "local content is never silently discarded")
- Tab goes to background -> visibilitychange event triggers immediate save
  (more reliable than beforeunload on iOS per Risk 3)
- Network offline -> navigator.onLine false -> queue saves in IndexedDB,
  show "Offline" indicator -> flush queue when back online
- Cmd+S pressed -> immediate save, "Saved" indicator updates
  (per UX Lead Section 4, Keyboard Handling)
```

**Key design decisions:**
- Three-tier save: IndexedDB -> Drive -> D1 metadata. See architecture above.
- 2-second debounce (revised from 5s per BA US-015 and target customer feedback).
- `visibilitychange` event for background save (not `beforeunload`, which is unreliable on iOS).
- Cmd+S is supported as a reassurance mechanism even though auto-save is active.

#### Flow C: User Requests AI Rewrite of Selected Text

```
1. User selects text in editor -> DraftCrane floating toolbar appears
   near the selection with "AI Rewrite" button
   (per UX Lead Section 5c: separate from native context menu)

2. User taps "AI Rewrite" -> bottom sheet slides up from bottom
   (per UX Lead Section 5c, Step 2)
   Bottom sheet shows:
   - Original text (quoted)
   - Instruction input with suggestion chips:
     "Simpler language" | "More concise" | "More conversational" | "Stronger"
     (per UX Lead Section 5c, Step 2 and Competitor Analyst lesson 4.4)
   - "Rewrite" button (disabled until instruction provided)

3. User taps a chip or types instruction, taps "Rewrite"

4. Frontend sends:
   POST /api/ai/rewrite
   Body: {
     chapter_id: "ch_123",
     selected_text: "The paragraph to rewrite...",
     instruction: "simpler language",
     surrounding_context: "...preceding 500 chars... [SELECTED] ...following 500 chars..."
   }

5. dc-api validates request (auth, ownership, content length limits)
6. dc-api builds Claude API prompt:
   - System: "You are a writing assistant. Rewrite the selected text according
     to the user's instruction. Preserve meaning and match the surrounding tone.
     Return only the rewritten text."
   - User: selected_text + surrounding_context + instruction
7. dc-api calls Anthropic Claude API (streaming response)
8. dc-api streams response back to frontend via SSE
   (REQUIRED, not optional -- per UX Lead Step 7 point 4, reduces perceived wait)

9. Frontend displays rewrite streaming word-by-word in bottom sheet
   (per UX Lead Section 5c, Step 4)

10. Bottom sheet shows completed result:
    - Original text (collapsible, per UX Lead Section 5c, Step 5)
    - Rewritten text (prominent)
    - "Use This" (primary) | "Try Again" (secondary) | "Discard" (tertiary)
    (per UX Lead Section 5c, Step 5)

11a. User taps "Use This":
    - Text replaced in editor with brief highlight flash
      (respects prefers-reduced-motion per UX Lead Section 6)
    - Bottom sheet closes
    - POST /api/ai/accept { interaction_id: "..." }
    - Auto-save triggers (Flow B)
    - Undo via Cmd+Z restores original (per BA US-018, UX Lead Section 5c)

11b. User taps "Try Again":
    - Instruction input reappears with previous instruction editable
    - User modifies instruction and taps "Rewrite" again
    - New API call, same flow from step 4
    - Original text always preserved until explicit "Use This"
    (per UX Lead Section 5c, Step 6)

11c. User taps "Discard" or taps outside bottom sheet:
    - Bottom sheet closes, original text unchanged
    - POST /api/ai/reject { interaction_id: "..." }

12. dc-api logs the interaction to D1 (ai_interactions table):
    { chapter_id, action, input_chars, output_chars, model, latency_ms, accepted }
    Input/output text is NOT stored -- only metadata.
```

**Key design decisions:**
- AI never modifies content directly. User always sees a preview and explicitly accepts or rejects. Per PM Principle 3, BA US-018.
- SSE streaming is a requirement. First token visible in <2 seconds. Per UX Lead, target customer feedback.
- "Try Again" supported within a single session. Original always preserved. Per UX Lead Section 5c.
- Suggestion chips replace Phase 0's need for freeform AI prompting. Per UX Lead and Competitor Analyst lesson 4.4 (Sudowrite pattern: specific transformations > generic "rewrite this").
- Bottom sheet UI, not modal or inline. Per UX Lead Section 5c: does not cover the selected text, works with keyboard state.
- Content length limits enforced server-side: max 2,000 words selected, max 500 chars surrounding context each side. Per BA OQ-11: min 1 word, max ~2000 words.

---

## 2. Proposed Data Model (Phase 0)

### Guiding Principle: Metadata in D1, Content in Drive, Buffer in IndexedDB

D1 stores everything needed to render the UI, enforce authorization, and track state. Google Drive stores everything the user would want to keep if DraftCrane disappeared. IndexedDB provides instant local persistence as crash protection.

| Data | Storage | Rationale |
|------|---------|-----------|
| User profile, preferences | D1 | App-internal, not user-owned content |
| Project structure (title, description, settings) | D1 | Metadata about the book, not the book itself |
| Chapter ordering, titles, word counts | D1 | Navigation structure, frequently queried |
| Chapter body content (canonical) | Google Drive | User's canonical manuscript. Sacred. (PM Principle 2) |
| Chapter body content (local buffer) | IndexedDB | Crash recovery, offline queue. Ephemeral. |
| OAuth tokens (encrypted) | D1 | Server-side only, never exposed to client |
| AI interaction logs | D1 | Analytics, cost tracking. No user content stored. |
| Export artifacts (PDF/EPUB) | R2 | Temporary; also written back to user's Drive |
| Session/cache data | KV | Ephemeral, performance optimization |

### D1 Schema (Phase 0)

#### Migration 0001: `0001_create_users.sql`

```sql
CREATE TABLE users (
    id              TEXT PRIMARY KEY,           -- Clerk user ID (e.g., "user_2x...")
    email           TEXT NOT NULL,
    display_name    TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
```

#### Migration 0002: `0002_create_drive_connections.sql`

```sql
CREATE TABLE drive_connections (
    id              TEXT PRIMARY KEY,           -- ULID
    user_id         TEXT NOT NULL REFERENCES users(id),
    access_token    TEXT NOT NULL,              -- Encrypted (AES-256-GCM)
    refresh_token   TEXT NOT NULL,              -- Encrypted (AES-256-GCM)
    token_expires_at TEXT NOT NULL,
    drive_email     TEXT,                       -- Google account email
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_drive_connections_user ON drive_connections(user_id);
```

#### Migration 0003: `0003_create_projects.sql`

```sql
CREATE TABLE projects (
    id              TEXT PRIMARY KEY,           -- ULID
    user_id         TEXT NOT NULL REFERENCES users(id),
    title           TEXT NOT NULL,
    description     TEXT,                       -- NEW: per UX Lead Step 3 (brief book description)
    drive_folder_id TEXT,                       -- Google Drive folder ID for this book
    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived')),
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_projects_user ON projects(user_id);
```

**Change from Round 1:** Added `description` column. The UX Lead's project setup flow (Step 3) includes a brief book description field: "A practical guide for managers who want to build systems, not just manage people." This description could also serve as initial context for AI rewrite prompts in future phases (e.g., the Book Blueprint seed). The BA's US-009 only requires a title, but the UX flow includes it, and it costs nothing to store. If the PM decides description is unnecessary for Phase 0, the column is nullable and harmless.

**Open question: single vs. multi-project.** The UX Lead (Section 3) proposes "Phase 0 supports one book per user." The BA (OQ-4) recommends multiple projects. The schema supports multiple projects (no constraint). If the PM decides single-project, enforce it in the service layer, not the schema. This avoids a migration when multi-project is enabled.

#### Migration 0004: `0004_create_chapters.sql`

```sql
CREATE TABLE chapters (
    id              TEXT PRIMARY KEY,           -- ULID
    project_id      TEXT NOT NULL REFERENCES projects(id),
    title           TEXT NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    drive_file_id   TEXT,                       -- Google Drive file ID for this chapter
    word_count      INTEGER NOT NULL DEFAULT 0,
    version         INTEGER NOT NULL DEFAULT 1, -- Optimistic concurrency control
    status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'review', 'final')),
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_chapters_project ON chapters(project_id);
CREATE UNIQUE INDEX idx_chapters_sort ON chapters(project_id, sort_order);
```

**Business rules enforced in service layer (per BA US-010, US-014):**
- A project must always have at least one chapter (BA US-014). Enforce on delete, not on schema.
- Chapter title must be non-empty; whitespace-only titles revert to "Untitled Chapter" (BA US-013). Max 200 characters (BA OQ-8).
- No artificial chapter count limit. Performance test at 50+ chapters (BA OQ-5).
- `sort_order` is a gapless integer sequence within a project. Reorder operations update all affected sort_order values in a single transaction.

#### Migration 0005: `0005_create_ai_interactions.sql`

```sql
CREATE TABLE ai_interactions (
    id              TEXT PRIMARY KEY,           -- ULID
    user_id         TEXT NOT NULL REFERENCES users(id),
    chapter_id      TEXT REFERENCES chapters(id),
    action          TEXT NOT NULL               -- 'rewrite', 'expand', 'simplify'
                    CHECK (action IN ('rewrite', 'expand', 'simplify')),
    instruction     TEXT,                       -- NEW: the user's instruction text (e.g., "simpler language")
    input_chars     INTEGER NOT NULL,           -- Length of selected text
    output_chars    INTEGER NOT NULL,           -- Length of AI response
    model           TEXT NOT NULL,              -- e.g., 'claude-sonnet-4-20250514'
    latency_ms      INTEGER NOT NULL,
    accepted        INTEGER NOT NULL DEFAULT 0, -- 0 = rejected/discarded, 1 = accepted
    attempt_number  INTEGER NOT NULL DEFAULT 1, -- NEW: tracks "Try Again" iterations
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_chapter ON ai_interactions(chapter_id);
```

**Changes from Round 1:**
- Added `instruction` column to track what the user asked for (the chip text or custom instruction). Useful for understanding which instruction types produce more accepts. Does not store user manuscript content.
- Added `attempt_number` to track "Try Again" iterations per session. Helps us understand if users typically accept on first try or iterate.

#### Migration 0006: `0006_create_export_jobs.sql`

```sql
CREATE TABLE export_jobs (
    id              TEXT PRIMARY KEY,           -- ULID
    project_id      TEXT NOT NULL REFERENCES projects(id),
    user_id         TEXT NOT NULL REFERENCES users(id),
    format          TEXT NOT NULL               -- 'pdf', 'epub'
                    CHECK (format IN ('pdf', 'epub')),
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    r2_key          TEXT,                       -- R2 object key for the generated file
    drive_file_id   TEXT,                       -- Drive file ID once uploaded
    error_message   TEXT,
    chapter_count   INTEGER,                    -- NEW: number of chapters included
    total_word_count INTEGER,                   -- NEW: total words across all chapters
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    completed_at    TEXT
);

CREATE INDEX idx_export_jobs_project ON export_jobs(project_id);
CREATE INDEX idx_export_jobs_user ON export_jobs(user_id);
```

**Changes from Round 1:** Added `chapter_count` and `total_word_count` for export analytics. Helps us understand what "good enough to export" looks like across users (PM metric: % users exporting, target customer's emphasis on "seeing it as a real book").

### Google Drive File Structure (per user)

```
Book Folder (user-selected)/
+-- Chapter 1 - Introduction.html        -- Created/managed by DraftCrane
+-- Chapter 2 - The Problem.html         -- One file per chapter
+-- Chapter 3 - The Solution.html
+-- _exports/                            -- Subfolder for generated files
    +-- MyBook - 2026-02-06.pdf          -- Timestamped per BA export naming rec
    +-- MyBook - 2026-02-06.epub
```

**File format:** HTML. Not plain text, not Google Docs native format. HTML preserves rich text formatting (bold, italic, headings, lists -- per BA US-011 formatting scope) and is the natural output of browser-based editors. Google Drive stores it as a regular file; the user can also open it in any browser.

**Export file naming:** `{Book Title} - {YYYY-MM-DD}.{format}` with timestamp appended per BA recommendation (OQ-14) to prevent accidental overwrites.

**Why not Google Docs native format?** The Google Docs API for content manipulation is separate from the Drive API, adds complexity, and introduces formatting translation issues. Storing as HTML keeps us in control of the format and eliminates a dependency on the Docs API. However, this means the files are not editable in Google Docs' native editing experience -- they open as rendered HTML in a browser tab. The PM should confirm this is acceptable to users. (Retained from Round 1 as an open question; the target customer's comment about wanting files she can "access" in Drive does not necessarily mean "edit in Docs.")

### IndexedDB Schema (Client-Side)

New section. Not present in Round 1.

```typescript
// IndexedDB database: "draftcrane"
// Object store: "chapter_buffer"

interface ChapterBuffer {
  chapterId: string;          // Matches D1 chapter ID
  content: string;            // HTML content
  localVersion: number;       // Incremented on every local change
  serverVersion: number;      // Last known server (Drive) version
  lastModified: number;       // Timestamp (Date.now())
  pendingSave: boolean;       // True if not yet synced to Drive
}
```

**On editor mount:** Compare `localVersion` vs. `serverVersion`. If `localVersion > serverVersion` AND `lastModified` is more recent than the Drive file's modifiedTime, offer recovery: "You have unsaved changes from your last session. Restore or discard?" (Per BA auto-save edge case: browser crash recovery.)

**On every keystroke:** Update `content`, increment `localVersion`, set `pendingSave = true`, update `lastModified`. This is cheap (~1ms for a local IndexedDB write).

**On successful Drive save:** Update `serverVersion` to match, set `pendingSave = false`.

### Notes on Schema Design

- **ULID over UUID:** ULIDs are sortable by creation time, which is useful for ordering without an extra query. They also work well as TEXT primary keys in SQLite/D1.
- **TEXT for dates:** D1 is SQLite under the hood. SQLite does not have a native datetime type. ISO 8601 text strings (`datetime('now')`) sort correctly and are unambiguous.
- **No cascading deletes:** Phase 0 does not need cascading delete operations. When we add project deletion (BA OQ-20), explicit service-level logic is safer than relying on CASCADE in a distributed system where Drive files also need cleanup.
- **No content in D1:** The `chapters` table has no `body` or `content` column. That data lives in Google Drive. D1 only has the `drive_file_id` pointer. This is the architectural expression of PM Principle 2 and project instruction #3.

---

## 3. Non-Functional Requirements (PRD Section 9 Rewrite)

### 3.1 Platform Compatibility

| Requirement | Target | How to Verify | Cross-Reference |
|-------------|--------|---------------|-----------------|
| iPad Safari support | iPadOS 17.0+ (Safari 17+) | Manual testing on iPad Air 5th gen or later; BrowserStack for coverage | UX Lead: primary target throughout |
| Desktop browser support | Chrome 120+, Firefox 120+, Safari 17+ | Automated E2E tests via Playwright | -- |
| Minimum viewport | 768px width (iPad portrait) | CSS breakpoint testing | UX Lead Section 4: portrait is secondary reading mode |
| Touch interaction | All primary actions completable via touch only | Manual QA checklist: no hover-dependent functionality | UX Lead Section 4: 44x44pt minimum touch targets |
| Virtual keyboard handling | Editor must not break when iOS keyboard appears/disappears. Cursor and active line always visible above keyboard. | Manual test: type in editor, keyboard appears, scroll adjusts. Use `visualViewport` API for keyboard detection. | UX Lead Section 4: Keyboard Handling |
| `100dvh` viewport units | Use `100dvh` or `visualViewport` API, never raw `100vh` | CSS audit; iPad Safari manual test | UX Lead Section 4: Safari-Specific Limitations |
| No native dependencies | Zero plugins, extensions, or app installs required | Verify via clean Safari profile | PM Principle 1 |
| Split View resilience | App must not break in iPadOS Split View, even if not optimized | Manual test in 50/50 and 33/66 Split View | UX Lead Section 4: Split View |
| Orientation change | Layout responds fluidly to landscape/portrait changes without content jumps or lost scroll position | Manual test: rotate iPad during editing | UX Lead Section 4: Landscape vs. Portrait |
| `prefers-reduced-motion` | All animations disabled when user has Reduce Motion enabled | Automated CSS audit + manual test on iPadOS with setting enabled | UX Lead Section 6: Reduced Motion |
| Pinch-to-zoom | App remains functional at 200% zoom. No `user-scalable=no` in viewport meta. | Manual test with pinch zoom on iPad | UX Lead Section 6: Zoom (WCAG AA) |

### 3.2 Performance Budgets

| Metric | Target | Measurement | Cross-Reference |
|--------|--------|-------------|-----------------|
| Largest Contentful Paint (LCP) | < 2.5 seconds on WiFi | Lighthouse on iPad Safari | -- |
| Time to Interactive (TTI) | < 3.5 seconds on WiFi | Lighthouse, same conditions | UX Lead Step 5: "Time from Safari load to ready-to-type: target < 3 seconds" |
| Chapter load (under 10K words) | < 2 seconds | Custom timing: navigation click to editor content visible | PM Section 9: "Document load < 3 seconds" |
| Chapter load (up to 50K words) | < 5 seconds | Same measurement, larger payload | BA edge case: "User pastes 50,000+ words" |
| Auto-save round trip | < 3 seconds from trigger to "Saved" | Custom timing: debounce fire to server response | -- |
| IndexedDB local write | < 5ms per keystroke | Performance.now() measurement | New: ensures Tier 1 save has no perceived lag |
| AI rewrite first token | < 2 seconds | Custom timing: SSE stream onset | UX Lead Step 7: streaming word-by-word |
| AI rewrite complete (500 words) | < 15 seconds | End-to-end including streaming | -- |
| JS bundle size (initial) | < 300 KB gzipped | Build output analysis | -- |
| Editor JS (lazy loaded) | < 200 KB gzipped | Separate chunk | -- |
| PDF export (10 chapters) | < 10 seconds | End-to-end from button click to file ready | UX Lead Step 9: "target < 10 seconds" |

### 3.3 Auto-Save Reliability

| Requirement | Specification | Cross-Reference |
|-------------|---------------|-----------------|
| Save trigger | Debounced: 2 seconds after last keystroke (revised from 5s) | BA US-015, UX Lead Step 6 |
| Local buffer | Every keystroke writes to IndexedDB. <5ms latency. | New: addresses target customer data loss anxiety |
| Save indicator | Three states: "Saving...", "Saved [timestamp]", "Save failed" | UX Lead Step 6, BA US-015 |
| Failure retry | Exponential backoff: 2s, 4s, 8s. Max 3 retries. Then persistent warning. | BA auto-save edge cases |
| Conflict detection | Optimistic versioning: `version` counter in D1. Server rejects save if client version does not match. | -- |
| Conflict resolution | User-facing prompt: "This chapter was modified elsewhere. View changes / Overwrite / Reload." No silent data loss. | BA US-015 |
| Offline behavior | Detect `navigator.onLine` transitions. When offline: queue saves in IndexedDB, show "Offline" indicator. When back online: flush queue in order, resolve conflicts. | BA auto-save edge cases |
| Crash recovery | On editor mount, check IndexedDB for unsaved content newer than Drive version. If found, prompt: "You have unsaved changes from your last session. Restore or discard?" | BA editor edge cases |
| Tab background | Use `visibilitychange` event to trigger immediate save when tab goes to background. More reliable than `beforeunload` on iOS. | -- |
| Maximum data loss window | 2 seconds of typing (one debounce interval). IndexedDB keystroke write reduces this to near-zero within browser lifetime. | Revised from 5s |
| Cmd+S support | Triggers immediate save and "Saved" indicator update. No "you don't need to save" message. | UX Lead Section 4: Keyboard Handling |

### 3.4 Security Model

| Requirement | Specification | Cross-Reference |
|-------------|---------------|-----------------|
| Authentication | Clerk-managed; session tokens as httpOnly, Secure, SameSite=Lax cookies | BA US-001 through US-004 |
| Authorization | All D1 queries include `WHERE user_id = ?` clause. No query returns data across users. Enforced in service layer. | BA: "User A must never see User B's data" |
| OAuth token storage | Google OAuth tokens encrypted at rest in D1 using a Worker-level secret (AES-256-GCM). Never sent to frontend. | BA US-005, Project Instructions Section 3 |
| OAuth scope | `drive.file` -- access only to files created by or opened with DraftCrane. Not full Drive access. | BA OQ-2, UX Lead Step 4 |
| OAuth flow type | Redirect-based only. No popup OAuth. | UX Lead Step 2, BA US-005 (Safari popup blocker) |
| Token refresh | Automatic refresh when `token_expires_at` is within 5 minutes of current time. Old refresh tokens invalidated after use (rotation). | BA Drive edge cases |
| Content isolation | User A must never see User B's projects, chapters, or AI interactions. Verified via integration tests with two test users. | -- |
| API rate limiting | Per-user via KV counters: 60 req/min standard, 10 req/min AI, 5 req/min export. | -- |
| Input validation | All user input validated and sanitized at the API boundary. HTML content sanitized with an allowlist of safe tags before storage. | -- |
| CORS | Production: only the DraftCrane frontend origin. No wildcards. | Project Instructions Section 3 |

### 3.5 Cloudflare Platform Constraints

These are hard limits that constrain the architecture. Design within them.

| Constraint | Limit | Implication |
|-----------|-------|-------------|
| Worker CPU time | 30ms (bundled), 30s (unbound) | Use unbound Workers for AI and export routes. Keep standard routes under 30ms CPU. |
| Worker memory | 128 MB | Cannot load entire large manuscripts into memory. Process chapter-by-chapter during export. |
| Worker request size | 100 MB | Not a concern for text; relevant for future image handling. |
| Worker subrequests | 1,000 per invocation | Batch Drive API calls. A 50-chapter export must not make 50+ serial subrequests. Design export to batch-read chapter content. |
| D1 row size | 1 MB max | No concern for metadata-only rows. Validates decision to keep content out of D1. |
| D1 database size | 2 GB (free), 10 GB (paid) | Monitor table sizes. AI interaction logs will be the largest table. Add TTL-based cleanup at 90 days. |
| D1 rows read/write | 5M reads/day, 100K writes/day (free) | Phase 0 with <100 users is fine. Auto-save at 2s debounce generates ~30 writes/min per active user. At 50 concurrent users: ~1,500 D1 metadata writes/min = 90K/hour. Monitor closely. |
| R2 object size | 5 GB max | Sufficient for any PDF/EPUB. |
| R2 operations | 10M Class A, 10M Class B/month (free) | Generous for Phase 0. |
| KV value size | 25 MB max | Sufficient for cached Drive responses. |
| KV operations | 100K reads/day, 1K writes/day (free) | Tight for writes. Use KV for hot-path reads only (session validation, rate limit checks). Rate limit counters at 10 writes/sec across all users could exhaust free tier quickly. Budget for paid KV or use D1 for rate limit tracking instead. |

**Updated analysis (from Round 1):** The 2-second debounce interval increases D1 write frequency. Revised the D1 rows/write calculation. At 50 concurrent users with 2s debounce, we are writing ~90K metadata rows per hour. The free tier (100K writes/day) will be exceeded with just 2 hours of concurrent use. **Decision: Phase 0 must budget for the D1 paid tier ($0.75/million writes).** This is a trivial cost but must be accounted for.

### 3.6 Accessibility Baseline

New section. Not present in Round 1. Added based on UX Lead Section 6.

| Requirement | Specification | How to Verify |
|-------------|---------------|---------------|
| WCAG level | 2.1 Level AA compliance | Automated: axe-core in CI. Manual: screen reader testing on iPad VoiceOver. |
| Screen reader: editor | `role="textbox"` with `aria-multiline="true"` and chapter name as label | VoiceOver testing |
| Screen reader: chapter list | Ordered list with position announcements ("Chapter 3 of 8") | VoiceOver testing |
| Screen reader: save status | `aria-live="polite"` region for save state changes | VoiceOver testing |
| Screen reader: AI bottom sheet | Focus trap while open. On close, focus returns to editor. | VoiceOver + keyboard testing |
| Keyboard navigation | All functionality reachable via external keyboard. Logical tab order. | Manual testing with Smart Keyboard |
| Color contrast | 4.5:1 for normal text, 3:1 for large text. No color-only indicators. | Automated: contrast checker in CI |
| Font sizing | Minimum 16px in editor (prevents iOS auto-zoom). Relative units (`rem`). | CSS audit |
| Reduced motion | Respect `prefers-reduced-motion`. All animations are non-essential. | Manual test with iPadOS Reduce Motion enabled |
| Zoom | Functional at 200% browser zoom. No `user-scalable=no`. | Manual test |

### 3.7 Reliability & Data Integrity

| Requirement | Specification |
|-------------|---------------|
| Data durability | Google Drive is the system of record. D1 metadata is reconstructible from Drive if lost. IndexedDB is ephemeral. |
| Backup strategy | D1: rely on Cloudflare's automatic backups. Drive: user's own Google Workspace backup. No additional backup in Phase 0. |
| Error handling | All API errors return structured JSON: `{ error: string, code: string, details?: object }`. No stack traces in production. |
| Uptime target | No formal SLA in Phase 0. Rely on Cloudflare's platform SLA (99.9%). |

---

## 4. Technical Risks & Constraints (Phase 0)

### Risk 1: Rich Text Editing on iPad Safari

**Severity:** HIGH -- Could block Phase 0 if editor is unusable on iPad.
**Cross-references:** PM Risk 2, BA OQ-6, UX Lead Section 4 (entire section), Target Customer ("works on iPad" vs. "delightful on iPad"), Competitor Analyst lesson 4.3 (Vellum's design-first philosophy).

**The problem:** Browser-based rich text editors rely heavily on the `contenteditable` API and `Selection`/`Range` APIs, both of which have long-standing inconsistencies in Safari. Known issues include: cursor positioning bugs after formatting changes, selection jumping when virtual keyboard appears/disappears, toolbar interactions causing focus loss, and inconsistent paste handling from other iPad apps.

**Specific concerns:**
- Tiptap (ProseMirror-based) has the strongest iPad track record but still has open issues with iOS selection.
- Lexical (Meta) is newer and has fewer Safari battle scars in production.
- Plate (Slate-based) has documented iOS problems.
- All editors struggle with the iOS virtual keyboard viewport resize behavior (the `visualViewport` API is required per UX Lead Section 4).
- The UX Lead's floating AI Rewrite toolbar must not conflict with iPadOS's native text selection menu (Cut/Copy/Paste). This requires careful positioning logic that interacts with the editor's selection system.
- The UX Lead specifies block quote as a Phase 0 formatting requirement (Section 5b). Verify editor candidate supports block quotes on iPad.

**Mitigation:** Prototype the top 2 editor candidates (Tiptap and Lexical) on a physical iPad within the first sprint. Test the UX Lead's specific interaction patterns:
1. Basic typing, formatting (bold/italic/heading/list/block quote)
2. Text selection via touch (long-press, drag handles)
3. Floating toolbar appearance near selection (custom toolbar positioning)
4. Copy/paste from Notes app, Google Docs, email
5. Undo/redo (both Cmd+Z and toolbar)
6. Virtual keyboard appear/dismiss -- cursor stays visible
7. Orientation change during editing (landscape to portrait)
8. Chapter switching -- scroll position preservation

Score each on a 1-5 scale. Allocate 2 days. Decision must be made from real-device testing, not documentation claims.

**Could block Phase 0:** Yes, if no editor works acceptably on iPad Safari.

---

### Risk 2: Google Drive API Latency and Rate Limits

**Severity:** MEDIUM -- Degrades experience but does not block Phase 0.
**Cross-references:** PM Risk 7, BA Drive edge cases, Target Customer's hotel WiFi concern.

**The problem:** Every chapter open and every auto-save requires a Google Drive API call. Drive API latency is typically 200-500ms but can spike to 2-3 seconds.

**Updated concern (from Round 1):** With the 2-second debounce (revised from 5s), auto-save generates ~30 Drive writes per minute per active user (up from ~12). At 50 concurrent users, that is 1,500 writes/minute. Still within Drive's per-user limits (12,000 queries/user/minute) but worth monitoring.

**Mitigation (unchanged):**
- Cache chapter content in frontend + IndexedDB after first load.
- Pre-fetch next/previous chapter content.
- Proactive token refresh (5 minutes before expiry).
- KV cache for Drive folder listings (TTL: 60 seconds).

**Could block Phase 0:** No.

---

### Risk 3: Auto-Save Reliability Across iPad Safari Lifecycle

**Severity:** HIGH -- Data loss is unacceptable for a writing tool.
**Cross-references:** BA US-015, BA auto-save edge cases, UX Lead Step 6, Target Customer pain point ("losing my work"), PM Risk 3.

**The problem:** Auto-save has multiple failure modes: network dropout, Drive API errors, browser crash/tab close, iPadOS background tab suspension, and version conflicts.

**Updated analysis (from Round 1):** The three-tier save architecture (IndexedDB -> Drive -> D1 metadata) mitigates most failure modes. The remaining risk is iPadOS killing Safari under severe memory pressure, which would lose the IndexedDB buffer. This is an OS-level event we cannot prevent.

**Specific iPad Safari concerns (per UX Lead Section 4):**
- iPad Safari aggressively suspends background tabs. `visibilitychange` event is our best hook.
- `beforeunload` is unreliable on iPad Safari. Do not depend on it.
- IndexedDB has storage pressure limits -- iOS can evict data. However, this typically only happens under extreme storage pressure (device nearly full).
- `position: fixed` and `position: sticky` behave inconsistently when the virtual keyboard is open. The save status indicator must be positioned correctly in both keyboard states.

**Mitigation:**
- IndexedDB write-ahead log on every keystroke (Tier 1).
- `visibilitychange` for background save (Tier 2).
- Recovery prompt on editor mount if IndexedDB has unsaved data.
- Accept that a hard OS kill of Safari may lose up to 2 seconds of work. Document as known limitation.
- The BA's suggestion to block second tabs (OQ-16) should be implemented via a simple BroadcastChannel API lock to prevent the more dangerous concurrent-editing scenario.

**Could block Phase 0:** No, but must be solid before beta.

---

### Risk 4: Claude API Response Times for Inline Rewrites

**Severity:** LOW-MEDIUM -- Mitigated by SSE streaming requirement.
**Cross-references:** PM Risk 5, UX Lead Step 7, Competitor Analyst lesson 4.4.

**The problem:** Claude API response time for a 500-word rewrite is typically 3-8 seconds end-to-end.

**Updated analysis:** SSE streaming (now a requirement, not optional) reduces perceived latency to under 2 seconds (first token). The UX Lead's word-by-word streaming pattern and the target customer's expectation of responsiveness make this a requirement, not an optimization.

**Cost model (updated):**
- Haiku for simple operations (simplify, shorten): ~$0.001/request
- Sonnet for complex operations (rewrite, expand): ~$0.003-0.01/request
- At 50 rewrites/user/month: ~$0.15-0.50/user/month
- Phase 0 with 50 users: <$25/month total AI cost

**Could block Phase 0:** No.

---

### Risk 5: PDF/EPUB Generation Quality and Feasibility

**Severity:** HIGH -- Elevated from Round 1 based on competitor analysis.
**Cross-references:** PM Risk 6, BA US-019/US-020, UX Lead Step 9, Competitor Analyst Section 2 (feature matrix), Competitor Analyst lesson 4.2 (Atticus formatting as confidence), Target Customer ("one click and I get something I could show to a publisher without embarrassment").

**The problem (updated):** Workers have no filesystem, no headless browser, and a 128 MB memory limit. The competitor analyst's assessment makes this risk more acute: Atticus already delivers professional book formatting at $147.99 one-time. Reedsy offers decent formatting for free. If DraftCrane's Phase 0 export "looks like a printed web page" (Competitor Analyst Section 3.3), it undermines the entire "publishing is a button" principle and the psychological "artifact moment" (UX Lead Step 9).

**The UX Lead's export requirements (Step 9):**
- "Clean typography, chapter titles as headers, page numbers, the book title on a simple title page"
- "Must look professional without me doing any formatting"
- "Typography, margins, and spacing must feel intentionally designed"

**The BA's export requirements (US-019):**
- Title page, table of contents, all chapters in order
- "Readable serif font, consistent margins and page numbers"
- Page size: A5 recommended (BA OQ-15)

**Mitigation options (to be decided via ADR-004):**
1. **Cloudflare Browser Rendering + EPUB in Worker:** Best PDF quality (headless Chrome renders HTML/CSS faithfully). EPUB is tractable in-Worker (ZIP of XHTML). Risk: Browser Rendering is beta.
2. **Client-side PDF + Worker EPUB:** Use `react-pdf` or styled `window.print()` on iPad. EPUB generated server-side. Risk: iPad Safari print quality varies.
3. **Hybrid with external fallback:** Try Browser Rendering; if unavailable or low quality, fall back to a slim external service (e.g., DocRaptor) for PDF only.

**Revised recommendation:** Invest more in export quality than I proposed in Round 1. The competitor analyst and target customer both indicate that a professional-looking export is disproportionately important to user confidence. Even if the MVP export has limited customization (no template selection, no font choice), the single default template must look like a real book: proper A5 trim, serif body font, chapter title pages, page numbers, generous margins. A "good enough" template designed by someone with typographic taste is more important than a flexible but ugly system.

**Could block Phase 0:** Potentially. If no approach produces book-quality PDF output, consider descoping to EPUB-only for Phase 0 (EPUB is tractable) with "Export as HTML/Google Doc" as a PDF workaround. This is a last resort. Per the UX Lead: "If the export looks like a printed web page, the user will lose confidence in DraftCrane."

---

### Risk 6: Writing Without Drive Connection (NEW)

**Severity:** MEDIUM -- Not a blocker but creates architectural complexity.
**Cross-references:** UX Lead Step 4 ("Maybe later" path), BA US-008 (disconnect behavior), BA OQ-10.

**The problem:** The UX Lead's journey allows users to write before connecting Google Drive. The BA specifies that disconnecting Drive mid-session should not block writing. This creates a state where content exists only in IndexedDB (local) and there is no server-side persistence.

**Specific concerns:**
- If the user writes 5,000 words without connecting Drive, that content exists only in their browser's IndexedDB. If they clear browser data, it is gone.
- The "Maybe later" path needs careful UX: the save indicator must clearly communicate "Saved locally only" vs. "Saved to Google Drive."
- When Drive is eventually connected, the existing content must be synced to Drive. This is a one-time migration per chapter.

**Mitigation:**
- Save indicator has three states: "Saved locally" (yellow), "Saved to Drive" (green), "Save failed" (red). Per BA edge case: "Google Drive is disconnected mid-editing session."
- When Drive is connected, trigger an immediate full sync of all chapter content to Drive.
- Show a persistent but dismissible banner: "Connect Google Drive to protect your work. Without Drive, your writing is only saved on this device."
- This is an acceptable risk for Phase 0. The "Maybe later" flow is important for reducing onboarding friction (UX Lead Step 4). The risk of data loss is low if the user connects Drive within the same session.

**Could block Phase 0:** No.

---

## 5. ADR Framing

### ADR-001: Editor Library Selection

**Decision:** Which rich text editor library to use for the chapter writing experience.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **Tiptap (ProseMirror)** | Most mature iPad Safari support; large extension ecosystem; collaborative editing foundation for future; strong TypeScript support; active commercial backing; block quote support out of the box | Larger bundle size (~150 KB); some extensions are paid (Tiptap Pro); ProseMirror learning curve for custom behavior |
| **Lexical (Meta)** | Smallest bundle (~30 KB core); designed for extensibility; excellent React integration; accessibility-first design; active Meta investment | Younger project, fewer production deployments on iPad; smaller extension ecosystem; iOS Safari support improving but less battle-tested |
| **Plate (Slate)** | Rich plugin ecosystem; highly customizable UI; good React integration | Known iOS Safari issues (selection, IME); Slate's architecture has had stability concerns; smallest team |

**Preliminary recommendation:** Tiptap. The iPad Safari constraint makes maturity the deciding factor.

**Test protocol (per UX Lead interaction patterns):**
Build a minimal editor prototype with Tiptap and Lexical. On a physical iPad (Air 5th gen, iPadOS 17+), test:
1. Typing, formatting: bold, italic, H2, H3, bullet list, numbered list, block quote (per UX Lead Section 5b)
2. Text selection: long-press, drag handles, extend selection (per UX Lead Section 5c)
3. Custom floating toolbar near selection (for AI Rewrite trigger)
4. Copy/paste from Notes app, Safari, Google Docs
5. Undo/redo (Cmd+Z, Cmd+Shift+Z)
6. Virtual keyboard show/hide with `visualViewport` API integration
7. Orientation change during editing
8. Chapter switching with scroll position restoration

Score each on a 1-5 scale. Allocate 2 days. Decision from real-device testing only.

---

### ADR-002: Google Drive Sync Strategy

**Decision:** When and how chapter content is synchronized between DraftCrane and Google Drive.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **On-save (debounced 2s)** | Simple to implement; predictable Drive API usage; clear mental model; IndexedDB provides local safety net | 2-second data loss window (mitigated by IndexedDB); user must be online for Drive persistence; no cross-device sync |
| **Periodic background sync** | Decouples user action from Drive write; batches changes; more resilient to transient errors | More complex state management; harder to reason about "current" version; stale data risk |
| **Real-time (operational transforms)** | Google-Docs-like experience; multi-device | Enormous complexity for Phase 0; Drive API not designed for OT; overkill for single-user |

**Recommendation:** On-save (debounced 2s). Phase 0 is single-user. IndexedDB provides the local safety net that makes 2-second debounce acceptable. The three-tier save architecture (IndexedDB -> Drive -> D1 metadata) handles all failure modes identified by the BA and UX Lead.

**Validation:** Measure Drive API write latency for chapter-sized files. If consistently under 2 seconds, the architecture is validated. If over 3 seconds, investigate Drive API performance or consider background sync as a fallback. Allocate 0.5 days.

---

### ADR-003: AI Integration Path

**Decision:** How DraftCrane calls the Claude API -- directly or through Cloudflare AI Gateway.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **Direct Anthropic API** | Simplest integration; full control over prompts and SSE streaming; best SDK support; no middleware | Must implement observability ourselves; no built-in caching |
| **Cloudflare AI Gateway** | Built-in logging, caching, rate limiting, analytics dashboard | Adds latency hop; caching unlikely to help (rewrites are unique); less control over SSE streaming; adds dependency |
| **Workers AI** | Zero egress cost; lowest latency | Model quality not comparable to Claude for writing tasks |

**Recommendation:** Direct Anthropic API for Phase 0. SSE streaming support is critical (see Risk 4) and the Anthropic TypeScript SDK handles it well. AI Gateway's caching benefits do not apply to unique rewrite requests. Implement a thin `AIService` wrapper that can be re-pointed to AI Gateway later.

**Cost monitoring:** Track cost per interaction via the `ai_interactions` table (model, input_chars, output_chars). No AI Gateway needed for this level of observability.

---

### ADR-004: PDF/EPUB Generation Approach

**Decision:** How to generate book-quality PDF and EPUB files from chapter HTML content.

**Elevated priority (from Round 1):** The competitor analyst identifies export quality as a key vulnerability against Atticus ($147.99, professional templates). The UX Lead identifies the "artifact moment" as psychologically critical. The target customer says the PDF must look like "something I could show to a publisher without embarrassment." This ADR must be resolved early -- the chosen approach constrains the export timeline.

**Options:**

| Option | Pros | Cons | Export Quality |
|--------|------|------|----------------|
| **Cloudflare Browser Rendering (PDF) + Worker (EPUB)** | High-quality PDF via headless Chrome; faithful HTML/CSS rendering; EPUB is tractable (ZIP of XHTML) | Browser Rendering is beta; per-session pricing; cold start ~2-5s | HIGH for PDF, GOOD for EPUB |
| **Client-side (browser)** | No server constraints; works offline; user can preview | PDF quality limited; iPad memory for large books; varies by platform | LOW-MEDIUM for PDF |
| **Worker-side (pdf-lib)** | Full server control; consistent output | No automatic HTML-to-PDF layout; building a typographic engine is a project | MEDIUM (with significant effort) |
| **External service (DocRaptor/Prince)** | Professional typographic quality; handles complex CSS | External dependency; per-document pricing; latency | HIGH |

**Revised recommendation:** EPUB generation in the Worker (straightforward). For PDF, prototype Cloudflare Browser Rendering first. Design a single, well-crafted HTML+CSS book template (A5 trim, serif font, chapter title pages, page numbers, table of contents, generous margins). If Browser Rendering produces professional-quality output, use it. If not, fall back to an external service for PDF only. Do NOT ship a low-quality PDF. The competitor analyst and target customer agree: amateur-looking export will torpedo confidence.

**Template design (new):** Allocate design effort for the default export template before the technical spike. The template CSS should target:
- A5 page size (148mm x 210mm) per BA recommendation (OQ-15)
- Body text: serif font (e.g., Georgia, Crimson Text), 11pt, 1.5 line height
- Margins: 20mm inside, 15mm outside, 15mm top, 20mm bottom
- Chapter title pages with generous whitespace
- Page numbers in footer, alternating left/right
- Table of contents with chapter titles (page numbers if feasible)
- Title page with book title and author name

This CSS template works with both Browser Rendering (renders it directly) and external services (pass the HTML+CSS). Design once, render anywhere.

**Spikes (3 days total):**
1. (Day 1) Design the HTML+CSS book template. Validate it looks good in a browser at A5 dimensions.
2. (Day 1) Build an EPUB generator in a Worker: take 3 chapters of HTML, produce a valid EPUB. Verify in Apple Books.
3. (Day 2) Test Cloudflare Browser Rendering: render 10-chapter HTML manuscript to PDF using the template. Measure quality, latency, cost.
4. (Day 3) If Browser Rendering fails quality bar: test DocRaptor or Prince (external) as fallback.

---

### ADR-005: Data Model Split (D1 vs. Google Drive)

**Decision:** What data lives in D1 vs. Google Drive vs. IndexedDB.

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **Metadata-only in D1 + IndexedDB buffer** (proposed) | Clean separation; user owns all content; D1 stays small; Drive is system of record; IndexedDB provides local speed | Every chapter open requires a Drive API call; no full-text search; export re-fetches from Drive |
| **Content cached in D1** | Faster reads; enables full-text search; reduces Drive dependency | Content duplication; sync complexity; D1 grows with content; contradicts "Drive is canonical" principle |
| **Content in R2** | R2 handles large objects; no D1 size concern | Still duplicated; R2 is not queryable; another sync layer |

**Recommendation:** Metadata-only in D1 + IndexedDB buffer (Option 1, refined with the three-tier save architecture). This is the architectural expression of PM Principle 2 and project instruction #3. The BA's concern about Drive read latency is addressed by IndexedDB caching on the client: after the first load, the chapter is in IndexedDB and subsequent opens do not require a Drive read (unless the server version is newer).

**Validation:** Measure Drive API read latency for chapter-sized files (1,000-10,000 words of HTML). If consistently under 1 second, the architecture is validated. If over 2 seconds, add KV caching of chapter content (TTL: 5 minutes, invalidated on save) as a read-through cache.

---

## 6. API Surface (Phase 0)

All routes are served by the `dc-api` Worker (Hono). All routes except `/auth/webhook` require a valid Clerk session JWT. Responses are JSON unless noted.

### Auth & User

| Method | Path | Description | BA Story |
|--------|------|-------------|----------|
| POST | `/auth/webhook` | Clerk webhook: user created/updated/deleted events. Syncs user record to D1. | US-001 |
| GET | `/users/me` | Returns current user profile, Drive connection status, and active project. | US-002, US-004 |

### Google Drive

| Method | Path | Description | BA Story |
|--------|------|-------------|----------|
| GET | `/drive/authorize` | Returns Google OAuth authorization URL. Redirect-based flow only. | US-005 |
| GET | `/drive/callback` | OAuth callback. Exchanges code for tokens, encrypts, stores in D1, redirects to app. | US-005 |
| GET | `/drive/folders` | Lists folders in user's Drive root. Used for "Select Book Folder" UI. | US-006 |
| GET | `/drive/folders/:folderId/children` | Lists subfolders of a given folder. For folder picker navigation. | US-006 |
| POST | `/drive/folders` | Creates a new folder in Drive (for "Create New Folder" in folder picker). | US-006 |
| DELETE | `/drive/connection` | Disconnects Google Drive. Revokes token, deletes from D1. Drive files untouched. | US-008 |

**Change from Round 1:** Added `POST /drive/folders` to support the UX Lead's "Create New Folder" button in the folder picker (Step 4, point 4).

### Projects

| Method | Path | Description | BA Story |
|--------|------|-------------|----------|
| POST | `/projects` | Creates a new book project. Accepts `{ title, description? }`. If Drive connected, links to Book Folder. Creates default "Chapter 1". | US-009 |
| GET | `/projects` | Lists all projects for the current user. | US-009 |
| GET | `/projects/:projectId` | Returns project details including chapter list with metadata. | US-009, US-012 |
| PATCH | `/projects/:projectId` | Updates project title, description, or settings. | US-009 |

### Chapters

| Method | Path | Description | BA Story |
|--------|------|-------------|----------|
| POST | `/projects/:projectId/chapters` | Creates a new chapter at end of list. Creates corresponding HTML file in Google Drive (if connected). Returns new chapter metadata. | US-010 |
| GET | `/projects/:projectId/chapters` | Lists chapters for a project (metadata only: title, order, word count, status). | US-012 |
| PATCH | `/chapters/:chapterId` | Updates chapter metadata (title, status). Title max 200 chars, non-empty. | US-013 |
| GET | `/chapters/:chapterId/content` | Fetches chapter body content from Google Drive. Returns HTML. If Drive not connected, returns 404 with message to connect Drive. If chapter has no Drive file yet (written before Drive connection), returns content from the initial sync. | US-011 |
| PUT | `/chapters/:chapterId/content` | Writes chapter body content to Google Drive. Accepts HTML + `version` header. Returns new version number. Rejects with 409 if version conflict. Updates word_count and updated_at in D1. | US-015 |
| DELETE | `/chapters/:chapterId` | Deletes chapter from D1. Moves Drive file to trash (not permanent delete). Rejects if it is the last chapter in the project. Returns 400 with message. Query param `?keep_drive=true` to leave the Drive file untouched. | US-014 |
| PATCH | `/projects/:projectId/chapters/reorder` | Batch-updates sort_order for multiple chapters. Accepts `[{ id, sort_order }]`. Single transaction. | UX Lead Step 6 (drag-to-reorder) |

**Changes from Round 1:**
- `DELETE` endpoint now enforces "minimum one chapter" rule per BA US-014.
- `DELETE` moves Drive file to trash (not permanent delete) per UX Lead Step 8 ("moved to Drive's trash, not permanently deleted").
- `PUT /chapters/:chapterId/content` now updates `word_count` in D1 on every save (needed for the chapter list metadata display and export analytics).
- `POST /projects/:projectId/chapters` creates the Drive file immediately if Drive is connected.

### AI

| Method | Path | Description | BA Story |
|--------|------|-------------|----------|
| POST | `/ai/rewrite` | Sends selected text + instruction + context to Claude API. Returns SSE stream. Enforces: min 1 word, max 2,000 words selected text; max 500 chars context each side. Rate limited: 10 req/min/user. | US-016, US-017 |
| POST | `/ai/interactions/:interactionId/accept` | Records that the user accepted an AI suggestion. Updates ai_interactions log. | US-018 |
| POST | `/ai/interactions/:interactionId/reject` | Records that the user rejected/discarded an AI suggestion. Updates ai_interactions log. | US-018 |

**Changes from Round 1:**
- Accept/reject endpoints now use the interaction ID as a path parameter (cleaner REST).
- SSE streaming is specified as the required response format for `/ai/rewrite`.
- Content length limits documented inline per BA OQ-11 recommendation.
- The `/ai/rewrite` endpoint returns an `interaction_id` in the SSE stream headers so the frontend can reference it for accept/reject calls.
- "Try Again" is supported by calling `/ai/rewrite` again with the same chapter/selection but a modified instruction. Each call creates a new `ai_interactions` record with an incremented `attempt_number`.

### Export

| Method | Path | Description | BA Story |
|--------|------|-------------|----------|
| POST | `/projects/:projectId/export` | Initiates export job. Accepts `{ format: "pdf" \| "epub" }`. Rejects if no chapters have content. Returns job ID and initial status. Rate limited: 5 req/min/user. Queues if another export is in progress (per BA export edge case). | US-019, US-020 |
| GET | `/export/:jobId` | Returns export job status. When completed, includes a signed R2 download URL (1-hour expiry). | US-019, US-020 |
| POST | `/export/:jobId/to-drive` | Uploads completed export artifact from R2 to user's Drive Book Folder `_exports/` subfolder. File named `{Book Title} - {YYYY-MM-DD}.{format}`. | US-021 |

**Changes from Round 1:**
- Export rejects if no chapters have content (per BA US-019: "Add content to at least one chapter before exporting").
- File naming uses timestamp format per BA OQ-14 recommendation.
- Sequential queuing for concurrent export attempts per BA export edge case.

### Conventions

- **IDs:** All entity IDs are ULIDs, passed as path parameters.
- **Pagination:** List endpoints support `?limit=N&cursor=ULID` for cursor-based pagination. Default limit: 50.
- **Errors:** All errors return `{ error: string, code: string }` with appropriate HTTP status codes. Common codes: `AUTH_REQUIRED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `DRIVE_ERROR` (502), `DRIVE_NOT_CONNECTED` (422), `VALIDATION_ERROR` (400), `LAST_CHAPTER` (400).
- **Versioning:** No URL versioning in Phase 0.
- **CORS:** Restricted to the DraftCrane frontend origin.
- **Rate limiting:** Standard endpoints: 60 req/min/user. AI endpoints: 10 req/min/user. Export endpoints: 5 req/min/user.

---

## Appendix: Open Questions for PRD Discussion

Retained from Round 1, updated with cross-references:

1. **File format for chapters (HTML vs. Google Docs native):** This document proposes HTML files in Drive. The target customer wants files she "can access" but this may not require native Docs editing. The PM should confirm. If Docs-native is required, add Google Docs API dependency and an ADR.

2. **Export quality bar:** What does "professional" mean? The competitor analyst establishes Atticus and Vellum as the benchmarks. The UX Lead says "typography, margins, and spacing must feel intentionally designed." The BA recommends A5 page size. Recommend: define a reference book (a published nonfiction book from a competitor's template) and match its formatting.

3. **Single vs. multi-project in Phase 0:** UX Lead says one book. BA recommends multiple. Schema supports both. PM decision needed.

4. **Chapter drag-to-reorder in Phase 0:** UX Lead includes it (Step 6, point 7). BA excludes it (US-010 out of scope). API supports it. PM decision needed.

5. **Auto-save destination when Drive is not connected:** This document proposes IndexedDB-only with a persistent warning banner. The BA proposed D1 as working copy. I recommend IndexedDB-only to avoid content in D1. PM decision needed.

6. **Export file naming:** This document uses `{Title} - {YYYY-MM-DD}.{format}` per BA recommendation. PM should confirm.

7. **AI usage limits in Phase 0:** BA OQ-13 recommends unlimited during beta with monitoring. I agree. The `ai_interactions` table tracks everything we need. Set limits before paid launch.
