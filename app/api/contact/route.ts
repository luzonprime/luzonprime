import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/brevo";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  inquiry_type: z.enum(["purchase", "rent", "valuation", "general"]).default("general"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact data" }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("inquiries").insert({
    user_id: user?.id ?? null,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message,
    inquiry_type: data.inquiry_type,
  });

  if (error) {
    return NextResponse.json({ error: "Could not submit your message" }, { status: 500 });
  }

  await Promise.allSettled([
    sendEmail(data.email, "inquiry_confirmation", { name: data.name }),
    sendEmail("info@luzonprime.com", "admin_lead_alert", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
