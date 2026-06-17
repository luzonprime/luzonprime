import Image from "next/image";
import { User } from "lucide-react";
import type { Profile } from "@/types";

export function AgentCard({ agent }: { agent: Profile }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
        {agent.avatar_url ? (
          <Image src={agent.avatar_url} alt={agent.full_name ?? "Agent"} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
            <User size={22} />
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-[var(--color-text)]">{agent.full_name ?? "LuzonPrime Agent"}</p>
        {agent.verified && (
          <p className="text-xs font-medium text-[var(--color-accent)]">Verified Agent</p>
        )}
        {agent.phone && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{agent.phone}</p>}
      </div>
    </div>
  );
}
