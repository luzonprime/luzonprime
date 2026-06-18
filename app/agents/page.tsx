import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import { AgentContactButtons } from "@/components/listings/AgentContactButtons";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Our Agents | Luzon Prime Realtors",
  description:
    "Meet the Luzon Prime Realtors team — verified, experienced agents ready to guide you through buying, selling, and renting.",
  alternates: { canonical: "/agents" },
  openGraph: {
    title: "Our Agents | Luzon Prime Realtors",
    description: "Meet the verified, experienced Luzon Prime Realtors team.",
    url: "/agents",
    type: "website",
  },
};

export default async function AgentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "agent")
    .order("verified", { ascending: false })
    .order("created_at", { ascending: false });

  const agents = (data ?? []) as Profile[];

  return (
    <div className="bg-[var(--color-bg)]">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
          <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            Meet our agents
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            A team that knows the market inside out — here to help you buy,
            sell, or rent with confidence.
          </p>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
        {agents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              Our agent profiles are coming soon. In the meantime,{" "}
              <Link href="/contact" className="font-semibold text-[var(--color-heading)]">
                get in touch
              </Link>{" "}
              and we&apos;ll connect you with the right person.
            </p>
          </div>
        ) : (
          <AnimatedStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent) => (
              <AnimatedStaggerItem key={agent.id}>
                <div className="group relative flex h-full flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {/* Stretched link makes the whole card clickable */}
                  <Link
                    href={`/agents/${agent.id}`}
                    aria-label={`View ${agent.full_name ?? "agent"}'s profile`}
                    className="absolute inset-0 z-0 rounded-2xl"
                  />
                  <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                    {agent.avatar_url ? (
                      <Image
                        src={agent.avatar_url}
                        alt={`${agent.full_name ?? "Luzon Prime Realtors agent"} headshot`}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                        <User size={30} />
                      </div>
                    )}
                  </div>
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                    {agent.full_name ?? "Luzon Prime Agent"}
                    {agent.verified && (
                      <BadgeCheck
                        size={15}
                        className="text-[var(--color-accent)]"
                        aria-label="Verified agent"
                      />
                    )}
                  </p>
                  {agent.bio && (
                    <p className="mt-2 line-clamp-2 text-xs text-[var(--color-text-muted)]">
                      {agent.bio}
                    </p>
                  )}
                  <div className="relative z-10 mt-auto pt-4">
                    <AgentContactButtons phone={agent.phone} name={agent.full_name} />
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
