-- Public reviews / testimonials with multi-nested threaded comments.
--
-- Anyone can READ reviews (public page). Only authenticated users can post,
-- and only as themselves. Author name/avatar are denormalised onto each row
-- because the profiles table is NOT publicly readable (see 001_initial_schema:
-- profiles_select_own_or_admin), so a public join on profiles would return
-- nothing for other users.

create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid references public.reviews(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  author_name   text,
  author_avatar text,
  rating        int check (rating between 1 and 5),  -- top-level reviews only; null for replies
  body          text not null,
  created_at    timestamptz default now()
);

create index if not exists reviews_parent_id_idx on public.reviews (parent_id);
create index if not exists reviews_created_at_idx on public.reviews (created_at);

alter table public.reviews enable row level security;

-- Public read.
drop policy if exists "reviews_select_anyone" on public.reviews;
create policy "reviews_select_anyone" on public.reviews
  for select using (true);

-- Logged-in users can post, only as themselves.
drop policy if exists "reviews_insert_authenticated" on public.reviews;
create policy "reviews_insert_authenticated" on public.reviews
  for insert with check (auth.uid() = user_id);

-- Authors can edit their own; admins can edit any (e.g. moderation).
drop policy if exists "reviews_update_own_or_admin" on public.reviews;
create policy "reviews_update_own_or_admin" on public.reviews
  for update using (auth.uid() = user_id or public.current_role() = 'admin');

-- Authors can delete their own; admins can remove any.
drop policy if exists "reviews_delete_own_or_admin" on public.reviews;
create policy "reviews_delete_own_or_admin" on public.reviews
  for delete using (auth.uid() = user_id or public.current_role() = 'admin');
