-- Ensure every auth user gets a profile (signup runs before a session exists,
-- so the client-side upsert is blocked by RLS — create it via a trigger instead).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'role', ''), 'client'),
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any existing users without a profile.
insert into public.profiles (id, role, full_name)
select u.id,
       coalesce(nullif(u.raw_user_meta_data->>'role', ''), 'client'),
       u.raw_user_meta_data->>'full_name'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
