import { createClient } from "@/lib/supabase/server";
import { CrudManager, type CrudRow } from "@/components/dashboard/CrudManager";

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("members").select("*").order("sort_order");
  return (
    <CrudManager
      table="members"
      rows={(data ?? []) as CrudRow[]}
      primaryField="name"
      secondaryField="title"
      addLabel="Add member"
      fields={[
        { name: "name", label: "Name" },
        { name: "title", label: "Title", placeholder: "Head of Sales" },
        { name: "image_url", label: "Image URL", placeholder: "https://…" },
        { name: "about", label: "About", type: "textarea" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Visible on site", type: "checkbox" },
      ]}
    />
  );
}
