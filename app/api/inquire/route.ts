import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/brevo";

const inquireSchema = z.object({
  property_id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  inquiry_type: z.enum(["purchase", "rent", "valuation", "general"]).default("general"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquireSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid inquiry data" }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let propertyTitle: string | undefined;
  let assignedAgentEmail: string | undefined;
  let assignedAgentId: string | null = null;

  if (data.property_id) {
    const admin = createAdminClient();
    const { data: property } = await admin
      .from("properties")
      .select("title, agent_id")
      .eq("id", data.property_id)
      .single();

    if (property) {
      propertyTitle = property.title;
      assignedAgentId = property.agent_id;

      if (property.agent_id) {
        const { data: agentProfile } = await admin
          .from("profiles")
          .select("full_name")
          .eq("id", property.agent_id)
          .single();

        const { data: agentAuth } = await admin.auth.admin.getUserById(property.agent_id);
        assignedAgentEmail = agentAuth?.user?.email ?? undefined;
        void agentProfile;
      }
    }
  }

  const { error } = await supabase.from("inquiries").insert({
    property_id: data.property_id ?? null,
    user_id: user?.id ?? null,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message ?? null,
    inquiry_type: data.inquiry_type,
    assigned_agent: assignedAgentId,
  });

  if (error) {
    return NextResponse.json({ error: "Could not submit inquiry" }, { status: 500 });
  }

  await Promise.allSettled([
    sendEmail(data.email, "inquiry_confirmation", { name: data.name, propertyTitle }),
    sendEmail("info@luzonprime.com", "admin_lead_alert", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      propertyTitle,
    }),
    assignedAgentEmail
      ? sendEmail(assignedAgentEmail, "admin_lead_alert", {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          propertyTitle,
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true });
}
