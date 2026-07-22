import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminStatsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("stats").select("*").order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        The animated counters shown on the homepage. Suffix is optional (e.g.{" "}
        <span className="font-medium text-[var(--color-text)]">+</span> or{" "}
        <span className="font-medium text-[var(--color-text)]">%</span>). Lower sort
        orders show first.
      </p>
      <CrudManager
        table="stats"
        rows={(data ?? []) as CrudRow[]}
        primaryField="label"
        addLabel="Add stat"
        searchPlaceholder="Search stats…"
        detailFields={[
          { name: "value", label: "Value" },
          { name: "suffix", label: "Suffix" },
        ]}
        fields={[
          { name: "label", label: "Label", placeholder: "e.g. Properties listed" },
          { name: "value", label: "Value", type: "number", placeholder: "100" },
          { name: "suffix", label: "Suffix", placeholder: "+  or  %  (optional)" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_active", label: "Active", type: "checkbox" },
        ]}
      />
    </div>
  );
}
