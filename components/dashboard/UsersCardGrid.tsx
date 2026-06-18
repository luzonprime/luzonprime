"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Ban, BadgeCheck, CheckCircle2, ShieldCheck, ShieldOff, User } from "lucide-react";
import { setAgentVerified, setUserSuspended } from "@/app/actions/users";
import { DashboardCardGrid } from "@/components/dashboard/DashboardCardGrid";

export interface UserRow {
  id: string;
  full_name: string | null;
  email: string;
  role: "client" | "agent" | "admin";
  verified: boolean;
  suspended: boolean;
  avatar_url: string | null;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  client: "Client",
  agent: "Agent",
  admin: "Admin",
};

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  const parts = source.split(/\s+/);
  const letters =
    parts.length > 1 ? [parts[0][0], parts[parts.length - 1][0]] : [source[0]];
  return letters.join("").toUpperCase();
}

export function UsersCardGrid({ users }: { users: UserRow[] }) {
  const [rows, setRows] = useState(users);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleToggleSuspend(id: string, next: boolean) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await setUserSuspended(id, next);
        setRows((prev) => prev.map((u) => (u.id === id ? { ...u, suspended: next } : u)));
      } finally {
        setPendingId(null);
      }
    });
  }

  function handleToggleVerified(id: string, next: boolean) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await setAgentVerified(id, next);
        setRows((prev) => prev.map((u) => (u.id === id ? { ...u, verified: next } : u)));
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <DashboardCardGrid
      rows={rows}
      searchPlaceholder="Search users..."
      emptyMessage="No users yet."
      searchableText={(u) => [u.full_name, u.email, u.role].filter(Boolean).join(" ")}
      renderCard={(u) => {
        const busy = isPending && pendingId === u.id;
        return (
          <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                {u.avatar_url ? (
                  <Image
                    src={u.avatar_url}
                    alt={u.full_name ?? "User avatar"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-sm font-semibold text-[var(--color-text-muted)]">
                    {u.full_name || u.email ? initials(u.full_name, u.email) : <User size={18} />}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-sm font-semibold text-[var(--color-text)]">
                  {u.full_name ?? "—"}
                  {u.role === "agent" && u.verified && (
                    <BadgeCheck size={14} className="shrink-0 text-[var(--color-accent)]" />
                  )}
                </p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">{u.email}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[var(--color-bg-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                {ROLE_LABELS[u.role] ?? u.role}
              </span>
              {u.role === "agent" && (
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    u.verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.verified ? "Verified" : "Unverified"}
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  u.suspended ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {u.suspended ? "Suspended" : "Active"}
              </span>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-4">
              {u.role === "agent" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleToggleVerified(u.id, !u.verified)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] disabled:opacity-40"
                >
                  {u.verified ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                  {u.verified ? "Unverify" : "Verify"}
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => handleToggleSuspend(u.id, !u.suspended)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 ${
                  u.suspended
                    ? "border-green-200 text-green-700 hover:bg-green-50 dark:hover:bg-green-500/10"
                    : "border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                }`}
              >
                {u.suspended ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                {u.suspended ? "Unsuspend" : "Suspend"}
              </button>
            </div>
          </div>
        );
      }}
    />
  );
}
