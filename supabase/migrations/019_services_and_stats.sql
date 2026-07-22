-- Admin-managed Services (shown on /services) and Stats (homepage StatsBar).

create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  icon        text,               -- lucide icon key (see SERVICE_ICONS map)
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

create table if not exists stats (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  value       numeric not null default 0,
  suffix      text,               -- e.g. "+", "%"
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

alter table services enable row level security;
alter table stats enable row level security;

drop policy if exists "services_select_all" on services;
drop policy if exists "services_admin_write" on services;
create policy "services_select_all" on services for select using (true);
create policy "services_admin_write" on services for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

drop policy if exists "stats_select_all" on stats;
drop policy if exists "stats_admin_write" on stats;
create policy "stats_select_all" on stats for select using (true);
create policy "stats_admin_write" on stats for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
