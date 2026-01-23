-- ============================================
-- UPDATE FRANCHISE CONSTRAINT
-- Run this in Supabase SQL Editor to allow new franchises
-- ============================================

-- Remove old constraint
ALTER TABLE heroes DROP CONSTRAINT IF EXISTS heroes_franchise_check;

-- Add new constraint with expanded franchise list
ALTER TABLE heroes 
ADD CONSTRAINT heroes_franchise_check 
CHECK (franchise IN (
    'MCU',           -- Marvel Cinematic Universe
    'X-Men',         -- X-Men / Mutants
    'Spider-Verse',  -- Spider-Man multiverse
    'Defenders',     -- Netflix Marvel shows
    'DC',            -- DC Comics / DCEU
    'Anime',         -- All anime characters
    'The Boys',      -- Amazon's The Boys
    'Invincible',    -- Amazon's Invincible
    'Peacemaker',    -- HBO Max Peacemaker
    'Gaming'         -- Video game characters
));

-- Success message
SELECT 'Franchise constraint updated successfully! 🎉 New franchises allowed: The Boys, Invincible, Peacemaker, Gaming' as message;
