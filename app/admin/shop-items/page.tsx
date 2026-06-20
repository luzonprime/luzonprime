import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminShopItemsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shop_items")
    .select("*")
    .order("item_type")
    .order("sort_order");
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        Furniture &amp; decor items shown in the Interior Designs shop, grouped by type.
      </p>
      <CrudManager
        table="shop_items"
        rows={(data ?? []) as CrudRow[]}
        primaryField="name"
        addLabel="Add item"
        searchPlaceholder="Search items…"
        groupBy="item_type"
        detailFields={[{ name: "price_label", label: "Price" }]}
        fields={[
          { name: "cover_image", label: "Cover image", type: "image" },
          { name: "images", label: "Gallery photos", type: "gallery" },
          { name: "videos", label: "Videos", type: "video" },
          { name: "name", label: "Name" },
          { name: "slug", label: "Slug", placeholder: "velvet-lounge-chair" },
          { name: "item_type", label: "Type", placeholder: "Chairs" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "materials", label: "Material and finishes", type: "textarea" },
          { name: "dimensions", label: "Dimensions (one per line)", type: "textarea" },
          { name: "price", label: "Price (number, optional)", type: "number" },
          { name: "price_label", label: "Price label", placeholder: "Price on request" },
          { name: "is_new", label: "New", type: "checkbox" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_published", label: "Published", type: "checkbox" },
        ]}
      />
    </div>
  );
}
