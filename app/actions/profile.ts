"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateOwnProfile(input: {
  full_name: string;
  phone: string | null;
  bio: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to update your profile.");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.full_name.trim() || null,
      phone: input.phone?.trim() || null,
      bio: input.bio?.trim() || null,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/client/settings");
  revalidatePath("/agent/settings");
  revalidatePath("/admin/settings");
}
