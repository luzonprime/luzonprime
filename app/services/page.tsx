import type { Metadata } from "next";
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
import { CtaBanner } from "@/components/shared/CtaBanner";

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
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
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
        <CtaBanner
          title="Ready to make your next move?"
          description="Tell us what you're looking for and we'll match you with the right property and the right agent."
          primary={{ href: "/listings", label: "Browse listings" }}
          secondary={{ href: "/contact", label: "Talk to us" }}
        />
      </section>
    </div>
  );
}
