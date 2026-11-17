-- Scope public reads on canon_events and hero_movies to non-locked heroes.
-- Locked heroes' relation rows must not be enumerable by anon/authenticated
-- roles (they could otherwise read locked hero UUIDs and canon-event details
-- even though the heroes row itself is hidden).
--
-- Idempotent: drops any existing "Public read access" policy on each table
-- and recreates it with the locked-content filter. Service role keeps full
-- access (unchanged policies).

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
     WHERE tablename = 'canon_events' AND policyname = 'Public read access'
  ) THEN
    DROP POLICY "Public read access" ON canon_events;
  END IF;
END $$;

CREATE POLICY "Public read access" ON canon_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM heroes h WHERE h.id = hero_id AND NOT h.is_locked_content));

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
     WHERE tablename = 'hero_movies' AND policyname = 'Public read access'
  ) THEN
    DROP POLICY "Public read access" ON hero_movies;
  END IF;
END $$;

CREATE POLICY "Public read access" ON hero_movies FOR SELECT
  USING (EXISTS (SELECT 1 FROM heroes h WHERE h.id = hero_id AND NOT h.is_locked_content));
