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

  return profile ? <AccountSettings profile={profile} /> : null;
}
