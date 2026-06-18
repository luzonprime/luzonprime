"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CurrencySwitcher } from "@/components/shared/CurrencySwitcher";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/agents", label: "Agents" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/client");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function resolveDashboard(userId: string) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      const role = (profile as { role?: string } | null)?.role;
      setDashboardHref(
        role === "admin" ? "/admin" : role === "agent" ? "/agent" : "/client"
      );
    }

    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
      if (data.user) resolveDashboard(data.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) resolveDashboard(session.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-md transition-shadow",
          scrolled
            ? "border-[var(--color-border)] bg-[var(--color-surface)]/95 shadow-md"
            : "border-transparent bg-[var(--color-surface)]/80"
        )}
      >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-[1.125rem] lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Logo priority className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
          <span className="font-heading hidden truncate text-base font-bold text-[var(--color-heading)] sm:inline sm:text-lg">
            Luzon Prime Realtors
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CurrencySwitcher />
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              href={dashboardHref}
              className="flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)]"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)]"
            >
              Log in
            </Link>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text)]"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
              aria-hidden
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col overflow-y-auto bg-[var(--color-bg)] px-6 py-4 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Logo width={32} height={33} className="h-8 w-8" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)]"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="mt-10 flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-heading text-2xl font-semibold text-[var(--color-text)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-10 flex items-center justify-between border-t border-[var(--color-border)] pt-6">
                <span className="text-sm font-medium text-[var(--color-text-muted)]">
                  Theme
                </span>
                <ThemeToggle />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text-muted)]">
                  Currency
                </span>
                <CurrencySwitcher />
              </div>

              <div className="mt-auto pt-6">
                {isLoggedIn ? (
                  <Link
                    href={dashboardHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-center text-sm font-semibold text-white"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-full bg-[var(--color-primary)] px-5 py-3 text-center text-sm font-semibold text-white"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
