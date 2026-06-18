-- Phase 5 seed data: taxonomies, nav, awards, members.

insert into taxonomy_terms (kind, slug, label, sort_order) values
  ('property_type','apartment','Apartment',1),
  ('property_type','duplex','Duplex',2),
  ('property_type','detached','Detached House',3),
  ('property_type','terrace','Terrace',4),
  ('property_type','bungalow','Bungalow',5),
  ('property_type','land','Land',6),
  ('property_type','commercial','Commercial',7),
  ('listing_type','for_sale','For Sale',1),
  ('listing_type','for_rent','For Rent',2),
  ('listing_type','off_plan','Off-Plan',3),
  ('status','available','Available',1),
  ('status','sold','Sold',2),
  ('status','rented','Rented',3)
on conflict (kind, slug) do nothing;

insert into nav_items (label, href, grp, sort_order) values
  ('Listings','/listings','popular',0),
  ('Agents','/agents','inline',1),
  ('Services','/services','inline',2),
  ('About','/about','more',3),
  ('Members','/members','more',4),
  ('Blog','/blog','more',5),
  ('Contact','/contact','more',6);

insert into awards (year, title, sort_order) values
  ('2020','Africa''s Most Innovative Real Estate Firm',0),
  ('2020','Real Estate Newcomer of the Year',1),
  ('22/23','African Property Awards — Winner',2),
  ('2025','Luxury Lifestyle Award — Winner',3);

insert into members (name, title, image_url, about, sort_order) values
  ('Adaeze Okoro','Head of Luxury Sales','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=70','Adaeze brings deep expertise in luxury and commercial property, known for a client-focused approach and sharp negotiation skills.',0),
  ('Daniel Mensah','Investment Advisor','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=70','Daniel guides investors through high-yield opportunities across multiple markets with data-backed advice and a long-term mindset.',1),
  ('Sofia Almeida','Off-Plan Specialist','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=70','Sofia specialises in off-plan developments, helping clients build wealth before completion across emerging neighbourhoods.',2),
  ('James Carter','Commercial Lead','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=70','James leads our commercial division, advising businesses on Grade A spaces and investment assets in prime districts.',3);
