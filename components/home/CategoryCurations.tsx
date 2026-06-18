import Image from "next/image";
import Link from "next/link";
import { Home, Building2, Hammer } from "lucide-react";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";

const CATEGORIES = [
  {
    href: "/listings?listing_type=for_rent",
    label: "Top Rentals",
    description: "The finest rental homes, curated weekly.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=70",
  },
  {
    href: "/listings?listing_type=off_plan",
    label: "Off-Plan Properties",
    description: "Buy early. Build wealth before completion.",
    icon: Hammer,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=70",
  },
  {
    href: "/listings?property_type=commercial",
    label: "Commercial Spaces",
    description: "Grade A commercial assets in prime districts.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=70",
  },
];

export function CategoryCurations() {
  return (
    <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
        <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          Explore properties by category
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
          From premium rentals to commercial assets — every category,
          hand-picked by our team.
        </p>

        <AnimatedStagger className="mt-8 grid gap-5 sm:grid-cols-3">
          {CATEGORIES.map(({ href, label, description, icon: Icon, image }) => (
            <AnimatedStaggerItem key={label}>
              <Link
                href={href}
                className="group relative block h-56 overflow-hidden rounded-2xl"
              >
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091f46]/90 via-[#091f46]/45 to-[#091f46]/20" />
                <Icon className="absolute left-6 top-6 text-white/80" size={26} />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-lg font-semibold text-white">{label}</h3>
                  <p className="mt-1 text-sm text-white/80">{description}</p>
                </div>
                <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </Link>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
