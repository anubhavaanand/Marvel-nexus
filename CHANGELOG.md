# Changelog

All notable changes to the **Multiverse Archive** project will be documented in this file.

---

## [2.1.0] - 2026-06-22

### Added

- Horizontal scrolling support (`flex-nowrap whitespace-nowrap overflow-x-auto`) for franchise tabs on the homepage and timeline page to prevent visual truncation and wrapping conflicts on mobile browsers.
- Dynamic responsive padding and gaps to the fixed bottom navigation bar, making it fit, center, and align cleanly on 390px mobile viewports.

### Fixed

- Client-side React 19 hydration crash on the Hero Details page by introducing a client-side mounting guard on the `PowerRadarChart` component to prevent Recharts rendering during SSR.
- Elimination of horizontal page layout overflow across all subpages.

---

## [2.0.0] - 2026-06-15

### Added

- **Tech-Noir Visual Identity Overhaul**: Implemented Stark-Industries-style HUD theme.
- Dynamic mouse-tracking 3D hover parallax tilt and holographic reflection glare animations on hero cards.
- Scanning biometric overlay animations (`.tactical-scan`) on the Navigation Bar and active components.
- ~~Integrated `DecryptionOverlay` loader component~~ — removed since 2.1.0; loading states now use the current components.
- Color theme upgrade to custom HSL Huds (Stark Cyan-500, Canon Rose-500 warning states, and void background).
- Swapped body and header fonts to Google Fonts (Orbitron for headers, Inter for copy, and Roboto Mono for telemetry).

---

## [1.1.0] - 2026-06-03

### Added

- Integrated automated database validation CLI tools (`scripts/database-health-check.js`) scanning fields, TMDB image URLs, and duplicates.

### Fixed

- ESLint and React 19 code purity compliance: refactored static rendering loops (the old `TimelineScroll.tsx`/`VisualEffects.tsx` components have since been removed; the fix lives on in their successors).
- Resolved variable hoisting compiler warning (`fetchHeroes`) in `HeroManager.tsx` and cleaned up unused package dependencies.
- Corrected A-Train name assignment (from "Ashley Barrett" to "Reggie Franklin").
- Verified and updated 10 incomplete/broken TMDB database image poster URLs.

---

## [1.0.0] - 2026-05-15

### Added

- Initial project release with Next.js 16 App Router.
- Supabase database integration for CRUD operations.
- Phase-divided MCU timeline carousel and MCU/DC watch order guides.
