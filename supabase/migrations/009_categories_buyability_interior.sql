-- Phase 6: admin-managed categories, buy-ability, interior designs module.

-- Admin-managed landing "Categorization" tiles.
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  image_url   text,
  link        text not null default '/listings',
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

-- Property buy-ability flag (admin-only toggle).
alter table properties add column if not exists buy_ability boolean not null default false;

-- Buy-ability submissions from the public / signed-in users.
create table if not exists buy_ability_submissions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references profiles(id),
  property_id    uuid references properties(id),
  email          text not null,
  location       text,
  credit_score   text,
  annual_income  numeric,
  down_payment   numeric,
  monthly_debt   numeric,
  status         text not null default 'new',
  admin_notes    text,
  created_at     timestamptz default now()
);

-- Interior design portfolio projects.
create table if not exists interior_projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  category     text,
  location     text,
  year         text,
  description  text,
  cover_image  text,
  images       text[] default '{}',
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz default now()
);

-- Interior shop items.
create table if not exists shop_items (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  item_type    text,
  description  text,
  price        numeric,
  price_label  text,
  is_new       boolean not null default false,
  images       text[] default '{}',
  project_id   uuid references interior_projects(id),
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz default now()
);

-- RLS
alter table categories enable row level security;
alter table buy_ability_submissions enable row level security;
alter table interior_projects enable row level security;
alter table shop_items enable row level security;

drop policy if exists "categories_select_all" on categories;
drop policy if exists "categories_admin_write" on categories;
create policy "categories_select_all" on categories for select using (true);
create policy "categories_admin_write" on categories for all using (public.current_role()='admin') with check (public.current_role()='admin');

drop policy if exists "interior_select_all" on interior_projects;
drop policy if exists "interior_admin_write" on interior_projects;
create policy "interior_select_all" on interior_projects for select using (true);
create policy "interior_admin_write" on interior_projects for all using (public.current_role()='admin') with check (public.current_role()='admin');

drop policy if exists "shop_select_all" on shop_items;
drop policy if exists "shop_admin_write" on shop_items;
create policy "shop_select_all" on shop_items for select using (true);
create policy "shop_admin_write" on shop_items for all using (public.current_role()='admin') with check (public.current_role()='admin');

drop policy if exists "buyability_insert_all" on buy_ability_submissions;
drop policy if exists "buyability_select" on buy_ability_submissions;
drop policy if exists "buyability_update_admin" on buy_ability_submissions;
drop policy if exists "buyability_delete_admin" on buy_ability_submissions;
create policy "buyability_insert_all" on buy_ability_submissions for insert with check (true);
create policy "buyability_select" on buy_ability_submissions for select using (public.current_role()='admin' or user_id = auth.uid());
create policy "buyability_update_admin" on buy_ability_submissions for update using (public.current_role()='admin');
create policy "buyability_delete_admin" on buy_ability_submissions for delete using (public.current_role()='admin');

-- Seed: new "Shoplet" listing type + category tiles.
insert into taxonomy_terms (kind, slug, label, sort_order)
  values ('listing_type','shoplet','Shoplet',4)
  on conflict (kind, slug) do nothing;

insert into categories (title, description, image_url, link, sort_order) values
  ('Top Rentals of the Week','The finest rental homes, curated weekly.','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=70','/listings?listing_type=for_rent',1),
  ('Off-Plan Properties','Buy early. Build wealth before completion.','https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=70','/listings?listing_type=off_plan',2),
  ('Commercial Spaces','Grade A commercial assets in prime districts.','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=70','/listings?property_type=commercial',3),
  ('Shoplet','Curated home & interior pieces for every space.','https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=70','/listings?listing_type=shoplet',4)
on conflict do nothing;
