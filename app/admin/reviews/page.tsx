import { createClient } from "@/lib/supabase/server";
import { AdminReviewsManager } from "@/components/dashboard/AdminReviewsManager";
import type { Review } from "@/types";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  // Admins bypass the visibility filter via RLS, so this returns hidden rows too.
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const reviews = (data ?? []) as Review[];
  const topLevel = reviews.filter((r) => !r.parent_id).length;

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        {topLevel} review{topLevel === 1 ? "" : "s"}. Reply, edit, feature on the
        home page, hide from the public, or delete. Replies you post here also
        appear on the public reviews page.
      </p>
      <AdminReviewsManager reviews={reviews} />
    </div>
  );
}
