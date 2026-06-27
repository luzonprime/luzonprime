-- Curation support for reviews + Google linkage in site settings.

-- Allow non-account reviews (curated testimonials / imported Google reviews).
alter table public.reviews alter column user_id drop not null;
alter table public.reviews add column if not exists source text not null default 'site'
  check (source in ('site', 'google'));
alter table public.reviews add column if not exists author_role text;     -- e.g. "Bought a duplex in Lekki"
alter table public.reviews add column if not exists is_featured boolean not null default false;

create index if not exists reviews_featured_idx on public.reviews (is_featured) where is_featured;

-- NOTE: the insert policy stays `auth.uid() = user_id`. A NULL user_id makes that
-- check evaluate to NULL (not true), so logged-in users still can't post curated
-- rows — only the service/management role (which bypasses RLS) can seed them.

-- Public Google business linkage + aggregate badge (admin-managed).
alter table public.site_settings add column if not exists google_reviews_url text;
alter table public.site_settings add column if not exists google_rating numeric;
alter table public.site_settings add column if not exists google_review_count int;

-- Default the linkage to the business's real Google share link.
update public.site_settings
  set google_reviews_url = coalesce(google_reviews_url, 'https://share.google/yyQP9k2f1gIYZ7mms')
  where id = 1;
