-- Admin dashboard support: user suspension flag + site settings singleton.

alter table profiles add column if not exists suspended boolean not null default false;

create table if not exists site_settings (
  id              int primary key default 1,
  contact_email   text,
  contact_phone   text,
  office_address  text,
  facebook_url    text,
  instagram_url   text,
  twitter_url     text,
  linkedin_url    text,
  featured_areas  text[],
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

alter table site_settings enable row level security;

create policy "site_settings_select_anyone"
  on site_settings for select
  using (true);

create policy "site_settings_update_admin"
  on site_settings for update
  using (public.current_role() = 'admin');
