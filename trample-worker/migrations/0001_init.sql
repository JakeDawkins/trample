CREATE TABLE users (id integer primary key, email text not null unique, created_at text default current_timestamp);
CREATE TABLE user_scores (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  game_date TEXT NOT NULL CHECK (date(game_date) IS game_date),
  score INTEGER NOT NULL,
  moves INTEGER NOT NULL,
  longest_word INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, game_date)
) STRICT;
CREATE TABLE auth_codes (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL CHECK (code GLOB '[0-9][0-9][0-9][0-9]'),
  ip TEXT,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL CHECK (datetime(expires_at) IS expires_at),
  used_at TEXT CHECK (used_at IS NULL OR datetime(used_at) IS used_at)
) STRICT;
CREATE INDEX auth_codes_email_created_at ON auth_codes (email, created_at);
CREATE INDEX auth_codes_ip_created_at ON auth_codes (ip, created_at);
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  token_hash TEXT NOT NULL UNIQUE,
  refresh_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL CHECK (datetime(expires_at) IS expires_at),
  refresh_expires_at TEXT NOT NULL CHECK (datetime(refresh_expires_at) IS refresh_expires_at),
  revoked_at TEXT CHECK (revoked_at IS NULL OR datetime(revoked_at) IS revoked_at)
) STRICT;
CREATE INDEX sessions_user_id ON sessions (user_id);
