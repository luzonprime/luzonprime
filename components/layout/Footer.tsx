"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/shared/Logo";

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
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { href: "https://facebook.com", icon: FacebookIcon, label: "Facebook" },
  { href: "https://instagram.com", icon: InstagramIcon, label: "Instagram" },
  { href: "https://twitter.com", icon: XIcon, label: "Twitter" },
  { href: "https://linkedin.com", icon: LinkedinIcon, label: "LinkedIn" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

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
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-muted)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Logo width={32} height={33} />
              <span className="font-heading text-lg font-bold text-[var(--color-heading)]">
                Luzon Prime
              </span>
            </Link>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Your trusted partner for buying, selling, and renting prime
              real estate.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Quick links
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
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
              <li>info@luzonprime.com</li>
              <li>support@luzonprime.com</li>
            </ul>
            <div className="mt-4 flex gap-3">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Newsletter
            </h3>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Get the latest listings and market insights.
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex flex-col gap-2">
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </Button>
              {status === "done" && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  Thanks for subscribing!
                </span>
              )}
              {status === "error" && (
                <span className="text-xs text-red-500">
                  Something went wrong, please try again.
                </span>
              )}
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Luzon Prime Realtors. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
