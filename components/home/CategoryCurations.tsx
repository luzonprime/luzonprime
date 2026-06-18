import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";
import { SectionHeader } from "@/components/home/SectionHeader";

const CURATIONS = [
  {
    href: "/listings?listing_type=for_rent",
    label: "Top Rentals of the Week",
    description: "The finest rental homes, curated weekly.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=70",
  },
  {
    href: "/listings?listing_type=off_plan",
    label: "Off-Plan Properties",
    description: "Buy early. Build wealth before completion.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=70",
  },
  {
    href: "/listings?property_type=commercial",
    label: "Commercial Spaces",
    description: "Grade A commercial assets in prime districts.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=70",
  },
];

export function CategoryCurations() {
  return (
    <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Curations"
          title="Explore properties by category"
          description="From premium rentals to commercial assets — every category, hand-picked by our team."
          seeAllHref="/listings"
          seeAllLabel="See all curations"
        />

        <AnimatedStagger className="mt-8 flex flex-col gap-4">
          {CURATIONS.map(({ href, label, description, image }) => (
            <AnimatedStaggerItem key={label}>
              <Link
                href={href}
                className="group relative block h-40 overflow-hidden rounded-2xl sm:h-48"
              >
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#091f46]/90 via-[#091f46]/45 to-transparent" />
                <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-6 sm:p-9">
                  <h3 className="text-xl font-semibold text-white sm:text-2xl">{label}</h3>
                  <p className="mt-1.5 text-sm text-white/80">{description}</p>
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
