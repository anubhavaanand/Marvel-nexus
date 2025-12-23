
import { Hero, Movie, CanonEvent } from './types';

export const INITIAL_HEROES: Hero[] = [
  {
    id: 'h1',
    name: 'Tony Stark',
    alias: 'Iron Man',
    origin_world: 'Earth-616',
    powers: ['Genius Intelligence', 'Mark LXXXV Armor', 'Nanotechnology', 'Flight', 'Repulsor Blasts'],
    weaknesses: ['Arc Reactor Dependency', 'Ego', 'PTSD'],
    image_url: 'https://images.unsplash.com/photo-1531259683007-016a703b994e?auto=format&fit=crop&q=80&w=1080',
    is_locked_content: false,
    description: 'Billionaire, playboy, philanthropist. Former CEO of Stark Industries and founding member of the Avengers. Master of armor technology.'
  },
  {
    id: 'h2',
    name: 'Steve Rogers',
    alias: 'Captain America',
    origin_world: 'Earth-616',
    powers: ['Super Soldier Serum', 'Tactical Genius', 'Vibranium Shield', 'Enhanced Strength'],
    weaknesses: ['Moral Rigidity', 'Out of Time Syndrome'],
    image_url: 'https://images.unsplash.com/photo-1626278664285-f796b9ee7806?auto=format&fit=crop&q=80&w=1080',
    is_locked_content: true,
    description: 'The First Avenger. A beacon of hope who fought in WWII and led the Avengers against Thanos. Armed with a nigh-indestructible shield.'
  },
  {
    id: 'h3',
    name: 'Logan',
    alias: 'Wolverine',
    origin_world: 'Earth-10005',
    powers: ['Accelerated Healing', 'Adamantium Skeleton', 'Animal-like Senses', 'Retractable Claws'],
    weaknesses: ['Magnetism', 'Muramasa Blade', 'Traumatic Memory'],
    image_url: 'https://images.unsplash.com/photo-1601004890684-d8cbf343f7f7?auto=format&fit=crop&q=80&w=1080',
    is_locked_content: true,
    description: 'A mutant with an unstoppable healing factor and retractable adamantium claws. A rugged survivor from the X-Men initiative.'
  },
  {
    id: 'h4',
    name: 'Miles Morales',
    alias: 'Spider-Man',
    origin_world: 'Earth-1610',
    powers: ['Venom Blast', 'Spider-Sense', 'Invisibility', 'Wall-Crawling'],
    weaknesses: ['Inexperience', 'Vulnerability to Sound'],
    image_url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=1080',
    is_locked_content: false,
    description: 'A young Brooklyn teenager who inherited the mantle of Spider-Man in the Ultimate Universe. Possesses unique bio-electric powers.'
  },
  {
    id: 'h5',
    name: 'Wanda Maximoff',
    alias: 'Scarlet Witch',
    origin_world: 'Earth-616',
    powers: ['Chaos Magic', 'Reality Warping', 'Psionic Energy', 'Telekinesis', 'Mind Manipulation'],
    weaknesses: ['Emotional Instability', 'Grief-Induced Reality Fractures', 'Mental Manipulation'],
    image_url: 'https://images.unsplash.com/photo-1635443900258-293674251214?auto=format&fit=crop&q=80&w=1080',
    is_locked_content: true,
    description: 'A Nexus Being capable of rewriting reality itself through Chaos Magic. Her power levels are currently classified as Omniverse-threatening after the Westview incident.'
  },
  {
    id: 'h6',
    name: 'Peter Parker',
    alias: 'Spider-Man',
    origin_world: 'Earth-199999',
    powers: ['Superhuman Agility', 'Wall-Crawling', 'Spider-Sense', 'Web-Shooters'],
    weaknesses: ['Identity Exposure', 'High Frequency Attacks', 'Loved Ones'],
    image_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=1080',
    is_locked_content: false,
    description: 'Your friendly neighborhood Spider-Man. Mentored by Iron Man and a key player in the battle for Earth-616.'
  },
  {
    id: 'h7',
    name: 'Vision',
    alias: 'Vision',
    origin_world: 'Earth-616',
    powers: ['Density Control', 'Solar Radiation Beam', 'Intangibility', 'Flight', 'Computer Interfacing'],
    weaknesses: ['Mind Stone Extraction Vulnerability', 'Vibranium Disruptors', 'Logic Conflict'],
    image_url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=1080',
    is_locked_content: true,
    description: 'A synthetic being created by Ultron and Helen Cho, brought to life by J.A.R.V.I.S. and the Mind Stone. A philosophical defender of life.'
  },
  {
    id: 'h8',
    name: 'Natasha Romanoff',
    alias: 'Black Widow',
    origin_world: 'Earth-616',
    powers: ['Master Martial Artist', 'Tactical Espionage', 'Enhanced Immune System', 'Multilingualism'],
    weaknesses: ['Human Fragility', 'Past Traumatic Conditioning', 'Red Room Protocols'],
    image_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1080',
    is_locked_content: false,
    description: 'A former KGB assassin and S.H.I.E.L.D. agent who became a founding member of the Avengers. Expert in infiltration and close-quarters combat.'
  }
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    tmdb_id: 299534,
    title: 'Avengers: Endgame',
    release_date: '2019-04-26',
    phase: 'Phase 3',
    poster_url: 'https://image.tmdb.org/t/p/w500/or06vS3ST0PZjnZ0ezq5vUvPb12.jpg'
  },
  {
    id: 'm2',
    tmdb_id: 1726,
    title: 'Iron Man',
    release_date: '2008-05-02',
    phase: 'Phase 1',
    poster_url: 'https://image.tmdb.org/t/p/w500/7819dd5843a2958742d1df7c48f8c474.jpg'
  },
  {
    id: 'm3',
    tmdb_id: 99861,
    title: 'Avengers: Age of Ultron',
    release_date: '2015-05-01',
    phase: 'Phase 2',
    poster_url: 'https://image.tmdb.org/t/p/w500/4ssDuvEDrS9SAySq0u8CYu9OO1R.jpg'
  }
];

export const INITIAL_CANON_EVENTS: CanonEvent[] = [
  {
    id: 'c1',
    hero_id: 'h1',
    movie_id: 'm2',
    description: 'Construction of the Mark I armor in an Afghan cave.',
    is_fixed_point: true,
    glitch_level: 0,
    movie_title: 'Iron Man'
  },
  {
    id: 'c2',
    hero_id: 'h1',
    movie_id: 'm1',
    description: 'The Ultimate Sacrifice: Snapping the Stark Gauntlet.',
    is_fixed_point: true,
    glitch_level: 3,
    movie_title: 'Avengers: Endgame'
  },
  {
    id: 'c3',
    hero_id: 'h3',
    movie_id: 'm3',
    description: 'The Adamantium Bonding Process at Weapon X.',
    is_fixed_point: true,
    glitch_level: 1,
    movie_title: 'X-Men Origins'
  },
  {
    id: 'c4',
    hero_id: 'h4',
    movie_id: 'm4',
    description: 'Uncle Aaron (The Prowler) reveals his identity.',
    is_fixed_point: true,
    glitch_level: 2,
    movie_title: 'Spider-Man: Into the Spider-Verse'
  },
  {
    id: 'c5',
    hero_id: 'h5',
    movie_id: 'm5',
    description: 'Creation of the Westview Hex and the twins.',
    is_fixed_point: true,
    glitch_level: 4,
    movie_title: 'WandaVision'
  },
  {
    id: 'c6',
    hero_id: 'h7',
    movie_id: 'm3',
    description: 'Awakening of the Vision using the Mind Stone and J.A.R.V.I.S.',
    is_fixed_point: true,
    glitch_level: 0,
    movie_title: 'Avengers: Age of Ultron'
  },
  {
    id: 'c7',
    hero_id: 'h8',
    movie_id: 'm6',
    description: 'The Vormir Sacrifice for the Soul Stone.',
    is_fixed_point: true,
    glitch_level: 3,
    movie_title: 'Avengers: Endgame'
  }
];
