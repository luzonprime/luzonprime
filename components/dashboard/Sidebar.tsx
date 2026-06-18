"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Building2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
  LayoutDashboard,
  Mail,
  Navigation,
  Settings,
  ShieldCheck,
  Tags,
  UserSquare,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";

const ICON_RULES: { match: RegExp; icon: LucideIcon }[] = [
  { match: /propert/i, icon: Building2 },
  { match: /member/i, icon: UserSquare },
  { match: /agent/i, icon: ShieldCheck },
  { match: /user/i, icon: Users },
  { match: /inquir/i, icon: Inbox },
  { match: /subscrib/i, icon: Mail },
  { match: /booking/i, icon: CalendarCheck },
  { match: /taxonom/i, icon: Tags },
  { match: /navigation/i, icon: Navigation },
  { match: /award/i, icon: Award },
  { match: /setting/i, icon: Settings },
];

function iconFor(label: string): LucideIcon {
  return ICON_RULES.find((rule) => rule.match.test(label))?.icon ?? LayoutDashboard;
}

type NavItem = { href: string; label: string };

function NavLinks({
  navItems,
  activeHref,
  collapsed,
  onNavigate,
}: {
  navItems: NavItem[];
  activeHref?: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = iconFor(item.label);
        const isActive = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              collapsed && "lg:justify-center lg:px-0",
              isActive
                ? "bg-[var(--color-primary)]/10 text-[var(--color-heading)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({
  navItems,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  navItems: NavItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname() ?? "";
  const activeHref = navItems
    .map((item) => item.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-[var(--color-border)] px-4">
          <Link href="/" aria-label="Luzon Prime Realtors home" className="flex items-center gap-2">
            <Logo width={28} height={29} className="h-7 w-7 shrink-0" />
            {!collapsed && (
              <span className="font-heading text-sm font-bold tracking-wide text-[var(--color-heading)]">
                LPR
              </span>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks navItems={navItems} activeHref={activeHref} collapsed={collapsed} />
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              aria-hidden
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-4">
                <Link href="/" aria-label="Luzon Prime Realtors home" onClick={onCloseMobile} className="flex items-center gap-2">
                  <Logo width={28} height={29} className="h-7 w-7" />
                  <span className="font-heading text-sm font-bold tracking-wide text-[var(--color-heading)]">
                    LPR
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)]"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <NavLinks
                  navItems={navItems}
                  activeHref={activeHref}
                  collapsed={false}
                  onNavigate={onCloseMobile}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
