import Link from "next/link";
import { Home, Building2, Hammer } from "lucide-react";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";

const CATEGORIES = [
  {
    href: "/listings?listing_type=for_rent",
    label: "Top Rentals",
    description: "The finest rental homes across Lagos, curated weekly.",
    icon: Home,
    gradient: "from-[#0f2a5c] to-[#1b3a73]",
  },
  {
    href: "/listings?listing_type=off_plan",
    label: "Off-Plan Properties",
    description: "Buy early. Build wealth before completion.",
    icon: Hammer,
    gradient: "from-[#091f46] to-[#2a4080]",
  },
  {
    href: "/listings?property_type=commercial",
    label: "Commercial Spaces",
    description: "Grade A commercial assets across Lagos Island.",
    icon: Building2,
    gradient: "from-[#15315e] to-[#091f46]",
  },
];

export function CategoryCurations() {
  return (
    <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
        <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          Explore properties by category
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
          From premium rentals to commercial assets — every category,
          hand-picked by our team.
        </p>

        <AnimatedStagger className="mt-8 grid gap-5 sm:grid-cols-3">
          {CATEGORIES.map(({ href, label, description, icon: Icon, gradient }) => (
            <AnimatedStaggerItem key={label}>
              <Link
                href={href}
                className={`group relative block h-56 overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6`}
              >
                <Icon className="text-white/70" size={28} />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-lg font-semibold text-white">{label}</h3>
                  <p className="mt-1 text-sm text-white/70">{description}</p>
                </div>
                <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
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
