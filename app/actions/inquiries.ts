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
  if (profile?.role !== "admin") throw new Error("Only admins can manage inquiries.");
}

export async function assignInquiry(inquiryId: string, agentId: string | null) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("inquiries").update({ assigned_agent: agentId }).eq("id", inquiryId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
}

export async function updateInquiryStatus(inquiryId: string, status: "new" | "contacted" | "closed") {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("inquiries").update({ status }).eq("id", inquiryId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
}
