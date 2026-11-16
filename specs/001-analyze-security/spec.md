# Feature Specification: Code Quality and Dependency Security Hardening

**Feature Branch**: `001-analyze-security`

**Created**: 2026-06-03

**Status**: Archived (superseded)

**Superseded by**: [specs/002-supabase-security-hardening/](../002-supabase-security-hardening/)

**Input**: User description: "Analyze and secure project dependencies and configurations"

> **Archived 2026-11-16** — This spec is retained for historical reference only. Its scope (dependency audit + React 19 purity fixes) was completed, but the claimed success criteria do not hold: `npm audit` still reports 24 vulnerabilities (1 low, 10 moderate, 10 high, 3 critical) as of 2026-11-16, contradicting **FR-001/SC-001** ("zero vulnerabilities"). The live remediation work is tracked in issue #11 and the active spec at `specs/002-supabase-security-hardening/`. Do not use this spec as the source of truth for current security work.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Dependency Vulnerability Remediation (Priority: P1)

As a developer or security auditor, I want to execute dependency vulnerability scans and remediate all identified vulnerabilities so that the application is secure from known exploits (such as DoS, CSRF bypass, and prototype pollution in packages like Next.js, PostCSS, Minimatch, etc.).

**Why this priority**: Crucial for baseline security. Eliminating critical and high CVEs prevents application compromises.

**Independent Test**: Running `npm audit` should report 0 vulnerabilities after remediation.

**Acceptance Scenarios**:

1. **Given** a codebase with package dependencies, **When** I run `npm audit`, **Then** the output reports zero vulnerabilities.

---

### User Story 2 - Code Purity & Linting Compliance (Priority: P1)

As a developer, I want to resolve all ESLint compilation warnings and errors (particularly React 19 rules like `react-hooks/purity` and variable hoisting errors) so that the application compiles cleanly without impure side-effects during component rendering.

**Why this priority**: React 19 strict mode or hydration checks will fail or cause UI flickering if components call impure functions like `Math.random` during rendering.

**Independent Test**: Running `npx eslint` should report 0 errors.

**Acceptance Scenarios**:

1. **Given** components like `TimelineScroll` and `VisualEffects`, **When** I run `npx eslint`, **Then** no `react-hooks/purity` errors are reported.
2. **Given** the `HeroManager` component, **When** I run `npx eslint`, **Then** no variable access errors (e.g. `fetchHeroes` hoisting) are reported.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The project dependencies MUST be upgraded or audited to resolve the 8 vulnerabilities reported by `npm audit` (specifically upgrading Next.js and dependency packages like minimatch, picomatch, postcss, flatted, brace-expansion, ajv, and ws).
- **FR-002**: The `VisualEffects` and `TimelineScroll` components MUST be refactored to remove impure calls to `Math.random()` during component rendering, using stable hooks (like `useMemo` or `useEffect` + local state) or seeding.
- **FR-003**: The `HeroManager` component MUST be updated to resolve hoisting issues with functions like `fetchHeroes` being invoked before declaration.
- **FR-004**: All unused imports/variables identified by ESLint MUST be pruned or resolved.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: `npm audit` returns exit code 0 and reports 0 vulnerabilities.
- **SC-002**: `npx eslint` compiles cleanly with exit code 0 and 0 errors.
- **SC-003**: The application starts in development (`npm run dev`) and builds in production (`npm run build`) without any errors.

## Assumptions

- No breaking changes are introduced to component functionality during React 19 refactoring.
- Supabase environment credentials or missing DB connectivity do not block static package audits.
