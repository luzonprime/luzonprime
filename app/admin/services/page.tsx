import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";
import { SERVICE_ICON_OPTIONS } from "@/components/services/icons";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        Services shown on the{" "}
        <span className="font-medium text-[var(--color-text)]">/services</span> page.
        Lower sort orders show first.
      </p>
      <CrudManager
        table="services"
        rows={(data ?? []) as CrudRow[]}
        primaryField="title"
        addLabel="Add service"
        searchPlaceholder="Search services…"
        detailFields={[{ name: "icon", label: "Icon" }]}
        fields={[
          { name: "title", label: "Title", placeholder: "Service name" },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "What this service offers…",
          },
          { name: "icon", label: "Icon", type: "select", options: SERVICE_ICON_OPTIONS },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_active", label: "Active", type: "checkbox" },
        ]}
      />
    </div>
  );
}
