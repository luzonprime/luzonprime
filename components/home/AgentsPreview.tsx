import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";

export async function AgentsPreview() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false })
    .limit(4);

  const agents = (data ?? []) as Profile[];
  if (agents.length === 0) return null;

  return (
    <section className="bg-[var(--color-bg-muted)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Meet our agents
            </h2>
          </div>
          <Link
            href="/agents"
            className="hidden text-sm font-semibold text-[var(--color-heading)] sm:inline-block"
          >
            View all →
          </Link>
        </div>

        <AnimatedStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent) => (
            <AnimatedStaggerItem key={agent.id}>
              <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center">
                <div className="relative mx-auto mt-6 h-20 w-20 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                  {agent.avatar_url ? (
                    <Image src={agent.avatar_url} alt={agent.full_name ?? "Agent"} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                      <User size={28} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {agent.full_name ?? "Luzon Prime Agent"}
                  </p>
                  {agent.verified && (
                    <span className="mt-1 inline-block text-xs font-medium text-[var(--color-accent)]">
                      Verified Agent
                    </span>
                  )}
                </div>
              </div>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
