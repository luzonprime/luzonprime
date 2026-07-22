import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types";
import { serviceIcon } from "@/components/services/icons";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";
import { CtaBanner } from "@/components/shared/CtaBanner";

export const metadata: Metadata = {
  title: "Services | Luzon Prime Realtors",
  description:
    "Investment advisory, acquisition & disposition, development advisory, capital raising, and transaction & legal advisory from Luzon Prime Realtors.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Luzon Prime Realtors",
    description:
      "Real estate investment, development, capital, and transaction advisory from Luzon Prime Realtors.",
    url: "/services",
    type: "website",
  },
};

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  const services = (data ?? []) as Service[];

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
        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-sm text-[var(--color-text-muted)]">
            Our services will appear here soon.
          </div>
        ) : (
          <AnimatedStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIcon(service.icon);
              return (
                <AnimatedStaggerItem key={service.id}>
                  <div className="group h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-heading)]">
                      <Icon size={22} />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-[var(--color-text)]">
                      {service.title}
                    </h2>
                    {service.description && (
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {service.description}
                      </p>
                    )}
                  </div>
                </AnimatedStaggerItem>
              );
            })}
          </AnimatedStagger>
        )}
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
