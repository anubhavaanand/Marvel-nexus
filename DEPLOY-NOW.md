# Quick Vercel Deployment Guide

## 🎯 Deploy in 3 Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select your `Marvel-nexus` repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your Supabase anon/public key — without it the app silently runs in demo mode)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your Supabase service role key, server-only)
   - `ADMIN_PASSWORD` = (password for /admin; login always fails without it)
   - `TMDB_API_KEY` = (image enrichment + search proxy)
   - `NEXT_PUBLIC_SITE_URL` = (canonical origin, e.g. https://your-domain.com)
   - `TRUST_PROXY` = true
   - `TRUST_PROXY_DEPTH` = 1 (Vercel hop count; a wrong value shares one rate-limit bucket)

6. Apply the database schema: run `supabase/schema.sql` (or the migrations in `supabase/migrations/` in order) so the `slug` column, triggers and `admin_sessions` table exist. See `DEPLOYMENT.md` for the full walkthrough.
7. Click "Deploy"

**Done!** Your site will be live at `https://marvel-nexus.vercel.app`

### Step 3: Add Custom Domain (When You Buy One)

1. In Vercel dashboard, go to your project
2. **Settings** → **Domains**
3. Click "Add Domain"
4. Enter your domain (e.g., `marvel-universe.com`)
5. Vercel shows you DNS records to add
6. Go to your domain registrar (GoDaddy, Namecheap, etc.)
7. Add these DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
8. Wait 24-48 hours for DNS propagation
9. **SSL certificate auto-generated** ✅

---

## 🌐 Recommended Domain Registrars

- **Namecheap** - Cheap, easy DNS
- **Cloudflare** - Free, fast DNS + extra features
- **Google Domains** - Simple, reliable
- **Porkbun** - Cheapest prices

---

## 💰 Cost Comparison

| Platform     | Hosting  | Custom Domain                | SSL      |
| ------------ | -------- | ---------------------------- | -------- |
| Vercel       | **FREE** | Buy separately ($10-15/year) | **FREE** |
| GitHub Pages | **FREE** | Buy separately ($10-15/year) | **FREE** |

**Winner: Vercel** - Same cost, better features!

---

## 🎨 Example Domain Ideas

- `marvel-nexus.com`
- `multiverse-archive.io`
- `hero-database.dev`
- `marvel-infinity.com`

---

## 📱 After Deployment

Your live URLs:

- **Vercel Default**: `https://marvel-nexus.vercel.app`
- **Custom Domain** (after setup): `https://yourdomain.com`

Both will work! Vercel automatically redirects.

---

## 🔒 Security Checklist

✅ Environment variables in Vercel (not in code)
✅ `.env.local` in `.gitignore`
✅ SSL auto-enabled
✅ Supabase schema applied (`supabase/schema.sql` / migrations) with RLS enabled

You're all set! 🚀
