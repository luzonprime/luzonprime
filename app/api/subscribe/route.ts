import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/brevo";

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email, name } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email, name }, { onConflict: "email" });

  if (error) {
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }

  try {
    await sendEmail(email, "welcome_email", { name });
  } catch {
    // subscription succeeded even if the welcome email fails to send
  }

  return NextResponse.json({ ok: true });
}
