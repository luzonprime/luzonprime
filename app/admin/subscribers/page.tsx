import { createClient } from "@/lib/supabase/server";
import { SubscribersDataTable } from "@/components/dashboard/SubscribersDataTable";
import type { Subscriber } from "@/types";

export default async function AdminSubscribersPage() {
  const supabase = await createClient();
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        {(subscribers ?? []).length} newsletter subscriber{(subscribers ?? []).length === 1 ? "" : "s"}.
      </p>
      <SubscribersDataTable subscribers={(subscribers ?? []) as Subscriber[]} />
    </div>
  );
}
