# Graph Report - luzonprime  (2026-06-20)

## Corpus Check
- 181 files · ~68,941 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 620 nodes · 1393 edges · 39 communities (29 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f5154ee6`
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
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 95 edges
2. `createAdminClient()` - 38 edges
3. `cn()` - 31 edges
4. `Property` - 23 edges
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

## Communities (39 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (31): deleteBooking(), requireAdmin(), updateBookingStatus(), AgentListings(), AdminBookingsPage(), BookingsManager(), STATUS_STYLES, DashboardCardGrid() (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (11): ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema, ResetPasswordInput, resetPasswordSchema, SignupInput, signupSchema (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (16): contactSchema, POST(), inquireSchema, POST(), AdminLeadAlertParams, BookingConfirmationParams, EmailTemplateMap, getTransporter() (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (16): metadata, organizationJsonLd, playfair, plusJakartaSans, websiteJsonLd, Footer(), DASHBOARD_PREFIXES, SiteChrome() (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (41): dependencies, clsx, framer-motion, @hookform/resolvers, lucide-react, next, next-sitemap, next-themes (+33 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (33): deleteBuyAbilitySubmission(), matchBuyAbility(), requireAdmin(), respondBuyAbility(), submitBuyAbility(), SubmitBuyAbilityInput, updateBuyAbilityStatus(), metadata (+25 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (37): ALLOWED, crudCreate(), crudDelete(), crudUpdate(), pick(), requireAdmin(), revalidate(), TableConfig (+29 more)

### Community 7 - "Community 7"
Cohesion: 0.20
Nodes (10): ContactInput, contactSchema, NewsletterBanner(), InquiryInput, InquiryModal(), inquirySchema, Button, ButtonProps (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.27
Nodes (8): generateMetadata(), InteriorDesignsPage(), metadata, ShopGrid(), getProject(), PortfolioProjectPage(), InteriorProject, ShopItem

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (30): AdminOverviewPage(), lastNDays(), NAV_ITEMS, BarChartCard(), LineChartCard(), PALETTE, PieChartCard(), NAV_ITEMS (+22 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (15): generateMetadata(), generateMetadata(), AgentCard(), AgentContactButtons(), toWhatsApp(), ImageGallery(), MediaItem, youTubeEmbed() (+7 more)

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
Nodes (31): updateAvatar(), updateOwnProfile(), updateSiteSettings(), AdminLayout(), NAV_ITEMS, generateMetadata(), AdminAwardsPage(), AdminCategoriesPage() (+23 more)

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (10): AWARDS, metadata, PILLARS, TIMELINE, POINTS, WhyUs(), metadata, SERVICES (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.16
Nodes (11): Home(), CategoryCurations(), FALLBACK, FeaturedListings(), PropertyMarquee(), TESTIMONIALS, TestimonialsCarousel(), ITEMS (+3 more)

### Community 30 - "Community 30"
Cohesion: 0.19
Nodes (9): BlueprintStatement(), DEFAULT_AWARDS, HeroSection(), BEDROOMS, LISTING_TYPES, PRICE_RANGES, SearchBar(), BUILDINGS (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (14): metadata, BlogPage(), metadata, BlogPreview(), BuyAbilityBanner(), Neighborhoods(), PLACES, metadata (+6 more)

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (7): Notif, NotificationBell(), initials(), ProfileMenu(), ROLE_LABELS, TopBar(), useAuth()

### Community 33 - "Community 33"
Cohesion: 0.24
Nodes (6): ImageDropzone(), MediaDropzone(), DEFAULT_LISTING_TYPES, DEFAULT_PROPERTY_TYPES, DEFAULT_STATUSES, Term

### Community 34 - "Community 34"
Cohesion: 0.29
Nodes (6): ListingsSort(), OPTIONS, ListingsPage(), ListingsSearchParams, metadata, SORTS

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (6): BEDROOMS, FEATURES, LISTING_TYPES, PRICE_RANGES, PROPERTY_TYPES, PropertyFilters()

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (3): STATS, StatsBar(), CountUp()

## Knowledge Gaps
- **179 isolated node(s):** `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN`, `metadata`, `PILLARS` (+174 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 15` to `Community 0`, `Community 2`, `Community 34`, `Community 5`, `Community 6`, `Community 8`, `Community 10`, `Community 11`, `Community 29`, `Community 31`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 10` to `Community 0`, `Community 1`, `Community 5`, `Community 7`, `Community 8`, `Community 31`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `createAdminClient()` connect `Community 6` to `Community 0`, `Community 2`, `Community 11`, `Community 5`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createAdminClient()` (e.g. with `AdminAgentsPage()` and `generateStaticParams()`) actually correct?**
  _`createAdminClient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@supabase/mcp-server-supabase`, `@vercel/mcp-adapter`, `VERCEL_TOKEN` to the rest of the system?**
  _179 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07397959183673469 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1067193675889328 - nodes in this community are weakly interconnected._