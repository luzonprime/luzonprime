"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function initials(name: string | null | undefined, fallback: string) {
  if (!name) return fallback.slice(0, 2).toUpperCase();
  const parts = name.trim().split(/\s+/);
  const letters = parts.length > 1 ? [parts[0][0], parts[parts.length - 1][0]] : [parts[0][0]];
  return letters.join("").toUpperCase();
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  agent: "Agent",
  client: "Client",
};

export function TopBar({
  pageTitle,
  notificationCount = 0,
}: {
  pageTitle: string;
  notificationCount?: number;
}) {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
      <h1 className="font-heading truncate text-xl font-bold text-[var(--color-heading)] sm:text-2xl">
        {pageTitle}
      </h1>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">
            {initials(profile?.full_name, profile?.role ?? "U")}
          </div>
          <div className="leading-tight">
            <p className="truncate text-sm font-medium text-[var(--color-text)]">
              {profile?.full_name ?? "—"}
            </p>
            <span className="inline-block rounded-full bg-[var(--color-bg-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              {profile?.role ? ROLE_LABELS[profile.role] ?? profile.role : ""}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
        >
          <LogOut size={17} />
        </button>
      </div>
    </div>
  );
}
