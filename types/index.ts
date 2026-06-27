export type UserRole = "client" | "agent" | "admin";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  verified: boolean;
  created_at: string;
}

export type ListingType = "for_sale" | "for_rent" | "off_plan";
export type PropertyStatus = "available" | "sold" | "rented";

export interface Property {
  id: string;
  agent_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  property_type: string | null;
  listing_type: ListingType | null;
  status: PropertyStatus;
  price: number | null;
  price_label: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  location: string | null;
  area: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  features: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  images: string[] | null;
  video_url: string | null;
  virtual_tour_url: string | null;
  videos: string[] | null;
  virtual_tours: string[] | null;
  buy_ability: boolean;
  buy_ability_percent: number | null;
  created_at: string;
  updated_at: string;
  agent?: Profile | null;
}

export interface Category {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BuyAbilitySubmission {
  id: string;
  user_id: string | null;
  property_id: string | null;
  email: string;
  location: string | null;
  credit_score: string | null;
  annual_income: number | null;
  down_payment: number | null;
  monthly_debt: number | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export interface InteriorProject {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  location: string | null;
  year: string | null;
  description: string | null;
  cover_image: string | null;
  images: string[] | null;
  videos: string[] | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  slug: string;
  item_type: string | null;
  description: string | null;
  price: number | null;
  price_label: string | null;
  is_new: boolean;
  cover_image: string | null;
  images: string[] | null;
  videos: string[] | null;
  materials: string | null;
  dimensions: string | null;
  project_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export type TaxonomyKind = "property_type" | "listing_type" | "status";

export interface TaxonomyTerm {
  id: string;
  kind: TaxonomyKind;
  slug: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  grp: "popular" | "inline" | "more";
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Award {
  id: string;
  year: string | null;
  title: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Member {
  id: string;
  name: string;
  title: string | null;
  image_url: string | null;
  about: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  property_id: string | null;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  inquiry_type: string | null;
  status: "new" | "contacted" | "closed";
  assigned_agent: string | null;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: "active" | "unsubscribed";
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string | null;
  agent_id: string | null;
  property_id: string | null;
  scheduled_at: string;
  status: "pending" | "confirmed" | "cancelled";
  notes: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  content: string | null;
  cover_image: string | null;
  published: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  parent_id: string | null;
  user_id: string;
  author_name: string | null;
  author_avatar: string | null;
  rating: number | null;
  body: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  contact_email: string | null;
  contact_phone: string | null;
  office_address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  featured_areas: string[] | null;
}
