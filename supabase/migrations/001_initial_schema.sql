-- Luzon Prime Realtors initial schema (CLAUDE.md Section 5)

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

-- =========================================================
-- RLS
-- =========================================================

alter table profiles enable row level security;
alter table properties enable row level security;
alter table inquiries enable row level security;
alter table subscribers enable row level security;
alter table bookings enable row level security;
alter table posts enable row level security;

-- helper: current user's role
create or replace function public.current_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- profiles policies
create policy "profiles_select_own_or_admin"
  on profiles for select
  using (id = auth.uid() or public.current_role() = 'admin');

create policy "profiles_insert_own"
  on profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own_or_admin"
  on profiles for update
  using (id = auth.uid() or public.current_role() = 'admin');

-- properties policies
create policy "properties_select_published_or_owner_or_admin"
  on properties for select
  using (
    is_published = true
    or agent_id = auth.uid()
    or public.current_role() = 'admin'
  );

create policy "properties_insert_agent_or_admin"
  on properties for insert
  with check (
    agent_id = auth.uid() and public.current_role() in ('agent','admin')
  );

create policy "properties_update_owner_or_admin"
  on properties for update
  using (agent_id = auth.uid() or public.current_role() = 'admin');

create policy "properties_delete_owner_or_admin"
  on properties for delete
  using (agent_id = auth.uid() or public.current_role() = 'admin');

-- inquiries policies
create policy "inquiries_insert_anyone"
  on inquiries for insert
  with check (true);

create policy "inquiries_select_admin_agent_or_owner"
  on inquiries for select
  using (
    public.current_role() = 'admin'
    or assigned_agent = auth.uid()
    or user_id = auth.uid()
  );

create policy "inquiries_update_admin_or_assigned_agent"
  on inquiries for update
  using (public.current_role() = 'admin' or assigned_agent = auth.uid());

-- subscribers policies
create policy "subscribers_insert_anyone"
  on subscribers for insert
  with check (true);

create policy "subscribers_select_admin"
  on subscribers for select
  using (public.current_role() = 'admin');

-- bookings policies
create policy "bookings_insert_own"
  on bookings for insert
  with check (user_id = auth.uid());

create policy "bookings_select_admin_agent_or_owner"
  on bookings for select
  using (
    public.current_role() = 'admin'
    or agent_id = auth.uid()
    or user_id = auth.uid()
  );

create policy "bookings_update_admin_or_agent"
  on bookings for update
  using (public.current_role() = 'admin' or agent_id = auth.uid());

-- posts policies
create policy "posts_select_published_or_author_or_admin"
  on posts for select
  using (
    published = true
    or author_id = auth.uid()
    or public.current_role() = 'admin'
  );

create policy "posts_insert_admin"
  on posts for insert
  with check (public.current_role() = 'admin');

create policy "posts_update_admin_or_author"
  on posts for update
  using (public.current_role() = 'admin' or author_id = auth.uid());

create policy "posts_delete_admin"
  on posts for delete
  using (public.current_role() = 'admin');
