# 🌌 Multiverse Archive

**The Ultimate Hero Database** - Explore heroes across Marvel, DC, Anime, and beyond!

[![Live Site](https://img.shields.io/badge/Live-multiversearchive.vercel.app-00D9FF?style=for-the-badge)](https://multiversearchive.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/anubhavaanand/Marvel-nexus)

---

## ✨ Features

- 🦸‍♂️ **50+ Heroes** from MCU, DC, Spider-Verse, The Boys, Peacemaker & Anime
- 🎨 **Glassmorphic UI** with stunning animations
- 🔐 **Admin Panel** for complete CRUD operations
- 📺 **Watch Order** pages for MCU & DC
- 🌲 **Custom Timeline Scroll** - Interactive tree-like scrollbar
- 🔒 **Premium Content** system with authentication
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Blazing Fast** - Built with Next.js 15 & React 19

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Animations:** Framer Motion
- **Deployment:** Vercel
- **UI Components:** Radix UI + shadcn/ui

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- TMDB API key (optional)

 deployed at :-
https://multiversearchive.vercel.app/

## 📁 Project Structure

```
Marvel-nexus/
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── admin/           # Admin panel
│   │   ├── hero/[slug]/     # Hero detail pages
│   │   ├── watch-order/     # Watch order pages
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── admin/           # Admin-specific components
│   │   ├── ui/              # Reusable UI components
│   │   └── ...
│   └── lib/                 # Utilities & config
│       ├── supabase.ts      # Database client
│       └── utils.ts         # Helper functions
├── scripts/                 # Database scripts
│   ├── create-tables.sql    # Database schema
│   ├── seed-ultimate.js     # Seed heroes
│   └── add-spidermen.js     # Add Spider-Men variants
└── public/                  # Static assets
```

---

## 🗄️ Database Schema

**Tables:**
- `heroes` - Hero profiles (name, alias, powers, weaknesses)
- `canon_events` - Important timeline events
- `movies` - Movie/show information
- `hero_movies` - Junction table

See `scripts/create-tables.sql` for full schema.

---

## 🎨 Customization

### Add a New Franchise

1. Update `src/components/HeroCard.tsx` color scheme
2. Add tab in `src/app/page.tsx`
3. Create heroes with new franchise value

### Change Admin Password

Edit `src/app/admin/page.tsx`:
```typescript
const ADMIN_PASSWORD = 'your-new-password'
```

### Add More Heroes

**Option 1: Via Admin Panel** (Recommended)
- Login to `/admin`
- Click "Add New Hero"
- Fill form & save

**Option 2: Via Script**
- Edit `scripts/seed-ultimate.js`
- Add hero object
- Run: `node scripts/seed-ultimate.js`

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 🌐 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Optional: TMDB (for movie data)
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-key
```

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database scripts
node scripts/seed-ultimate.js    # Seed all heroes
node scripts/add-spidermen.js    # Add Spider-Men variants
```

---

## 🎯 Features Breakdown

### Homepage
- Franchise tabs (MCU, DC, Spider-Verse, etc.)
- Hero grid with animated cards
- Search & filter (coming soon)

### Hero Detail Page
- Full character profile
- Powers & weaknesses
- Canon events timeline
- Movie appearances
- Power radar chart

### Admin Panel
- Secure password authentication
- Full CRUD operations
- Image upload support
- Real-time database updates

### Watch Order
- MCU timeline
- DC timeline
- Chronological & release order

---

## 🔒 Security

- ✅ Environment variables secured
- ✅ Row Level Security (RLS) enabled in Supabase
- ✅ Admin authentication via session storage
- ✅ Input validation & sanitization
- ✅ HTTPS enforced in production

---

## 🐛 Known Issues

- CSS linting warnings (Tailwind v4 syntax) - Can be ignored
- Some anime posters may need updating

---

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

---

## 📄 License

MIT License - Feel free to use this project for learning

---

## 🙏 Credits

- **Built by:** Anubhav Anand
- **Heroes Data:** TMDB, Marvel Wiki, DC Wiki
- **UI Inspiration:** Spider-Verse, MCU
- **Icons:** Lucide React

---

## 📞 Support

For issues or questions, open an issue on GitHub

---

## 🎉 Live Demo

**Production:** [https://multiversearchive.vercel.app](https://multiversearchive.vercel.app)

**Admin Panel:** [https://multiversearchive.vercel.app/admin](https://multiversearchive.vercel.app/admin)

---

**Made with ❤️ and ⚡ by Anubhav**
