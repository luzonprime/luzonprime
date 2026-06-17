-- Enforce that only admins can change is_published / is_featured,
-- even if an agent updates other columns on their own property row.
create or replace function public.enforce_property_publish_guard()
returns trigger
language plpgsql
security definer
as $$
begin
  if public.current_role() <> 'admin' then
    new.is_published := old.is_published;
    new.is_featured := old.is_featured;
  end if;
  return new;
end;
$$;

create trigger property_publish_guard
  before update on properties
  for each row
  execute function public.enforce_property_publish_guard();
