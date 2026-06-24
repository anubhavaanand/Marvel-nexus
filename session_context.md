# Marvel-nexus Session Context Summary

This document captures the current stable state of the **Multiverse Archive (Marvel-nexus)** project as established in the Antigravity session on **June 22-24, 2026**. Use this context when working with the `antigravity cli` or `opencode cli` for further code generation or design enhancements.

---

## 🎯 Codebase & Technology Stack
*   **Framework:** Next.js 16 (App Router, dynamic page segments, server components).
*   **UI/Design styling:** Tailwind CSS v4 (configured via `@tailwindcss/postcss` plugin).
*   **Database Integration:** Supabase Client (`@supabase/supabase-js`) with `mockHeroes` fallback.
*   **Animations:** Framer Motion (page transitions, cards entry springs) + Anime.js (title micro-animations).
*   **3D Visuals:** Three.js, `@react-three/fiber`, and `@react-three/drei` (WebGL context controls).

---

## 🎨 Visual Identity & Fixed Design Principles
The site visual design has been locked to **commit `e9f6681` (and subsequent minor optimization commits)**. The user explicitly requests preserving this exact look:
1.  **WebGL background:** It features an active, working 3D scrolling stars/particle background canvas defined in [`Scene3DWrapper.tsx`](file:///home/anubhavanand/Marvel-nexus/src/components/3d/Scene3DWrapper.tsx). Do **not** replace it with static CSS gradients.
2.  **Typography scale:** Geometric heading layouts (Orbitron) combined with monospaced telemetry fonts (Roboto Mono) and clean readable copy (Inter).
3.  **Color guidelines:** Stark Industry cyber cyan highlights (`#06b6d4`), hazard rose warning indicators (`#f43f5e`), and absolute deep space void backgrounds.

---

## 🔧 Environment & Local Execution Configs
*   **Misconfigured symlinks:** The symlinks for `node` and `npm` in `~/.local/bin/` are broken because they point to a different username `/home/anubhaanand/...`.
*   **Workaround:** Always run local Node/NPM commands using the absolute hermes path:
    ```bash
    /home/anubhavanand/.hermes/node/bin/npm run dev
    /home/anubhavanand/.hermes/node/bin/npm run build
    ```
*   **Obsolete package cleanup:** Ran `npm prune` to discard **70 unused packages** (like `zod`, `react-hook-form`, etc.) that were left over from visual experiments.

---

## 🔒 Git & Deployment Setup
*   **Active branch:** `main` (fully reset to `e9f6681` + cherry-picked optimizations).
*   **Deleted remote branches:** Obsolete styling experiment branches (`origin/openwork` and `origin/001-analyze-security`) were deleted to keep the GitHub repo clean.
*   **Git Privacy Bypass (GH007):** Pushes are configured locally in the repo to use your secure GitHub no-reply email:
    ```bash
    git config user.email "123159297+anubhavaanand@users.noreply.github.com"
    git config user.name "anubhavaanand"
    ```
    *Ensure future commits preserve this email to prevent GitHub from declining pushes under email privacy rules.*
*   **Git Authentication:** Uses HTTPS. Authenticate using your classic Personal Access Token (PAT) with `repo` scope when prompted for the password in CLI.
