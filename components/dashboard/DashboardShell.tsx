"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function DashboardShell({
  title,
  navItems,
  children,
}: {
  title: string;
  navItems: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row">
      <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible">
        <div className="mb-2 hidden lg:block">
          <p className="font-heading text-lg font-bold text-[var(--color-primary)] dark:text-[var(--color-text)]">
            {title}
          </p>
          {profile?.full_name && (
            <p className="text-xs text-[var(--color-text-muted)]">{profile.full_name}</p>
          )}
        </div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]"
          >
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 lg:mt-auto"
        >
          <LogOut size={15} /> Sign out
        </button>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
