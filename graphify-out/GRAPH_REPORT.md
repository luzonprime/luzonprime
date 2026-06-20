# Graph Report - luzonprime  (2026-06-20)

## Corpus Check
- 175 files · ~67,836 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 607 nodes · 1357 edges · 27 communities (19 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `049ac7c7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
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
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 93 edges
2. `createAdminClient()` - 38 edges
3. `cn()` - 28 edges
4. `Property` - 22 edges
5. `Button` - 18 edges
6. `Profile` - 17 edges
7. `Input` - 16 edges
8. `compilerOptions` - 16 edges
9. `AnimatedStaggerItem()` - 15 edges
10. `AnimatedStagger()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `createAdminClient()`  [INFERRED]
  app/listings/[slug]/page.tsx → lib/supabase/admin.ts
- `AdminAgentsPage()` --calls--> `createAdminClient()`  [INFERRED]
  app/admin/agents/page.tsx → lib/supabase/admin.ts
- `AdminBookingsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/bookings/page.tsx → lib/supabase/server.ts
- `AdminInquiriesPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/inquiries/page.tsx → lib/supabase/server.ts
- `AdminSubscribersPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/subscribers/page.tsx → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (27 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (13): assignInquiry(), requireAdmin(), updateInquiryStatus(), DataTable(), DataTableColumn, InquiriesDataTable(), STATUS_OPTIONS, STATUS_STYLES (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (35): updateAvatar(), updateOwnProfile(), ContactInput, contactSchema, AccountSettings(), AvatarUpload(), Notif, NotificationBell() (+27 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (23): metadata, organizationJsonLd, playfair, plusJakartaSans, websiteJsonLd, Footer(), FOOTER_LINKS, SOCIALS (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (41): dependencies, clsx, framer-motion, @hookform/resolvers, lucide-react, next, next-sitemap, next-themes (+33 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (32): deleteBuyAbilitySubmission(), matchBuyAbility(), requireAdmin(), respondBuyAbility(), submitBuyAbility(), SubmitBuyAbilityInput, updateBuyAbilityStatus(), contactSchema (+24 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (40): deleteBooking(), requireAdmin(), updateBookingStatus(), createProperty(), dbClientFor(), deleteProperty(), features(), fileList() (+32 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (40): generateMetadata(), generateMetadata(), metadata, PERKS, BuyAbilityForm(), REQUIRED, TIPS, FeaturedListings() (+32 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): AdminOverviewPage(), lastNDays(), NAV_ITEMS, BarChartCard(), LineChartCard(), PALETTE, PieChartCard(), NAV_ITEMS (+27 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (17): AgentListings(), metadata, generateMetadata(), AgentDetailPage(), generateMetadata(), getAgent(), AgentCard(), AgentContactButtons() (+9 more)

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
Cohesion: 0.08
Nodes (30): ALLOWED, crudCreate(), crudDelete(), crudUpdate(), pick(), requireAdmin(), revalidate(), TableConfig (+22 more)

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 31 - "Community 31"
Cohesion: 0.06
Nodes (40): AWARDS, metadata, PILLARS, TIMELINE, Home(), BlogPage(), metadata, AgentsPreview() (+32 more)

## Knowledge Gaps
- **175 isolated node(s):** `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN`, `metadata`, `PILLARS` (+170 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 15` to `Community 0`, `Community 1`, `Community 5`, `Community 6`, `Community 8`, `Community 10`, `Community 11`, `Community 31`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 10` to `Community 0`, `Community 1`, `Community 3`, `Community 8`, `Community 31`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `createAdminClient()` connect `Community 6` to `Community 0`, `Community 11`, `Community 5`, `Community 15`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createAdminClient()` (e.g. with `AdminAgentsPage()` and `generateStaticParams()`) actually correct?**
  _`createAdminClient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN` to the rest of the system?**
  _175 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06105834464043419 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06825396825396825 - nodes in this community are weakly interconnected._