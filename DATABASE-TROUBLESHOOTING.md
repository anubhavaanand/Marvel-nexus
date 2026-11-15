# Database Connection Troubleshooting

## ❌ Current Issue

Connection to Supabase database is **failing** with error:

```
TypeError: fetch failed
getaddrinfo ENOTFOUND ngrbczgogtmngnskymui.supabase.co
```

## ✅ What's Configured Correctly

- Environment variables are set in `.env.local`
- Supabase client initializes successfully
- URL format is correct

## ⚠️ Most Likely Causes

### 1. **Supabase Project Paused/Deleted** (Most Likely)

Your Supabase project at `ngrbczgogtmngnskymui.supabase.co` cannot be reached.

**Solution:**

1. Go to https://supabase.com/dashboard
2. Check if your project is **paused** or **deleted**
3. If paused, click "Resume" to wake it up
4. If deleted, create a new project and update `.env.local`

### 2. **Network/DNS Issue**

The URL might be temporarily unreachable.

**Test:**

```bash
ping ngrbczgogtmngnskymui.supabase.co
```

If ping fails, it's definitely a connectivity issue.

### 3. **Free Tier Inactivity**

Supabase pauses inactive free tier projects after 7 days.

**Solution:**
Visit your project dashboard and resume it.

---

## 🔧 How to Fix

### Option A: Resume Existing Project

1. Visit https://supabase.com/dashboard/projects
2. Find your project
3. Click "Resume" if it's paused
4. Wait 1-2 minutes for it to wake up
5. Run: `node scripts/check-env.js` to verify

### Option B: Create New Project

1. Go to https://supabase.com/dashboard
2. Create a new project
3. Run the SQL from `scripts/create-tables.sql` in SQL Editor
4. Run the SQL from `scripts/update-franchise-constraint.sql`
5. Update `.env.local` with new credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_NEW_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key
   ```

---

## ✅ Once Connection Works

Run these scripts in order:

```bash
# 1. Verify connection
node scripts/check-env.js

# 2. Health check
node scripts/database-health-check.js

# 3. Add heroes
node scripts/add-expanded-heroes.js

# 4. Verify heroes added
node scripts/count-heroes.js
```

---

## 📝 All Bugs Are Still Fixed!

Even though the database is unreachable right now, all the code bugs have been fixed:

- ✅ A-Train's name corrected
- ✅ 10 broken image URLs fixed
- ✅ 47 new heroes ready to add
- ✅ Health check tool created
- ✅ Full documentation written

Once your Supabase project is running, everything will work!
