-- Interior designs: single cover image for shop items + seed data.
alter table shop_items add column if not exists cover_image text;

insert into interior_projects (title, slug, category, location, year, description, cover_image, sort_order) values
  ('Ikoyi Penthouse Living','ikoyi-penthouse-living','Residential','Ikoyi, Lagos','2024','A warm, modern penthouse renovation blending natural textures with statement lighting and bespoke joinery.','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=70',1),
  ('Lekki Family Home','lekki-family-home','Residential','Lekki, Lagos','2023','A family-first interior with durable finishes, soft palettes, and clever storage throughout.','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=70',2),
  ('Victoria Island Workspace','victoria-island-workspace','Commercial','Victoria Island, Lagos','2024','A boutique office fit-out designed for focus and collaboration, with curated furniture and acoustic detailing.','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=70',3),
  ('Banana Island Villa','banana-island-villa','Luxury','Banana Island, Lagos','2022','A full villa interior — from concept to styling — defined by understated luxury and considered craft.','https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1400&q=70',4)
on conflict (slug) do nothing;

insert into shop_items (name, slug, item_type, description, price_label, is_new, cover_image, sort_order) values
  ('Antin Sideboard','antin-sideboard','Storage','A sculptural burl-wood sideboard with brushed-brass banding — a true statement piece.','Price on request',true,'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1000&q=70',1),
  ('Velvet Lounge Chair','velvet-lounge-chair','Armchairs','A deep-seated velvet lounge chair with a blackened-steel frame for timeless comfort.','Price on request',true,'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=70',2),
  ('Halo Pendant Light','halo-pendant-light','Lighting','A brushed-brass ring pendant that casts a soft, even glow over dining and lounge spaces.','Price on request',false,'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=70',3),
  ('Modular Sofa','modular-sofa','Sofas','A low, modular sofa upholstered in boucle — endlessly configurable for any living space.','Price on request',false,'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=70',4),
  ('Oak Dining Table','oak-dining-table','Tables','A solid-oak dining table with a hand-finished top and tapered legs, seats up to eight.','Price on request',true,'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1000&q=70',5),
  ('Travertine Coffee Table','travertine-coffee-table','Tables','A monolithic travertine coffee table — quietly luxurious and built to last.','Price on request',false,'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=70',6)
on conflict (slug) do nothing;
