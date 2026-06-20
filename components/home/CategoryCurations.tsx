import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";
import { SectionHeader } from "@/components/home/SectionHeader";

const FALLBACK: Pick<Category, "title" | "description" | "image_url" | "link">[] = [
  {
    title: "Top Rentals of the Week",
    description: "The finest rental homes, curated weekly.",
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=70",
    link: "/listings?listing_type=for_rent",
  },
  {
    title: "Off-Plan Properties",
    description: "Buy early. Build wealth before completion.",
    image_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=70",
    link: "/listings?listing_type=off_plan",
  },
  {
    title: "Commercial Spaces",
    description: "Grade A commercial assets in prime districts.",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=70",
    link: "/listings?property_type=commercial",
  },
];

export async function CategoryCurations() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const categories = data && data.length > 0 ? (data as Category[]) : FALLBACK;

  return (
    <section className="bg-[var(--color-bg)] px-4 py-12 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Categorization"
          title="Explore properties by category"
          description="From premium rentals to commercial assets — every category, hand-picked by our team."
          seeAllHref="/listings"
          seeAllLabel="See all"
        />

        <AnimatedStagger className="mt-8 flex flex-col gap-4">
          {categories.map((c) => (
            <AnimatedStaggerItem key={c.title}>
              <Link
                href={c.link}
                className="group relative block h-40 overflow-hidden rounded-2xl sm:h-48"
              >
                {c.image_url && (
                  <Image
                    src={c.image_url}
                    alt={c.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#091f46]/90 via-[#091f46]/45 to-transparent" />
                <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-6 sm:p-9">
                  <h3 className="text-xl font-semibold text-white sm:text-2xl">{c.title}</h3>
                  {c.description && (
                    <p className="mt-1.5 text-sm text-white/80">{c.description}</p>
                  )}
                </div>
                <span className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 text-white transition-transform group-hover:translate-x-1 sm:right-8">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
