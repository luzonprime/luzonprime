import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sofa } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { ShopItem } from "@/types";

async function getItem(slug: string): Promise<ShopItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("shop_items")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return (data as ShopItem | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) return { title: "Item not found | Luzon Prime Realtors" };
  return {
    title: `${item.name} | Interior Designs`,
    description: item.description ?? `${item.name} — Luzon Prime Realtors interior shop.`,
    alternates: { canonical: `/interior-designs/shop/${item.slug}` },
  };
}

export default async function ShopItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) notFound();

  const supabase = await createClient();
  const { data: relatedData } = await supabase
    .from("shop_items")
    .select("*")
    .eq("is_published", true)
    .eq("item_type", item.item_type ?? "")
    .neq("id", item.id)
    .limit(3);
  const related = (relatedData ?? []) as ShopItem[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-[1.125rem] lg:px-8">
      <Link
        href="/interior-designs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
      >
        <ArrowLeft size={15} /> Interior Designs
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-bg-muted)]">
          {item.cover_image ? (
            <Image src={item.cover_image} alt={item.name} fill sizes="(max-width: 1024px) 100vw, 50vw" priority className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
              <Sofa size={40} />
            </div>
          )}
          {item.is_new && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white">
              New
            </span>
          )}
        </div>

        <div>
          {item.item_type && (
            <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
              {item.item_type}
            </span>
          )}
          <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            {item.name}
          </h1>
          <p className="mt-3 text-lg font-semibold text-[var(--color-heading)]">
            {item.price_label ?? (item.price != null ? `₦${Number(item.price).toLocaleString()}` : "Price on request")}
          </p>
          {item.description && (
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {item.description}
            </p>
          )}
          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Get price
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">
            Related pieces
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/interior-designs/shop/${r.slug}`}
                className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-muted)]">
                  {r.cover_image && (
                    <Image src={r.cover_image} alt={r.name} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-sm font-medium text-[var(--color-text)]">{r.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
