-- Allow upsert-by-email on subscribers (newsletter resubscribe) for anonymous/public users.
create policy "subscribers_update_anyone"
  on subscribers for update
  using (true)
  with check (true);
