-- Drive connections: one per user, tokens encrypted with AES-256-GCM
CREATE TABLE IF NOT EXISTS drive_connections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TEXT NOT NULL,
  drive_email TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE UNIQUE INDEX idx_drive_connections_user_id ON drive_connections(user_id);
