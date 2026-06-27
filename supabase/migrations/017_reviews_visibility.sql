-- Admin moderation: hide reviews from the public without deleting them.

alter table public.reviews add column if not exists is_hidden boolean not null default false;

-- Hidden reviews are invisible to the public but still visible to admins.
drop policy if exists "reviews_select_anyone" on public.reviews;
create policy "reviews_select_visible_or_admin" on public.reviews
  for select using (is_hidden = false or public.current_role() = 'admin');
