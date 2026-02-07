-- Export jobs: tracks PDF/EPUB generation
CREATE TABLE IF NOT EXISTS export_jobs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  chapter_id TEXT,
  format TEXT NOT NULL CHECK (format IN ('pdf', 'epub')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  r2_key TEXT,
  drive_file_id TEXT,
  error_message TEXT,
  chapter_count INTEGER NOT NULL DEFAULT 0,
  total_word_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  completed_at TEXT
);

CREATE INDEX idx_export_jobs_project_id ON export_jobs(project_id);
CREATE INDEX idx_export_jobs_user_id ON export_jobs(user_id);
CREATE INDEX idx_export_jobs_status ON export_jobs(status);
