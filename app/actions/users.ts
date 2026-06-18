"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to do this.");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Only admins can manage users.");
}

export async function setUserSuspended(userId: string, suspended: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ suspended }).eq("id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
  revalidatePath("/admin/agents");
}

export async function setAgentVerified(userId: string, verified: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ verified }).eq("id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
  revalidatePath("/admin/agents");
}
