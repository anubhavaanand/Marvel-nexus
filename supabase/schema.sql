-- ============================================
-- MULTIVERSE ARCHIVE - CANONICAL SCHEMA
-- Run this in the Supabase SQL Editor to create or
-- safely upgrade the database schema.
--
-- This is the single source of truth for table
-- definitions. The older scripts/create-tables.sql and
-- scripts/setup-database.sql were removed because they
-- described incompatible schemas (missing actor_name,
-- incomplete franchise lists, non-idempotent policies).
--
-- Seed data: supabase/seed.sql
-- Incremental migrations: supabase/migrations/
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MOVIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INTEGER UNIQUE,
    title TEXT NOT NULL UNIQUE,
    release_date DATE,
    phase TEXT CHECK (phase IN ('Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6')),
    poster_url TEXT,
    tmdb_rating DECIMAL(3,1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HEROES TABLE
-- actor_name and the full franchise list match what the
-- application type and UI expect.
-- ============================================
CREATE TABLE IF NOT EXISTS heroes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    alias TEXT NOT NULL,
    actor_name TEXT,
    franchise TEXT NOT NULL CHECK (franchise IN ('MCU', 'X-Men', 'Spider-Verse', 'Defenders', 'DC', 'Anime', 'The Boys', 'Invincible', 'Peacemaker', 'Gaming', 'Other')),
    origin_world TEXT,
    powers TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    image_url TEXT DEFAULT '',
    is_locked_content BOOLEAN DEFAULT FALSE,
    slug TEXT,
    first_appearance_movie_id UUID REFERENCES movies(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN SESSIONS (#412: mirror migrations 005/008)
-- Server-only credential storage; RLS exposes nothing to the public.
-- ============================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    password_epoch INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_sessions_password_epoch_idx ON admin_sessions (password_epoch);

CREATE TABLE IF NOT EXISTS admin_password_epoch (
    id INTEGER PRIMARY KEY DEFAULT 1,
    epoch INTEGER NOT NULL DEFAULT 0,
    password_hash TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admin_password_epoch (id, epoch, password_hash)
VALUES (1, 0, NULL)
ON CONFLICT (id) DO NOTHING;

-- #506: last-seeded timestamps that survive restarts and serverless instances.
CREATE TABLE IF NOT EXISTS seed_runs (
    key TEXT PRIMARY KEY,
    seeded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE seed_runs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CANON EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS canon_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID REFERENCES heroes(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id),
    description TEXT NOT NULL,
    is_fixed_point BOOLEAN DEFAULT FALSE,
    glitch_level INTEGER DEFAULT 5 CHECK (glitch_level >= 1 AND glitch_level <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (hero_id, movie_id, description)
);

-- ============================================
-- HERO_MOVIES JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hero_movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID REFERENCES heroes(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'main' CHECK (role IN ('main', 'lead', 'supporting', 'cameo')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hero_id, movie_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_heroes_franchise ON heroes(franchise);
CREATE INDEX IF NOT EXISTS idx_heroes_alias ON heroes(alias);
CREATE INDEX IF NOT EXISTS idx_canon_events_hero ON canon_events(hero_id);
-- #777: relation queries filter on movie_id.
CREATE INDEX IF NOT EXISTS idx_canon_events_movie_id ON canon_events(movie_id);
CREATE INDEX IF NOT EXISTS idx_hero_movies_movie_id ON hero_movies(movie_id);
CREATE INDEX IF NOT EXISTS idx_movies_phase ON movies(phase);
-- #480: hot list queries order by these columns.
CREATE INDEX IF NOT EXISTS idx_heroes_name ON heroes(name);
CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date);
CREATE INDEX IF NOT EXISTS idx_heroes_slug ON heroes(slug);

-- ============================================
-- HERO SLUG (#412: mirror migration 005 + guarded 009 semantics)
-- Mirror of src/lib/slugs.ts::slugifyAlias. The trigger only fills an absent
-- slug so application-chosen collision-safe slugs are preserved.
-- ============================================
CREATE OR REPLACE FUNCTION public.hero_slugify(alias text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    regexp_replace(
      regexp_replace(
        regexp_replace(lower(trim(coalesce(alias, ''))), '[''’]', '', 'g'),
        '[^a-z0-9]+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'
    );
$$;

UPDATE heroes
   SET slug = public.hero_slugify(alias)
 WHERE slug IS NULL;

CREATE OR REPLACE FUNCTION public.heros_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.slug := public.hero_slugify(NEW.alias);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS heroes_set_slug ON heroes;
-- #811: TG_OP is not available inside a trigger WHEN clause (Postgres raises
-- "column tg_op does not exist"), so the guarded trigger is split per event.
DROP TRIGGER IF EXISTS heroes_set_slug_insert ON heroes;
CREATE TRIGGER heroes_set_slug_insert
  BEFORE INSERT
  ON heroes
  FOR EACH ROW
  WHEN (
        NEW.slug IS NULL OR NEW.slug = ''
        OR public.hero_slugify(NEW.alias) IS DISTINCT FROM NEW.slug
  )
  EXECUTE FUNCTION public.heros_set_slug();

DROP TRIGGER IF EXISTS heroes_set_slug_update ON heroes;
CREATE TRIGGER heroes_set_slug_update
  BEFORE UPDATE OF alias, name
  ON heroes
  FOR EACH ROW
  WHEN (
        public.hero_slugify(NEW.alias) IS DISTINCT FROM NEW.slug
  )
  EXECUTE FUNCTION public.heros_set_slug();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE canon_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_password_epoch ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'movies' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON movies FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'heroes' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON heroes FOR SELECT USING (NOT is_locked_content);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canon_events' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON canon_events FOR SELECT USING (EXISTS (SELECT 1 FROM heroes h WHERE h.id = hero_id AND NOT h.is_locked_content));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hero_movies' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON hero_movies FOR SELECT USING (EXISTS (SELECT 1 FROM heroes h WHERE h.id = hero_id AND NOT h.is_locked_content));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'movies' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON movies FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'heroes' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON heroes FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canon_events' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON canon_events FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hero_movies' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON hero_movies FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_sessions' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON admin_sessions FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- #811: match the explicit deny-anon policy applied by migration 011.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_sessions' AND policyname = 'admin_sessions deny anon') THEN
    CREATE POLICY "admin_sessions deny anon" ON admin_sessions FOR ALL TO anon USING (false);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_password_epoch' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON admin_password_epoch FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- #506: same service-only posture for seed run timestamps.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seed_runs' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON seed_runs FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

SELECT 'Schema is up to date.' AS message;


-- ============================================
-- HERO DELETION (#440: transactional cascade)
-- ============================================
CREATE OR REPLACE FUNCTION public.delete_hero_cascade(p_hero_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.canon_events WHERE hero_id = p_hero_id;
  DELETE FROM public.hero_movies WHERE hero_id = p_hero_id;
  DELETE FROM public.heroes WHERE id = p_hero_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_hero_cascade(uuid) FROM PUBLIC;


-- #813: match the privilege posture applied by supabase/migrations/011_admin_sessions_rls.sql.
-- GRANT/REVOKE are naturally idempotent, so re-running this file is safe.
REVOKE ALL ON admin_sessions FROM anon;
REVOKE ALL ON admin_sessions FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_sessions TO service_role;
