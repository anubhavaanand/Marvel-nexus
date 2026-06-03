# Tasks: Code Quality and Dependency Security Hardening

**Input**: Design documents from `/specs/001-analyze-security/`

**Prerequisites**: plan.md, spec.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup

- [X] T001 Verify npm packages are successfully installed and cache is warmed.

## Phase 2: Foundational

No database or major infrastructure blockers are required for this security patch.

## Phase 3: User Story 1 - Dependency Vulnerability Remediation (Priority: P1) 🎯 MVP

**Goal**: Resolve security vulnerabilities in dependencies.

**Independent Test**: Running `npm audit` should report 0 vulnerabilities.

- [X] T002 Update dependency ranges in package.json or execute security fixes to resolve all 8 vulnerabilities.
- [X] T003 Run `npm audit` to verify 0 vulnerabilities are reported.

## Phase 4: User Story 2 - Code Purity & Linting Compliance (Priority: P1)

**Goal**: Fix React 19 ESLint errors and compilation issues.

**Independent Test**: Running `npx eslint` should report 0 errors.

- [X] T004 [P] Refactor `src/components/TimelineScroll.tsx` to make component rendering pure (removing Math.random from render).
- [X] T005 [P] Refactor `src/components/VisualEffects.tsx` to generate random particle properties using pure Hooks (useEffect/useMemo) instead of inline during rendering.
- [X] T006 [P] Refactor `src/components/admin/HeroManager.tsx` to move function declarations before they are accessed and remove unused variables.
- [X] T007 Run `npx eslint` to verify that all errors are resolved.

## Phase 5: Polish & Build Validation

- [X] T008 Run `npm run build` to verify the application bundles successfully for production.
