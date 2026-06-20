import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { InteriorProject, ShopItem } from "@/types";

async function getProject(slug: string): Promise<InteriorProject | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("interior_projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return (data as InteriorProject | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found | Luzon Prime Realtors" };
  return {
    title: `${project.title} | Interior Designs`,
    description: project.description ?? `${project.title} — a Luzon Prime Realtors interior project.`,
    alternates: { canonical: `/interior-designs/portfolio/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description ?? undefined,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
  };
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const supabase = await createClient();
  const { data: itemsData } = await supabase
    .from("shop_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .limit(4);
  const items = (itemsData ?? []) as ShopItem[];

  const gallery = project.images?.length ? project.images : project.cover_image ? [project.cover_image] : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-[1.125rem] lg:px-8">
      <Link
        href="/interior-designs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
      >
        <ArrowLeft size={15} /> Interior Designs
      </Link>

      <div className="mt-6">
        {project.category && (
          <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
            {project.category}
          </span>
        )}
        <h1 className="font-heading mt-2 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
          {project.title}
        </h1>
        {(project.location || project.year) && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
            <MapPin size={14} />
            {[project.location, project.year].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {project.cover_image && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--color-bg-muted)]">
          <Image src={project.cover_image} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 1024px" priority className="object-cover" />
        </div>
      )}

      {project.description && (
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-text-muted)]">
          {project.description}
        </p>
      )}

      {gallery.length > 1 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {gallery.slice(1).map((src, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--color-bg-muted)]">
              <Image src={src} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-14">
          <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">Shop the look</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/interior-designs/shop/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-muted)]">
                  {item.cover_image && (
                    <Image src={item.cover_image} alt={item.name} fill sizes="25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-medium text-[var(--color-text)]">{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
