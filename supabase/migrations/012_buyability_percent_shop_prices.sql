-- Buy-Ability eligible percentage of the property price (admin-set).
alter table properties add column if not exists buy_ability_percent numeric;

-- Real shop prices (base NGN) so multi-currency display works; clear "Price on request".
update shop_items set price = case slug
  when 'antin-sideboard' then 4500000
  when 'velvet-lounge-chair' then 850000
  when 'halo-pendant-light' then 650000
  when 'modular-sofa' then 3200000
  when 'oak-dining-table' then 1800000
  when 'travertine-coffee-table' then 1200000
  when 'collins-dining-chair' then 480000
  when 'arc-floor-lamp' then 720000
  when 'boucle-accent-sofa' then 2400000
  else price end,
  price_label = null
where slug in (
  'antin-sideboard','velvet-lounge-chair','halo-pendant-light','modular-sofa',
  'oak-dining-table','travertine-coffee-table','collins-dining-chair',
  'arc-floor-lamp','boucle-accent-sofa'
);

-- Extra items so every type has at least two (related products work everywhere).
insert into shop_items (name, slug, item_type, description, materials, dimensions, price, is_new, cover_image, sort_order, is_published) values
  ('Walnut Console Table','walnut-console-table','Tables','A slim walnut console with brass inlay, ideal for hallways and entryways.','Solid walnut & brass inlay',E'Width: 120 cm | 47.2"\nDepth: 35 cm | 13.8"\nHeight: 78 cm | 30.7"',1350000,false,'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=70',10,true),
  ('Linen Wingback Chair','linen-wingback-chair','Armchairs','A classic wingback reimagined in natural linen with a blackened-oak frame.','Linen upholstery, blackened oak',E'Width: 80 cm | 31.5"\nDepth: 85 cm | 33.4"\nHeight: 105 cm | 41.3"',980000,true,'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=70',11,true),
  ('Cane Storage Cabinet','cane-storage-cabinet','Storage','A two-door cabinet with woven cane fronts and soft-close hinges.','Oak veneer & natural cane',E'Width: 110 cm | 43.3"\nDepth: 45 cm | 17.7"\nHeight: 80 cm | 31.5"',2100000,false,'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=1000&q=70',12,true),
  ('Sculpted Side Chair','sculpted-side-chair','Chairs','A sculptural side chair with a curved back and tactile boucle seat.','Ash frame & boucle',E'Width: 52 cm | 20.5"\nDepth: 55 cm | 21.7"\nHeight: 80 cm | 31.5"',420000,false,'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=70',13,true)
on conflict (slug) do nothing;
