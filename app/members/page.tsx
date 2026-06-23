import type { Metadata } from "next";
import Image from "next/image";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/types";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";
import { ShowMoreText } from "@/components/shared/ShowMoreText";

export const metadata: Metadata = {
  title: "Members | Luzon Prime Realtors",
  description:
    "Meet the people behind Luzon Prime Realtors — specialists across luxury, investment, off-plan, and commercial real estate.",
  alternates: { canonical: "/members" },
  openGraph: {
    title: "Members | Luzon Prime Realtors",
    description: "Meet the people behind Luzon Prime Realtors.",
    url: "/members",
    type: "website",
  },
};

export default async function MembersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  const members = (data ?? []) as Member[];

  return (
    <div className="bg-[var(--color-bg)]">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
          <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            Our members
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            The people behind Luzon Prime Realtors — specialists across luxury,
            investment, off-plan, and commercial real estate.
          </p>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
        {members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <Users size={28} className="mx-auto text-[var(--color-text-muted)]" />
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Member profiles are coming soon.
            </p>
          </div>
        ) : (
          <AnimatedStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m) => (
              <AnimatedStaggerItem key={m.id}>
                <div className="h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="relative aspect-[4/5] bg-[var(--color-bg-muted)]">
                    {m.image_url ? (
                      <Image
                        src={m.image_url}
                        alt={`${m.name}${m.title ? `, ${m.title}` : ""}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                        <Users size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-[var(--color-text)]">{m.name}</p>
                    {m.title && (
                      <p className="text-xs font-medium text-[var(--color-accent)]">{m.title}</p>
                    )}
                    {/* {m.about && (
                      <p className="mt-2 line-clamp-4 text-sm text-[var(--color-text-muted)]">
                        {m.about}
                      </p>
                    )} */}
                    {m.about && (
                      <ShowMoreText text={m.about} maxLines={4} className="mt-2" />
                    )}
                  </div>
                </div>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>
    </div>
  );
}
