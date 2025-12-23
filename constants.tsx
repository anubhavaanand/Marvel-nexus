
import { Hero, Movie, CanonEvent } from './types';

export const INITIAL_HEROES: Hero[] = [
  {
    id: 'h1',
    name: 'Tony Stark',
    alias: 'Iron Man',
    origin_world: 'Earth-616',
    powers: ['Genius Intelligence', 'Powered Armor Suit', 'Cybernetic Link'],
    weaknesses: ['Arc Reactor Dependency', 'Arrogance', 'PTSD'],
    image_url: 'https://images.unsplash.com/photo-1623984109622-f9c9719397c3?auto=format&fit=crop&q=80&w=800',
    is_locked_content: false,
    description: 'Billionaire, playboy, philanthropist. Inventor of the Mark series armor.'
  },
  {
    id: 'h2',
    name: 'Steve Rogers',
    alias: 'Captain America',
    origin_world: 'Earth-616',
    powers: ['Super Soldier Serum', 'Tactical Genius', 'Indestructible Shield'],
    weaknesses: ['Moral Rigidity', 'Out of Time Syndrome'],
    image_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800',
    is_locked_content: true,
    description: 'The first Avenger. A man out of time fighting for timeless ideals.'
  },
  {
    id: 'h3',
    name: 'Wanda Maximoff',
    alias: 'Scarlet Witch',
    origin_world: 'Earth-616',
    powers: ['Chaos Magic', 'Reality Warping', 'Telekinesis'],
    weaknesses: ['Emotional Instability', 'Grief-driven Power'],
    image_url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800',
    is_locked_content: true,
    description: 'A nexus being with the power to rewrite reality itself.'
  },
  {
    id: 'h4',
    name: 'Peter Parker',
    alias: 'Spider-Man',
    origin_world: 'Earth-199999',
    powers: ['Spider-Sense', 'Wall Crawling', 'Superhuman Agility'],
    weaknesses: ['Guilt Complex', 'Vulnerability to High Frequency'],
    image_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800',
    is_locked_content: false,
    description: 'Your friendly neighborhood Spider-Man. Protecting Queens and the Multiverse.'
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
  }
];

export const INITIAL_CANON_EVENTS: CanonEvent[] = [
  {
    id: 'c1',
    hero_id: 'h1',
    movie_id: 'm2',
    description: 'Building the Mark I in a cave with a box of scraps.',
    is_fixed_point: true,
    glitch_level: 0,
    movie_title: 'Iron Man'
  },
  {
    id: 'c2',
    hero_id: 'h1',
    movie_id: 'm1',
    description: 'The Snap: "I am Iron Man"',
    is_fixed_point: true,
    glitch_level: 3,
    movie_title: 'Avengers: Endgame'
  }
];
