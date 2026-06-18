# Graph Report - luzonprime  (2026-06-18)

## Corpus Check
- 151 files · ~58,241 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 540 nodes · 1144 edges · 28 communities (20 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c992977f`
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
1. `createClient()` - 72 edges
2. `createAdminClient()` - 32 edges
3. `cn()` - 23 edges
4. `Property` - 18 edges
5. `Profile` - 17 edges
6. `Button` - 16 edges
7. `compilerOptions` - 16 edges
8. `Input` - 15 edges
9. `AnimatedStagger()` - 13 edges
10. `AnimatedStaggerItem()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `createAdminClient()`  [INFERRED]
  app/listings/[slug]/page.tsx → lib/supabase/admin.ts
- `AdminAgentsPage()` --calls--> `createAdminClient()`  [INFERRED]
  app/admin/agents/page.tsx → lib/supabase/admin.ts
- `AdminAwardsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/awards/page.tsx → lib/supabase/server.ts
- `AdminBookingsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/bookings/page.tsx → lib/supabase/server.ts
- `AdminInquiriesPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/inquiries/page.tsx → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (28 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (31): AgentListings(), AdminBookingsPage(), BOOKING_STATUS_STYLES, ClientOverviewPage(), INQUIRY_STATUS_STYLES, AccountSettings(), BookingsManager(), STATUS_STYLES (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (37): ContactInput, contactSchema, AvatarUpload(), ImageDropzone(), MediaDropzone(), DEFAULT_LISTING_TYPES, DEFAULT_PROPERTY_TYPES, DEFAULT_STATUSES (+29 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (40): AWARDS, metadata, PILLARS, TIMELINE, updateAvatar(), updateOwnProfile(), updateSiteSettings(), metadata (+32 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (34): AdminOverviewPage(), lastNDays(), BarChartCard(), LineChartCard(), PALETTE, PieChartCard(), StatCard(), ITEMS (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (41): dependencies, clsx, framer-motion, @hookform/resolvers, lucide-react, next, next-sitemap, next-themes (+33 more)

### Community 5 - "Community 5"
Cohesion: 0.21
Nodes (10): assignInquiry(), requireAdmin(), updateInquiryStatus(), DataTable(), DataTableColumn, STATUS_OPTIONS, STATUS_STYLES, SubscribersDataTable() (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (29): deleteBooking(), requireAdmin(), updateBookingStatus(), createProperty(), dbClientFor(), deleteProperty(), features(), fileList() (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (21): metadata, organizationJsonLd, playfair, plusJakartaSans, websiteJsonLd, BlueprintStatement(), DEFAULT_AWARDS, HeroSection() (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (16): contactSchema, POST(), inquireSchema, POST(), AdminLeadAlertParams, BookingConfirmationParams, EmailTemplateMap, getTransporter() (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (16): AdminLayout(), NAV_ITEMS, NAV_ITEMS, NAV_ITEMS, DashboardShell(), Notif, NotificationBell(), initials() (+8 more)

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
Cohesion: 0.17
Nodes (15): ALLOWED, crudCreate(), crudDelete(), crudUpdate(), pick(), requireAdmin(), revalidate(), TableConfig (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **164 isolated node(s):** `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN`, `metadata`, `PILLARS` (+159 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`, `Community 5`, `Community 6`, `Community 8`, `Community 10`, `Community 11`, `Community 15`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 5`, `Community 10`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `createAdminClient()` connect `Community 6` to `Community 0`, `Community 5`, `Community 8`, `Community 11`, `Community 15`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createAdminClient()` (e.g. with `AdminAgentsPage()` and `generateStaticParams()`) actually correct?**
  _`createAdminClient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN` to the rest of the system?**
  _164 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06848357791754019 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.059673659673659674 - nodes in this community are weakly interconnected._