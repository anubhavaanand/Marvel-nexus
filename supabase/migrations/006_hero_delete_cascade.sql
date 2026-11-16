-- Ensure deleting a hero cascades to its dependent rows (#233).
--
-- `canon_events.hero_id` and `hero_movies.hero_id` are declared with
-- `ON DELETE CASCADE` in schema.sql, but older databases created before
-- that clause was added may still carry a plain (or `NO ACTION`) foreign
-- key, leaving orphaned rows when a hero is deleted. Re-add both
-- constraints idempotently so every environment matches schema.sql.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'canon_events_hero_id_fkey'
      AND table_name = 'canon_events'
  ) THEN
    ALTER TABLE canon_events DROP CONSTRAINT canon_events_hero_id_fkey;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'hero_movies_hero_id_fkey'
      AND table_name = 'hero_movies'
  ) THEN
    ALTER TABLE hero_movies DROP CONSTRAINT hero_movies_hero_id_fkey;
  END IF;
END $$;

ALTER TABLE canon_events
  ADD CONSTRAINT canon_events_hero_id_fkey
  FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE;

ALTER TABLE hero_movies
  ADD CONSTRAINT hero_movies_hero_id_fkey
  FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE;
