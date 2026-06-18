import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  ClipboardCheck,
  Home,
  KeyRound,
  LineChart,
  Wrench,
} from "lucide-react";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Services | Luzon Prime Realtors",
  description:
    "Buy, sell, rent, invest off-plan, manage, or value property with Luzon Prime Realtors — full-service real estate across multiple cities and currencies.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Luzon Prime Realtors",
    description:
      "Full-service real estate: buying, selling, rentals, off-plan advisory, property management, and valuation.",
    url: "/services",
    type: "website",
  },
};

const SERVICES = [
  {
    icon: Home,
    title: "Buy a property",
    description:
      "Hand-picked homes and investments matched to your budget, lifestyle, and goals — with guidance at every step.",
  },
  {
    icon: KeyRound,
    title: "Sell with confidence",
    description:
      "Accurate pricing, professional marketing, and qualified buyers so your property sells faster and for more.",
  },
  {
    icon: Building2,
    title: "Rent & lease",
    description:
      "Verified rentals for tenants and reliable, vetted occupants for landlords across every neighbourhood.",
  },
  {
    icon: ClipboardCheck,
    title: "Off-plan advisory",
    description:
      "Get in early on trusted developments and build wealth before completion with data-backed advice.",
  },
  {
    icon: Wrench,
    title: "Property management",
    description:
      "End-to-end management — rent collection, maintenance, and reporting — so your asset runs itself.",
  },
  {
    icon: LineChart,
    title: "Valuation & insight",
    description:
      "Know what your property is really worth with market valuations grounded in real transaction data.",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
          <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            Everything you need, under one roof
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            From your first viewing to closing and beyond, Luzon Prime Realtors
            offers the full spectrum of real estate services — locally rooted,
            globally minded.
          </p>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
        <AnimatedStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <AnimatedStaggerItem key={title}>
              <div className="group h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-heading)]">
                  <Icon size={22} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-[var(--color-text)]">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {description}
                </p>
              </div>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection className="overflow-hidden rounded-3xl bg-[var(--color-primary)] px-6 py-12 text-center sm:px-12">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Ready to make your next move?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
            Tell us what you&apos;re looking for and we&apos;ll match you with
            the right property and the right agent.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/listings"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-transform hover:-translate-y-0.5"
            >
              Browse listings
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Talk to us
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
