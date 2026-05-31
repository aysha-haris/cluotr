# CLOUTR Connect — Project Understanding

> Generated from deep analysis of both `/aysha/cloutr-website` (source) and `/aysha/cloutr-connect` (target).
> Goal: rebuild the CLOUTR experience on Next.js 15 App Router while preserving design and UX exactly.

---

## 1. What This Project Is

CLOUTR is a **curated lifestyle affiliate discovery platform** for women. It shows products, categories, and editorial collections, lets users save items to a personal "board," and links out to affiliate URLs (primarily Amazon). Content is editorial/aspirational — think a visual magazine shop hybrid.

The **cloutr-connect** repo is a clean Next.js 15 rebuild of the original Vite/React SPA (`cloutr-website`). Most of the frontend migration is already done. The primary remaining work is:

- Wiring up the root layout (Navbar, Footer, Providers)
- Completing the CSS (dark mode, Google Fonts, shadows, missing vars)
- Fleshing out missing routes/pages
- Adding missing UI component primitives

---

## 2. Architecture

| Layer | Source (`cloutr-website`) | Target (`cloutr-connect`) |
|---|---|---|
| Framework | React 19 + Vite SPA | Next.js 15 App Router |
| Router | Wouter | Next.js file-based routing |
| Styling | Tailwind CSS 4 + CSS vars | Tailwind CSS 4 + CSS vars (same tokens) |
| State | Context API (BoardContext) | Context API (board-context.tsx) |
| DB | Drizzle ORM + pg | Raw `pg` pool (no ORM) |
| Images | `<img>` | `next/image` |
| Fonts | Google Fonts `@import` in CSS | Next.js font loading (needs wiring) |
| API client | `@workspace/api-client-react` hooks | `affiliate-links-context.tsx` (local) |
| Content | Static `data.ts` | Static `data.ts` + MDX files |

---

## 3. Directory Structure (cloutr-connect)

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # ROOT LAYOUT — needs Navbar/Footer/Providers wiring
│   ├── page.tsx               # Home — needs to render <HomePage>
│   ├── blog/                  # Blog list + [slug] pages
│   ├── collections/[slug]/    # Collection detail (new)
│   ├── guides/[slug]/         # Buying guides (new, SEO)
│   ├── roundups/[slug]/       # Product roundups (new, SEO)
│   ├── pin/[slug]/            # Pinterest landing pages (new)
│   └── api/affiliate-links/   # Internal API route for affiliate data
├── components/
│   ├── cards/                 # ProductCard, CategoryCard, CollectionCard, ArticleCard
│   ├── layout/                # Navbar, Footer, CloudLogo
│   ├── pages/                 # Page-level client components (HomePage, ShopPage, etc.)
│   ├── providers/             # AppProviders (BoardProvider + AffiliateLinkProvider)
│   ├── ui/                    # Primitive UI components (INCOMPLETE — only 4 exist)
│   └── analytics/             # Google Analytics, Pinterest Tag, etc.
├── lib/
│   ├── board-context.tsx      # Saved items (localStorage-backed)
│   ├── affiliate-links-context.tsx  # Fetches /api/affiliate-links
│   ├── data.ts                # Static product/category/collection/article data
│   └── db/                    # PostgreSQL pool + query functions
├── db/schema/                 # Raw SQL migration files
├── types/                     # TypeScript interfaces
└── content/                   # MDX files (blog, guides, roundups, pinterest)
```

---

## 4. Design System (Source of Truth)

### Fonts
- **Body (sans):** Inter (300, 400, 500, 600, 700) — Google Fonts
- **Headings (serif):** Outfit (300–800) — Google Fonts
- **Mono:** Menlo (system)
- CSS vars: `--app-font-sans`, `--app-font-serif`, `--app-font-mono`

### Color Palette (Light Mode)
| Token | Value | Description |
|---|---|---|
| `--background` | `hsl(38 33% 98%)` | Warm cream |
| `--foreground` | `hsl(280 15% 15%)` | Dark purple-grey text |
| `--primary` | `hsl(270 40% 65%)` | Lavender |
| `--secondary` | `hsl(344 60% 87%)` | Soft pink |
| `--accent` | `hsl(348 70% 78%)` | Coral |
| `--muted` | `hsl(38 40% 95%)` | Cream |
| `--card` | `hsl(0 0% 100%)` | White |
| `--border` | `hsl(270 30% 90%)` | Soft lavender border |

### Border Radius
- Base: `--radius: 1rem` (16px)
- Cards use `rounded-[20px]` and `rounded-[24px]`
- Large containers use `rounded-[32px]`

### Shadows
Lavender-tinted shadow system: `--shadow-2xs` through `--shadow-2xl` (rgba(188, 163, 213, ...)).

### Special CSS Classes
- `.gradient-text` — primary-to-accent gradient text
- `.bg-hero-gradient` — hero section background
- `.bento-grid` — CSS grid for featured category section
- `.scrollbar-hide` — hides scrollbar on carousel

---

## 5. Pages & Routes

| Route | Component | Status |
|---|---|---|
| `/` | `app/page.tsx` → `<HomePage>` | **BROKEN** — shows placeholder |
| `/shop` | `pages/shop-page.tsx` | Component exists, no route file |
| `/board` | `pages/board-page.tsx` | Component exists, no route file |
| `/blog` | `app/blog/page.tsx` | Exists |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Exists |
| `/category/[slug]` | — | Missing |
| `/collections/[slug]` | `app/collections/[slug]/page.tsx` | Exists (new) |
| `/guides/[slug]` | `app/guides/[slug]/page.tsx` | Exists (new) |
| `/roundups/[slug]` | `app/roundups/[slug]/page.tsx` | Exists (new) |
| `/pin/[slug]` | `app/pin/[slug]/page.tsx` | Exists (new) |

---

## 6. Database Schema

Three tables (PostgreSQL), defined in `src/db/schema/`:

```sql
-- categories (001_categories.sql)
id TEXT PRIMARY KEY, name TEXT NOT NULL,
description TEXT, image_url TEXT,
sort_order INTEGER DEFAULT 0, updated_at TIMESTAMPTZ

-- products (002_products.sql)
product_id INTEGER PRIMARY KEY,
title TEXT, category TEXT, image_url TEXT, updated_at TIMESTAMPTZ

-- affiliate_links (003_affiliate_links.sql)
product_id INTEGER PRIMARY KEY,
url TEXT NOT NULL DEFAULT '', price REAL, updated_at TIMESTAMPTZ
```

Query functions live in `src/lib/db/queries/`. Connection in `src/lib/db/pool.ts` (requires `DATABASE_URL`).

---

## 7. Key Gaps to Address

### High Priority
1. **`app/layout.tsx`** — Replace bare layout with Navbar + Footer + AppProviders + Google Fonts loading
2. **`app/page.tsx`** — Swap placeholder for `<HomePage>` from `pages/home-page.tsx`
3. **`globals.css`** — Add: Google Fonts `@import`, dark mode variables block, sidebar CSS vars, shadow system, `--app-font-*` aliases, `--badge-outline`, `--elevate-*`, `--tracking-normal`, `--spacing`
4. **Missing UI components** — Source has 65+; new project has only: `button`, `card`, `input`, `toast`, `toaster`. At minimum need: `badge`, `separator`, `skeleton`, `spinner`, `dialog`, `dropdown-menu`, `sheet`, `tooltip`, `scroll-area`, `tabs`

### Medium Priority
5. **`app/shop/page.tsx`** — Create route file that renders `<ShopPage>`
6. **`app/board/page.tsx`** — Create route file that renders `<BoardPage>`
7. **`app/category/[slug]/page.tsx`** — Create category route

### Lower Priority
8. **Admin page** — Source has a large `Admin.tsx`; new project has no equivalent
9. **Images** — Source references `/images/` paths; these need to exist in `public/`

---

## 8. Traced Workflows

### Workflow 1: User saves a product to their board
1. User visits `/` → `HomePage` renders `ProductCard` grid
2. User hovers product → bookmark button appears
3. Click → `handleSave()` in `ProductCard` calls `useBoard().saveItem()`
4. `BoardContext` (`board-context.tsx`) saves to `localStorage["cloutr-board"]`
5. Navbar badge animates with new count via `useBoard().count`
6. User navigates to `/board` → `BoardPage` reads `useBoard().items` and renders saved cards

### Workflow 2: Affiliate link price override
1. `AppProviders` wraps app; `AffiliateLinkProvider` fetches `/api/affiliate-links` on mount
2. `ProductCard` calls `useAffiliateLink(product.id)` from context
3. If link found: displays `link.price` (affiliate price) and `product.price` struck through
4. "View on Amazon" button opens `link.url` in new tab

### Workflow 3: Admin edits a category
1. POST/PUT to Next.js API route (to be built) → calls `src/lib/db/queries/categories.ts`
2. Drizzle/raw pg upserts into `categories` table
3. Category page at `/category/[slug]` re-fetches and renders updated data

---

## 9. Setup & Run

```bash
cd /Users/ayshaharis/Desktop/aysha/cloutr-connect
pnpm install
cp .env.example .env.local    # set DATABASE_URL
pnpm dev                       # Next.js dev on port 3000
```

Environment variables:
- `DATABASE_URL` — PostgreSQL connection string (required for DB queries)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics (optional)

---

## 10. Change Hazards

- `globals.css` uses Tailwind v4 `@theme inline {}` — do NOT add `tailwind.config.js`; all theme customization lives in the CSS file
- `next/image` requires `sizes` prop and configured `domains` if images are external
- `BoardProvider` and `AffiliateLinkProvider` must be in a `"use client"` boundary — both are already wrapped in `AppProviders`
- `app/layout.tsx` is a Server Component by default; Navbar/Footer can be Server Components but Providers must be client-wrapped
- Framer Motion `motion.*` components require `"use client"` — all page-level framer usage is already in `components/pages/` which are client components

---

## 11. Open Questions

- Are production images hosted externally (CDN) or will they be added to `public/`?
- Does the admin panel need to be rebuilt, or is it out of scope?
- Should dark mode be exposed in the UI (toggle), or just defined in CSS for future use?
- Is `DATABASE_URL` configured in the deployment environment (Vercel)?

---

## 12. Next-Session Kickoff Prompt

> "Continue building CLOUTR Connect. The design system and card components are already migrated from the Vite source. The immediate priorities are: (1) fix `app/layout.tsx` to use Navbar/Footer/AppProviders with Google Fonts, (2) wire `app/page.tsx` to render the existing `<HomePage>` component, (3) complete `globals.css` with dark mode + shadow vars, (4) add missing UI primitives (badge, separator, skeleton, etc.), and (5) create shop/board/category route files. Reference `PROJECT_UNDERSTANDING.md` for full context."
