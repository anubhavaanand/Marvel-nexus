-- ============================================
-- MULTIVERSE ARCHIVE DATABASE SCHEMA v2
-- New Supabase Project: Marvel-nexus
-- ============================================

-- Enable UUID extension
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
-- HEROES TABLE (with actor_name + expanded franchise)
-- ============================================
CREATE TABLE IF NOT EXISTS heroes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    alias TEXT NOT NULL,
    actor_name TEXT,
    franchise TEXT NOT NULL CHECK (franchise IN ('MCU', 'X-Men', 'Spider-Verse', 'Defenders', 'DC', 'Anime', 'The Boys')),
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

-- Public read access for all tables
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'movies' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON movies FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'heroes' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON heroes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'canon_events' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON canon_events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hero_movies' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON hero_movies FOR SELECT USING (true);
  END IF;
END $$;

-- Service role can do everything
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

-- ============================================
-- SEED: HEROES DATA (32 heroes)
-- ============================================
INSERT INTO heroes (name, alias, actor_name, franchise, origin_world, powers, weaknesses, image_url, is_locked_content) VALUES
('Tony Stark', 'Iron Man', 'Robert Downey Jr.', 'MCU', 'Earth-616', ARRAY['Genius-level intellect', 'Powered armor suit', 'Flight', 'Energy repulsors'], ARRAY['Arc reactor dependency', 'Alcoholism'], '', false),
('Steve Rogers', 'Captain America', 'Chris Evans', 'MCU', 'Earth-616', ARRAY['Super soldier serum', 'Vibranium shield', 'Enhanced strength', 'Enhanced agility'], ARRAY['Man out of time', 'Honor bound'], '', false),
('Thor Odinson', 'Thor', 'Chris Hemsworth', 'MCU', 'Asgard', ARRAY['God of Thunder', 'Mjolnir/Stormbreaker', 'Super strength', 'Flight'], ARRAY['Arrogance', 'Love for Jane Foster'], '', false),
('Bruce Banner', 'Hulk', 'Mark Ruffalo', 'MCU', 'Earth-616', ARRAY['Super strength', 'Regeneration', 'Gamma radiation', 'Near-invulnerability'], ARRAY['Anger management', 'Transforms under stress'], '', false),
('Natasha Romanoff', 'Black Widow', 'Scarlett Johansson', 'MCU', 'Earth-616', ARRAY['Expert martial artist', 'Spy tactics', 'Widow bites', 'Enhanced reflexes'], ARRAY['No superpowers', 'Red ledger'], '', false),
('Clint Barton', 'Hawkeye', 'Jeremy Renner', 'MCU', 'Earth-616', ARRAY['Master archer', 'Expert marksman', 'Tactical genius', 'Enhanced aim'], ARRAY['Family vulnerable', 'No superpowers'], '', false),
('Peter Parker', 'Spider-Man', 'Tom Holland', 'MCU', 'Earth-199999', ARRAY['Spider-sense', 'Wall-crawling', 'Super strength', 'Web shooters'], ARRAY['Guilt over Uncle Ben', 'Identity protection'], '', false),
('T''Challa', 'Black Panther', 'Chadwick Boseman', 'MCU', 'Wakanda', ARRAY['Heart-shaped herb', 'Vibranium suit', 'Enhanced strength', 'Enhanced agility'], ARRAY['King''s responsibility', 'Killmonger challenge'], '', false),
('Stephen Strange', 'Doctor Strange', 'Benedict Cumberbatch', 'MCU', 'Earth-616', ARRAY['Sorcery', 'Time Stone', 'Astral projection', 'Dimensional travel'], ARRAY['Arrogance', 'Ego'], '', false),
('Carol Danvers', 'Captain Marvel', 'Brie Larson', 'MCU', 'Earth-616', ARRAY['Photon blasts', 'Flight', 'Super strength', 'Energy absorption'], ARRAY['Memory loss', 'Kree heritage'], '', false),
('Logan', 'Wolverine', 'Hugh Jackman', 'X-Men', 'Earth-616', ARRAY['Adamantium skeleton', 'Healing factor', 'Enhanced senses', 'Retractable claws'], ARRAY['Adamantium poisoning', 'Memory loss'], '', false),
('Charles Xavier', 'Professor X', 'Patrick Stewart', 'X-Men', 'Earth-616', ARRAY['Telepathy', 'Mind control', 'Psionic shields', 'Genius intellect'], ARRAY['Paraplegic', 'Magneto rivalry'], '', false),
('Erik Lehnsherr', 'Magneto', 'Michael Fassbender', 'X-Men', 'Earth-616', ARRAY['Magnetism manipulation', 'Metal control', 'Flight', 'Force fields'], ARRAY['Holocaust trauma', 'Xavier friendship'], '', false),
('Jean Grey', 'Phoenix', 'Famke Janssen', 'X-Men', 'Earth-616', ARRAY['Telepathy', 'Telekinesis', 'Phoenix Force', 'Cosmic power'], ARRAY['Phoenix corruption', 'Emotional instability'], '', false),
('Scott Summers', 'Cyclops', 'James Marsden', 'X-Men', 'Earth-616', ARRAY['Optic blasts', 'Tactical genius', 'Leadership', 'Visor control'], ARRAY['No eye control', 'Jean Grey relationship'], '', false),
('Ororo Munroe', 'Storm', 'Halle Berry', 'X-Men', 'Earth-616', ARRAY['Weather manipulation', 'Flight', 'Elemental control', 'Goddess worship'], ARRAY['Claustrophobia', 'African heritage'], '', false),
('Miles Morales', 'Spider-Man', 'Shameik Moore', 'Spider-Verse', 'Earth-1610', ARRAY['Venom strike', 'Camouflage', 'Spider-sense', 'Web wings'], ARRAY['Guilt over Uncle Aaron', 'Multiverse responsibility'], '', false),
('Gwen Stacy', 'Spider-Gwen', 'Hailee Steinfeld', 'Spider-Verse', 'Earth-65', ARRAY['Spider-sense', 'Wall-crawling', 'Acrobatics', 'Web shooters'], ARRAY['Peter Parker death guilt', 'Multiverse travel'], '', false),
('Peter B. Parker', 'Spider-Man', 'Jake Johnson', 'Spider-Verse', 'Earth-616B', ARRAY['Spider-sense', 'Wall-crawling', 'Experience', 'Wisdom'], ARRAY['Midlife crisis', 'Divorce'], '', false),
('Clark Kent', 'Superman', 'Henry Cavill', 'DC', 'Krypton', ARRAY['Super strength', 'Flight', 'Heat vision', 'Invulnerability'], ARRAY['Kryptonite', 'Magic', 'Lois Lane'], '', false),
('Bruce Wayne', 'Batman', 'Ben Affleck', 'DC', 'Earth-0', ARRAY['Genius intellect', 'Martial arts', 'Bat-suit', 'Batmobile'], ARRAY['No superpowers', 'Parents death', 'Joker obsession'], '', false),
('Diana Prince', 'Wonder Woman', 'Gal Gadot', 'DC', 'Themyscira', ARRAY['Super strength', 'Lasso of Truth', 'Bracelets of Victory', 'Flight'], ARRAY['Honesty bound', 'Ares connection'], '', false),
('Barry Allen', 'The Flash', 'Ezra Miller', 'DC', 'Earth-0', ARRAY['Super speed', 'Speed Force', 'Time travel', 'Phasing'], ARRAY['Mother murder', 'Speed Force dependency'], '', false),
('Arthur Curry', 'Aquaman', 'Jason Momoa', 'DC', 'Atlantis', ARRAY['Super strength', 'Telepathy', 'Underwater breathing', 'Trident'], ARRAY['Surface world rejection', 'Atlantis politics'], '', false),
('Billy Butcher', 'Butcher', 'Karl Urban', 'The Boys', 'Earth', ARRAY['Tactical genius', 'V-24 powers', 'Super strength', 'Heat vision'], ARRAY['V-24 addiction', 'Revenge obsession'], '', false),
('Homelander', 'Homelander', 'Antony Starr', 'The Boys', 'Earth', ARRAY['Super strength', 'Flight', 'Heat vision', 'Invulnerability'], ARRAY['Narcissism', 'Mother issues', 'Compound V'], '', false),
('Starlight', 'Starlight', 'Erin Moriarty', 'The Boys', 'Earth', ARRAY['Light manipulation', 'Energy blasts', 'Flight', 'Super strength'], ARRAY['Homelander manipulation', 'Public image'], '', false),
('Queen Maeve', 'Queen Maeve', 'Dominique McElligott', 'The Boys', 'Earth', ARRAY['Super strength', 'Flight', 'Invulnerability', 'Combat skills'], ARRAY['Alcoholism', 'Homelander fear'], '', false),
('Goku', 'Goku', 'Masako Nozawa', 'Anime', 'Universe 7', ARRAY['Super Saiyan', 'Kamehameha', 'Instant transmission', 'Ultra Instinct'], ARRAY['Naive', 'Food obsession', 'Saiyan pride'], '', false),
('Naruto Uzumaki', 'Naruto', 'Junko Takeuchi', 'Anime', 'Shinobi World', ARRAY['Rasengan', 'Shadow clones', 'Nine-tails chakra', 'Sage mode'], ARRAY['Childhood trauma', 'Village rejection'], '', false),
('Monkey D. Luffy', 'Luffy', 'Mayumi Tanaka', 'Anime', 'Grand Line', ARRAY['Rubber body', 'Gum-Gum attacks', 'Haki', 'Gear transformations'], ARRAY['Water weakness', 'Naive nature'], '', false),
('Saitama', 'One Punch Man', 'Makoto Furukawa', 'Anime', 'Earth', ARRAY['Limitless strength', 'Speed', 'Invulnerability', 'Serious punch'], ARRAY['Boredom', 'No real challenge'], '', false)
ON CONFLICT DO NOTHING;

SELECT 'Database setup complete! ' || COUNT(*) || ' heroes seeded.' as message FROM heroes;
