CREATE TABLE IF NOT EXISTS user_ops (
  id SERIAL PRIMARY KEY,
  sender TEXT NOT NULL,
  api_key TEXT NOT NULL,
  status TEXT NOT NULL,
  tx_hash TEXT,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
