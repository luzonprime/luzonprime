-- Client favourites (saved listings)
create table if not exists public.favourites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at  timestamptz default now(),
  unique (user_id, property_id)
);

alter table public.favourites enable row level security;

drop policy if exists "favourites_select_own" on public.favourites;
create policy "favourites_select_own" on public.favourites
  for select using (auth.uid() = user_id);

drop policy if exists "favourites_insert_own" on public.favourites;
create policy "favourites_insert_own" on public.favourites
  for insert with check (auth.uid() = user_id);

drop policy if exists "favourites_delete_own" on public.favourites;
create policy "favourites_delete_own" on public.favourites
  for delete using (auth.uid() = user_id);
