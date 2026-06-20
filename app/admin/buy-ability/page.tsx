import { createClient } from "@/lib/supabase/server";
import { BuyAbilityManager } from "@/components/dashboard/BuyAbilityManager";
import type { BuyAbilitySubmission, Property } from "@/types";

export default async function AdminBuyAbilityPage() {
  const supabase = await createClient();

  const [{ data: subs }, { data: properties }] = await Promise.all([
    supabase.from("buy_ability_submissions").select("*").order("created_at", { ascending: false }),
    supabase.from("properties").select("id, title"),
  ]);

  const propertyTitles = Object.fromEntries(
    ((properties ?? []) as Pick<Property, "id" | "title">[]).map((p) => [p.id, p.title])
  );

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        Buy-Ability requests from the public and signed-in users. Respond by email
        (sent from info@luzonprime.com).
      </p>
      <BuyAbilityManager
        submissions={(subs ?? []) as BuyAbilitySubmission[]}
        propertyTitles={propertyTitles}
      />
    </div>
  );
}
