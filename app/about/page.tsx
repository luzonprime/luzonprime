import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Eye, Target, Trophy } from "lucide-react";
import { StatsBar } from "@/components/home/StatsBar";
import { WhyUs } from "@/components/home/WhyUs";
import { AgentsPreview } from "@/components/home/AgentsPreview";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "About | Luzon Prime Realtors",
  description:
    "Luzon Prime Realtors is a premium, globally-minded real estate company connecting buyers, investors, and developers to high-value property across multiple cities and currencies.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Luzon Prime Realtors",
    description:
      "A premium real estate company committed to creating value through trusted property expertise.",
    url: "/about",
    type: "website",
  },
};

const PILLARS = [
  {
    icon: Target,
    title: "Our mission",
    description:
      "To make high-value property accessible and transparent — connecting people to the right home or investment, wherever they are in the world.",
  },
  {
    icon: Eye,
    title: "Our vision",
    description:
      "To be the most trusted name in real estate across the markets we serve, known for integrity, insight, and results.",
  },
  {
    icon: Compass,
    title: "Our approach",
    description:
      "Curated, not crowded. We hand-pick listings and back every decision with real market data and local expertise.",
  },
];

const AWARDS = [
  "Africa's Most Innovative Real Estate Firm",
  "African Property Awards — Winner 2022/2023",
  "Luxury Lifestyle Award — Winner 2025",
  "Real Estate Newcomer of the Year",
];

const TIMELINE = [
  { year: "2019", text: "Founded with a single office and a big ambition." },
  { year: "2021", text: "Crossed ₦/$ multi-currency transactions across regions." },
  { year: "2023", text: "Recognised at the African Property Awards." },
  { year: "2025", text: "2,500+ properties sold and growing across 12+ cities." },
];

export default function AboutPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
          <h1 className="font-heading mt-3 max-w-3xl text-3xl font-bold leading-tight text-[var(--color-text)] sm:text-4xl">
            A premium real estate company, committed to creating value through
            trusted property expertise.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            We connect buyers, investors, and developers to high-value real
            estate across multiple cities and currencies. From residential homes
            to commercial spaces and off-plan opportunities, we deliver trusted
            guidance backed by market insight and experience.
          </p>
        </AnimatedSection>
      </section>

      <StatsBar />

      {/* Mission / Vision / Approach */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-[1.125rem] lg:px-8">
        <AnimatedStagger className="grid gap-5 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <AnimatedStaggerItem key={title}>
              <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-heading)]">
                  <Icon size={20} />
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

      <WhyUs />

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
          <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Our journey
          </h2>
        </AnimatedSection>
        <AnimatedStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map(({ year, text }) => (
            <AnimatedStaggerItem key={year}>
              <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <p className="font-heading text-2xl font-bold text-[var(--color-heading)]">
                  {year}
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{text}</p>
              </div>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </section>

      {/* Awards */}
      <section className="bg-[var(--color-bg-muted)] px-4 py-16 sm:px-[1.125rem]">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Recognised for our work
            </h2>
          </AnimatedSection>
          <AnimatedStagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AWARDS.map((award) => (
              <AnimatedStaggerItem key={award}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <Trophy size={20} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {award}
                  </p>
                </div>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <AgentsPreview />

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection className="overflow-hidden rounded-3xl bg-[var(--color-primary)] px-6 py-12 text-center sm:px-12">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Let&apos;s find your next property
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
            Explore our curated listings or speak with an agent today.
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
              Contact us
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
