-- Migration number: 0028   2026-03-27T00:00:00.000Z
-- Update chapter status values: remove 'final', add 'complete' and 'needs-work'
-- Maps existing 'final' rows to 'complete'
--
-- Uses ALTER TABLE column operations instead of table recreation to avoid
-- FK constraint failures — D1 enforces foreign keys and cannot be disabled
-- via PRAGMA. Child tables (ai_interactions, research_clips, chapter_sources)
-- reference chapters(id), blocking DROP TABLE.

-- 1. Add new column with updated CHECK constraint
ALTER TABLE chapters ADD COLUMN status_v2 TEXT NOT NULL DEFAULT 'draft'
  CHECK (status_v2 IN ('draft', 'review', 'complete', 'needs-work'));

-- 2. Migrate data with status mapping (final → complete)
UPDATE chapters SET status_v2 = CASE WHEN status = 'final' THEN 'complete' ELSE status END;

-- 3. Drop old status column (removes old CHECK constraint with it)
ALTER TABLE chapters DROP COLUMN status;

-- 4. Rename new column to status
ALTER TABLE chapters RENAME COLUMN status_v2 TO status;
