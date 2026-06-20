"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCustomEmail } from "@/lib/brevo";
import { estimateBudget } from "@/lib/buyability";
import type { Property } from "@/types";

export interface SubmitBuyAbilityInput {
  property_id?: string | null;
  email: string;
  location?: string | null;
  credit_score?: string | null;
  annual_income?: number | null;
  down_payment?: number | null;
  monthly_debt?: number | null;
}

export async function submitBuyAbility(input: SubmitBuyAbilityInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = (input.email || "").trim();
  if (!email) throw new Error("An email address is required.");

  const budget = estimateBudget(input);
  const admin = createAdminClient();

  await admin.from("buy_ability_submissions").insert({
    user_id: user?.id ?? null,
    property_id: input.property_id ?? null,
    email,
    location: input.location ?? null,
    credit_score: input.credit_score ?? null,
    annual_income: input.annual_income ?? null,
    down_payment: input.down_payment ?? null,
    monthly_debt: input.monthly_debt ?? null,
  });

  // Match buy-ability properties within ±10% of the estimated budget.
  let q = admin
    .from("properties")
    .select("*")
    .eq("is_published", true)
    .eq("buy_ability", true);
  if (budget > 0) {
    q = q.gte("price", Math.round(budget * 0.9)).lte("price", Math.round(budget * 1.1));
  }
  if (input.location) {
    const loc = input.location.replace(/[%,]/g, "");
    q = q.or(`location.ilike.%${loc}%,area.ilike.%${loc}%,city.ilike.%${loc}%`);
  }
  const { data: matches } = await q.order("price", { ascending: true }).limit(6);

  // Acknowledge the user + notify the team (best-effort).
  try {
    await sendCustomEmail({
      to: email,
      from: "info@luzonprime.com",
      subject: "Your Buy-Ability estimate",
      bodyHtml: `<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">Thanks for using Buy-Ability. Based on what you shared, your estimated budget is <strong>&#8358;${budget.toLocaleString()}</strong>. Our team will be in touch with tailored options shortly.</p>`,
    });
  } catch {
    // ignore email failures
  }
  try {
    await sendCustomEmail({
      to: "info@luzonprime.com",
      from: "info@luzonprime.com",
      subject: "New Buy-Ability request",
      bodyHtml: `<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">New Buy-Ability request from <strong>${email}</strong> — estimated budget &#8358;${budget.toLocaleString()}, location: ${input.location || "—"}.</p>`,
    });
  } catch {
    // ignore
  }

  revalidatePath("/admin/buy-ability");
  return { budget, matches: (matches ?? []) as Property[] };
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Only admins can do this.");
}

export async function respondBuyAbility(id: string, to: string, message: string) {
  await requireAdmin();
  await sendCustomEmail({
    to,
    from: "info@luzonprime.com",
    subject: "Your Buy-Ability enquiry — Luzon Prime Realtors",
    bodyHtml: `<p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">${message.replace(/\n/g, "<br/>")}</p>`,
  });
  const admin = createAdminClient();
  await admin
    .from("buy_ability_submissions")
    .update({ status: "contacted", admin_notes: message })
    .eq("id", id);
  revalidatePath("/admin/buy-ability");
}

export async function updateBuyAbilityStatus(id: string, status: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("buy_ability_submissions").update({ status }).eq("id", id);
  revalidatePath("/admin/buy-ability");
}

export async function deleteBuyAbilitySubmission(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("buy_ability_submissions").delete().eq("id", id);
  revalidatePath("/admin/buy-ability");
}
