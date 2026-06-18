import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";
import { Marquee } from "@/components/shared/Marquee";
import { SectionHeader } from "@/components/home/SectionHeader";

export async function PropertyMarquee() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(12);

  const properties = (data ?? []) as Property[];
  if (properties.length < 3) return null;

  return (
    <section className="bg-[var(--color-bg-muted)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-[1.125rem]">
        <SectionHeader
          eyebrow="Signature"
          title="Featured developments"
          description="A glimpse of the properties our clients love, across every city we serve."
          seeAllHref="/listings"
          seeAllLabel="See all"
        />
      </div>

      <div className="mt-8">
        <Marquee speedSeconds={55}>
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/listings/${p.slug}`}
              className="group relative mx-2.5 block h-64 w-72 shrink-0 overflow-hidden rounded-2xl"
            >
              {p.images?.[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.title}
                  fill
                  sizes="288px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[var(--color-surface)] text-[var(--color-text-muted)]">
                  <MapPin size={26} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="line-clamp-1 text-base font-semibold text-white">{p.title}</h3>
                {(p.area || p.city) && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
                    <MapPin size={12} />
                    {[p.area, p.city].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
