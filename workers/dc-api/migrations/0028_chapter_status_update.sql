-- Migration number: 0028   2026-03-27T00:00:00.000Z
-- Update chapter status values: remove 'final', add 'complete' and 'needs-work'
-- Maps existing 'final' rows to 'complete'
-- Also drops unused drive_file_id column (NULLed in 0021, unused in code)

PRAGMA foreign_keys=OFF;

-- 1. Create new table with updated status constraint (no drive_file_id)
CREATE TABLE chapters_new (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  r2_key TEXT,
  word_count INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'complete', 'needs-work')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- 2. Migrate existing rows with status mapping
INSERT INTO chapters_new (id, project_id, title, sort_order, r2_key, word_count, version, status, created_at, updated_at)
SELECT id, project_id, title, sort_order, r2_key, word_count, version,
  CASE WHEN status = 'final' THEN 'complete' ELSE status END,
  created_at, updated_at
FROM chapters;

-- 3. Swap tables
DROP TABLE chapters;
ALTER TABLE chapters_new RENAME TO chapters;

-- 4. Recreate indexes
CREATE UNIQUE INDEX idx_chapters_sort ON chapters(project_id, sort_order);
CREATE INDEX idx_chapters_project_id ON chapters(project_id);

PRAGMA foreign_keys=ON;
