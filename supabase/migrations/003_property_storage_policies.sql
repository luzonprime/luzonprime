-- Storage policies for the property-images bucket.
-- Upload path convention: property-images/{agent_id}/{property_id}/{filename}

create policy "property_images_public_read"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "property_images_agent_admin_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'property-images'
    and (
      public.current_role() = 'admin'
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

create policy "property_images_agent_admin_update"
  on storage.objects for update
  using (
    bucket_id = 'property-images'
    and (
      public.current_role() = 'admin'
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

create policy "property_images_agent_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'property-images'
    and (
      public.current_role() = 'admin'
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );
