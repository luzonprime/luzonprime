"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

// Routes that render their own full-screen dashboard chrome (sidebar + topbar).
// The public navbar/footer/WhatsApp FAB must never appear here.
const DASHBOARD_PREFIXES = ["/admin", "/agent", "/client"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isDashboard = DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isDashboard) {
    // Dashboard fills the viewport; its own layout provides sidebar + topbar.
    return (
      <MotionConfig reducedMotion="user">
        <main className="flex min-h-screen flex-1 flex-col">{children}</main>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="flex flex-1 flex-col pt-16 sm:pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
    </MotionConfig>
  );
}
