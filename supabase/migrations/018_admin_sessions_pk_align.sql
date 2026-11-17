-- #809: reconcile admin_sessions primary key across environments.
-- Some databases were created with schema.sql's old shape (id uuid PK + unique
-- token_hash). Align everything to the canonical shape (token_hash text PK).

-- Backfill: if an id column exists, drop the uuid PK and promote token_hash.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'admin_sessions' AND column_name = 'id'
  ) THEN
    -- drop dependent primary key constraint
    ALTER TABLE admin_sessions DROP CONSTRAINT IF EXISTS admin_sessions_pkey;
    -- ensure token_hash is not null and unique
    ALTER TABLE admin_sessions ALTER COLUMN token_hash SET NOT NULL;
    -- drop id column (no longer needed)
    ALTER TABLE admin_sessions DROP COLUMN id;
    -- promote token_hash to primary key if not already
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'admin_sessions_pkey' AND conrelid = 'admin_sessions'::regclass
    ) THEN
      ALTER TABLE admin_sessions ADD CONSTRAINT admin_sessions_pkey PRIMARY KEY (token_hash);
    END IF;
  END IF;
END
$$;

-- Ensure column exists for migrated installs that predate password_epoch
ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS password_epoch INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS admin_sessions_password_epoch_idx ON admin_sessions (password_epoch);
