"use client";

import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Adaeze O.",
    role: "Bought a duplex in Lekki",
    quote:
      "Luzon Prime Realtors made the whole process feel effortless. Our agent understood exactly what we wanted and never wasted our time with mismatched listings.",
  },
  {
    name: "Emeka U.",
    role: "Rented an apartment in Ikoyi",
    quote:
      "Verified listings made all the difference — what we saw online was exactly what we got on the viewing day.",
  },
  {
    name: "Funmi A.",
    role: "Off-plan investor",
    quote:
      "The market insight from the team helped us invest early in a development that's now worth significantly more.",
  },
];

export function TestimonialsCarousel() {
  return (
    <section className="bg-[var(--color-bg)] px-4 py-12 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
        <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          What our clients say
        </h2>

        <div className="mt-8 flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="min-w-[280px] flex-1 snap-start rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:min-w-[320px]"
            >
              <div className="flex gap-0.5 text-[var(--color-accent)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
