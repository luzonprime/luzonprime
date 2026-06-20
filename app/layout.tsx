import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { CurrencyProvider } from "@/components/shared/CurrencyProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luzonprime.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Luzon Prime Realtors | Find Your Prime Property",
    template: "%s | Luzon Prime Realtors",
  },
  description:
    "Luzon Prime Realtors helps you buy, sell, and rent properties with confidence — across multiple cities and currencies.",
  applicationName: "Luzon Prime Realtors",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Luzon Prime Realtors",
    title: "Luzon Prime Realtors | Find Your Prime Property",
    description:
      "Buy, sell, and rent prime real estate with confidence — across multiple cities and currencies.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Luzon Prime Realtors | Find Your Prime Property",
    description:
      "Buy, sell, and rent prime real estate with confidence — across multiple cities and currencies.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Luzon Prime Realtors",
  url: siteUrl,
  email: "support@luzonprime.com",
  description:
    "A premium real estate company connecting buyers, investors, and developers to high-value property across multiple cities and currencies.",
  areaServed: "Global",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Luzon Prime Realtors",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/listings?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${playfair.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light">
          <CurrencyProvider>
            <SiteChrome>{children}</SiteChrome>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
