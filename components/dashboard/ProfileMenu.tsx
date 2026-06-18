"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

export function ProfileMenu() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
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

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const roleLabel = profile?.role ? ROLE_LABELS[profile.role] ?? profile.role : "";

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
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="" width={36} height={36} className="h-9 w-9 object-cover" />
        ) : (
          initials(profile?.full_name, profile?.role ?? "U")
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg"
        >
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">
              {profile?.full_name ?? "—"}
            </p>
            {roleLabel && (
              <p className="text-xs text-[var(--color-text-muted)]">{roleLabel}</p>
            )}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-[var(--color-bg-muted)]"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
