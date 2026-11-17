# Marvel Nexus Database Scripts

## Overview

Collection of database management scripts for the Marvel Nexus Multiverse Archive. These scripts help seed, update, verify, and maintain the heroes database.

---

## 🚀 Quick Start

### 1. Setup Environment

Ensure your `.env.local` file has valid Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Upgrading an Older Database?

The canonical schema (`../supabase/schema.sql`) already allows every franchise
the app supports. If you are upgrading a database created before it existed,
run `supabase/migrations/002_franchise_constraint_full.sql` once.

### 3. Seed or Add Heroes

```bash
# Canonical first-run path: schema + migrations, then seed-heroes.js
# (run supabase/schema.sql, then supabase/migrations/002_franchise_constraint_full.sql if legacy DB)
node scripts/seed-heroes.js

# OR full database reseed
node scripts/seed-master.js
```

---

## 📝 Script Reference

### Health & Validation

| Script                     | Purpose                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `database-health-check.js` | **Comprehensive database scan** - checks connections, images, duplicates, data quality |
| `check-broken-images.js`   | Check which hero images return 404/errors                                              |
| `count-heroes.js`          | Count total heroes and breakdown by franchise                                          |

### Seeding (Full Replacement)

| Script             | Purpose                                                     | Heroes |
| ------------------ | ----------------------------------------------------------- | ------ |
| `seed-master.js`   | **MASTER SEED** - Complete database reset with curated list | ~35    |
| `seed-ultimate.js` | Alternative seed with different hero selection              | ~51    |
| `seed-heroes.js`   | Original seed script                                        | ~51    |

> ⚠️ **Safety**: `seed-master.js` and `seed-ultimate.js` **refuse to run without an explicit `--confirm` flag** (or `SEED_CONFIRM=1` in the environment). They print exactly what they will do and exit non-zero. `seed-heroes.js` is now **idempotent** — it upserts by `alias` and never deletes rows, so it is safe to run without `--confirm`. `add-spidermen.js` also deletes the two aliases it manages and requires `--confirm`.
>
> Shared guard: `scripts/seed-guard.js` (`parseArgs` / `requireConfirm` / `upsertHeroes`).

### Adding (Non-Destructive)

| Script                   | Purpose                                       | Heroes |
| ------------------------ | --------------------------------------------- | ------ |
| `add-expanded-heroes.js` | ✨ **NEW!** Add 40+ MCU/DC/Anime/X-Men heroes | 44     |
| `add-more-verified.js`   | Add verified anime + MCU/DC heroes            | 29     |
| `add-more-heroes.js`     | Add The Boys + Invincible heroes              | 18     |

### Image Fixing

| Script                     | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `fix-broken-images.js`     | Update specific heroes with verified TMDB URLs |
| `verify-and-fix-images.js` | Verify and auto-fix broken images              |
| `test-image-url.js`        | Test if a single URL works                     |

---

## 🐛 Recently Fixed Bugs

### ✅ Fixed in Latest Update

1. **A-Train character name** - Changed from "Ashley Barrett" to "Reggie Franklin" in `add-more-heroes.js`
2. **Broken TMDB URLs** - Fixed 11 incomplete URLs across `seed-ultimate.js` (4) and `seed-master.js` (7):
   - Hawkeye, Vigilante, Goku (2x), Eren (2x), Vegeta, Luffy, Zoro, Naruto, Gojo

---

## 🎯 Recommended Workflow

### First Time Setup

```bash
# 1. Legacy DB only: update the franchise constraint
#    (run supabase/migrations/002_franchise_constraint_full.sql)

# 2. Check current database state
node scripts/count-heroes.js

# 3. Run health check
node scripts/database-health-check.js

# 4. Seed canonical heroes (idempotent upsert by alias)
node scripts/seed-heroes.js

# 5. Verify everything works
node scripts/check-broken-images.js
```

### Regular Maintenance

```bash
# Weekly health check
node scripts/database-health-check.js

# Fix any broken images found
node scripts/verify-and-fix-images.js
```

---

## 📊 Current Database Stats

Total franchises supported:

- MCU (Marvel Cinematic Universe)
- X-Men / Mutants
- Spider-Verse
- DC Comics / DCEU
- Anime (all anime characters)
- The Boys
- Invincible
- Peacemaker
- Gaming

---

## 🔧 SQL Scripts

| File                     | Purpose                   |
| ------------------------ | ------------------------- |
| `../supabase/schema.sql` | Canonical database schema |

---

## ⚠️ Important Notes

1. **Service Role Key Required** - Most scripts need the service role key, not the anon key
2. **Network Required** - Image checking scripts make HTTP requests
3. **Supabase Limits** - Be mindful of API rate limits for large operations
4. **Backup First** - Always export data before running seed scripts

---

## 📦 New Heroes Available

The `add-expanded-heroes.js` script adds:

**MCU Phase 4/5**: Shang-Chi, Kate Bishop, Moon Knight, Ms. Marvel, She-Hulk, Namor, War Machine, Falcon, Winter Soldier

**DC Extended**: Zatanna, Blue Beetle, Martian Manhunter, Swamp Thing, Hawkgirl, Spectre, Poison Ivy, Deathstroke

**Anime All-Stars**: Chainsaw Man (Denji, Power, Makima), More Demon Slayer, Naruto legends, FMA brothers, Mob Psycho, and more!

**X-Men Classics**: Storm, Jean Grey, Cyclops, Rogue, Gambit, Nightcrawler
