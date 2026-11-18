-- #603: no table tracked last-modified time, so cache invalidation and
-- incremental syncs had nothing to work from.
--
-- Idempotent: columns are added only when missing; triggers are dropped and
-- recreated so re-running converges on the same definition.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['heroes', 'movies', 'canon_events', 'hero_movies']
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = t AND column_name = 'updated_at'
    ) THEN
      EXECUTE format(
        'ALTER TABLE %I ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW()',
        t
      );
    END IF;
  END LOOP;
END
$$;

DROP TRIGGER IF EXISTS heroes_set_updated_at ON heroes;
CREATE TRIGGER heroes_set_updated_at
  BEFORE UPDATE ON heroes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS movies_set_updated_at ON movies;
CREATE TRIGGER movies_set_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS canon_events_set_updated_at ON canon_events;
CREATE TRIGGER canon_events_set_updated_at
  BEFORE UPDATE ON canon_events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS hero_movies_set_updated_at ON hero_movies;
CREATE TRIGGER hero_movies_set_updated_at
  BEFORE UPDATE ON hero_movies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
