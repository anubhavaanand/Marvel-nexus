# 🌌 Multiverse Archive

<div align="center">
  
  **The Ultimate Hero Database**
  
  Explore heroes across all universes - Marvel, DC, Anime, and beyond.
</div>

---

## ✨ Features

- 🦸 **Hero Database** - Browse heroes from MCU, X-Men, Spider-Verse, DC, Anime, and more
- 📊 **Power Analysis** - Interactive radar charts showing hero abilities
- ⚠️ **Canon Events** - Track fixed points in time with glitch level indicators
- 🎬 **MCU Timeline** - Complete movie timeline from Phase 1 to Phase 6
- 📺 **Watch Order** - Chronological and release order viewing guide
- 🔍 **Instant Search** - Search heroes by name, alias, powers, or origin world
- 🛡️ **Admin Dashboard** - Database management and seeding controls

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4.x |
| UI Components | Shadcn UI |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL) |
| Data Source | TMDB API |
| Icons | Lucide React |

## 🎨 Design System

Cyberpunk/holographic aesthetic inspired by sci-fi interfaces.

### Color Palette
- **Background**: `#0a0a0a`
- **Glass Surface**: `#171717` (60% opacity)
- **Primary Accent**: `#06b6d4` (Cyan)
- **Danger Accent**: `#f43f5e` (Red)

### Typography
- **Headers**: Orbitron
- **Body**: Inter

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/multiverse-archive.git
cd multiverse-archive

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

> **Note**: The app works with demo data out of the box. Add API keys for full features.

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the project root:

```env
# TMDB API (for movie posters and data)
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key

# Supabase (for database - optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📁 Project Structure

```
multiverse-archive/
├── src/
│   ├── app/
│   │   ├── page.tsx             # Home (Hero Grid)
│   │   ├── hero/[slug]/         # Hero profiles
│   │   ├── timeline/            # MCU Timeline
│   │   ├── watch-order/         # Watch Order Guide
│   │   ├── search/              # Search page
│   │   └── admin/               # Admin dashboard
│   ├── components/
│   │   ├── HeroCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── CanonEventAlert.tsx
│   │   ├── PowerRadarChart.tsx
│   │   ├── TimelineSlider.tsx
│   │   └── Skeleton.tsx
│   └── lib/
│       ├── supabase.ts
│       ├── tmdb.ts
│       └── utils.ts
└── public/
```

## 🌐 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

## 🔮 Roadmap

- [ ] DC Universe heroes
- [ ] Anime heroes (My Hero Academia, One Punch Man)
- [ ] User authentication
- [ ] Premium content unlocking
- [ ] Team builder feature
- [ ] Mobile app

## 📄 License

MIT License

---

<div align="center">
  <p>Built with ❤️ for heroes everywhere</p>
  <p>
    <strong>Across the Multiverse!</strong> 🌌
  </p>
</div>
