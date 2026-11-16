# Deployment Guide - Marvel Nexus

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and is made by the creators of Next.js.

### Prerequisites

- GitHub account
- Vercel account (free tier available at [vercel.com](https://vercel.com))
- Your code pushed to GitHub

### Step-by-Step Deployment

#### 1. Push Code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/marvel-nexus.git
git push -u origin main
```

#### 2. Deploy on Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anonymous (public) key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
   - `TMDB_API_KEY` = Your TMDB API key (for image enrichment)
   - `ADMIN_PASSWORD` = Password for the admin panel
6. Click **"Deploy"**

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add TMDB_API_KEY
vercel env add ADMIN_PASSWORD

# Deploy to production
vercel --prod
```

#### 3. Environment Variables in Vercel

In your Vercel project settings:

- Go to **Settings** > **Environment Variables**
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `TMDB_API_KEY`
  - `ADMIN_PASSWORD`
- Make sure they are available for **Production**, **Preview**, and **Development**

---

## 🌐 Alternative: Deploy to Netlify

### Step-by-Step

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click **"Add new site"** > **"Import an existing project"**
4. Connect to GitHub and select your repository
5. Build settings (auto-detected):
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variables in **Site settings** > **Environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TMDB_API_KEY`
   - `ADMIN_PASSWORD`
7. Click **"Deploy site"**

---

## 🐳 Alternative: Deploy with Docker

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
docker build -t marvel-nexus .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="your-url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" \
  -e SUPABASE_SERVICE_ROLE_KEY="your-key" \
  -e TMDB_API_KEY="your-tmdb-key" \
  -e ADMIN_PASSWORD="your-admin-password" \
  marvel-nexus
```

---

## ☁️ Alternative: Deploy to AWS (Advanced)

Use AWS Amplify or AWS Elastic Beanstalk:

1. **AWS Amplify**:
   - Connect GitHub repo
   - Auto-detects Next.js
   - Add env vars in console

2. **AWS Lambda/Serverless**:
   - Use `serverless-next.js` or AWS CDK
   - More complex but cost-effective

---

## 📋 Environment Variables

All environment variables required by the application. Set these in your deployment platform (Vercel, Netlify, Docker, etc.).

| Variable                        | Required | Purpose                                                                        |
| ------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅       | Your Supabase project URL                                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅       | Supabase anonymous (public) key — used by the client-side Supabase client      |
| `SUPABASE_SERVICE_ROLE_KEY`     | ✅       | Supabase service role key — server-side admin access (never expose to browser) |
| `TMDB_API_KEY`                  | ⚠️       | TMDB API key — enables automatic image enrichment for heroes missing images    |
| `ADMIN_PASSWORD`                | ✅       | Password for the credential-protected admin panel                              |

> **Note:** `TMDB_API_KEY` is optional at runtime; without it, heroes simply skip image enrichment. The other four are required for the app to function.

---

## 🔒 Important Security Notes

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use environment variables** in your deployment platform
3. **Rotate Supabase keys** if they're ever exposed
4. **Enable RLS (Row Level Security)** in Supabase for production

---

## 📊 Post-Deployment Checklist

- [ ] Test all franchise tabs (MCU, DC, Spider-Verse, The Boys, Peacemaker)
- [ ] Verify images are loading
- [ ] Test admin login with password: `<your-admin-password>`
- [ ] Check Hero Manager CRUD operations
- [ ] Test Watch Order page
- [ ] Verify the Timeline Scroll works
- [ ] Check mobile responsiveness

---

## 🎯 Custom Domain Setup (Vercel)

1. Go to **Settings** > **Domains** in Vercel
2. Add your custom domain (e.g., `marvel-nexus.com`)
3. Update DNS records:
   - Type: `A` Record
   - Name: `@`
   - Value: `76.76.21.21`
4. Wait for DNS propagation (usually 24-48 hours)

---

## 🔄 Automatic Deployments

Once connected to GitHub:

- **Every push to `main`** = Auto-deploy to production (Vercel)
- **Pull requests** = Preview deployments
- **Rollback** anytime from Vercel dashboard

---

## 🌟 Recommended Setup

**Best for this project:**

1. ✅ **Vercel** (fastest, easiest, free SSL, global CDN)
2. Use GitHub for version control
3. Set up automatic deployments
4. Use Vercel's built-in analytics

**Your site will be live at:**
`https://your-project-name.vercel.app`

Or use a custom domain for maximum impact! 🚀
