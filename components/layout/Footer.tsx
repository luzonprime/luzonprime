"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/shared/Logo";
import { SkylineSketch } from "@/components/home/SkylineSketch";
import { createClient } from "@/lib/supabase/client";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.4 8.46L23 22h-6.9l-5.4-7.07L4.6 22H1.5l7.93-9.06L1 2h7l4.9 6.47L18.9 2Zm-2.42 18h1.9L8.6 4H6.6l9.88 16Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0H14v1.7c.63-.95 1.97-1.95 4-1.95 3.06 0 5 2 5 5.75V21h-4v-5.7c0-1.7-.6-2.85-2.1-2.85-1.14 0-1.84.78-2.14 1.53-.11.27-.16.65-.16 1.03V21H9.5V9Z" />
    </svg>
  );
}

const FOOTER_LINKS = [
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/agents", label: "Agents" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

// Fallback contact details, used until/unless admin overrides them in site_settings.
const LEGAL_EMAIL = "legal.team@luzonprime.com";
const DEFAULT_EMAIL = "support@luzonprime.com";
const DEFAULT_PHONE_DISPLAY = "0906 679 2730";
const DEFAULT_PHONE_TEL = "+2349066792730";

type FooterSettings = {
  contact_email: string | null;
  contact_phone: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
};

// Strip spaces/dashes so a display phone like "0906 679 2730" still makes a valid tel: link.
function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [settings, setSettings] = useState<FooterSettings | null>(null);

  // site_settings is publicly readable (RLS: select for anyone). Mirror the
  // Navbar's pattern of loading admin-managed config client-side.
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("contact_email, contact_phone, facebook_url, instagram_url, twitter_url, linkedin_url")
      .eq("id", 1)
      .single()
      .then(({ data }) => setSettings(data as FooterSettings | null));
  }, []);

  const contactEmail = settings?.contact_email ?? DEFAULT_EMAIL;
  const contactPhone = settings?.contact_phone ?? null;
  const phoneDisplay = contactPhone ?? DEFAULT_PHONE_DISPLAY;
  const phoneTel = contactPhone ? telHref(contactPhone) : `tel:${DEFAULT_PHONE_TEL}`;

  const socials = [
    { href: settings?.facebook_url, icon: FacebookIcon, label: "Facebook" },
    { href: settings?.instagram_url, icon: InstagramIcon, label: "Instagram" },
    { href: settings?.twitter_url, icon: XIcon, label: "Twitter" },
    { href: settings?.linkedin_url, icon: LinkedinIcon, label: "LinkedIn" },
  ].filter((s): s is { href: string; icon: typeof FacebookIcon; label: string } => Boolean(s.href));

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg-muted)]">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-44 pt-12 sm:px-[1.125rem] sm:pb-52 lg:px-8">
        {/* Brand + newsletter */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Logo width={32} height={33} />
              <span className="font-heading text-lg font-bold text-[var(--color-heading)]">
                Luzon Prime Realtors
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-[var(--color-text-muted)]">
              Your trusted partner for buying, selling, and renting prime real
              estate — across multiple cities and currencies.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Newsletter
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Get the latest listings and market insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                required
                aria-label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sm:flex-1"
              />
              <Button type="submit" disabled={status === "loading"} className="shrink-0">
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
            {status === "done" && (
              <span className="mt-2 block text-xs text-[var(--color-text-muted)]">
                Thanks for subscribing!
              </span>
            )}
            {status === "error" && (
              <span className="mt-2 block text-xs text-red-500">
                Something went wrong, please try again.
              </span>
            )}
          </div>
        </div>

        {/* Sections stack vertically on mobile; 2 columns of links inside Quick links */}
        <div className="mt-10 grid grid-cols-1 gap-8 border-t border-[var(--color-border)] pt-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Quick links
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Contact
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)] dark:text-[var(--color-accent)]" />
                <span>
                  1 Kudang Street, Wuse 2
                  <br />
                  Abuja, Nigeria
                </span>
              </li>
              <li>
                <a href={`mailto:${LEGAL_EMAIL}`} className="hover:text-[var(--color-primary)]">
                  {LEGAL_EMAIL}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-[var(--color-primary)]">
                  {contactEmail}
                </a>
              </li>
              <li>
                <a href={phoneTel} className="hover:text-[var(--color-primary)]">
                  {phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          {socials.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Follow us on
              </h3>
              <div className="mt-3 flex w-fit gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                  >
                    <Icon width={16} height={16} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-xs text-[var(--color-text-muted)] sm:text-left">
          © {new Date().getFullYear()} Luzon Prime Realtors. All rights reserved.
        </div>
      </div>

      {/* City skyline silhouette anchored to the footer bottom:
          dark navy on light backgrounds, grey on dark backgrounds. */}
      <SkylineSketch
        aria-hidden
        strokeWidth={1.8}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 w-full text-[var(--color-primary)] opacity-55 dark:text-[#9aa3b2] dark:opacity-60 sm:h-44"
      />
    </footer>
  );
}
