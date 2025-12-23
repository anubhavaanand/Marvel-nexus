-- ============================================
-- ADD NEW FRANCHISES TO MULTIVERSE ARCHIVE
-- Run this in Supabase SQL Editor FIRST
-- ============================================

-- Remove the old franchise constraint
ALTER TABLE heroes DROP CONSTRAINT IF EXISTS heroes_franchise_check;

-- Add new constraint with more franchises
ALTER TABLE heroes ADD CONSTRAINT heroes_franchise_check 
CHECK (franchise IN (
    'MCU', 
    'X-Men', 
    'Spider-Verse', 
    'Defenders', 
    'DC', 
    'Anime', 
    'The Boys', 
    'Invincible',
    'Other'
));

SELECT 'Franchise constraint updated! You can now add The Boys and Invincible heroes.' as message;
