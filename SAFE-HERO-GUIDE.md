# 🛡️ Safe Hero Addition Guide

## ✅ ALWAYS Follow These Steps

### Step 1: Find a Good Image

**Best Sources (in order):**

1. **TMDB** (themoviedb.org) - Most reliable
2. **Wikipedia** character pages
3. **Official show/movie websites**

**⚠️ AVOID:**

- Pinterest (blocks hotlinking)
- Instagram (blocks hotlinking)
- Facebook (blocks hotlinking)
- Any URL with authentication tokens

---

### Step 2: TEST the Image URL

**Before adding to database, ALWAYS test:**

```bash
node scripts/test-image-url.js "YOUR_IMAGE_URL_HERE"
```

**Example:**

```bash
node scripts/test-image-url.js "https://image.tmdb.org/t/p/w500/abc123.jpg"
```

✅ If it says "VALID" → Safe to use  
❌ If it says "FAILED" → Find a different image

---

### Step 3: Add Hero

**Option A: Via Admin Panel** (Recommended)

1. Go to `/admin`
2. Login with password: `<your-admin-password>`
3. Click "Add New Hero"
4. Paste your TESTED image URL
5. Fill other fields
6. Save!

**Option B: Via Script**
Only if adding many heroes at once.

---

## 📸 How to Get TMDB Image URLs

### Method 1: Browse TMDB

1. Go to https://www.themoviedb.org
2. Search for the character/movie
3. Click on the poster
4. Right-click → "Copy image address"
5. **TEST IT** with our script!

### Method 2: TMDB API (Most Reliable)

TMDB images follow this pattern:

```
https://image.tmdb.org/t/p/w500/{IMAGE_ID}.jpg
```

**Popular sizes:**

- `w500` - Good for cards (recommended)
- `original` - Full resolution (slower)

---

## 🎯 Pre-Verified Safe Image Domains

This list is generated from the admin validator (`scripts/lib/image-url-policy.js`, mirrored by `next.config.ts`). Only these hosts are accepted — anything else is rejected before it reaches `next/image`:

- ✅ `image.tmdb.org` (preferred: `https://image.tmdb.org/t/p/w500/{ID}.jpg`)
- ✅ `images.unsplash.com` / `unsplash.com`
- ✅ `cdn.myanimelist.net`
- ✅ `static.wikia.nocookie.net`
- ✅ Your project's Supabase host, and `*.supabase.co` **only** on `/storage/` paths

Not allowed (do not use, even if the URL downloads):

- ❌ Plain `http://` URLs — https only
- ❌ Internal/reserved IPs and `localhost`
- ❌ Signed URLs with `?` params that expire

Before saving, verify a candidate with `node scripts/test-image-url.js "<url>"` — it checks both the allowlist and reachability.

---

## 🔧 If Image Still Fails

Don't worry! The app has fallbacks:

1. Shows hero initials (e.g., "IM" for Iron Man)
2. Gradient background in franchise color
3. Still fully functional

You can update the image later via Admin Panel.

---

## 📝 Adding a New Franchise

When adding many heroes from a new franchise:

1. **Pick ONE test hero**
2. **Test their image URL thoroughly**
3. If TMDB has the show/movie, get its poster
4. **Reuse that verified poster** for all characters initially
5. Update with character-specific images later

**Example:**

- Adding Harry Potter characters?
- Test ONE URL from Harry Potter poster
- Use it for all characters initially
- Update Hermione, Ron, etc. later with their own images

---

## ⚡ Quick Reference Commands

```bash
# Test an image URL
node scripts/test-image-url.js "URL_HERE"

# Add hero via Admin Panel
1. Visit /admin
2. Login: <your-admin-password>
3. Add Hero form

# Check current heroes (count-heroes) and run the full audit (database-health-check)
node scripts/count-heroes.js
node scripts/database-health-check.js
```

---

## 🎨 Image Quality Tips

**Recommended specs:**

- **Format:** JPG or PNG
- **Size:** 500-1000px width
- **Aspect:** Portrait (2:3 or 3:4)
- **Quality:** High resolution, not blurry

**The app will:**

- Auto-crop to fit cards
- Add hover effects
- Show fallback if fails

---

## 🚀 Best Practice Workflow

```
1. Find image → 2. Test URL → 3. Add via Admin Panel → 4. Verify on site
```

**Time:** ~2 minutes per hero  
**Success Rate:** 99% if you test first! ✅

---

Remember: **ALWAYS test URLs before adding!**
It saves time and prevents poster issues.
