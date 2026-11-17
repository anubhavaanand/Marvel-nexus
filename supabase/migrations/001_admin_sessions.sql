-- Admin sessions with server-side revocation.
-- The application stores only SHA-256 hashes of session tokens here, never the
-- tokens themselves. Run this once per environment; the app falls back to
-- signed short-lived tokens automatically when the table is missing.
--
-- Canonical PK: token_hash (text). This mirrors supabase/schema.sql so fresh
-- installs and migrated installs converge (#809).

create table if not exists admin_sessions (
  token_hash text primary key,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_expires_at_idx
  on admin_sessions (expires_at);
