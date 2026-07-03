"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LayoutDashboard, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CurrencySwitcher } from "@/components/shared/CurrencySwitcher";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

// Fallbacks used until admin-managed nav_items load (and if none exist).
const DEFAULT_POPULAR: NavLink = { href: "/listings", label: "Listings" };
const DEFAULT_INLINE: NavLink[] = [
  { href: "/agents", label: "Agents" },
  { href: "/services", label: "Services" },
];
const DEFAULT_MORE: NavLink[] = [
  { href: "/interior-designs", label: "Interior Designs" },
  { href: "/buy-ability", label: "Buy-Ability" },
  { href: "/about", label: "About" },
  { href: "/members", label: "Members" },
  { href: "/partners", label: "Partners" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname() ?? "";
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popular, setPopular] = useState<NavLink>(DEFAULT_POPULAR);
  const [inline, setInline] = useState<NavLink[]>(DEFAULT_INLINE);
  const [more, setMore] = useState<NavLink[]>(DEFAULT_MORE);
  const allLinks: NavLink[] = [{ href: "/", label: "Home" }, popular, ...inline, ...more];

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("nav_items")
      .select("label, href, grp, sort_order")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const toLink = (d: { href: string; label: string }) => ({ href: d.href, label: d.label });
        const pop = data.filter((d) => d.grp === "popular").map(toLink);
        const inl = data.filter((d) => d.grp === "inline").map(toLink);
        const mor = data.filter((d) => d.grp === "more").map(toLink);
        if (pop[0]) setPopular(pop[0]);
        if (inl.length) setInline(inl);
        if (mor.length) setMore(mor);
      });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
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

  // Transparent over hero media on the homepage until scrolled.
  const transparent = isHome && !scrolled;
  const linkCls = transparent
    ? "text-white/90 hover:text-white"
    : "text-[var(--color-text)] hover:text-[var(--color-primary)]";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-300",
          transparent
            ? "border-transparent bg-transparent"
            : "border-[var(--color-border)] bg-[var(--color-surface)]/95 shadow-sm backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-[1.125rem] lg:px-8">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Luzon Prime Realtors home">
            {transparent ? (
              <Image src="/logo.png" alt="Luzon Prime Realtors" width={56} height={57} priority className="h-12 w-12 sm:h-14 sm:w-14" />
            ) : (
              <Logo priority className="h-11 w-11 sm:h-12 sm:w-12" />
            )}
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            <Link href={popular.href} className={cn("text-sm font-semibold transition-colors", linkCls)}>
              {popular.label}
            </Link>
            <span className={cn("h-5 w-px", transparent ? "bg-white/30" : "bg-[var(--color-border)]")} />
            {inline.map((link) => (
              <Link key={link.href} href={link.href} className={cn("text-sm font-medium transition-colors", linkCls)}>
                {link.label}
              </Link>
            ))}
            <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                onMouseEnter={() => setMoreOpen(true)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className={cn("flex items-center gap-1 text-sm font-medium transition-colors", linkCls)}
              >
                More
                <ChevronDown size={14} className={cn("transition-transform", moreOpen && "rotate-180")} />
              </button>
              {moreOpen && (
                <div role="menu" className="absolute right-0 top-full w-44 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
                  {more.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <CurrencySwitcher onMedia={transparent} />
            <ThemeToggle onMedia={transparent} />
            {isLoggedIn ? (
              <Link
                href="/dashboard"
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
            <ThemeToggle onMedia={transparent} />
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                transparent ? "text-white" : "text-[var(--color-text)]"
              )}
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
                {allLinks.map((link) => (
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
                <span className="text-sm font-medium text-[var(--color-text-muted)]">Theme</span>
                <ThemeToggle />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text-muted)]">Currency</span>
                <CurrencySwitcher />
              </div>

              <div className="mt-auto pt-6">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
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
