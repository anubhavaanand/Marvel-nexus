-- #440: deleting a hero must remove canon_events and hero_movies links in the
-- same database transaction as the hero row, otherwise a failure between the
-- statements can leave orphaned children or a partially deleted hero.
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
