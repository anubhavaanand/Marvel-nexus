-- #413: admin_sessions stores sha256(session token). Without RLS and without
-- revoking the default API-role grants, a holder of the public anon key could
-- forge or enumerate session rows. Enable RLS and lock the table to the service
-- role (the application only reaches it with SUPABASE_SERVICE_ROLE_KEY).
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON admin_sessions FROM anon;
REVOKE ALL ON admin_sessions FROM authenticated;

-- Service role access is implicit (bypasses RLS); keep it explicit for clarity.
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_sessions TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
     WHERE tablename = 'admin_sessions'
       AND policyname = 'admin_sessions deny anon'
  ) THEN
    CREATE POLICY "admin_sessions deny anon" ON admin_sessions
      FOR ALL TO anon USING (false);
  END IF;
END $$;
