# Contributing Guidelines

Thank you for your interest in contributing to the **Multiverse Archive**! To maintain a high-quality, professional, and secure codebase, please adhere to the following workflow guidelines.

---

## 💻 Local Environment Setup

### 1. Requirements
- Node.js version 20 or higher.
- npm version 10 or higher.

### 2. Configuration
Always copy `env.example` to `.env.local` in the project root to set up your environment variables locally.
- **Never commit `.env.local` or any secrets file to Git.** These are secured under `.gitignore`.
- Provide correct keys for Supabase and the **TMDB Database API** to enable sync functionality.

---

## 🗃️ Database Syncing & Scripts

Before staging your work, make sure that your local changes do not break database integration:

- **Check Database Connection**: Run `node scripts/check-env.js` to verify your Supabase configuration.
- **Verify Database Health**: Run `node scripts/database-health-check.js` to scan character fields and TMDB poster URLs.
- **Seeding Heroes**: Use `node scripts/add-expanded-heroes.js` to seed the database with extended hero listings without wiping out existing user-curated items.

---

## 🎨 Frontend Coding Standards

### 1. React 19 & Next.js 16 Code Purity
- **Render Purity**: Component render bodies must be pure. Do not call impure methods like `Math.random()` inline inside rendering loops. Utilize React hooks like `useMemo` or `useEffect` instead.
- **Client Component Hydration Guard**: Recharts, Canvas, or other browser-only components that reference `window` or `document` will cause hydration errors or server-side reference crashes during SSR. Wrap them in a `mounted` state:
```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => {
    setMounted(true)
}, [])

return mounted ? <BrowserOnlyComponent /> : <LoadingSkeleton />
```

### 2. Styling & Responsiveness
- All tabs lists containing dynamic listings must scroll horizontally (`flex-nowrap whitespace-nowrap overflow-x-auto`) on mobile viewports to prevent layout shifts.
- Fixed layout elements (like the bottom navbar) must use responsive padding and item gaps to adjust cleanly to narrower mobile viewports.

---

## 🌿 Git Workflow & Branching

### 1. Branch Naming Rules
Use clean and descriptive names prefixed by change type:
- `feature/your-feature-name` — for new pages or visual additions.
- `bugfix/fix-issue-name` — for functional or layout corrections.
- `docs/update-documentation` — for README or spec modifications.

### 2. Commit Message Guidelines
Follow conventional commits structure:
- `feat: add mobile responsive search filters`
- `fix: resolve Recharts SSR hydration crash`
- `docs: add contributing rules`
- `style: adjust bottom navbar padding`

### 3. Pull Request Process
1. Run static checks and linters before committing:
   ```bash
   npm run lint
   ```
2. Verify the production build compiles successfully:
   ```bash
   npm run build
   ```
3. Submit your PR against the `main` branch with a description of the changes, verification checks completed, and screenshots of visual components.
