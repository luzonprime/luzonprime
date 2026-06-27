"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  return trimmed === "" ? null : trimmed;
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to do this.");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Only admins can update site settings.");

  const featuredAreasRaw = str(formData, "featured_areas");
  const featured_areas = featuredAreasRaw
    ? featuredAreasRaw.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  const ratingRaw = str(formData, "google_rating");
  const countRaw = str(formData, "google_review_count");
  const google_rating = ratingRaw ? Number(ratingRaw) : null;
  const google_review_count = countRaw ? Number(countRaw) : null;

  const { error } = await supabase
    .from("site_settings")
    .update({
      contact_email: str(formData, "contact_email"),
      contact_phone: str(formData, "contact_phone"),
      office_address: str(formData, "office_address"),
      facebook_url: str(formData, "facebook_url"),
      instagram_url: str(formData, "instagram_url"),
      twitter_url: str(formData, "twitter_url"),
      linkedin_url: str(formData, "linkedin_url"),
      featured_areas,
      google_reviews_url: str(formData, "google_reviews_url"),
      google_rating: Number.isFinite(google_rating as number) ? google_rating : null,
      google_review_count: Number.isInteger(google_review_count as number)
        ? google_review_count
        : null,
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
}
