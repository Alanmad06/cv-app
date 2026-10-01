# AGENTS.md

Next.js 15 (App Router) + React 19 + TypeScript portfolio/CV app (GitHub user `Alanmad06`). Single package — no workspaces, no CI. Style is enforced at three points: Prettier config, editor format-on-save, and a husky pre-commit hook. Formatting is Prettier (`.prettierrc.json`, `.prettierignore`), linting is ESLint (flat config in `eslint.config.mjs`, ended with `eslint-config-prettier`).

## Commands

- `npm run dev` — Next dev with Turbopack, http://localhost:3000
- `npm test` — Jest via `next/jest`, jsdom. Coverage is **always** collected (`collectCoverage: true`); use `npm test -- --coverage=false` for a faster run.
  - Single file: `npx jest __tests__/portfolio.test.js`
  - Single case: `npx jest -t "Login Form should open when button is submitted"`
- `npm run lint` — `next lint` (flat config in `eslint.config.mjs`). Currently clean. `npm run lint:fix` autofixes.
- `npm run format` — `prettier --write .` (repo-wide). `npm run format:check` to verify without writing. `.eslintignore` was deleted; its entries now live in the `ignores` array of `eslint.config.mjs`, so the old deprecation warning is gone.
- `.prettierrc.json` is the single source of truth for style (double quotes, semicolons, `trailingComma: "all"`, width 80, LF) and loads `prettier-plugin-tailwindcss`, which also sorts Tailwind class names. Format-on-save is enabled via `.vscode/settings.json`.
- **Pre-commit hook**: husky + lint-staged, wired by `.husky/pre-commit` → `npx lint-staged` (config lives in `package.json`). Staged `*.{js,jsx,ts,tsx,mjs,cjs}` run `prettier --write` then `eslint --fix --max-warnings=0`; `*.{json,jsonc,css,md,yml,yaml}` run Prettier only. Any error blocks the commit — bypass with `git commit --no-verify`. lint-staged stashes unstaged changes as a backup and reverts task edits if a task fails. Tests are deliberately **not** in the hook (coverage is always collected, so they're slow; run them manually before committing).
- `"formatter": true` in the root `opencode.json` makes OpenCode run Prettier on files after its own `write`/`edit`/`patch` tools change them (works because `prettier` is a `package.json` dependency). Disabled unless you're running OpenCode.
- `npm run typecheck` — `tsc --noEmit`. Currently clean.
- `npm run build` — `prisma generate && next build` (next build also typechecks).

Verify with: `npm run lint && npx tsc --noEmit && npm run format:check && npm test`. When touching routing, server rendering or CSS, also run `npm run build` (stop `npm run dev` first — see gotchas).

## Build / env gotchas

- A local `.env` (gitignored) is required for `npm run build`: `prisma generate` needs `DATABASE_URL` (Neon Postgres). It also holds `USER` / `PASSWORD`, which the `login` server action compares against — auth is env-based, not in the database.
- **Stop `npm run dev` before `npm run build`.** The dev server keeps `node_modules\.prisma\client\query_engine-windows.dll.node` open, so `prisma generate` fails with `EPERM: operation not permitted, rename ... .tmp -> query_engine-windows.dll.node`. The project also lives under OneDrive, which can add its own file locks.
- Prisma schema: `prisma/schema.prisma` (single `Skill` model). Migrations live in `prisma/migrations/` — change schema, then `npx prisma migrate dev`.

## Testing

- `jest.config.ts` sets `customExportConditions: ["browser"]` (jsdom's default). An earlier `[""]` made Jest unable to resolve `@prisma/client` — Prisma's `exports` `require` branch has no `default` fallback, so `[""]` resolved to nothing and the suite died with `Cannot find module '@prisma/client' from 'lib/db.ts'`. Keep it `["browser"]`.
- `moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" }` resolves the tsconfig `@/*` alias. SWC rewrites `import` statements during transform, but **not** the string literal inside `jest.mock("@/lib/actions/skills")`, which Jest resolves itself — so `jest.mock` needs the mapper.
- Mock the `@/lib/actions/*` modules at module scope (see `__tests__/portfolio.test.js`) so thunks don't reach Prisma. Calling `jest.mock()` inside `it()` is never hoisted and its factory can't see file imports.
- Without that mock, server actions load Prisma's browser build and throw _"PrismaClient is unable to run in this browser environment"_. The Redux thunks catch it, so tests still pass — expected console noise, don't chase it. `act(...)` warnings from async thunk resolution are also expected.
- MSW scaffolding exists (`mocks/`, `app/mocks.ts`, `jest.setup.ts`) but is **dormant**: the `server.listen()` wiring in `jest.setup.ts` is commented out and `initMocks()` is never imported. `mocks/README.md` claims it's integrated — trust the code, not that README.
- Test helper: `lib/tests/renderWithProviders.tsx` wraps a component in the Redux `Provider`; `setUpStore(preloadedState)` in `store/store.ts` creates an isolated store for assertions.

## Architecture

- `app/layout.tsx` wraps every page in `components/Providers.tsx` (Redux store + next-themes `ThemeProvider` + `ThemeInitializer`) and renders `components/Panel.tsx`, the persistent slide-in nav.
- Routes: `/` (home), `/portfolio` (server component — fetches the project list with `revalidate = 3600`), `/projects/[name]` (server component that fetches a repo **and its README**). The `/api/github-repos` route was deleted in the Phase-4 refactor: GitHub data is fetched server-side in `lib/github.ts`, never from the browser.
- UI primitives live in `components/ui/`: `Modal` (portal + `role="dialog"`, focus trap, Escape, scroll lock, focus restore — shared by `LoginForm` and `SkillsForm`), `Button` (action) and `ButtonLink` (`next/link` styled as a button). The old `components/Button.tsx` mixed both concerns (a `<button>` that called `router.push`) and was split in the Phase-1 refactor — use `ButtonLink` for navigation, `Button` for actions.
- Data flow: client component → Redux thunk (`store/skillsSlice.ts`, `store/authSlice.ts`) → **server actions** in `lib/actions/{skills,auth}.ts` (`"use server"`, Zod-validated) → Prisma singleton `lib/db.ts`. GitHub reads are _not_ actions: `lib/github.ts` holds server-only loaders (`fetchPortfolioProjects`, `fetchProject`, `fetchReadme`) with `next: { revalidate: 3600 }`.
- `store/store.ts` registers only `skills` and `auth`. A leftover `store/themeSlice.ts` (never in the reducer map) was deleted in the Phase-6 cleanup; theming is handled by next-themes, not Redux.
- `lib/github.ts` fetches `api.github.com/users/Alanmad06/repos` and keeps only repos whose description matches the `Tipo | Tecnologías | Descripción` regex, then pulls the image from the repo README. New portfolio entries are created by formatting GitHub repo descriptions, not by editing code.
- `next.config.ts` `images.remotePatterns` whitelists GitHub/avatars hosts **plus `raw.githubusercontent.com` and `user-images.githubusercontent.com`** (README project images) — `next/image` rejects any other remote host.
- Path alias `@/*` → repo root (`tsconfig.json`). Shared TS types live in `interfaces/`.

## Styling

- Tailwind **v4**, CSS-first: `app/globals.css` has `@import "tailwindcss"`, `@plugin 'tailwind-scrollbar'`, `@custom-variant dark`, an `@theme` block, and `.light` / `.dark` CSS-variable sets. There is **no `tailwind.config.js`** (deleted in the Phase-6 cleanup — v4 never loaded it without an `@config` directive); new config belongs in the CSS file.
- `dark:` follows the **class**, not the OS preference, thanks to `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` — without it the `dark:` utilities disagreed with next-themes' `attribute="class"`. Theme-dependent colors usually come from the CSS variables (`--main`, `--background`, `--foreground`); use `dark:` only for surfaces whose color is fixed per theme.
- Theme is `class`-based (next-themes `attribute="class"`); `ThemeInitializer` reads `localStorage.theme`, defaulting to `dark`. Most theming flows through the CSS variables, not `dark:` variants.
- v4 removed `bg-opacity-*`: hover opacity is `bg-color/80`-style (e.g. `hover:bg-[#26C17E]/90`). The dead v3 leftovers (`bg-opacity-*`, `font-sm`, bare `xl`, `prose` without `@tailwindcss/typography`, typo `text-foregroundk`) were cleaned up in the Phase-1 refactor — don't reintroduce them. `border-1` **is** valid in v4 (dynamic numeric utilities); a full-repo audit against compiled CSS is the only way to tell dead classes from real ones.

## Accessibility (Phase 5)

- Keyboard reach: `Panel`'s hamburger is an `sr-only` checkbox + `<label>` with `aria-label` (never `hidden` — `display:none` removes it from the tab order); the closed panel carries `inert`/`aria-hidden` so its links can't receive focus while off-screen.
- Names/labels: FontAwesome icons are `aria-hidden` (Phase 1), so icon-only controls must declare their own `aria-label`; form fields use visible `<label htmlFor>` pairs; async errors (login) render inside `role="alert"`; the skills progress bars expose `role="progressbar"` + `aria-valuenow/min/max`.
- Headings: `Box` and `ProjectDetail` render the page `<h1>` (on `/`, `PhotoBox` renders `<h1>` when `big`, else `<h2>`); section titles are `<h2>`; card/item titles (`Portfolio` cards, `Timeline` entries, `SkillsForm` modal) are `<h3>`; `Modal`'s own title is an `<h2>`.
- Contrast (WCAG 1.4.3): `.light { --main: 15, 107, 69 }` exists because the bright green `#26C17E` was 1.67:1 on the light background — don't lighten it without re-checking; accent-on-surface pairs use `bg-main` with `text-white dark:text-gray-900`. Known residual: the skills range slider's dark-mode thumb/track pair is ~1.96:1 (below the 3:1 of 1.4.11).
