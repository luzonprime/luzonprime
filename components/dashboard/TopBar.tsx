"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ProfileMenu } from "@/components/dashboard/ProfileMenu";
import { NotificationBell } from "@/components/dashboard/NotificationBell";

export function TopBar({
  pageTitle,
  onOpenMobile,
}: {
  pageTitle: string;
  onOpenMobile?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-3 backdrop-blur sm:px-[1.125rem]">
      <div className="flex min-w-0 items-center gap-2">
        <Link href="/" aria-label="Luzon Prime Realtors home" className="shrink-0 lg:hidden">
          <Logo width={30} height={31} className="h-7 w-7" />
        </Link>
        <h1 className="font-heading truncate text-lg font-bold text-[var(--color-heading)] sm:text-xl">
          {pageTitle}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <NotificationBell />

        <ProfileMenu />

        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
