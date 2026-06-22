# 🌌 Multiverse Archive

**The Ultimate Hero Database** — Explore and manage hero profiles, powers, watch orders, and timelines across Marvel, DC, Anime, and beyond!

This application features a premium, Stark-Industries-style "JARVIS" visual interface, featuring responsive grid layouts, custom pine-tree timelines, interactive radar charts, and real-time database integrations.

---

## ✨ Key Features

- 🦸‍♂️ **Dynamic Hero Hub**: Explore 80+ heroes across multiple universes (MCU, X-Men, Spider-Verse, DC, Anime, The Boys, and Peacemaker).
- 🎨 **Premium Tech-Noir Visual Identity**: Experience a Stark-like HUD interface with biometric scanlines, energy-shield locks, holographic glows, and decryption overlays.
- 📱 **Fully Mobile Responsive**: Optimized layouts that scroll and scale beautifully on any viewport width without vertical cut-offs or page overflows.
- 📺 **Official Watch Orders**: Detailed, sortable chronological and release order movie lists for the Marvel and DC universes.
- 🌲 **Pine-Tree Timeline Scroll**: Interactive custom right-side scroll indicator matching MCU phase progress.
- 📊 **Power Analysis Charts**: Hydration-safe radar charts visualizing capability matrices dynamically.
- 🔒 **Secure Admin Clearance**: Built-in credential-protected panel to perform database reset, TMDB sync, and full CRUD operations on characters.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS Transitions
- **Database**: Supabase (PostgreSQL client integration)
- **Animations**: Framer Motion
- **Chart Visuals**: Recharts (with hydration-safe client-side mounting)
- **Database Sync**: Custom Node scripts syncing details using the **TMDB Database API**

---

## 🔧 Local Development & Setup

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+ recommended)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anubhavaanand/Marvel-nexus.git
cd Marvel-nexus
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the project root based on `env.example`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# TMDB API (For movie & poster syncing)
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

### 3. Initialize & Seed Database
If you are configuring a new Supabase database, run the setup SQL scripts from the Supabase SQL editor:
1. Run `scripts/create-tables.sql` to initialize tables schema.
2. Run `scripts/update-franchise-constraint.sql` to enable extra universes.

Then verify and seed the database locally:
```bash
# Verify connection credentials
node scripts/check-env.js

# Sync with TMDB and seed 80+ heroes
node scripts/add-expanded-heroes.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the archive.

---

## 🗂️ Project Structure
```text
Marvel-nexus/
├── public/                 # Static assets (favicons, overlays)
├── scripts/                # Database seed, sync, and health check scripts
├── specs/                  # Feature specs and security analysis records
└── src/
    ├── app/                # Next.js App Router (Layouts, Pages)
    │   ├── admin/          # Admin CRUD authentication dashboard
    │   ├── hero/           # Dynamic hero profile pages
    │   ├── timeline/       # Chronological phase timelines
    │   └── watch-order/    # MCU/DC sortable movie lists
    ├── components/         # Reusable HUD & visual components
    │   ├── 3d/             # WebGL particle background scene
    │   ├── ui/             # Radix & styling primitives
    │   └── admin/          # Form inputs and list managers
    └── lib/                # Database clients (Supabase, TMDB integration)
```

---

## 📝 Documentation Links

- **Contribution Guidelines**: Explore coding standards and branching flows in [CONTRIBUTING.md](file:///home/anubhavanand/Marvel-nexus/CONTRIBUTING.md).
- **Project Versioning**: Review the history of security patches, design overhauls, and mobile layout fixes in [CHANGELOG.md](file:///home/anubhavanand/Marvel-nexus/CHANGELOG.md).
- **Safe Hero Guide**: Check character creation visual protocols in [SAFE-HERO-GUIDE.md](file:///home/anubhavanand/Marvel-nexus/SAFE-HERO-GUIDE.md).
- **Database Troubleshooting**: Find connection resolutions in [DATABASE-TROUBLESHOOTING.md](file:///home/anubhavanand/Marvel-nexus/DATABASE-TROUBLESHOOTING.md).
