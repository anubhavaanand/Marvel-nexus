-- ============================================
-- MULTIVERSE ARCHIVE - SEED DATA
-- Loaded automatically by `supabase db reset` (see supabase/config.toml)
-- and safe to run manually on an empty database.
--
-- Every block is idempotent (#459): re-running converges to the curated set
-- instead of only seeding completely empty tables.
-- Schema changes belong in supabase/migrations/, not here.
--
-- origin_world should use the controlled vocabulary:
--   Earth-616, Earth-10005, Earth-199999, Earth-1610, Earth-65,
--   Earth-616B, Earth-928, Earth-TRN414, Earth-96283, Earth-120703,
--   Asgard, Wakanda, Vought Universe, Gotham, Metropolis, Central City,
--   Star City, Coast City, Atlantis, Themyscira, Krypton, Titan,
--   Zen-Whoberi, Halfworld, Planet X, Shinobi World, Grand Line,
--   Universe 7, Dragon Ball, One Piece, My Hero Academia, Attack on Titan,
--   Death Note, Demon Slayer, Bleach, Jujutsu Kaisen, Hunter x Hunter,
--   OPM, Cowboy Bebop, Naruto
-- ============================================

-- Movies (timeline + watch order need these)
-- Idempotent (#459): each row is inserted only when its title is absent, so a
-- partially seeded or partially failed database converges to the full set.
INSERT INTO movies (title, release_date, phase, poster_url)
SELECT v.title, v.release_date, v.phase, v.poster_url
  FROM (VALUES
    ('Iron Man', '2008-05-02', 'Phase 1'::text, ''),
    ('The Avengers', '2012-05-04', 'Phase 1'::text, ''),
    ('Thor: Ragnarok', '2017-11-03', 'Phase 3'::text, ''),
    ('Avengers: Infinity War', '2018-04-27', 'Phase 3'::text, ''),
    ('Avengers: Endgame', '2019-04-26', 'Phase 3'::text, ''),
    ('Spider-Man: Homecoming', '2017-07-07', 'Phase 3'::text, ''),
    ('Spider-Man: No Way Home', '2021-12-17', 'Phase 4'::text, ''),
    ('X-Men', '2000-07-14', NULL::text, ''),
    ('Logan', '2017-03-03', NULL::text, ''),
    ('Wonder Woman', '2017-06-02', NULL::text, ''),
    ('Spider-Man: Into the Spider-Verse', '2018-12-14', NULL::text, '')
  ) AS v(title, release_date, phase, poster_url)
 WHERE NOT EXISTS (SELECT 1 FROM movies m WHERE m.title = v.title);

-- Heroes (curated demo set; actor names included)
INSERT INTO heroes (name, alias, actor_name, franchise, origin_world, powers, weaknesses, image_url, is_locked_content)
SELECT v.name, v.alias, v.actor_name, v.franchise, v.origin_world, v.powers, v.weaknesses, v.image_url, v.is_locked_content
  FROM (VALUES
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
('Saitama', 'One Punch Man', 'Makoto Furukawa', 'Anime', 'Earth', ARRAY['Limitless strength', 'Speed', 'Invulnerability', 'Serious punch'], ARRAY['Boredom', 'No real challenge'], '', false),
  ) AS v(name, alias, actor_name, franchise, origin_world, powers, weaknesses, image_url, is_locked_content)
 WHERE NOT EXISTS (
   SELECT 1 FROM heroes h WHERE h.name = v.name AND h.alias = v.alias
 );

-- Hero <-> movie links
INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Iron Man'
 WHERE h.alias = 'Iron Man'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'The Avengers'
 WHERE h.alias = 'Iron Man'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Avengers: Endgame'
 WHERE h.alias = 'Iron Man'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'The Avengers'
 WHERE h.alias = 'Captain America'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Avengers: Endgame'
 WHERE h.alias = 'Captain America'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'The Avengers'
 WHERE h.alias = 'Thor'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Thor: Ragnarok'
 WHERE h.alias = 'Thor'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Avengers: Endgame'
 WHERE h.alias = 'Thor'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Spider-Man: Homecoming'
 WHERE h.name = 'Peter Parker' AND h.alias = 'Spider-Man'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Spider-Man: No Way Home'
 WHERE h.name = 'Peter Parker' AND h.alias = 'Spider-Man'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'X-Men'
 WHERE h.alias = 'Wolverine'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Logan'
 WHERE h.alias = 'Wolverine'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Wonder Woman'
 WHERE h.alias = 'Wonder Woman'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

INSERT INTO hero_movies (hero_id, movie_id, role)
SELECT h.id, m.id, 'main'
  FROM heroes h JOIN movies m ON m.title = 'Spider-Man: Into the Spider-Verse'
 WHERE h.name = 'Miles Morales'
   AND NOT EXISTS (
     SELECT 1 FROM hero_movies hm WHERE hm.hero_id = h.id AND hm.movie_id = m.id
   );

-- First appearances (only where the movie list makes the answer unambiguous)
UPDATE heroes h SET first_appearance_movie_id = m.id
  FROM movies m
 WHERE (h.name, m.title) IN (
    ('Tony Stark', 'Iron Man'),
    ('Steve Rogers', 'The Avengers'),
    ('Thor Odinson', 'The Avengers'),
    ('Bruce Banner', 'The Avengers'),
    ('Natasha Romanoff', 'Iron Man'),
    ('Clint Barton', 'The Avengers'),
    ('Peter Parker', 'Spider-Man: Homecoming'),
    ('Logan', 'X-Men'),
    ('Diana Prince', 'Wonder Woman'),
    ('Miles Morales', 'Spider-Man: Into the Spider-Verse')
 );

-- Normalize The Boys origin world to match the seed scripts
UPDATE heroes SET origin_world = 'Vought Universe'
 WHERE franchise = 'The Boys' AND origin_world = 'Earth';

-- Canon events (powers the timeline page)
INSERT INTO canon_events (hero_id, movie_id, description, is_fixed_point, glitch_level)
SELECT h.id, m.id, v.description, v.is_fixed_point, v.glitch_level
  FROM (VALUES
    ('Tony Stark', 'Iron Man', 'Iron Man', 'Tony Stark reveals he is Iron Man', true, 6),
    ('Tony Stark', 'Iron Man', 'Avengers: Endgame', 'Tony Stark snaps away Thanos'' army', true, 9),
    ('Steve Rogers', 'Captain America', 'Avengers: Endgame', 'Steve Rogers proves worthy of Mjolnir', false, 4),
    ('Thor Odinson', 'Thor', 'Thor: Ragnarok', 'Asgard is destroyed by Surtur', true, 8),
    ('Peter Parker', 'Spider-Man', 'Spider-Man: No Way Home', 'The multiverse breaks open', true, 9),
    ('Logan', 'Wolverine', 'Logan', 'Logan sacrifices himself for Laura', true, 9),
    ('Diana Prince', 'Wonder Woman', 'Wonder Woman', 'Diana leaves Themyscira for the war', false, 5),
    ('Miles Morales', 'Spider-Man', 'Spider-Man: Into the Spider-Verse', 'Miles embraces his Spider-Man identity', true, 7)
  ) AS v(name, alias, title, description, is_fixed_point, glitch_level)
  JOIN heroes h ON h.name = v.name AND h.alias = v.alias
  JOIN movies m ON m.title = v.title
 WHERE NOT EXISTS (
   SELECT 1 FROM canon_events ce
    WHERE ce.hero_id = h.id AND ce.movie_id = m.id AND ce.description = v.description
 );

SELECT 'Seed complete.' AS message;
