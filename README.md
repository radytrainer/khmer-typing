# Khmer Typing Game Platform

A playful, Duolingo/Kahoot-styled platform for Cambodian students to learn Khmer typing through
games. This repo is a **foundation build**: full auth, database, landing page, dashboards, the
achievement/leaderboard/XP systems, and two complete games (**Falling Letters**, **Falling
Words**) end-to-end. The remaining eight game modes and several portal features are scaffolded
(catalog entries, protected routes, "coming soon" screens) but not yet implemented — see
[Roadmap](#roadmap-not-yet-built).

Building all ten games, three full portals, a thousand-word dictionary, and a hundred bespoke
achievements in one pass isn't something any tool can respectably do in one shot without shipping
unverified filler. This build prioritizes a real, tested, extensible core over broad, hollow
coverage.

## Tech stack

| Layer | Choice | Note |
|---|---|---|
| Framework | Next.js 15 (App Router) | Pinned to 15.x — `create-next-app` now defaults to 16 |
| Language | TypeScript | strict mode |
| Styling | Tailwind CSS v4 + shadcn/ui | custom violet/fuchsia theme, not the default neutral preset |
| Animation | Framer Motion | landing page, forms, countdown |
| Game engine | Phaser **3**.90 | pinned — `npm install phaser` now resolves to Phaser 4 |
| Forms | React Hook Form + Zod | auth forms |
| Data fetching | TanStack Query | leaderboard page |
| Auth | Supabase Auth only | see [Why Supabase Auth only](#why-supabase-auth-only) |
| ORM | Prisma **6**.19 | pinned — Prisma 7 moved connection config out of `schema.prisma` into `prisma.config.ts` with driver adapters, a breaking change most current guides don't reflect yet |
| Database | Supabase Postgres | schema + RLS in `supabase/migrations/`, mirrored in `prisma/schema.prisma` |
| Deployment | Vercel | see [Deployment](#deployment-vercel) |

## What's actually implemented

- **Auth**: email/password + Google OAuth via Supabase, role-aware middleware, self-registration
  limited to student/teacher (admin is provisioned manually — see `supabase/migrations/0002`).
- **Database**: full schema (profiles, classes, games, letters, words, game_sessions,
  achievements, user_achievements, daily_progress) with RLS policies, a profile-creation trigger,
  and SQL functions for per-game and per-class leaderboards.
- **Landing page**: hero, live stats (real counts from the seeded content, not vanity metrics),
  game catalog, features grid, leaderboard preview (falls back to sample data if the DB is
  empty), and clearly-labeled placeholder testimonials.
- **Dashboard**: role-based shell (student/teacher/admin), student stats pulled from real
  aggregated `game_sessions`, XP/level bar, daily challenge, recent achievements.
- **Khmer keyboard**: on-screen keyboard driven by a verified physical-layout dataset (see
  [Keyboard layout](#keyboard-layout)), with Shift/CapsLock support and a tappable Shift key so
  the whole layout is reachable on touch devices.
- **Falling Letters**: fully playable — Phaser 3 scene, difficulty-scaled letter pools and fall
  speed, hearts, combo scoring, particle explosions, floating score text, tap-to-type via the
  on-screen keyboard, and a game-over flow that posts to `/api/scores`.
- **Falling Words**: fully playable — pick a category (from `src/data/khmer/words.ts`'s
  categorized dictionary) and a difficulty (pacing only, not word selection); whole words fall
  and must be typed character-by-character, with per-character progress coloring, a
  romanization/meaning hint for the targeted word, combo scoring, and the same particle/score-post
  flow as Falling Letters.
- **Scoring pipeline**: `/api/scores` records the session, updates XP/coins/level/streak/daily
  progress, and unlocks any achievements the new stats qualify for (see
  [Achievement coverage](#achievement-coverage) for which criteria types are actually evaluated).
- **Leaderboard**: daily/weekly/monthly/all-time, via a Postgres function, with a TanStack Query
  powered UI.
- **Achievements page**: all 100 achievements, grouped by rarity, showing locked/unlocked state.

## Roadmap (not yet built)

- Games 3–10 (Zombie Typing, Racer, Balloon Pop, Fish Catch, Space Shooter, Castle Defense, Memory
  Typing, Typing Marathon) — catalog entries exist in `src/data/games.ts` and render as "coming
  soon" on the Games hub.
- Learning Mode (structured alphabet → paragraph lessons) — stub page at `/learn`.
- Shop (themes, car skins, avatar frames) — stub page at `/shop`; no `shop_items`/`themes` tables
  yet.
- Teacher Portal beyond the protected stub: class rosters, join-code enrollment, assignments,
  PDF/Excel export. The `classes`/`class_students` tables and `class_leaderboard()` function
  already exist for this.
- Admin Panel beyond live counts: user/game/dictionary management, moderation, site settings.
- Missions (daily/weekly/monthly), notifications, activity logs, PWA/offline support.

## Architecture notes

### Why Supabase Auth only

The original brief listed both Supabase and Firebase Authentication. Running both means
reconciling two separate identity systems (a Firebase UID and a Supabase user row) on every
signup — real overhead for no benefit here, since Supabase Auth already covers email/password and
Google OAuth. Decided with the project owner up front; add Firebase later only if you need
something Supabase genuinely can't do (e.g. FCM push notifications).

### Prisma vs. Supabase's `auth` schema

Supabase owns `auth.users` in a schema Prisma can't see. The SQL in `supabase/migrations/` is the
source of truth for DDL (tables, RLS, the profile-creation trigger); `prisma/schema.prisma`
mirrors it by hand so Prisma Client gets full typed query access to the `public` schema. **Do not
run `prisma migrate dev` against this database** — apply the numbered SQL files via the Supabase
SQL editor or `supabase db push` instead, then run `prisma generate`.

### Prisma bypasses RLS — authorization lives in application code

Prisma connects using the `postgres` role from your connection string, which owns the tables and
therefore bypasses Row Level Security entirely (RLS only restricts roles like `anon`/
`authenticated` that Postgres actually enforces policies against). The RLS policies in
`0003_rls_policies.sql` are real and matter if you ever query Supabase directly from the browser
(e.g. Realtime subscriptions), but for every API route in this repo, **the authorization check is
the `getUser()` + ownership check in the route handler itself** (see `src/features/auth/guards.ts`
and `src/app/api/scores/route.ts`), not the database. Keep that in mind before trusting Prisma
queries to self-police who can read/write what.

### Weekly/monthly progress, leaderboards: views and functions, not tables

`daily_progress` is the only stored granularity. Weekly/monthly rollups (`0004` SQL) and
leaderboards (`leaderboard()`, `class_leaderboard()` functions) are computed on read. This avoids
maintaining redundant aggregates that can drift from the source rows.

### Keyboard layout

The on-screen keyboard needed a real physical key → Khmer character mapping. An initial attempt
to source the NiDA layout via a keyboard-diagram website produced self-contradictory data (the
same character assigned to two different keys across two fetches of the same page) — it's an
image/OCR-style extraction, not reliable for something this detail-sensitive. Instead,
`src/data/khmer/keyboard-layout.ts` is parsed programmatically (not hand-transcribed) from the
plain-text, open-source Keyman keyboard source for **Khmer Traditional** (Windows'
`KBDKHMR.DLL`, locale `0x0453`) — see the file header for the exact source URL. If your target
users specifically expect the NiDA layout instead, that's a data swap in one file, but verify
whatever source you use is plain text, not a rendered diagram.

### Achievement coverage

All 100 achievements are defined in `src/data/achievements.ts`. `src/features/achievements/check.ts`
only evaluates the criteria types this build can actually measure:
`correct_letters_total`, `combo_max`, `accuracy_single_game`, `kpm_max`, `games_played_total`,
`level_reached`, `coins_earned_total` (approximated from current balance — there's no coin ledger
until Shop exists), `achievements_unlocked_count`, and `game_mode_played_count` (keyed by an
achievement's `meta` field, so it already covers both `falling-letters` and `falling-words`, not
just one). Everything else (marathon durations, letter-category mastery, shop purchases,
streaks, time-of-day "special" flags, and every other game's play-count/hard-clear achievements)
correctly stays locked until those features are built — the switch statement is structured so
adding a case is the only work needed later.

### Known limitations

- **Word dictionary is a curated starter set** (~110 words), not "thousands." A handful of
  entries (mostly specific fish species and school/institution names) have their English gloss
  marked "(uncertain)" rather than guessed with false confidence — see `src/data/khmer/words.ts`.
  Scaling this up, and resolving those uncertain glosses, should go through native-speaker review
  before shipping to students — hand-authoring entries risks silent spelling/meaning errors in an
  app whose whole purpose is teaching correct spelling.
- **Score submission trusts the client** for gameplay counts (correct/wrong/combo/duration). There
  is no server-authoritative replay validation. Reasonable for a foundation build; revisit before
  running real competitive leaderboards at scale.
- Landing-page testimonials are explicitly placeholder copy (see `src/data/testimonials.ts`).

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase project

1. Create a project at supabase.com.
2. In **Authentication → Providers**, enable **Google** (Client ID/Secret from Google Cloud
   Console; redirect URI is `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`).
3. In the **SQL Editor**, run the files in `supabase/migrations/` **in order** (0001 → 0004).
4. Copy `.env.example` to `.env.local` (for Next.js) and `.env` (for the Prisma CLI). Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API.
   - `DATABASE_URL` / `DIRECT_URL` — Project Settings → Database → Connection string (see the
     comments in `.env.example` for which pooler port goes where).

   Never paste real keys into a chat/AI tool — fill these in yourself, locally.

### 3. Database client + seed data

```bash
npm run db:generate   # generates the Prisma Client from schema.prisma
npm run db:seed       # seeds games, letters, words, and all 100 achievements
```

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`, register a student (or teacher) account, and play Falling Letters
from the dashboard.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate Prisma Client after schema changes |
| `npm run db:seed` | Re-run the idempotent content seed |
| `npm run db:studio` | Prisma Studio, browsing the `public` schema |

## Deployment (Vercel)

1. Push this repo to GitHub and import it in Vercel.
2. Add every variable from `.env.example` to the Vercel project's Environment Variables (all
   environments). `NEXT_PUBLIC_SITE_URL` should be your production URL.
3. In Supabase, add your Vercel domain to **Authentication → URL Configuration → Redirect URLs**
   (`https://your-app.vercel.app/auth/callback`), or Google sign-in will redirect back to
   `localhost`.
4. Deploy. Run the SQL migrations and `npm run db:seed` against the production database before
   the first real user signs up (seed data — games/letters/achievements — must exist for the app
   to function).

## A note on the security advisories in `npm audit`

`npm audit` flags transitive `postcss`/`sharp` advisories bundled inside Next.js 15 itself, with
no fix available except downgrading to Next 9 (npm's suggested "fix" — do not do this). These are
inside Next's internal build tooling, not your application code; keep an eye out for a Next.js
15.x patch release that bumps them.
