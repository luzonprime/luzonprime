-- Award badge image (uploaded to storage, shown in the homepage hero).
alter table awards add column if not exists image_url text;
