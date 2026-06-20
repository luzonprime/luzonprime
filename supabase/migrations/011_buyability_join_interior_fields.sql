-- Buy-Ability: properties a user selected on a submission (one-to-many).
create table if not exists buy_ability_properties (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references buy_ability_submissions(id) on delete cascade,
  property_id   uuid not null references properties(id) on delete cascade,
  created_at    timestamptz default now(),
  unique (submission_id, property_id)
);

alter table buy_ability_properties enable row level security;
drop policy if exists "bap_select_admin" on buy_ability_properties;
drop policy if exists "bap_admin" on buy_ability_properties;
create policy "bap_select_admin" on buy_ability_properties for select
  using (public.current_role() = 'admin');
create policy "bap_admin" on buy_ability_properties for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

-- Interior: extra fields + multi-video support.
alter table shop_items add column if not exists materials text;
alter table shop_items add column if not exists dimensions text;
alter table shop_items add column if not exists videos text[] default '{}';
alter table interior_projects add column if not exists videos text[] default '{}';

-- Backfill existing shop items with material & dimension details.
update shop_items
set materials = coalesce(materials, 'Solid wood frame, brushed brass detailing & premium upholstery'),
    dimensions = coalesce(
      dimensions,
      E'Width: 90 cm | 35.4"\nDepth: 80 cm | 31.5"\nHeight: 75 cm | 29.5"'
    )
where materials is null or dimensions is null;
