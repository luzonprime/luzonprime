import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminAwardsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("awards").select("*").order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        The lowest 4 sort orders (active) are featured in the homepage hero.
      </p>
      <CrudManager
        table="awards"
        rows={(data ?? []) as CrudRow[]}
        primaryField="title"
        secondaryField="year"
        addLabel="Add award"
        searchPlaceholder="Search awards…"
        detailFields={[{ name: "year", label: "Year" }]}
        fields={[
          { name: "image_url", label: "Badge image", type: "image" },
          { name: "year", label: "Year", placeholder: "2025" },
          { name: "title", label: "Title", placeholder: "Award name" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_active", label: "Active", type: "checkbox" },
        ]}
      />
    </div>
  );
}
