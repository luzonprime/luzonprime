import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "@/components/dashboard/SiteSettingsForm";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import type { Profile, SiteSettings } from "@/types";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: settings }, { data: profileData }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    user
      ? supabase.from("profiles").select("*").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
  ]);
  const profile = profileData as Profile | null;

  return (
    <div className="flex flex-col gap-8">
      {profile && <AccountSettings profile={profile} />}

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Site settings</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--color-text-muted)]">
          Contact info and social links used across the public pages.
        </p>
        <SiteSettingsForm
          settings={
            (settings as SiteSettings) ?? {
              id: 1,
              contact_email: null,
              contact_phone: null,
              office_address: null,
              facebook_url: null,
              instagram_url: null,
              twitter_url: null,
              linkedin_url: null,
              featured_areas: [],
              google_reviews_url: null,
              google_rating: null,
              google_review_count: null,
            }
          }
        />
      </section>
    </div>
  );
}
