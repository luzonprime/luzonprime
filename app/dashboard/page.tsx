import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Role-aware dashboard entry — avoids any client-side race resolving the link.
export default async function DashboardRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = (profile as { role?: string } | null)?.role;

  redirect(role === "admin" ? "/admin" : role === "agent" ? "/agent" : "/client");
}
