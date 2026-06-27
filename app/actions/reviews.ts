"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_BODY = 2000;

export async function createReview(input: {
  body: string;
  rating?: number | null;
  parentId?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to post a review.");

  const body = input.body?.trim();
  if (!body) throw new Error("Your review can’t be empty.");
  if (body.length > MAX_BODY) throw new Error("Your review is too long.");

  const isReply = Boolean(input.parentId);
  // Ratings only apply to top-level reviews; replies are plain comments.
  const rating =
    !isReply && input.rating
      ? Math.min(5, Math.max(1, Math.round(input.rating)))
      : null;

  // Snapshot the author's display info onto the row — profiles aren't publicly
  // readable, so the public page can't join them back later.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    parent_id: input.parentId ?? null,
    author_name: profile?.full_name ?? null,
    author_avatar: profile?.avatar_url ?? null,
    rating,
    body,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/reviews");
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to do this.");

  // RLS enforces own-or-admin; this only deletes rows the user is allowed to.
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/reviews");
}
