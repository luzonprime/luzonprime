"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ProfileMenu } from "@/components/dashboard/ProfileMenu";

export function TopBar({
  pageTitle,
  notificationCount = 0,
  onOpenMobile,
}: {
  pageTitle: string;
  notificationCount?: number;
  onOpenMobile?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-3 backdrop-blur sm:px-[1.125rem]">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] lg:hidden"
        >
          <Menu size={20} />
        </button>
        <Link href="/" aria-label="Luzon Prime Realtors home" className="shrink-0 lg:hidden">
          <Logo width={30} height={31} className="h-7 w-7" />
        </Link>
        <h1 className="font-heading truncate text-lg font-bold text-[var(--color-heading)] sm:text-xl">
          {pageTitle}
        </h1>
      </div>

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

        <ProfileMenu />
      </div>
    </header>
  );
}
