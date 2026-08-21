import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  Eye,
  Globe,
  Handshake,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Radio,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Tv,
} from "lucide-react";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";
import { CtaBanner } from "@/components/shared/CtaBanner";
import { SpiralRings } from "@/components/luzon-media/SpiralRings";
import { CertificateViewer } from "@/components/luzon-media/CertificateViewer";

export const metadata: Metadata = {
  title: "Luzon Media | Luzon Prime Realtors",
  description:
    "Luzon Media is the group's 360° marketing communication agency — outdoor (OOH), radio, television, digital marketing, media planning & buying, communications strategy and media consultancy. ARCON registered, Abuja.",
  alternates: { canonical: "/luzon-media" },
  openGraph: {
    title: "Luzon Media — Your 360° Powerhouse",
    description:
      "Outdoor, radio, television, digital, media planning & buying and communications strategy from Luzon Media, ARCON-registered and headquartered in Abuja.",
    url: "/luzon-media",
    type: "website",
  },
};

// Contact details as published in the Luzon Media company profile.
const CONTACT = {
  phoneDisplay: "0802 513 2290",
  phoneTel: "+2348025132290",
  email: "Luzonmedia.ng@gmail.com",
  location: "Federal Capital Territory, Abuja",
};

const PILLARS = [
  {
    icon: Target,
    title: "Our purpose",
    description:
      "To help brands be seen, heard, and remembered across every platform — bridging the gap between big ideas and real impact.",
  },
  {
    icon: Rocket,
    title: "Our mission",
    description:
      "To empower brands with full-spectrum, creative, data-driven media solutions that deliver visibility, engagement, and lasting impact.",
  },
  {
    icon: Eye,
    title: "Our vision",
    description:
      "To be Africa's most trusted and innovative 360° media powerhouse, delivering bold strategy, integrated marketing, and brand experiences that connect and grow.",
  },
];

const SERVICES = [
  {
    icon: Megaphone,
    title: "Outdoor Advertising (OOH)",
    description:
      "Billboards, transit and strategic outdoor placements — location-based campaigns positioned where your audience actually is.",
  },
  {
    icon: Radio,
    title: "Radio Advertising",
    description:
      "Airtime planning, placement, negotiation and end-to-end campaign management across Nigeria's highest-penetration stations.",
  },
  {
    icon: Globe,
    title: "Digital Marketing",
    description:
      "Social media, digital campaigns, performance marketing and online audience acquisition built around measurable outcomes.",
  },
  {
    icon: Target,
    title: "Media Planning & Buying",
    description:
      "Audience research, media selection, budget allocation, negotiation and continuous campaign optimisation.",
  },
  {
    icon: Tv,
    title: "Television Media Buying",
    description:
      "Television airtime procurement and campaign placement with the networks, broadcasters and satellite platforms that matter.",
  },
  {
    icon: Compass,
    title: "Communications Strategy",
    description:
      "Integrated communication planning, brand positioning, campaign strategy and messaging that holds together across channels.",
  },
  {
    icon: Handshake,
    title: "Media Consultancy",
    description:
      "Deciding where, when and how to spend your advertising budget for maximum reach and effectiveness.",
  },
];

const DEFINING_WORDS = [
  {
    icon: TrendingUp,
    word: "Growth",
    description:
      "We don't just drive campaigns, we drive growth — for our clients' brands, our people, and every market we serve.",
  },
  {
    icon: ShieldCheck,
    word: "Accountability",
    description:
      "We lead with transparency and deliver with integrity: open books, measurable outcomes, best practice from strategy to execution.",
  },
  {
    icon: BadgeCheck,
    word: "Value",
    description:
      "We create more without costing more, combining creativity, efficiency and smart strategy to maximise results.",
  },
];

const PARTNERS = [
  {
    name: "Nigerian Breweries Plc",
    logo: "/luzon-media/partner-nigerian-breweries.png",
  },
  {
    name: "Zee World",
    logo: "/luzon-media/partner-zee-world.png",
  },
];

const ACCREDITATION = [
  { label: "Regulator", value: "Advertising Regulatory Council of Nigeria (ARCON)" },
  { label: "Membership number", value: "9186" },
  { label: "Grade", value: "Associate Member — Registered Practitioner in Advertising (arpa)" },
  { label: "Registered", value: "28 September 2023" },
  { label: "In the name of", value: "Odusanya Lucy Folasade" },
];

export default function LuzonMediaPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      {/* Hero ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-[#0A1B33] px-4 py-16 sm:px-[1.125rem] sm:py-20 lg:px-8">
        {/* The mark itself, bled off the right edge, with the ring engraving
            behind it for depth. Both sit under a scrim so the copy stays legible. */}
        <SpiralRings className="pointer-events-none absolute -right-28 -top-32 h-[40rem] w-[40rem] text-[#4FC8E4] opacity-[0.16] sm:-right-20 sm:h-[48rem] sm:w-[48rem]" />
        <Image
          src="/luzon-media/spiral-mark.png"
          alt=""
          aria-hidden
          width={595}
          height={645}
          className="pointer-events-none absolute -right-16 top-1/2 h-[26rem] w-auto -translate-y-1/2 opacity-40 sm:-right-4 sm:h-[32rem] lg:right-12"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0A1B33] via-[#0A1B33]/85 to-[#0A1B33]/20"
        />

        <div className="relative mx-auto max-w-6xl">
          <AnimatedSection>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/55 transition-colors hover:text-white"
            >
              A Luzon Prime Realtors company
            </Link>

            <Image
              src="/luzon-media/logo-on-dark.png"
              alt="Luzon Media"
              width={283}
              height={299}
              priority
              className="mt-6 h-28 w-auto sm:h-36"
            />

            <h1 className="font-heading mt-7 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
              Your 360° Powerhouse
            </h1>
            <p className="mt-3 text-base font-medium text-[#4FC8E4] sm:text-lg">
              Where ideas meet impact.
            </p>
            <p className="mt-5 max-w-2xl text-sm text-white/70 sm:text-base">
              A bold, forward-thinking 360° marketing communication agency
              headquartered in Abuja, Nigeria. Proudly Nigerian with a global
              outlook — a powerhouse of creativity, strategy and innovation
              delivering high-impact media and business solutions across
              diverse sectors.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#12A5C6] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Plan a campaign
                <ArrowRight size={16} />
              </Link>
              <a
                href="#services"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore services
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Introduction ------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-[1.125rem] lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <AnimatedSection>
            <span className="inline-block h-1 w-10 rounded-full bg-[#12A5C6]" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              About Luzon Media
            </h2>
            <p className="mt-4 text-sm text-[var(--color-text-muted)] sm:text-base">
              Founded and led by Folasade Lucy Odusanya, Luzon Media combines
              deep market knowledge with a dynamic team to help brands rise,
              stand out, and thrive in a competitive landscape. From startups
              and government agencies to luxury services and global media
              networks, we help clients create lasting visibility, engagement
              and success.
            </p>
            <p className="mt-4 text-sm text-[var(--color-text-muted)] sm:text-base">
              We believe every brand has a voice worth hearing — but in a
              saturated world it takes clarity, creativity and connection to
              make an impact. So we work to help brands cut through the noise,
              reach the right audience, and grow through experiences that are
              strategic, creative and measurable.
            </p>
            <blockquote className="mt-6 border-l-2 border-[#12A5C6] pl-5">
              <p className="font-heading text-lg font-semibold text-[var(--color-text)] sm:text-xl">
                We don&apos;t just run campaigns — we build platforms, shape
                narratives, and engineer results.
              </p>
            </blockquote>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="lg:pt-4">
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-8">
              <Image
                src="/luzon-media/spiral-mark.png"
                alt="The Luzon Media spiral mark"
                width={595}
                height={645}
                className="h-20 w-auto"
              />
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                The mark
              </p>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                The spiral circle stands for strategic flow, outreach and
                impact — how we amplify a message across multiple platforms.
                The circle is the spotlight: the space where we place our
                clients so they are seen, heard, and positioned for success.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {["Creativity", "Strategy", "Innovation", "Integrity", "Excellence", "Client success"].map(
                  (value) => (
                    <li
                      key={value}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)]"
                    >
                      {value}
                    </li>
                  )
                )}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Purpose / Mission / Vision ---------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-[1.125rem] lg:px-8">
        <AnimatedStagger className="grid gap-5 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <AnimatedStaggerItem key={title}>
              <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#12A5C6]/12 text-[#0E7E9B] dark:text-[#4FC8E4]">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {description}
                </p>
              </div>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </section>

      {/* Services ---------------------------------------------------------- */}
      <section
        id="services"
        className="scroll-mt-24 bg-[var(--color-bg-muted)] px-4 py-16 sm:px-[1.125rem]"
      >
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <span className="inline-block h-1 w-10 rounded-full bg-[#12A5C6]" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Our services
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
              End-to-end integrated marketing across every channel — planned,
              negotiated, placed and optimised in one place.
            </p>
          </AnimatedSection>

          <AnimatedStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, description }) => (
              <AnimatedStaggerItem key={title}>
                <div className="group h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#12A5C6]/12 text-[#0E7E9B] transition-colors group-hover:bg-[#12A5C6] group-hover:text-white dark:text-[#4FC8E4]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {description}
                  </p>
                </div>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Three words that define us ----------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[#12A5C6]" />
          <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Three words that define us
          </h2>
        </AnimatedSection>
        <AnimatedStagger className="mt-8 grid gap-5 sm:grid-cols-3">
          {DEFINING_WORDS.map(({ icon: Icon, word, description }) => (
            <AnimatedStaggerItem key={word}>
              <div className="relative h-full overflow-hidden rounded-2xl bg-[#0A1B33] p-6">
                <SpiralRings className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 text-[#4FC8E4] opacity-[0.14]" />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#4FC8E4]">
                  <Icon size={20} />
                </div>
                <h3 className="font-heading relative mt-4 text-xl font-bold text-white">
                  {word}
                </h3>
                <p className="relative mt-2 text-sm text-white/70">{description}</p>
              </div>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </section>

      {/* Partners ----------------------------------------------------------- */}
      <section className="bg-[var(--color-bg-muted)] px-4 py-16 sm:px-[1.125rem]">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <span className="inline-block h-1 w-10 rounded-full bg-[#12A5C6]" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Clients &amp; media partners
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
              Brands and networks we plan, negotiate and place campaigns with.
            </p>
          </AnimatedSection>

          <AnimatedStagger className="mt-8 grid grid-cols-2 gap-4 sm:max-w-2xl sm:gap-5">
            {PARTNERS.map((partner) => (
              <AnimatedStaggerItem key={partner.name}>
                <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:h-32">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 300px"
                    className="object-contain p-5"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
                  {partner.name}
                </p>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Accreditation ------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-[1.125rem] lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_460px] lg:items-start">
          <AnimatedSection>
            <span className="inline-block h-1 w-10 rounded-full bg-[#12A5C6]" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Registered &amp; accountable
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[var(--color-text-muted)] sm:text-base">
              Luzon Media practises under ARCON registration — the Advertising
              Regulatory Council of Nigeria, the statutory body that regulates
              advertising practice in the country. Every campaign we plan and
              place is handled by a registered practitioner.
            </p>

            <dl className="mt-8 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {ACCREDITATION.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] sm:w-52 sm:shrink-0">
                    {label}
                  </dt>
                  <dd className="text-sm text-[var(--color-text)]">{value}</dd>
                </div>
              ))}
            </dl>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <CertificateViewer
              src="/luzon-media/arcon-certificate.jpg"
              alt="ARCON certificate of registration for Luzon Media"
              caption="ARCON certificate of registration — click to enlarge."
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Contact ------------------------------------------------------------ */}
      <section className="bg-[var(--color-bg-muted)] px-4 py-16 sm:px-[1.125rem]">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <span className="inline-block h-1 w-10 rounded-full bg-[#12A5C6]" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Talk to Luzon Media
            </h2>
          </AnimatedSection>
          <AnimatedStagger className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { icon: Phone, label: "Phone", value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneTel}` },
              { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { icon: MapPin, label: "Location", value: CONTACT.location, href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <AnimatedStaggerItem key={label}>
                <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#12A5C6]/12 text-[#0E7E9B] dark:text-[#4FC8E4]">
                    <Icon size={20} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-1 block break-words text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[#0E7E9B]"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{value}</p>
                  )}
                </div>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-[1.125rem] lg:px-8">
        <CtaBanner
          title="Ready to put your brand in the spotlight?"
          description="Tell us your objective and budget — we'll come back with the channels, the plan and the numbers behind it."
          primary={{ href: "/contact", label: "Start a conversation" }}
          secondary={{ href: "/listings", label: "Back to Luzon Prime" }}
        />
      </section>
    </div>
  );
}
