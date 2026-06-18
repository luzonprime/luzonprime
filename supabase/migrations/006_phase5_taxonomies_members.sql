-- Phase 5: admin-managed taxonomies, nav, awards, members; property media; avatars bucket.

-- ---------- Tables ----------
create table if not exists taxonomy_terms (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('property_type','listing_type','status')),
  slug        text not null,
  label       text not null,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now(),
  unique (kind, slug)
);

create table if not exists nav_items (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  href        text not null,
  grp         text not null default 'inline' check (grp in ('popular','inline','more')),
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

create table if not exists awards (
  id          uuid primary key default gen_random_uuid(),
  year        text,
  title       text not null,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

create table if not exists members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  title       text,
  image_url   text,
  about       text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

-- ---------- Property media (multiple videos + virtual tours) ----------
alter table properties add column if not exists videos text[] default '{}';
alter table properties add column if not exists virtual_tours text[] default '{}';

-- ---------- RLS ----------
alter table taxonomy_terms enable row level security;
alter table nav_items enable row level security;
alter table awards enable row level security;
alter table members enable row level security;

drop policy if exists "taxonomy_select_all" on taxonomy_terms;
drop policy if exists "taxonomy_admin_write" on taxonomy_terms;
create policy "taxonomy_select_all" on taxonomy_terms for select using (true);
create policy "taxonomy_admin_write" on taxonomy_terms for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

drop policy if exists "nav_select_all" on nav_items;
drop policy if exists "nav_admin_write" on nav_items;
create policy "nav_select_all" on nav_items for select using (true);
create policy "nav_admin_write" on nav_items for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

drop policy if exists "awards_select_all" on awards;
drop policy if exists "awards_admin_write" on awards;
create policy "awards_select_all" on awards for select using (true);
create policy "awards_admin_write" on awards for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

drop policy if exists "members_select_all" on members;
drop policy if exists "members_admin_write" on members;
create policy "members_select_all" on members for select using (true);
create policy "members_admin_write" on members for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

-- ---------- Avatars storage bucket ----------
insert into storage.buckets (id, name, public)
  values ('avatars','avatars',true)
  on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_owner_write" on storage.objects;
drop policy if exists "avatars_owner_update" on storage.objects;
drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_owner_write" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_update" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_delete" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
