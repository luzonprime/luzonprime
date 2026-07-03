-- Partners: brands & companies Luzon Prime works with.
-- Admin-managed (CRUD). Logos vary in size and baked-in background colour,
-- so each row carries an optional bg_color used to blend the logo tile.

create table if not exists partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  website_url text,
  bg_color    text,               -- hex tile background (blends logo); null → white
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

alter table partners enable row level security;

drop policy if exists "partners_select_all" on partners;
drop policy if exists "partners_admin_write" on partners;
create policy "partners_select_all" on partners for select using (true);
create policy "partners_admin_write" on partners for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
