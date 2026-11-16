-- Restrict public reads so locked ("premium") heroes are never visible to
-- anon/authenticated roles. The service role keeps full access and is what the
-- admin panel and the server-side hero gate use.
--
-- Idempotent: drops any existing "Public read access" policy on heroes and
-- recreates it with the locked-content filter.

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
     WHERE tablename = 'heroes' AND policyname = 'Public read access'
  ) THEN
    DROP POLICY "Public read access" ON heroes;
  END IF;
END $$;

CREATE POLICY "Public read access" ON heroes FOR SELECT USING (NOT is_locked_content);
