import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        These tiles power the homepage &quot;Categorization&quot; section. Set the
        link to a filtered listings URL (e.g. <code>/listings?listing_type=for_rent</code>).
      </p>
      <CrudManager
        table="categories"
        rows={(data ?? []) as CrudRow[]}
        primaryField="title"
        secondaryField="link"
        addLabel="Add category"
        searchPlaceholder="Search categories…"
        detailFields={[{ name: "link", label: "Link" }]}
        fields={[
          { name: "image_url", label: "Image", type: "image" },
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "link", label: "Link", placeholder: "/listings?listing_type=for_rent" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_active", label: "Visible", type: "checkbox" },
        ]}
      />
    </div>
  );
}
