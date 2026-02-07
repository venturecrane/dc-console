-- AI interactions: logs every AI rewrite request (no user content stored)
CREATE TABLE IF NOT EXISTS ai_interactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  action TEXT NOT NULL CHECK (action IN ('rewrite', 'expand', 'simplify')),
  instruction TEXT NOT NULL,
  input_chars INTEGER NOT NULL,
  output_chars INTEGER NOT NULL DEFAULT 0,
  model TEXT NOT NULL,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  accepted INTEGER,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_chapter_id ON ai_interactions(chapter_id);
