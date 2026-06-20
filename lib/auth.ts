import { createClient } from "@/lib/supabase/server";

export type DashboardUser = {
  email: string | null;
  fullName: string | null;
  role: string | null;
  avatarUrl: string | null;
};

/** Server-side profile for dashboard chrome (reliable source of truth). */
export async function getDashboardUser(): Promise<DashboardUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("full_name, role, avatar_url")
    .eq("id", user.id)
    .single();
  const profile = data as
    | { full_name: string | null; role: string | null; avatar_url: string | null }
    | null;

  return {
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    role: profile?.role ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };
}
