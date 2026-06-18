"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { cn } from "@/lib/utils";

export function DashboardShell({
  title,
  navItems,
  children,
}: {
  title: string;
  navItems: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? "";

  // The header shows the active section's name (e.g. "Properties"), not the role.
  const activeItem = navItems
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  const sectionTitle = activeItem?.label ?? title;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar
        navItems={navItems}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200",
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        )}
      >
        <TopBar pageTitle={sectionTitle} onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-[1.125rem]">{children}</main>
      </div>
    </div>
  );
}
