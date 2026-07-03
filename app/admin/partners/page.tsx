import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminPartnersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("partners").select("*").order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        Partners appear in a strip on the homepage and in full on the{" "}
        <span className="font-medium text-[var(--color-text)]">/partners</span> page.
        Logos come in different sizes and background colours — set a{" "}
        <span className="font-medium text-[var(--color-text)]">tile colour</span> that
        matches each logo&apos;s background so it blends seamlessly (leave blank for white).
        Lower sort orders show first.
      </p>
      <CrudManager
        table="partners"
        rows={(data ?? []) as CrudRow[]}
        primaryField="name"
        secondaryField="website_url"
        addLabel="Add partner"
        searchPlaceholder="Search partners…"
        fields={[
          { name: "logo_url", label: "Logo", type: "image" },
          { name: "name", label: "Partner name", placeholder: "Company name" },
          {
            name: "website_url",
            label: "Website",
            placeholder: "https://example.com",
          },
          {
            name: "bg_color",
            label: "Tile background colour",
            type: "color",
            placeholder: "#FFFFFF — leave blank for white",
          },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_active", label: "Active", type: "checkbox" },
        ]}
      />
    </div>
  );
}
