import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminNavigationPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("nav_items")
    .select("*")
    .order("grp")
    .order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        Header navigation. &quot;Popular&quot; shows first (before the divider),
        &quot;Inline&quot; items show next, and &quot;More&quot; items collapse into
        the More dropdown — ordered by sort order.
      </p>
      <CrudManager
        table="nav_items"
        rows={(data ?? []) as CrudRow[]}
        primaryField="label"
        secondaryField="href"
        addLabel="Add nav item"
        fields={[
          { name: "label", label: "Label" },
          { name: "href", label: "Link (href)", placeholder: "/listings" },
          {
            name: "grp",
            label: "Group",
            type: "select",
            options: [
              { value: "popular", label: "Popular (before divider)" },
              { value: "inline", label: "Inline" },
              { value: "more", label: "More dropdown" },
            ],
          },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_active", label: "Active", type: "checkbox" },
        ]}
      />
    </div>
  );
}
