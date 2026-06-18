import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminTaxonomiesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("taxonomy_terms")
    .select("*")
    .order("kind")
    .order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        These options populate the property form selectors, listing filters, and
        search across the site.
      </p>
      <CrudManager
        table="taxonomy_terms"
        rows={(data ?? []) as CrudRow[]}
        primaryField="label"
        addLabel="Add option"
        searchPlaceholder="Search options…"
        groupBy="kind"
        groupLabels={{
          property_type: "Property types",
          listing_type: "Listing types",
          status: "Statuses",
        }}
        detailFields={[{ name: "slug", label: "Slug" }]}
        fields={[
          {
            name: "kind",
            label: "Type",
            type: "select",
            options: [
              { value: "property_type", label: "Property type" },
              { value: "listing_type", label: "Listing type" },
              { value: "status", label: "Status" },
            ],
          },
          { name: "slug", label: "Slug (value)", placeholder: "apartment" },
          { name: "label", label: "Label", placeholder: "Apartment" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_active", label: "Active", type: "checkbox" },
        ]}
      />
    </div>
  );
}
