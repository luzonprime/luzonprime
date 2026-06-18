# Graph Report - luzonprime  (2026-06-18)

## Corpus Check
- 134 files · ~52,698 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 480 nodes · 975 edges · 28 communities (20 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c953045`
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
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
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
- `generateStaticParams()` --calls--> `createAdminClient()`  [INFERRED]
  app/listings/[slug]/page.tsx → lib/supabase/admin.ts
- `AdminAgentsPage()` --calls--> `createAdminClient()`  [INFERRED]
  app/admin/agents/page.tsx → lib/supabase/admin.ts
- `AdminLayout()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/layout.tsx → lib/supabase/server.ts
- `AdminSubscribersPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/subscribers/page.tsx → lib/supabase/server.ts
- `BlogPage()` --calls--> `createClient()`  [EXTRACTED]
  app/blog/page.tsx → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (28 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (35): updateOwnProfile(), updateSiteSettings(), AgentListings(), AdminBookingsPage(), BOOKING_STATUS_STYLES, ClientOverviewPage(), INQUIRY_STATUS_STYLES, AccountSettings() (+27 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (27): ContactInput, contactSchema, NewsletterBanner(), ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, ResetPasswordInput (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (27): AWARDS, metadata, PILLARS, TIMELINE, metadata, BlogPage(), metadata, AgentsPreview() (+19 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (23): AdminLayout(), NAV_ITEMS, AdminOverviewPage(), lastNDays(), NAV_ITEMS, BarChartCard(), LineChartCard(), PALETTE (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (41): dependencies, clsx, framer-motion, @hookform/resolvers, lucide-react, next, next-sitemap, next-themes (+33 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (21): initials(), ROLE_LABELS, TopBar(), HeroSection(), BEDROOMS, LISTING_TYPES, PRICE_RANGES, SearchBar() (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (22): createProperty(), dbClientFor(), deleteProperty(), features(), getActor(), num(), publishProperty(), toggleFeatured() (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (20): metadata, organizationJsonLd, playfair, plusJakartaSans, websiteJsonLd, COUNTRY_CURRENCY, CurrencyDef, currencyForCountry() (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (16): contactSchema, POST(), inquireSchema, POST(), AdminLeadAlertParams, BookingConfirmationParams, EmailTemplateMap, getTransporter() (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.19
Nodes (11): assignInquiry(), requireAdmin(), updateInquiryStatus(), DataTable(), DataTableColumn, InquiriesDataTable(), STATUS_OPTIONS, STATUS_STYLES (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (12): generateMetadata(), AgentCard(), AgentContactButtons(), toWhatsApp(), ImageGallery(), MediaItem, youTubeEmbed(), PropertyEnquiryCTA() (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.32
Nodes (6): AGENT_PHOTOS, EXTERIOR_IMAGES, img(), INTERIOR_IMAGES, main(), slugify()

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (6): supabase, vercel, VERCEL_TOKEN, npx, @supabase/mcp-server-supabase, @vercel/mcp-adapter

### Community 14 - "Community 14"
Cohesion: 0.47
Nodes (4): config, proxy(), ROLE_PREFIXES, updateSession()

### Community 15 - "Community 15"
Cohesion: 0.70
Nodes (4): generateMetadata(), BlogPostPage(), formatDate(), getPost()

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **148 isolated node(s):** `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN`, `metadata`, `PILLARS` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 2`, `Community 3`, `Community 6`, `Community 8`, `Community 10`, `Community 11`, `Community 15`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 3` to `Community 1`, `Community 10`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `Button` connect `Community 1` to `Community 0`, `Community 5`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createAdminClient()` (e.g. with `AdminAgentsPage()` and `generateStaticParams()`) actually correct?**
  _`createAdminClient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06749482401656315 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08244897959183674 - nodes in this community are weakly interconnected._