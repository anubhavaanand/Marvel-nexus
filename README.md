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
- 🔒 **Secure Admin Clearance**: Built-in credential-protected panel with Hero Manager CRUD operations (create, update, delete) and a database connection tester. Seed and TMDB sync buttons are wired to real server actions (see #9/#114), including hero/event/movie relation seeding (#140); there is still no destructive database reset feature.

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
    │   ├── 3d/             # WebGL particle background scen
    │   ├── ui/             # Radix & styling primitives
    │   └── admin/          # Form inputs and list managers
    └── lib/                # Database clients (Supabase, TMDB integration)
```

---

## 🔒 Rate Limiting & TRUST_PROXY

When deployed behind a trusted reverse proxy (Vercel, Netlify, nginx, ...), set `TRUST_PROXY=true` so per-client IP rate-limit buckets work. When unset/false, proxy headers are ignored (spoofable) and all clients share one conservative bucket; a warning is logged if headers are present. See DEPLOYMENT.md.

## 📝 Documentation Links

- **Contribution Guidelines**: Explore coding standards and branching flows in [CONTRIBUTING.md](./CONTRIBUTING.md).
- **Project Versioning**: Review the history of security patches, design overhauls, and mobile layout fixes in [CHANGELOG.md](./CHANGELOG.md).
- **Safe Hero Guide**: Check character creation visual protocols in [SAFE-HERO-GUIDE.md](./SAFE-HERO-GUIDE.md).
- **Database Troubleshooting**: Find connection resolutions in [DATABASE-TROUBLESHOOTING.md](./DATABASE-TROUBLESHOOTING.md).

---

## 📄 License & Citation

Released under the [MIT License](./LICENSE). If you use this project in research or writing, see [CITATION.cff](./CITATION.cff) for a machine-readable citation.

```yaml
cff-version: 1.2.0
message: 'If you use this software, please cite it as below.'
title: 'Multiverse Archive'
authors:
  - family-names: Anand
    given-names: Anubhav
year: 2026
url: 'https://github.com/anubhavaanand/Marvel-nexus'
```
