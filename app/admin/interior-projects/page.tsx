import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminInteriorProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("interior_projects")
    .select("*")
    .order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        Completed interior design projects shown in the Interior Designs portfolio.
      </p>
      <CrudManager
        table="interior_projects"
        rows={(data ?? []) as CrudRow[]}
        primaryField="title"
        secondaryField="category"
        addLabel="Add project"
        searchPlaceholder="Search projects…"
        detailFields={[
          { name: "location", label: "Location" },
          { name: "year", label: "Year" },
        ]}
        fields={[
          { name: "cover_image", label: "Cover image", type: "image" },
          { name: "images", label: "Gallery photos", type: "gallery" },
          { name: "videos", label: "Videos", type: "video" },
          { name: "title", label: "Title" },
          { name: "slug", label: "Slug", placeholder: "ikoyi-penthouse" },
          { name: "category", label: "Category", placeholder: "Residential" },
          { name: "location", label: "Location" },
          { name: "year", label: "Year", placeholder: "2024" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_published", label: "Published", type: "checkbox" },
        ]}
      />
    </div>
  );
}
