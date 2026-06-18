import { createClient } from "@/lib/supabase/server";
import { AccountSettings } from "@/components/dashboard/AccountSettings";
import type { Profile } from "@/types";

export default async function AgentSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null };
  const profile = data as Profile | null;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">Settings</h1>
      <p className="mb-6 mt-1 text-sm text-[var(--color-text-muted)]">
        Manage your profile and preferences.
      </p>
      {profile && <AccountSettings profile={profile} />}
    </div>
  );
}
