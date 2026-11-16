-- Add the actor_name column that src/lib/supabase.ts and the hero UI expect.
-- The canonical schema (supabase/schema.sql) already includes it; this
-- migration upgrades databases created from the older scripts.

ALTER TABLE heroes ADD COLUMN IF NOT EXISTS actor_name TEXT;

COMMENT ON COLUMN heroes.actor_name IS 'Primary live-action/voice actor for this character';
