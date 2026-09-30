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
- **Pre-commit hook**: husky + lint-staged, wired by `.husky/pre-commit` → `npx lint-staged` (config lives in `package.json`). Staged `*.{js,jsx,ts,tsx,mjs,cjs}` run `prettier --write` then `eslint --fix --max-warnings=0`; `*.{json,jsonc,css,md,yml,yaml}` run Prettier only. Any error blocks the commit — bypass with `git commit --no-verify`. lint-staged stashes unstaged changes as a backup and reverts task edits if a task fails. Tests are deliberately **not** in the hook (`npm test` currently fails).
- `"formatter": true` in the root `opencode.json` makes OpenCode run Prettier on files after its own `write`/`edit`/`patch` tools change them (works because `prettier` is a `package.json` dependency). Disabled unless you're running OpenCode.
- `npx tsc --noEmit` — typecheck. There is **no** npm script for this. Currently clean.
- `npm run build` — `prisma generate && next build` (next build also typechecks).

Verify with: `npm run lint && npx tsc --noEmit && npm run format:check && npm test`.

## Build / env gotchas

- A local `.env` (gitignored) is required for `npm run build`: `prisma generate` needs `DATABASE_URL` (Neon Postgres). It also holds `USER` / `PASSWORD`, which the `login` server action compares against — auth is env-based, not in the database.
- **Stop `npm run dev` before `npm run build`.** The dev server keeps `node_modules\.prisma\client\query_engine-windows.dll.node` open, so `prisma generate` fails with `EPERM: operation not permitted, rename ... .tmp -> query_engine-windows.dll.node`. The project also lives under OneDrive, which can add its own file locks.
- Prisma schema: `prisma/schema.prisma` (single `Skill` model). Migrations live in `prisma/migrations/` — change schema, then `npx prisma migrate dev`.

## Testing quirks (tests currently fail — read before touching Jest)

- `jest.config.ts` sets `testEnvironmentOptions.customExportConditions: ['']`. That makes Jest unable to resolve `@prisma/client` (suite dies with `Cannot find module '@prisma/client' from 'lib/db.ts'`): Prisma's `exports` `require` branch has no `default` fallback, so `['']` resolves to nothing. `['browser']` (jsdom's default) works. This is the cause of the current red `npm test`.
- With the `browser` condition, server actions load Prisma's browser build and throw _"PrismaClient is unable to run in this browser environment"_. The Redux thunks catch it, so tests still pass — expected console noise, don't chase it.
- The last test, `async Skills should appear in document`, fails on its own: it calls `jest.mock()` inside `it()` (never hoisted) and `fetchSkills` isn't in scope.
- MSW scaffolding exists (`mocks/`, `app/mocks.ts`, `jest.setup.ts`) but is **dormant**: the `server.listen()` wiring in `jest.setup.ts` is commented out and `initMocks()` is never imported. `mocks/README.md` claims it's integrated — trust the code, not that README.
- Test helper: `lib/tests/renderWithProviders.tsx` wraps a component in the Redux `Provider`; `setUpStore(preloadedState)` in `store/store.ts` creates an isolated store for assertions.

## Architecture

- `app/layout.tsx` wraps every page in `components/Providers.tsx` (Redux store + next-themes `ThemeProvider` + `ThemeInitializer`) and renders `components/Panel.tsx`, the persistent slide-in nav.
- Routes: `/` (home), `/portfolio` (main CV page, client component), `/projects/[name]` (server component that fetches a repo by name), plus the only API route `app/api/github-repos/route.ts`.
- Data flow: client component → Redux thunk (`store/skillsSlice.ts`, `store/authSlice.ts`) → **server action** in `lib/action.ts` (`"use server"`, Zod-validated) → Prisma singleton `lib/db.ts`.
- `store/store.ts` registers only `skills` and `auth`. `store/themeSlice.ts` exists but is **not** in the reducer map — leftover; theming is handled by next-themes, don't wire state to it.
- `/api/github-repos` fetches `api.github.com/users/Alanmad06/repos` and keeps only repos whose description matches the `Tipo | Tecnologías | Descripción` regex, then pulls the image from the repo README. New portfolio entries are created by formatting GitHub repo descriptions, not by editing code.
- `next.config.ts` `images.remotePatterns` whitelists only GitHub/avatars hosts — `next/image` rejects any other remote host.
- Path alias `@/*` → repo root (`tsconfig.json`). Shared TS types live in `interfaces/`.

## Styling

- Tailwind **v4**, CSS-first: `app/globals.css` has `@import "tailwindcss"`, `@plugin 'tailwind-scrollbar'`, an `@theme` block, and `.light` / `.dark` CSS-variable sets. `tailwind.config.js` is **not loaded** (no `@config` directive anywhere) — edits there have no effect.
- Theme is `class`-based (next-themes `attribute="class"`); `ThemeInitializer` reads `localStorage.theme`, defaulting to `dark`. Most theming flows through the CSS variables, not `dark:` variants.
