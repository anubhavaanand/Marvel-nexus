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
    title TEXT NOT NULL,
    release_date DATE,
    phase TEXT CHECK (phase IN ('Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6')),
    poster_url TEXT,
    imdb_rating DECIMAL(3,1),
    created_at TIMESTAMPTZ DEFAULT NOW()
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
    first_appearance_movie_id UUID REFERENCES movies(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HERO_MOVIES JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hero_movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID REFERENCES heroes(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'main',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hero_id, movie_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_heroes_franchise ON heroes(franchise);
CREATE INDEX IF NOT EXISTS idx_heroes_alias ON heroes(alias);
CREATE INDEX IF NOT EXISTS idx_canon_events_hero ON canon_events(hero_id);
CREATE INDEX IF NOT EXISTS idx_movies_phase ON movies(phase);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE canon_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_movies ENABLE ROW LEVEL SECURITY;

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

SELECT 'Schema is up to date.' AS message;
