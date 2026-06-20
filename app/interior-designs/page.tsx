import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sofa } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { InteriorProject, ShopItem } from "@/types";
import { ShopGrid } from "@/components/interior/ShopGrid";
import { SectionHeader } from "@/components/home/SectionHeader";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Interior Designs | Luzon Prime Realtors",
  description:
    "Explore our completed interior design projects and shop curated furniture and decor pieces.",
  alternates: { canonical: "/interior-designs" },
  openGraph: {
    title: "Interior Designs | Luzon Prime Realtors",
    description: "Completed interior projects and a curated furniture & decor shop.",
    url: "/interior-designs",
    type: "website",
  },
};

export default async function InteriorDesignsPage() {
  const supabase = await createClient();
  const [{ data: projectsData }, { data: itemsData }] = await Promise.all([
    supabase.from("interior_projects").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("shop_items").select("*").eq("is_published", true).order("sort_order"),
  ]);
  const projects = (projectsData ?? []) as InteriorProject[];
  const items = (itemsData ?? []) as ShopItem[];

  return (
    <div className="bg-[var(--color-bg)]">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            <Sofa size={14} className="text-[var(--color-accent)]" /> Interior Designs
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            Unique designs with a modern twist
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            Browse our portfolio of completed interiors, then shop the pieces that
            bring each space to life.
          </p>
        </AnimatedSection>
      </section>

      {/* Portfolio */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
        <SectionHeader eyebrow="Portfolio" title="Completed projects" />
        {projects.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-text-muted)]">
            Projects coming soon.
          </p>
        ) : (
          <AnimatedStagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <AnimatedStaggerItem key={p.id}>
                <Link
                  href={`/interior-designs/portfolio/${p.slug}`}
                  className="group relative block h-72 overflow-hidden rounded-2xl"
                >
                  {p.cover_image && (
                    <Image
                      src={p.cover_image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {p.category && (
                      <span className="text-xs uppercase tracking-wide text-white/70">
                        {p.category}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                    {(p.location || p.year) && (
                      <p className="text-xs text-white/75">
                        {[p.location, p.year].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>

      {/* Shop */}
      <section className="bg-[var(--color-bg-muted)] px-4 py-12 sm:px-[1.125rem]">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="The Shop"
            title="Shop the collection"
            description="Curated furniture and decor — by category."
          />
          <div className="mt-8">
            {items.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-text-muted)]">
                Shop items coming soon.
              </p>
            ) : (
              <ShopGrid items={items} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
