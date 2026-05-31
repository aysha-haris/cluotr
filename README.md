# CLOUTR

Pinterest-first affiliate marketing foundation built with Next.js 15, PostgreSQL, and file-based MDX content.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui primitives
- PostgreSQL via `pg` (raw SQL, no ORM)
- MDX content in `src/content/`
- Zod validation for env and content frontmatter

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in required values
pnpm dev
```

Required environment variables are validated at startup via `src/instrumentation.ts`.

## Database

Apply schema files in order:

```bash
psql $DATABASE_URL -f src/db/schema/001_products.sql
psql $DATABASE_URL -f src/db/schema/002_collections.sql
psql $DATABASE_URL -f src/db/schema/003_blog_posts.sql
psql $DATABASE_URL -f src/db/schema/004_categories.sql
```

## Content

Add MDX files without touching code:

| Type | Directory | Route |
|------|-------------|-------|
| Blog | `src/content/blog/` | `/blog/[slug]` |
| Buying guides | `src/content/guides/` | `/guides/[slug]` |
| Roundups | `src/content/roundups/` | `/roundups/[slug]` |
| Pinterest landings | `src/content/pinterest/` | `/pin/[slug]` |

## Scripts

```bash
pnpm dev          # development server
pnpm build        # production build
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm format       # Prettier
```

## Deploy

Configured for Vercel. Set all variables from `.env.example` in your project settings before deploying.
