"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import type { DashboardUser } from "@/lib/auth";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  agent: "Agent",
  client: "Client",
};

function initials(name: string | null | undefined, fallback: string) {
  if (!name) return fallback.slice(0, 2).toUpperCase();
  const parts = name.trim().split(/\s+/);
  const letters = parts.length > 1 ? [parts[0][0], parts[parts.length - 1][0]] : [parts[0][0]];
  return letters.join("").toUpperCase();
}

export function ProfileMenu({ user }: { user: DashboardUser | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const roleLabel = user?.role ? ROLE_LABELS[user.role] ?? user.role : "";
  const displayName = user?.fullName || user?.email || "Account";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
      >
        {user?.avatarUrl ? (
          <Image src={user.avatarUrl} alt="" width={36} height={36} className="h-9 w-9 object-cover" />
        ) : (
          initials(user?.fullName, user?.role ?? "U")
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg"
        >
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">
              {displayName}
            </p>
            {roleLabel && (
              <p className="text-xs text-[var(--color-text-muted)]">{roleLabel}</p>
            )}
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-[var(--color-bg-muted)]"
            >
              <LogOut size={16} /> Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
