import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, User } from "lucide-react";
import type { Profile } from "@/types";
import { AgentContactButtons } from "@/components/listings/AgentContactButtons";

export function AgentCard({ agent }: { agent: Profile }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
        {agent.avatar_url ? (
          <Image src={agent.avatar_url} alt={agent.full_name ?? "Agent"} fill sizes="56px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
            <User size={22} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/agents/${agent.id}`}
          className="flex items-center gap-1 font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)]"
        >
          {agent.full_name ?? "Luzon Prime Agent"}
          {agent.verified && (
            <BadgeCheck size={15} className="shrink-0 text-[var(--color-accent)]" aria-label="Verified agent" />
          )}
        </Link>
        {agent.phone && (
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{agent.phone}</p>
        )}
      </div>
      <AgentContactButtons phone={agent.phone} name={agent.full_name} />
    </div>
  );
}
