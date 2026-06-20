import { createClient } from "@/lib/supabase/server";
import { BuyAbilityManager, type SelectedProperty } from "@/components/dashboard/BuyAbilityManager";
import type { BuyAbilitySubmission, Property } from "@/types";

export default async function AdminBuyAbilityPage() {
  const supabase = await createClient();

  const [{ data: subs }, { data: properties }, { data: links }] = await Promise.all([
    supabase.from("buy_ability_submissions").select("*").order("created_at", { ascending: false }),
    supabase.from("properties").select("id, title, images"),
    supabase.from("buy_ability_properties").select("submission_id, property_id"),
  ]);

  const propMap = Object.fromEntries(
    ((properties ?? []) as Pick<Property, "id" | "title" | "images">[]).map((p) => [p.id, p])
  );
  const propertyTitles = Object.fromEntries(
    Object.values(propMap).map((p) => [p.id, p.title])
  );

  const selections: Record<string, SelectedProperty[]> = {};
  for (const l of (links ?? []) as { submission_id: string; property_id: string }[]) {
    const p = propMap[l.property_id];
    if (!p) continue;
    (selections[l.submission_id] ??= []).push({
      id: p.id,
      title: p.title,
      image: p.images?.[0] ?? null,
    });
  }

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        Buy-Ability requests with the homes each person selected. Respond by email
        (sent from info@luzonprime.com).
      </p>
      <BuyAbilityManager
        submissions={(subs ?? []) as BuyAbilitySubmission[]}
        propertyTitles={propertyTitles}
        selections={selections}
      />
    </div>
  );
}
