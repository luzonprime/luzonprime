import type { MetadataRoute } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luzonprime.com";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/listings", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services", priority: 0.6, changeFrequency: "monthly" },
  { path: "/agents", priority: 0.6, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return entries;

  try {
    const supabase = createSupabaseClient(url, anon, {
      auth: { persistSession: false },
    });

    const [{ data: properties }, { data: posts }] = await Promise.all([
      supabase
        .from("properties")
        .select("slug, updated_at")
        .eq("is_published", true),
      supabase.from("posts").select("slug, created_at").eq("published", true),
    ]);

    for (const p of properties ?? []) {
      entries.push({
        url: `${baseUrl}/listings/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const post of posts ?? []) {
      entries.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.created_at ? new Date(post.created_at) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // Network/DB hiccup at build time — fall back to static routes.
  }

  return entries;
}
