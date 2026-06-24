-- ============================================
-- CLEANED AND EXTRACTED PUBLIC SCHEMA & DATA
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET default_transaction_read_only = off;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE TABLE public.canon_events (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    hero_id uuid,
    movie_id uuid,
    description text NOT NULL,
    is_fixed_point boolean DEFAULT false,
    glitch_level integer DEFAULT 5,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT canon_events_glitch_level_check CHECK (((glitch_level >= 1) AND (glitch_level <= 10)))
);

ALTER TABLE public.canon_events OWNER TO postgres;

CREATE TABLE public.hero_movies (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    hero_id uuid,
    movie_id uuid,
    role text DEFAULT 'main'::text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.hero_movies OWNER TO postgres;

CREATE TABLE public.heroes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    alias text NOT NULL,
    franchise text NOT NULL,
    origin_world text,
    powers text[] DEFAULT '{}'::text[],
    weaknesses text[] DEFAULT '{}'::text[],
    image_url text,
    is_locked_content boolean DEFAULT false,
    first_appearance_movie_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT heroes_franchise_check CHECK ((franchise = ANY (ARRAY['MCU'::text, 'X-Men'::text, 'Spider-Verse'::text, 'Defenders'::text, 'DC'::text, 'Anime'::text, 'The Boys'::text, 'Invincible'::text, 'Other'::text])))
);

ALTER TABLE public.heroes OWNER TO postgres;

CREATE TABLE public.movies (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    tmdb_id integer,
    title text NOT NULL,
    release_date date,
    phase text,
    poster_url text,
    imdb_rating numeric(3,1),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT movies_phase_check CHECK ((phase = ANY (ARRAY['Phase 1'::text, 'Phase 2'::text, 'Phase 3'::text, 'Phase 4'::text, 'Phase 5'::text, 'Phase 6'::text])))
);

ALTER TABLE public.movies OWNER TO postgres;

-- Data for public.canon_events

-- Data for public.hero_movies

-- Data for public.heroes
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('017bde78-0cf5-409d-add0-496bfd9b3751', 'Tony Stark', 'Iron Man', 'MCU', 'Earth-616', '{"Powered Armor",Genius,Flight}'::text[], '{Ego,"Arc Reactor"}'::text[], 'https://image.tmdb.org/t/p/original/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', false, NULL, '2025-12-23 14:57:56.719292+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('d5589a07-e39a-4fba-8f03-d055939ee4ce', 'T''Challa', 'Black Panther', 'MCU', 'Earth-616', '{"Vibranium Suit","Super Strength"}'::text[], '{Tradition}'::text[], 'https://image.tmdb.org/t/p/original/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', false, NULL, '2025-12-23 14:57:59.347767+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('a749d249-9b43-484f-9544-36eb758a418f', 'Wanda Maximoff', 'Scarlet Witch', 'MCU', 'Earth-616', '{"Chaos Magic","Reality Warping"}'::text[], '{Trauma}'::text[], 'https://image.tmdb.org/t/p/original/wR185S8zgbFzPXPqeT3phWQaPey.jpg', true, NULL, '2025-12-23 14:57:58.803314+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('3ccf1002-2626-4e1f-ada1-9d012966c6fe', 'Thanos', 'Thanos', 'MCU', 'Titan', '{Power,Will}'::text[], '{Arrogance}'::text[], 'https://image.tmdb.org/t/p/original/fLs65mLoxGxUfU7iGP6bm8pdVrn.jpg', true, NULL, '2025-12-23 14:58:00.396272+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('ff3aed73-3bbb-405a-9d79-801a3f663828', 'Thor Odinson', 'Thor', 'MCU', 'Asgard', '{"God of Thunder",Mjolnir}'::text[], '{Pride}'::text[], 'https://image.tmdb.org/t/p/original/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', false, NULL, '2025-12-23 14:57:57.260236+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('5b896eb4-8143-4b87-87f2-d3a72abf8142', 'Peter Quill', 'Star-Lord', 'MCU', 'Earth-616', '{Pilot,Gadgets,"Celestial DNA"}'::text[], '{Music,Emotional}'::text[], 'https://image.tmdb.org/t/p/original/nGdyUoiKn3R3oH8TphN2HO6kBwP.jpg', false, NULL, '2025-12-23 14:57:59.86656+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('400cac30-ea6a-488f-8054-db1b3759a197', 'Stephen Strange', 'Doctor Strange', 'MCU', 'Earth-616', '{Sorcery,"Time Stone"}'::text[], '{Arrogance}'::text[], 'https://image.tmdb.org/t/p/original/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg', true, NULL, '2025-12-23 14:57:58.376421+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('2d82cf45-5ffd-400f-be79-3a53524f8090', 'Scott Lang', 'Ant-Man', 'MCU', 'Earth-616', '{Shrinking,Growing}'::text[], '{"Suit Damage"}'::text[], 'https://image.tmdb.org/t/p/original/rQRn8cS5rC4Z7kBkCsR3bVjBjOu.jpg', false, NULL, '2025-12-23 14:57:59.585526+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('4dd3e8d1-4b1e-4849-b2dd-1f0238d1c212', 'Logan', 'Wolverine', 'X-Men', 'Earth-10005', '{Healing,Claws}'::text[], '{Magnets}'::text[], 'https://image.tmdb.org/t/p/original/yv48k7QgdfwAwvBfntjjZ1WFZPy.jpg', false, NULL, '2025-12-23 14:58:00.776828+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('be884b30-9077-4466-9aaa-5fa212f06bb9', 'Gwen Stacy', 'Spider-Woman', 'Spider-Verse', 'Earth-65', '{Grace,Webs}'::text[], '{Police}'::text[], 'https://image.tmdb.org/t/p/original/uTSLeQTeHevt4fpLgid9UH2E5ls.jpg', false, NULL, '2025-12-23 14:58:02.076441+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('1c3ac266-5f83-4b31-bfd4-6208646e767c', 'Loki Laufeyson', 'Loki', 'MCU', 'Asgard', '{Illusions,Trickery}'::text[], '{Trust}'::text[], 'https://image.tmdb.org/t/p/original/voHUmluYmKyleFkTu3lOXQG702u.jpg', false, NULL, '2025-12-23 14:58:00.147024+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('0202d117-8135-46b1-b13f-d046abdc0978', 'Natasha Romanoff', 'Black Widow', 'MCU', 'Earth-616', '{"Master Spy","Martial Arts"}'::text[], '{Human}'::text[], 'https://image.tmdb.org/t/p/original/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg', false, NULL, '2025-12-23 14:57:57.737298+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('01230ed1-96e1-4eed-a518-67d338b04568', 'Bruce Wayne', 'Batman', 'DC', 'Gotham', '{Wealth,Genius,Fear}'::text[], '{Trauma}'::text[], 'https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg', false, NULL, '2025-12-23 14:58:02.707705+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('c3a3893c-b282-4922-b323-a6f3bf9dad64', 'Miguel O''Hara', 'Spider-Man 2099', 'Spider-Verse', 'Earth-928', '{Talons,Tech}'::text[], '{Canon}'::text[], 'https://image.tmdb.org/t/p/original/4FAA18ZIja70d1Tu5hr5cj2vjnr.jpg', false, NULL, '2025-12-23 14:58:02.337931+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('087ea21a-7e7f-43f8-99f9-070c58d55100', 'Wade Wilson', 'Deadpool', 'X-Men', 'Earth-TRN414', '{Immortal,"4th Wall Break"}'::text[], '{Insane}'::text[], 'https://image.tmdb.org/t/p/original/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg', false, NULL, '2025-12-23 14:58:01.018838+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('1887b470-6f46-4b5b-8948-86aba712df54', 'Erik Lehnsherr', 'Magneto', 'X-Men', 'Earth-10005', '{Magnetism}'::text[], '{Wood}'::text[], 'https://image.tmdb.org/t/p/original/uxVPRUjU3VlvkExvIQPLBvvJM7Y.jpg', false, NULL, '2025-12-23 14:58:01.531871+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('9235c818-7454-4376-82ba-af67d8f02f23', 'Miles Morales', 'Miles Morales', 'Spider-Verse', 'Earth-1610', '{"Venom Strike",Invisibility}'::text[], '{Inexperience}'::text[], 'https://image.tmdb.org/t/p/original/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', false, NULL, '2025-12-23 14:58:01.765724+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('777499cf-62ea-442d-b934-d4aec3f8e5f2', 'Charles Xavier', 'Professor X', 'X-Men', 'Earth-10005', '{Telepathy}'::text[], '{Spine}'::text[], 'https://image.tmdb.org/t/p/original/hExlhkWEFNSJitH52ulGZpBo5ty.jpg', false, NULL, '2025-12-23 14:58:01.257527+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('9ec1d744-d6e6-4bc6-9365-843be52beeab', 'Clark Kent', 'Superman', 'DC', 'Krypton', '{God-like}'::text[], '{Kryptonite}'::text[], 'https://image.tmdb.org/t/p/original/8jJtQZg0IjrfKY3Jbu3CYvh1d1L.jpg', false, NULL, '2025-12-23 14:58:02.964938+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('6ae68c4a-e633-4a7c-a47c-756f1bd83c9e', 'Diana Prince', 'Wonder Woman', 'DC', 'Themyscira', '{Warrior,Lasso}'::text[], '{Binding}'::text[], 'https://image.tmdb.org/t/p/original/gfJGlDaHuWimTnCf7qR8z7zOL7K.jpg', false, NULL, '2025-12-23 14:58:03.182751+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('d651881f-e7c5-4215-8354-aab204518a2d', 'Arthur Curry', 'Aquaman', 'DC', 'Atlantis', '{"Ocean King"}'::text[], '{"Dry Land"}'::text[], 'https://image.tmdb.org/t/p/original/zlG5bHnpci2Ou7hYQWfzuawzMi0.jpg', false, NULL, '2025-12-23 14:58:03.719622+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('936142ae-d56b-4a17-8b4f-9eec3cc95ff1', 'Victor Stone', 'Cyborg', 'DC', 'Detroit', '{Technopathy}'::text[], '{EMP}'::text[], 'https://image.tmdb.org/t/p/original/qbj4fCMd6VXlDyRq2JHE2S3F2yO.jpg', false, NULL, '2025-12-23 14:58:03.994707+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('2580fbd7-881f-45bf-8063-ae4b89e55fdf', 'Barry Allen', 'The Flash', 'DC', 'Central City', '{"Speed Force"}'::text[], '{Cold}'::text[], 'https://image.tmdb.org/t/p/original/lJA2RCMfsWoskqlQhXPSLFQGXEJ.jpg', false, NULL, '2025-12-23 14:58:03.481806+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('d0916207-73bb-428b-93df-f82d79ed9205', 'Dick Grayson', 'Nightwing', 'DC', 'Blüdhaven', '{Acrobatics}'::text[], '{Human}'::text[], 'https://image.tmdb.org/t/p/original/9jVCHPmXdLBdW8E1I4zGzZUgcH9.jpg', false, NULL, '2025-12-23 14:58:04.631383+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('6ae5aa72-614c-44ea-b3a4-335dc966f899', 'Harleen Quinzel', 'Harley Quinn', 'DC', 'Gotham', '{Unpredictable}'::text[], '{Joker}'::text[], 'https://image.tmdb.org/t/p/original/rodjieRdOuUySMqUHpz7oSapSXq.jpg', false, NULL, '2025-12-23 14:58:05.2805+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('072bf514-eabe-4f17-a4cc-70edabdd45cd', 'Hal Jordan', 'Green Lantern', 'DC', 'Coast City', '{Willpower}'::text[], '{Fear}'::text[], 'https://image.tmdb.org/t/p/original/fk8OfdReNltKZqOk2TZgko3M1Y.jpg', false, NULL, '2025-12-23 14:58:04.378592+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('5667004f-c28d-4f2d-935e-b619408d97ff', 'Bruce Banner', 'Hulk', 'MCU', 'Earth-616', '{"Super Strength",Regen}'::text[], '{Rage}'::text[], 'https://image.tmdb.org/t/p/original/pJ6LABxc0qqqP8bPvCHg8a3NQM9.jpg', false, NULL, '2025-12-23 14:57:57.49704+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('7eb67fd4-e5dc-4a78-80ab-becadb64234f', 'Peter Parker', 'Spider-Man', 'MCU', 'Earth-616', '{Spider-Sense,Webs}'::text[], '{Responsibility}'::text[], 'https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', false, NULL, '2025-12-23 14:57:59.022685+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('afc81bb5-9ffe-452a-b37c-1215cd4d5deb', 'Clint Barton', 'Hawkeye', 'MCU', 'Earth-616', '{"Master Archer",Accuracy}'::text[], '{"Hearing Loss"}'::text[], 'https://image.tmdb.org/t/p/original/2hElpOxE6Dqm8IGZkKdxQ1k0fv0.jpg', false, NULL, '2025-12-23 14:57:58.085529+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('e4737522-9d38-48f4-bde3-533b4444a3a9', 'Billy Batson', 'Shazam', 'DC', 'Philly', '{"Magic Word"}'::text[], '{"Child Form"}'::text[], 'https://image.tmdb.org/t/p/original/xnopI5Xtky18MPhK40cZAGAOVeV.jpg', false, NULL, '2025-12-23 14:58:05.577205+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('5b4d6d38-de9a-4372-ba1d-ed45155e3301', 'Unknown', 'Joker', 'DC', 'Gotham', '{Chaos}'::text[], '{Bats}'::text[], 'https://image.tmdb.org/t/p/original/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', true, NULL, '2025-12-23 14:58:04.929314+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('b073ddf9-80db-4c4c-a44f-50d4bb2a1eec', 'Groot', 'Groot', 'MCU', 'Planet X', '{Regeneration,"Super Strength","Flora Colossus"}'::text[], '{Fire}'::text[], 'https://image.tmdb.org/t/p/original/mJvd1nz4LhE4f0reBLaQRLNMxr7.jpg', false, NULL, '2025-12-23 15:45:05.436751+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('758ea586-5b61-4f18-8c43-2610b52f06e4', 'Prince Vegeta', 'Vegeta', 'Anime', 'Dragon Ball', '{"Super Saiyan","Final Flash","Ultra Ego"}'::text[], '{Pride}'::text[], 'https://cdn.myanimelist.net/images/characters/9/284122.jpg', false, NULL, '2025-12-23 15:45:17.209748+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('970f2e9c-7b93-49f7-afae-58fa2c004a32', 'Rocket Raccoon', 'Rocket', 'MCU', 'Halfworld', '{"Genius Engineer","Master Tactician","Weapons Expert"}'::text[], '{"Anger Issues"}'::text[], 'https://image.tmdb.org/t/p/original/4fexNW2pPxhp9lITGLqC3lW6nLS.jpg', false, NULL, '2025-12-23 15:45:04.79619+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('9581f14f-3e46-4cea-8585-bfad5bb5ff58', 'Vision', 'Vision', 'MCU', 'Earth-616', '{"Mind Stone","Density Control",Flight,Genius}'::text[], '{"Mind Stone Dependency"}'::text[], 'https://image.tmdb.org/t/p/original/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg', false, NULL, '2025-12-23 15:45:06.084662+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('82cb6425-63f6-4188-9019-182a5a4cc2fb', 'Drax the Destroyer', 'Drax', 'MCU', 'Unknown', '{"Super Strength",Durability,"Literal Thinking"}'::text[], '{Metaphors}'::text[], 'https://image.tmdb.org/t/p/original/9O0VBbOWbcFEW2rxdFEL2l8uVAM.jpg', false, NULL, '2025-12-23 15:45:04.19117+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('11d0d6ad-d66f-4558-86ec-9f4481a4e5c9', 'Teth-Adam', 'Black Adam', 'DC', 'Kahndaq', '{Anti-Hero}'::text[], '{Rage}'::text[], 'https://image.tmdb.org/t/p/original/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg', false, NULL, '2025-12-23 14:58:05.929631+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('c0b49b76-762e-4346-9dd6-fc912e0438fb', 'Oliver Queen', 'Green Arrow', 'DC', 'Star City', '{"Master Archer","Martial Arts","Peak Human"}'::text[], '{"Human Mortality"}'::text[], 'https://image.tmdb.org/t/p/original/gKG5QGz5Ngf8fgWpBsWtlg5L2SF.jpg', false, NULL, '2025-12-23 15:45:06.717156+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('4172b466-73e8-4f9d-b605-3e6510bce50f', 'Kara Zor-El', 'Supergirl', 'DC', 'Krypton', '{"Kryptonian Powers",Flight,"Heat Vision"}'::text[], '{Kryptonite}'::text[], 'https://image.tmdb.org/t/p/original/vqBsgL9nd2v04ZvCqPz0KAMq00l.jpg', false, NULL, '2025-12-23 15:45:07.315512+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('25284aa8-7ce3-4152-b0be-2d14a5a36b76', 'Selina Kyle', 'Catwoman', 'DC', 'Gotham', '{Stealth,Acrobatics,"Cat Burglar"}'::text[], '{Cats}'::text[], 'https://image.tmdb.org/t/p/original/kJfGL4e0I5VQjWY6gG5Rqa1VKmt.jpg', false, NULL, '2025-12-23 15:45:07.90985+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('430f63ba-9283-409f-ae59-05cf7d21f801', 'John', 'Homelander', 'The Boys', 'Vought', '{"God Complex"}'::text[], '{Ego}'::text[], 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg', false, NULL, '2025-12-23 14:58:06.221909+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('5588e292-0371-45ca-9096-2110abbf9c86', 'Son Gohan', 'Gohan', 'Anime', 'Dragon Ball', '{"Beast Form","Potential Unleashed",Masenko}'::text[], '{Pacifist}'::text[], 'https://cdn.myanimelist.net/images/characters/9/327401.jpg', false, NULL, '2025-12-23 15:45:17.695766+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('b49e6e43-0d65-4b05-bd6b-b662b638961a', 'Vinsmoke Sanji', 'Sanji', 'Anime', 'One Piece', '{"Black Leg","Diable Jambe",Chef}'::text[], '{Women}'::text[], 'https://cdn.myanimelist.net/images/characters/13/307679.jpg', false, NULL, '2025-12-23 15:45:16.062524+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('d7aed7cd-4c33-4ca6-9fa8-7bde9d00830e', 'Nami', 'Nami', 'Anime', 'One Piece', '{"Weather Control",Zeus,Navigator}'::text[], '{Money}'::text[], 'https://cdn.myanimelist.net/images/characters/2/478918.jpg', false, NULL, '2025-12-23 15:45:16.712321+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('b7023585-57ed-42fd-98ae-47918b046829', 'Izuku Midoriya', 'Deku', 'Anime', 'My Hero Academia', '{"One For All","Super Strength",Blackwhip}'::text[], '{Self-Sacrifice}'::text[], 'https://cdn.myanimelist.net/images/characters/7/299404.jpg', false, NULL, '2025-12-23 15:45:08.47679+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('c0d5a0a9-1ecd-4139-b0aa-0ef0eebf985f', 'Toshinori Yagi', 'All Might', 'Anime', 'My Hero Academia', '{"One For All","Symbol of Peace","Detroit Smash"}'::text[], '{"Time Limit"}'::text[], 'https://cdn.myanimelist.net/images/characters/6/320809.jpg', false, NULL, '2025-12-23 15:45:08.973077+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('0753f950-36c1-4950-a147-6d67143bd146', 'Shoto Todoroki', 'Todoroki', 'Anime', 'My Hero Academia', '{"Half-Cold Half-Hot",Ice,Fire}'::text[], '{"Family Issues"}'::text[], 'https://cdn.myanimelist.net/images/characters/15/422168.jpg', false, NULL, '2025-12-23 15:45:10.178583+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('185ad4b3-98db-4b06-9a0e-d1ba156b5202', 'Katsuki Bakugo', 'Bakugo', 'Anime', 'My Hero Academia', '{Explosion,"Combat Genius",Determination}'::text[], '{Pride}'::text[], 'https://cdn.myanimelist.net/images/characters/2/325952.jpg', false, NULL, '2025-12-23 15:45:09.582314+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('f85e9021-e159-4566-bf3c-46d223094280', 'Mikasa Ackerman', 'Mikasa', 'Anime', 'Attack on Titan', '{"Ackerman Power","ODM Master","Super Strength"}'::text[], '{Eren}'::text[], 'https://cdn.myanimelist.net/images/characters/12/482033.jpg', false, NULL, '2025-12-23 15:45:13.696111+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('11600f3e-9bbd-4133-af94-90f4b6e228eb', 'Armin Arlert', 'Armin', 'Anime', 'Attack on Titan', '{"Colossal Titan","Genius Tactician",Transformation}'::text[], '{"Physical Weakness"}'::text[], 'https://cdn.myanimelist.net/images/characters/8/346308.jpg', false, NULL, '2025-12-23 15:45:15.569287+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('b0b652e9-fd35-4bf4-884b-ecbd0c6a057d', 'Light Yagami', 'Light Yagami', 'Anime', 'Death Note', '{"Death Note","Genius Intellect",Manipulation}'::text[], '{"God Complex"}'::text[], 'https://cdn.myanimelist.net/images/characters/8/282351.jpg', true, NULL, '2025-12-23 15:45:18.689237+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('11b39d0c-1c55-48be-a596-7ce48c17fb86', 'L Lawliet', 'L', 'Anime', 'Death Note', '{"Genius Detective",Deduction,Sugar}'::text[], '{Sweets}'::text[], 'https://cdn.myanimelist.net/images/characters/8/282352.jpg', false, NULL, '2025-12-23 15:45:19.208008+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('309fac01-18ca-41bd-9cb1-162943abd3ce', 'Tanjiro Kamado', 'Tanjiro', 'Anime', 'Demon Slayer', '{"Sun Breathing","Water Breathing","Enhanced Smell"}'::text[], '{Human}'::text[], 'https://cdn.myanimelist.net/images/characters/6/386735.jpg', false, NULL, '2025-12-23 15:45:10.700774+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('64133b2b-aba7-4895-a725-61d710a0a5ce', 'Nezuko Kamado', 'Nezuko', 'Anime', 'Demon Slayer', '{"Demon Form","Blood Demon Art","Size Change"}'::text[], '{Sunlight}'::text[], 'https://cdn.myanimelist.net/images/characters/2/378254.jpg', false, NULL, '2025-12-23 15:45:11.280451+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('c50ba3bd-9223-4f9a-91bb-b30a9e46c789', 'Zenitsu Agatsuma', 'Zenitsu', 'Anime', 'Demon Slayer', '{"Thunder Breathing","Godlike Speed","Sleep Fighting"}'::text[], '{Cowardice}'::text[], 'https://cdn.myanimelist.net/images/characters/16/476913.jpg', false, NULL, '2025-12-23 15:45:11.898658+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('cde33ea4-89a6-426e-b8d7-c28fcc118983', 'Ichigo Kurosaki', 'Ichigo', 'Anime', 'Bleach', '{Zanpakuto,"Hollow Powers","Getsuga Tensho"}'::text[], '{Emotion}'::text[], 'https://cdn.myanimelist.net/images/characters/8/335545.jpg', false, NULL, '2025-12-23 15:45:18.21963+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('c0c2648e-155e-4296-9337-84cba1b13564', 'Yuji Itadori', 'Yuji Itadori', 'Anime', 'Jujutsu Kaisen', '{"Superhuman Strength","Sukuna Vessel","Black Flash"}'::text[], '{Sukuna}'::text[], 'https://cdn.myanimelist.net/images/characters/6/467646.jpg', false, NULL, '2025-12-23 15:45:12.389253+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('9c79c437-e036-4832-81f9-d5d887b3e7cb', 'Megumi Fushiguro', 'Megumi', 'Anime', 'Jujutsu Kaisen', '{"Ten Shadows",Shikigami,"Domain Expansion"}'::text[], '{Self-Sacrifice}'::text[], 'https://cdn.myanimelist.net/images/characters/3/474789.jpg', false, NULL, '2025-12-23 15:45:13.112041+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('87921177-7856-490e-8976-373dbdc61e51', 'Gamora', 'Gamora', 'MCU', 'Zen-Whoberi', '{"Enhanced Strength","Master Assassin","Godslayer Sword"}'::text[], '{Mortality}'::text[], 'https://image.tmdb.org/t/p/original/1igJAXh1hxkopOKqlMd4lfvJwMH.jpg', false, NULL, '2025-12-23 15:45:02.978911+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('58089113-0da3-4ceb-8a3a-b77875e02512', 'Naruto Uzumaki', 'Naruto', 'Anime', 'Naruto', '{Hokage}'::text[], '{Ramen}'::text[], 'https://cdn.myanimelist.net/images/characters/2/284916.jpg', false, NULL, '2025-12-23 14:58:10.888229+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('a0f58885-37fe-45ab-875a-b2b8cac97f85', 'Monkey D. Luffy', 'Luffy', 'Anime', 'One Piece', '{Rubber}'::text[], '{Water}'::text[], 'https://cdn.myanimelist.net/images/characters/9/310307.jpg', false, NULL, '2025-12-23 14:58:10.048767+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('b7bae45f-2227-4899-8ed7-d9c6d37e3053', 'Roronoa Zoro', 'Zoro', 'Anime', 'One Piece', '{Swords}'::text[], '{Directions}'::text[], 'https://cdn.myanimelist.net/images/characters/3/100534.jpg', false, NULL, '2025-12-23 14:58:10.379087+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('5a561468-5d40-4450-95cc-687d1e8f0ebf', 'Peter Parker', 'Spider-Man (Andrew)', 'Spider-Verse', 'Earth-120703', '{Agility,"Web Shooters","Scientific Genius"}'::text[], '{"Guilt (Gwen Stacy)",Rage}'::text[], 'https://image.tmdb.org/t/p/original/wZ5pM6t03Bjgvd85N4BExEe2qrR.jpg', false, NULL, '2025-12-23 14:58:29.860718+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('b78a9b29-4e96-4cd6-847f-0316d20e5bad', 'Peter Parker', 'Spider-Man (Tobey)', 'Spider-Verse', 'Earth-96283', '{"Organic Webbing","Super Strength",Spider-Sense}'::text[], '{"Back Pain","Mary Jane"}'::text[], 'https://image.tmdb.org/t/p/original/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg', false, NULL, '2025-12-23 14:58:29.274361+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('194083a6-b423-4888-9dda-52b5b87cb0ae', 'Annie January', 'Starlight', 'The Boys', 'Vought', '{Light}'::text[], '{"Power Source"}'::text[], 'https://image.tmdb.org/t/p/original/lnf3EqhGHnl5EYU3ZXNiymxl9ht.jpg', false, NULL, '2025-12-23 14:58:06.864689+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('21f60295-f6b1-418d-81a7-4ca94fad7c22', 'Billy Butcher', 'Butcher', 'The Boys', 'London', '{Brutality}'::text[], '{Ryan}'::text[], 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg', false, NULL, '2025-12-23 14:58:06.561983+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('4420b897-00cc-483a-9039-2ca9bd26bb86', 'Eren Yeager', 'Eren Yeager', 'Anime', 'AOT', '{Titan}'::text[], '{Freedom}'::text[], 'https://cdn.myanimelist.net/images/characters/10/216895.jpg', true, NULL, '2025-12-23 14:58:11.369564+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('c04a92ea-5298-491a-ab92-3ea4e6772bb6', 'Gon Freecss', 'Gon', 'Anime', 'Hunter x Hunter', '{Nen,Jajanken,"Enhanced Senses"}'::text[], '{Anger}'::text[], 'https://cdn.myanimelist.net/images/characters/11/174517.jpg', false, NULL, '2025-12-23 15:45:20.257975+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('6365c000-ff9a-4ce9-bb4a-7de3dbcef78d', 'Killua Zoldyck', 'Killua', 'Anime', 'Hunter x Hunter', '{Godspeed,Assassin,Electricity}'::text[], '{Illumi}'::text[], 'https://cdn.myanimelist.net/images/characters/2/327920.jpg', false, NULL, '2025-12-23 15:45:22.947659+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('9d0cb4d0-3201-403b-b0a2-d30d6eda3a1c', 'One Punch Man', 'Saitama', 'Anime', 'OPM', '{Punch}'::text[], '{Bored}'::text[], 'https://cdn.myanimelist.net/images/characters/11/294388.jpg', false, NULL, '2025-12-23 14:58:11.126104+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('56578fc3-8e04-4889-a73b-55ef5b5510fc', 'Spike Spiegel', 'Spike Spiegel', 'Anime', 'Cowboy Bebop', '{"Martial Arts",Marksmanship,Cool}'::text[], '{Past}'::text[], 'https://cdn.myanimelist.net/images/characters/4/50197.jpg', false, NULL, '2025-12-23 15:45:19.768251+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('b5d1b488-808c-4b0e-a8ad-e03290b56ff1', 'Reggie Franklin', 'A-Train', 'The Boys', 'Vought', '{Speed}'::text[], '{Heart}'::text[], 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg', false, NULL, '2025-12-23 14:58:07.426054+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('a387abf0-3f15-4c39-82ca-cfafa09f84c4', 'Kevin', 'The Deep', 'The Boys', 'Vought', '{"Fish Talk"}'::text[], '{Gills}'::text[], 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg', false, NULL, '2025-12-23 14:58:08.596662+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('4d136d59-ab61-404d-81c4-8be2d88fb307', 'Maggie Shaw', 'Queen Maeve', 'The Boys', 'Vought', '{Strength}'::text[], '{Burnout}'::text[], 'https://image.tmdb.org/t/p/original/lnf3EqhGHnl5EYU3ZXNiymxl9ht.jpg', false, NULL, '2025-12-23 14:58:08.016014+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('113ac17e-401e-4c37-860d-fd25cae2b698', 'Earving', 'Black Noir', 'The Boys', 'Vought', '{Stealth}'::text[], '{Nuts}'::text[], 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg', false, NULL, '2025-12-23 14:58:08.328036+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('83c3ce82-91df-40f4-972b-e144e40924ce', 'Ben', 'Soldier Boy', 'The Boys', 'Vought', '{Radiation}'::text[], '{PTSD}'::text[], 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg', true, NULL, '2025-12-23 14:58:07.177531+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('3338dac4-75a4-4e48-8f66-23997b10a887', 'Kakarot', 'Goku', 'Anime', 'Dragon Ball', '{Saiyan}'::text[], '{Hunger}'::text[], 'https://cdn.myanimelist.net/images/characters/5/266681.jpg', false, NULL, '2025-12-23 14:58:10.627744+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('199622e9-199a-48de-a305-ae9179ac21b3', 'Christopher Smith', 'Peacemaker', 'DC', 'DCEU', '{"Peak Conditioning",Armor,"Peace at all costs"}'::text[], '{Dad}'::text[], 'https://image.tmdb.org/t/p/original/hFMsj6J5xvfU3HUJLQnLSbLRqOr.jpg', false, NULL, '2025-12-23 15:03:35.30314+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('f0bc3a00-2bbc-4988-8788-5be3ed1fd6b3', 'Adrian Chase', 'Vigilante', 'DC', 'DCEU', '{"Healing Factor",Marskman}'::text[], '{"Social Skills"}'::text[], 'https://image.tmdb.org/t/p/original/7MCV2pwN1h3sx6dH0uE3WiP68Ac.jpg', false, NULL, '2025-12-23 15:03:35.853055+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('435f7019-30ba-4ca9-bda8-7e377ed16e62', 'Eagly', 'Eagly', 'DC', 'DCEU', '{Flight,Claws,Hugs}'::text[], '{Bird}'::text[], 'https://image.tmdb.org/t/p/original/4LsalAWA6R9c5kMhnLoMOdM6iB3.jpg', false, NULL, '2025-12-23 15:03:36.972935+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('d94abbfa-5cce-4fc9-9cc1-5ca7fd08be5a', 'Judomaster', 'Judomaster', 'DC', 'DCEU', '{Judo,Agility}'::text[], '{Height}'::text[], 'https://image.tmdb.org/t/p/original/yYPz93DmitmN3LLNJIoUCPVhOYz.jpg', false, NULL, '2025-12-23 15:03:36.402129+00');
INSERT INTO public.heroes (id, name, alias, franchise, origin_world, powers, weaknesses, image_url, is_locked_content, first_appearance_movie_id, created_at) VALUES ('615ef46c-e6e0-4514-829f-f4cabfeb1d22', 'Steve Rogers', 'Captain America', 'MCU', 'Earth-616', '{"Super Soldier",Shield,Tactician}'::text[], '{"Time Displacement"}'::text[], 'https://image.tmdb.org/t/p/original/rFObbzTEh8S5D6cIVxM2OFfv4X8.jpg', false, NULL, '2025-12-23 14:57:56.986826+00');

-- Data for public.movies

ALTER TABLE ONLY public.canon_events
    ADD CONSTRAINT canon_events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.hero_movies
    ADD CONSTRAINT hero_movies_hero_id_movie_id_key UNIQUE (hero_id, movie_id);

ALTER TABLE ONLY public.hero_movies
    ADD CONSTRAINT hero_movies_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_tmdb_id_key UNIQUE (tmdb_id);

CREATE INDEX idx_canon_events_hero ON public.canon_events USING btree (hero_id);

CREATE INDEX idx_heroes_alias ON public.heroes USING btree (alias);

CREATE INDEX idx_heroes_franchise ON public.heroes USING btree (franchise);

CREATE INDEX idx_movies_phase ON public.movies USING btree (phase);

ALTER TABLE ONLY public.canon_events
    ADD CONSTRAINT canon_events_hero_id_fkey FOREIGN KEY (hero_id) REFERENCES public.heroes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.canon_events
    ADD CONSTRAINT canon_events_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id);

ALTER TABLE ONLY public.hero_movies
    ADD CONSTRAINT hero_movies_hero_id_fkey FOREIGN KEY (hero_id) REFERENCES public.heroes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.hero_movies
    ADD CONSTRAINT hero_movies_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_first_appearance_movie_id_fkey FOREIGN KEY (first_appearance_movie_id) REFERENCES public.movies(id);

CREATE POLICY "Public read access" ON public.canon_events FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.hero_movies FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.heroes FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.movies FOR SELECT USING (true);

CREATE POLICY "Service role full access" ON public.canon_events USING ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role full access" ON public.hero_movies USING ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role full access" ON public.heroes USING ((auth.role() = 'service_role'::text));

CREATE POLICY "Service role full access" ON public.movies USING ((auth.role() = 'service_role'::text));

ALTER TABLE public.canon_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.hero_movies ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.heroes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.canon_events TO anon;

GRANT ALL ON TABLE public.canon_events TO authenticated;

GRANT ALL ON TABLE public.canon_events TO service_role;

GRANT ALL ON TABLE public.hero_movies TO anon;

GRANT ALL ON TABLE public.hero_movies TO authenticated;

GRANT ALL ON TABLE public.hero_movies TO service_role;

GRANT ALL ON TABLE public.heroes TO anon;

GRANT ALL ON TABLE public.heroes TO authenticated;

GRANT ALL ON TABLE public.heroes TO service_role;

GRANT ALL ON TABLE public.movies TO anon;

GRANT ALL ON TABLE public.movies TO authenticated;

GRANT ALL ON TABLE public.movies TO service_role;
