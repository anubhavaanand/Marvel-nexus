
export interface Movie {
  id: string;
  tmdb_id: number;
  title: string;
  release_date: string;
  phase: string;
  poster_url: string;
}

export interface Hero {
  id: string;
  name: string;
  alias: string;
  origin_world: string;
  powers: string[];
  weaknesses: string[];
  image_url: string;
  is_locked_content: boolean;
  description?: string;
}

export interface CanonEvent {
  id: string;
  hero_id: string;
  movie_id: string;
  description: string;
  is_fixed_point: boolean;
  glitch_level: number;
  movie_title?: string;
}
