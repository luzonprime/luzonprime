"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  Inbox,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";

const ICON_RULES: { match: RegExp; icon: LucideIcon }[] = [
  { match: /propert/i, icon: Building2 },
  { match: /agent/i, icon: ShieldCheck },
  { match: /user/i, icon: Users },
  { match: /inquir/i, icon: Inbox },
  { match: /subscrib/i, icon: Mail },
  { match: /booking/i, icon: CalendarCheck },
  { match: /setting/i, icon: Settings },
];

function iconFor(label: string): LucideIcon {
  return ICON_RULES.find((rule) => rule.match.test(label))?.icon ?? LayoutDashboard;
}

export function Sidebar({
  title,
  navItems,
}: {
  title: string;
  navItems: { href: string; label: string }[];
}) {
  const pathname = usePathname() ?? "";

  const activeHref = navItems
    .map((item) => item.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <aside className="flex w-14 shrink-0 flex-col gap-1 border-r border-[var(--color-border)] py-4 md:w-64 md:px-3">
      <div className="mb-4 hidden items-center gap-2 px-2 md:flex">
        <Logo width={28} height={29} className="h-7 w-7 shrink-0" />
        <span className="font-heading truncate text-sm font-bold text-[var(--color-heading)]">
          {title}
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = iconFor(item.label);
          const isActive = item.href === activeHref;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center justify-center gap-3 rounded-lg px-0 py-2.5 text-sm font-medium transition-colors md:justify-start md:px-3",
                isActive
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-heading)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden truncate md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
