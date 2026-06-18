import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "@/components/dashboard/SiteSettingsForm";
import type { SiteSettings } from "@/types";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        Site-wide contact info and social links used across the public pages.
      </p>
      <SiteSettingsForm settings={(settings as SiteSettings) ?? { id: 1, contact_email: null, contact_phone: null, office_address: null, facebook_url: null, instagram_url: null, twitter_url: null, linkedin_url: null, featured_areas: [] }} />
    </div>
  );
}
