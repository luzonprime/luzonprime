# Graph Report - luzonprime  (2026-06-18)

## Corpus Check
- 135 files · ~52,870 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 482 nodes · 981 edges · 26 communities (18 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82d5d870`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 55 edges
2. `createAdminClient()` - 25 edges
3. `cn()` - 19 edges
4. `Profile` - 17 edges
5. `Property` - 17 edges
6. `compilerOptions` - 16 edges
7. `Button` - 15 edges
8. `Input` - 14 edges
9. `AnimatedStagger()` - 12 edges
10. `AnimatedStaggerItem()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AdminAgentsPage()` --calls--> `createAdminClient()`  [INFERRED]
  app/admin/agents/page.tsx → lib/supabase/admin.ts
- `AdminLayout()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/layout.tsx → lib/supabase/server.ts
- `BlogPage()` --calls--> `createClient()`  [EXTRACTED]
  app/blog/page.tsx → lib/supabase/server.ts
- `generateStaticParams()` --calls--> `createAdminClient()`  [INFERRED]
  app/listings/[slug]/page.tsx → lib/supabase/admin.ts
- `ListingsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/listings/page.tsx → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (26 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (41): assignInquiry(), requireAdmin(), updateInquiryStatus(), updateOwnProfile(), updateSiteSettings(), generateMetadata(), AdminBookingsPage(), BOOKING_STATUS_STYLES (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (27): ContactInput, contactSchema, ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, ResetPasswordInput, resetPasswordSchema (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (28): AWARDS, metadata, PILLARS, TIMELINE, metadata, BlogPage(), metadata, BlogPreview() (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (33): AdminOverviewPage(), lastNDays(), AgentListings(), generateMetadata(), BarChartCard(), LineChartCard(), PALETTE, PieChartCard() (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (41): dependencies, clsx, framer-motion, @hookform/resolvers, lucide-react, next, next-sitemap, next-themes (+33 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (9): HeroSection(), BEDROOMS, LISTING_TYPES, PRICE_RANGES, SearchBar(), BUILDINGS, SkylineSketch(), FOOTER_LINKS (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (24): createProperty(), dbClientFor(), deleteProperty(), features(), getActor(), num(), publishProperty(), toggleFeatured() (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (27): metadata, organizationJsonLd, playfair, plusJakartaSans, websiteJsonLd, Footer(), NAV_LINKS, Navbar() (+19 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (16): contactSchema, POST(), inquireSchema, POST(), AdminLeadAlertParams, BookingConfirmationParams, EmailTemplateMap, getTransporter() (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (14): AdminLayout(), NAV_ITEMS, NAV_ITEMS, NAV_ITEMS, DashboardShell(), initials(), ProfileMenu(), ROLE_LABELS (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.32
Nodes (6): AGENT_PHOTOS, EXTERIOR_IMAGES, img(), INTERIOR_IMAGES, main(), slugify()

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (6): supabase, vercel, VERCEL_TOKEN, npx, @supabase/mcp-server-supabase, @vercel/mcp-adapter

### Community 14 - "Community 14"
Cohesion: 0.47
Nodes (4): config, proxy(), ROLE_PREFIXES, updateSession()

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **148 isolated node(s):** `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN`, `metadata`, `PILLARS` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 2`, `Community 3`, `Community 6`, `Community 8`, `Community 10`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 3` to `Community 0`, `Community 1`, `Community 10`, `Community 7`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `Button` connect `Community 1` to `Community 0`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createAdminClient()` (e.g. with `AdminAgentsPage()` and `generateStaticParams()`) actually correct?**
  _`createAdminClient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.056962025316455694 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0824829931972789 - nodes in this community are weakly interconnected._