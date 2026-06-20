"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type TableConfig = { columns: string[]; revalidate: string[] };

const ALLOWED: Record<string, TableConfig> = {
  taxonomy_terms: {
    columns: ["kind", "slug", "label", "sort_order", "is_active"],
    revalidate: ["/admin/taxonomies", "/listings", "/admin/properties/new"],
  },
  nav_items: {
    columns: ["label", "href", "grp", "sort_order", "is_active"],
    revalidate: ["/admin/navigation", "/"],
  },
  awards: {
    columns: ["year", "title", "image_url", "sort_order", "is_active"],
    revalidate: ["/admin/awards", "/"],
  },
  members: {
    columns: ["name", "title", "image_url", "about", "sort_order", "is_active"],
    revalidate: ["/admin/members", "/members"],
  },
  categories: {
    columns: ["title", "description", "image_url", "link", "sort_order", "is_active"],
    revalidate: ["/admin/categories", "/"],
  },
  interior_projects: {
    columns: ["title", "slug", "category", "location", "year", "description", "cover_image", "images", "videos", "sort_order", "is_published"],
    revalidate: ["/admin/interior-projects", "/interior-designs"],
  },
  shop_items: {
    columns: ["name", "slug", "item_type", "description", "materials", "dimensions", "price", "price_label", "is_new", "cover_image", "images", "videos", "sort_order", "is_published"],
    revalidate: ["/admin/shop-items", "/interior-designs"],
  },
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Only admins can do this.");
}

function pick(table: string, data: Record<string, unknown>) {
  const cfg = ALLOWED[table];
  if (!cfg) throw new Error("Unknown table.");
  const out: Record<string, unknown> = {};
  for (const col of cfg.columns) {
    if (col in data) out[col] = data[col] === "" ? null : data[col];
  }
  return out;
}

function revalidate(table: string) {
  ALLOWED[table].revalidate.forEach((p) => revalidatePath(p));
}

export async function crudCreate(table: string, data: Record<string, unknown>) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).insert(pick(table, data));
  if (error) throw new Error(error.message);
  revalidate(table);
}

export async function crudUpdate(
  table: string,
  id: string,
  data: Record<string, unknown>
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).update(pick(table, data)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidate(table);
}

export async function crudDelete(table: string, id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidate(table);
}
