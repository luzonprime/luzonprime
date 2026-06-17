# CLAUDE.md — LuzonPrime Real Estate Website
## Master Build Plan & Context File

> **Purpose:** This file is the persistent context anchor for Claude Code sessions.
> Read this file at the start of every session. Never hallucinate state — always re-read
> relevant source files before editing them.

---

## 0. Project Identity

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Domain           | luzonprime.com                             |
| Brand Name       | LuzonPrimeRealtors                                 |
| Primary Email    | info@luzonprime.com                        |
| Support Email    | support@luzonprime.com                     |
| Email Provider   | Zoho Mail (domain only — no SMTP service) |
| Transactional    | Brevo (connected to luzonprime.com domain) |
| Hosting          | Vercel (Next.js)                           |
| Database/Auth    | Supabase                                   |
| Repo             | GitHub                                     |
| Design Ref       | cwlagos.com + edenoasisrealty.com (inspired, not copied) |
| UI Screenshots   | /ui-sample/ folder in project root         |

---

## 1. Tech Stack (Locked)

```
Frontend   : Next.js 14+ (App Router), TypeScript, Tailwind CSS
Animation  : Framer Motion (page transitions, scroll reveals, hover)
Icons      : Lucide React
Forms      : React Hook Form + Zod validation
Database   : Supabase (PostgreSQL)
Auth       : Supabase Auth (email/password + 6 digit otp (expires after 300 seconds))
Storage    : Supabase Storage (property images)
Email      : Brevo (transactional) via SMTP / API
SEO        : Next.js Metadata API + next-sitemap
Analytics  : Vercel Analytics + custom admin dashboard
Maps       : OpenStreetMap embed (static pin point of property location, no map SDK)
Deployment : Vercel (auto-deploy from GitHub main branch)
```

---

## 2. MCP Servers (Setup in .cursor/mcp.json or Claude Code config)

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest",
               "--access-token", "${SUPABASE_ACCESS_TOKEN}"],
      "env": {}
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-adapter@latest"],
      "env": {
        "VERCEL_TOKEN": "${VERCEL_TOKEN}"
      }
    }
  }
}
```

> Keys are sourced from `.env` — never hardcode them.

---

## 3. Environment Variables (.env)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ACCESS_TOKEN=          # for MCP server

# Vercel
VERCEL_TOKEN=                   # for MCP server

# Brevo (email)
BREVO_API_KEY=
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=                # your Brevo login email
BREVO_SMTP_PASS=                # Brevo SMTP key

# App
NEXT_PUBLIC_SITE_URL=https://luzonprime.com
NEXT_PUBLIC_WHATSAPP_NUMBER=    # e.g. 2348012345678

# Admin bootstrap (used only during initial DB seed)
ADMIN_BOOTSTRAP_EMAIL=
```

---

## 4. User Roles & Auth Architecture

### Role Hierarchy
```
admin   → full system control (created via Supabase dashboard SQL)
agent   → list/manage own properties, view assigned leads
client  → save favourites, submit enquiries, book consultations
public  → browse listings (no account needed)
```

### How Roles Are Assigned

- **client / agent** → chosen at signup via radio button; stored in
  `profiles.role` column; enforced by Supabase RLS policies.
- **admin** → NEVER selectable at signup. Created by running:
  ```sql
  -- In Supabase SQL editor
  INSERT INTO auth.users (...) ...;
  UPDATE public.profiles SET role = 'admin' WHERE user_id = '<uuid>';
  ```
  Or via a one-time secure migration script (`scripts/create-admin.ts`).

### Password Reset
All roles (including admin) use Supabase's built-in email-based
password reset. Brevo delivers the reset email via the custom domain.
No special handling needed beyond configuring Supabase SMTP settings
to point at Brevo.

---

## 5. Database Schema (Supabase / PostgreSQL)

```sql
-- profiles (extends auth.users)
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('client','agent','admin')) default 'client',
  full_name   text,
  phone       text,
  avatar_url  text,
  bio         text,                        -- agent bio
  verified    boolean default false,       -- agent verified badge
  created_at  timestamptz default now()
);

-- properties
create table properties (
  id              uuid primary key default gen_random_uuid(),
  agent_id        uuid references profiles(id),
  title           text not null,
  slug            text unique not null,
  description     text,
  property_type   text,   -- apartment, duplex, land, commercial, etc.
  listing_type    text,   -- for_sale, for_rent, off_plan
  status          text default 'available', -- available, sold, rented
  price           numeric,
  price_label     text,   -- e.g. "Price on Request"
  bedrooms        int,
  bathrooms       numeric,
  size_sqm        numeric,
  location        text,
  area            text,   -- neighbourhood
  city            text,
  latitude        numeric,
  longitude       numeric,
  features        text[], -- pool, gym, elevator, etc.
  is_featured     boolean default false,
  is_published    boolean default false,
  images          text[], -- Supabase Storage URLs
  video_url       text,
  virtual_tour_url text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- inquiries / leads
create table inquiries (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid references properties(id),
  user_id         uuid references profiles(id),
  name            text not null,
  email           text not null,
  phone           text,
  message         text,
  inquiry_type    text,  -- purchase, rent, valuation, general
  status          text default 'new',  -- new, contacted, closed
  assigned_agent  uuid references profiles(id),
  created_at      timestamptz default now()
);

-- newsletter subscribers
create table subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  name       text,
  status     text default 'active',
  created_at timestamptz default now()
);

-- bookings (consultation)
create table bookings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id),
  agent_id      uuid references profiles(id),
  property_id   uuid references properties(id),
  scheduled_at  timestamptz not null,
  status        text default 'pending',  -- pending, confirmed, cancelled
  notes         text,
  created_at    timestamptz default now()
);

-- blog / market insights (optional Phase 2)
create table posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid references profiles(id),
  title       text not null,
  slug        text unique not null,
  content     text,
  cover_image text,
  published   boolean default false,
  created_at  timestamptz default now()
);
```

### RLS Policies (Key Rules)
- Public can SELECT published properties.
- Agents can INSERT/UPDATE/DELETE their own properties.
- Admin can do anything (bypass RLS via service role in server actions).
- Inquiries: INSERT for all, SELECT only for admin/assigned agent/inquiry owner.

---

## 6. Project File Structure

```
luzonprime/
├── CLAUDE.md                        ← this file (also in root for Claude Code)
├── ui-sample/                       ← screenshot references (DO NOT DELETE)
│   ├── hero.png
│   ├── listing-card.png
│   ├── property-detail.png
│   └── ...
├── .env.local                       ← secrets (gitignored)
├── .env.example                     ← safe template committed to git
├── .cursor/
│   └── mcp.json                     ← MCP server config
├── scripts/
│   ├── create-admin.ts              ← one-time admin bootstrap
│   └── seed.ts                      ← dev data seed
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── public/
│   ├── images/
│   └── og-image.jpg
├── src/
│   ├── app/                         ← Next.js App Router
│   │   ├── (public)/                ← unauthenticated routes
│   │   │   ├── page.tsx             ← Home
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx         ← Listings index
│   │   │   │   └── [slug]/page.tsx  ← Property detail
│   │   │   ├── about/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── agents/page.tsx
│   │   │   └── blog/
│   │   │       ├── page.tsx
│   │   │       └── [slug]/page.tsx
│   │   ├── (auth)/                  ← auth routes
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (dashboard)/             ← protected routes
│   │   │   ├── layout.tsx           ← sidebar/nav layout
│   │   │   ├── client/
│   │   │   │   ├── page.tsx         ← client home
│   │   │   │   ├── favourites/
│   │   │   │   ├── inquiries/
│   │   │   │   └── bookings/
│   │   │   ├── agent/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── properties/
│   │   │   │   ├── leads/
│   │   │   │   └── profile/
│   │   │   └── admin/
│   │   │       ├── page.tsx         ← analytics overview
│   │   │       ├── properties/
│   │   │       ├── users/
│   │   │       ├── inquiries/
│   │   │       ├── agents/
│   │   │       ├── subscribers/
│   │   │       ├── bookings/
│   │   │       └── settings/
│   │   ├── api/
│   │   │   ├── contact/route.ts
│   │   │   ├── subscribe/route.ts
│   │   │   ├── inquire/route.ts
│   │   │   └── webhooks/brevo/route.ts
│   │   ├── layout.tsx               ← root layout (theme, fonts)
│   │   ├── not-found.tsx
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/                      ← base primitives (Button, Input, Card...)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FeaturedListings.tsx
│   │   │   ├── CategoryCurations.tsx
│   │   │   ├── StatsBar.tsx
│   │   │   ├── TestimonialsCarousel.tsx
│   │   │   ├── NewsletterBanner.tsx
│   │   │   └── WhyUs.tsx
│   │   ├── listings/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   ├── PropertyFilters.tsx
│   │   │   ├── PropertyLocationPin.tsx   ← static OpenStreetMap pin embed, not interactive map
│   │   │   ├── ImageGallery.tsx
│   │   │   └── InquiryForm.tsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── DataTable.tsx
│   │   └── shared/
│   │       ├── WhatsAppButton.tsx
│   │       ├── ThemeToggle.tsx
│   │       ├── AnimatedSection.tsx
│   │       └── SEOHead.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            ← browser client
│   │   │   ├── server.ts            ← server client (RSC/actions)
│   │   │   └── middleware.ts
│   │   ├── brevo.ts                 ← email sending helpers
│   │   ├── validations.ts           ← Zod schemas
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProperties.ts
│   │   └── useTheme.ts
│   ├── types/
│   │   └── index.ts                 ← shared TS types
│   └── styles/
│       └── globals.css              ← Tailwind + CSS vars
├── middleware.ts                    ← auth route protection
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 7. Design System

### Color Tokens

```css
/* globals.css — Light Mode */
:root {
  --color-primary:    #091F46;   /* exact logo background navy — buttons, widgets, CTAs */
  --color-primary-light: #2A4080;
  --color-accent:     #C9A84C;   /* warm gold */
  --color-bg:         #FFFFFF;   /* white background in light mode */
  --color-bg-muted:   #F7F8FA;
  --color-surface:    #FFFFFF;
  --color-border:     #E5E7EB;
  --color-text:       #111827;
  --color-text-muted: #6B7280;
}

/* Dark Mode */
.dark {
  --color-primary:    #091F46;   /* same exact logo navy — buttons, widgets, CTAs */
  --color-accent:     #C9A84C;
  --color-bg:         #000000;   /* black background in dark mode */
  --color-bg-muted:   #1A2540;
  --color-surface:    #1E2D4A;
  --color-border:     #2D3E5E;
  --color-text:       #F3F4F6;
  --color-text-muted: #9CA3AF;
}
```

### Typography
```
Font:    Inter (body) + Playfair Display (headings / hero)
Sizes:   Mobile-first, scale via Tailwind responsive prefixes
```

### Animation Principles (Framer Motion)
- **Scroll reveal:** `fadeInUp` for cards and sections (staggerChildren)
- **Hero:** Full-viewport video/image background with text parallax
- **Property cards:** Subtle scale + shadow lift on hover
- **Page transitions:** Fade + slight Y shift between routes
- **Numbers:** CountUp animation for stats on scroll entry
- **WhatsApp FAB:** Pulse ring animation

---

## 8. Page-by-Page Spec

### 8.1 Home (`/`)
- **Hero:** Full-screen aerial city video bg, headline + search bar overlay
- **Search bar:** Type (Sale/Rent/Off-Plan), Location, Bedrooms, Price → goes to `/listings`
- **Trust badges:** Awards row (animated scroll-in)
- **Stats:** Animated counters (properties sold, transaction vol, years)
- **Featured listings:** Horizontal scroll carousel (mobile) / 3-col grid (desktop)
- **Curations:** Category tiles with background images (Rentals, Off-Plan, Commercial)
- **Why Us:** Icon + text grid, 3–4 USPs
- **Agents:** Team preview strip with headshots
- **Testimonials:** Auto-scrolling card carousel
- **Newsletter:** Email capture → Brevo list
- **WhatsApp FAB:** Floating bottom-right, always visible

### 8.2 Listings (`/listings`)
- Filter sidebar (mobile: bottom sheet) — type, location, beds, price range, features
- Grid view only (no interactive map view — each property's location pin is shown on its own detail page)
- Infinite scroll / pagination
- Sort: Newest, Price ↑↓, Featured
- Property card: image (carousel on hover), price, beds/baths, area, status badge

### 8.3 Property Detail (`/listings/[slug]`)
- Full-screen image gallery (lightbox)
- Sticky sidebar: price, CTA buttons (Enquire, Book Visit, WhatsApp)
- Details: type, size, beds/baths, features checklist
- Static map pin showing the property's recorded coordinates (OpenStreetMap embed, no SDK/API key)
- Agent card (name, photo, contact)
- Related listings (same area)
- Enquiry modal → creates inquiry record + sends email via Brevo

### 8.4 About (`/about`)
- Brand story, mission, vision
- Stats block
- Team grid (agents with roles)
- Awards section
- Timeline (company milestones)

### 8.5 Services (`/services`)
- Cards: Buy, Sell, Rent, Off-Plan Advisory, Property Management, Valuation
- Each expands or links to a detail section

### 8.6 Contact (`/contact`)
- Contact form → creates inquiry + sends notification
- Office address, phone, email
- Map embed
- WhatsApp CTA

### 8.7 Agents (`/agents`)
- Grid of agent profiles
- Each links to `/agents/[slug]` with their active listings

### 8.8 Blog / Market Insights (`/blog`)
- Article cards
- `/blog/[slug]` — full article with SEO metadata

---

## 9. Dashboard Specs

### Client Dashboard (`/client`)
- Saved properties (favourites)
- My inquiries (status tracking)
- My bookings (upcoming consultations)
- Profile settings + password change

### Agent Dashboard (`/agent`)
- My property listings (CRUD)
- Upload images to Supabase Storage
- My assigned leads / inquiries
- Booking calendar
- Profile + bio editor

### Admin Dashboard (`/admin`)
- **Overview:** Total listings, inquiries, subscribers, revenue KPIs (charts)
- **Properties:** Full CRUD, approve/publish agent listings, feature toggle
- **Users:** List all clients + agents, suspend, verify agents
- **Inquiries:** All leads, assign to agent, update status
- **Agents:** Approve, verify, deactivate agents
- **Subscribers:** Newsletter list, export CSV
- **Bookings:** All consultations overview
- **Settings:** Site config (contact info, social links, featured areas)
- **Email Campaigns:** Trigger Brevo campaign to subscriber list

---

## 10. Email Flows (Brevo + Supabase)

| Trigger                  | Recipients             | Template              |
|--------------------------|------------------------|-----------------------|
| New user signup          | User                   | Supabase default      |
| Password reset           | User                   | Supabase default      |
| Property inquiry         | User + Admin + Agent   | Inquiry confirmation  |
| Booking confirmed        | User + Agent           | Booking details       |
| Newsletter subscribe     | User                   | Welcome to list       |
| Admin: new inquiry alert | Admin (info@)          | Lead notification     |
| Agent: new lead assigned | Agent                  | Lead assigned         |

All emails sent from `noreply@luzonprime.com` for Supabase Auth & `info@luzonprime.com` via Brevo SMTP.

---

## 11. SEO Strategy

- `<title>` and `<meta description>` set per page via Next.js `generateMetadata()`
- Dynamic OG images for property pages
- `sitemap.ts` → auto-generates sitemap with all listing slugs
- `robots.txt` → disallow /admin, /client, /agent
- Structured data (JSON-LD): `RealEstateListing`, `Organization`, `BreadcrumbList`
- Canonical URLs on all pages
- Alt text on all images

---

## 12. Build Phases

### Phase 1 — Foundation 
- [ ] Init Next.js project, install dependencies
- [ ] Configure Tailwind, design tokens, dark/light mode
- [ ] Supabase project: schema migrations, RLS policies
- [ ] Auth flow: signup (with role selector), login, password reset
- [ ] Middleware: route protection by role
- [ ] Navbar + Footer + Mobile menu
- [ ] Home page (static, no data)
- [ ] Vercel deploy + domain

### Phase 2 — Core Features
- [ ] Property CRUD (admin + agent)
- [ ] Supabase Storage for images
- [ ] Listings page with filters
- [ ] Property detail page
- [ ] Enquiry / contact forms + Brevo email
- [ ] WhatsApp floating button
- [ ] Newsletter subscribe

### Phase 3 — Dashboards 
- [ ] Admin dashboard (full)
- [ ] Agent dashboard
- [ ] Client dashboard
- [ ] Booking system
- [ ] Analytics charts (Recharts)

### Phase 4 — Polish 
- [ ] Framer Motion animations (all pages)
- [ ] Property location pin embed (OpenStreetMap)
- [ ] Blog/Insights section
- [ ] SEO finalization (sitemap, JSON-LD, metadata)
- [ ] Performance audit (images, lazy load, bundle size)
- [ ] Mobile QA pass
- [ ] Accessibility (a11y) pass

---

## 13. Claude Code Session Rules

1. **Always read CLAUDE.md first** at session start.
2. **Never hardcode** env variables. Use `process.env.*`.
3. **Mobile-first** — write Tailwind classes sm → lg, never assume desktop.
4. **Before editing any file**, re-read it with `cat` or `read_file`.
5. **Use server actions** for mutations (not client-side fetch to API routes where possible).
6. **RLS is the security layer** — never bypass it client-side. Use service role only in server-only files.
7. **Images** go to Supabase Storage bucket `property-images`, served via public URL.
8. **All forms** use React Hook Form + Zod. No uncontrolled inputs.
9. **ui-sample/ folder** is the design bible — reference it before building any new UI section.
10. **Commits** should be atomic: one feature/fix per commit with a clear message.

---

## 14. Key Commands

```bash
# Dev
npm run dev

# Supabase local
npx supabase start
npx supabase db push
npx supabase gen types typescript --local > src/types/supabase.ts

# Deploy (auto via Vercel GitHub integration)
git push origin main

# Admin bootstrap (one-time)
npx tsx scripts/create-admin.ts
```

---

## 15. Skills Files (Reference per task)

| Task                      | Skill / Reference                    |
|---------------------------|--------------------------------------|
| UI component design       | ui-sample/ screenshots               |
| Email templates           | src/lib/brevo.ts + Brevo dashboard   |
| DB changes                | supabase/migrations/ (never direct)  |
| New page SEO              | src/app/*/page.tsx generateMetadata  |
| Image uploads             | Supabase Storage (bucket: property-images) |
| Form validation           | src/lib/validations.ts (Zod schemas) |

---

*Last updated: project kickoff. Update this file whenever architecture decisions change.*

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
