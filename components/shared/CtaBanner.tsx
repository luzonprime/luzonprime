import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

type CtaLink = { href: string; label: string };

export function CtaBanner({
  title,
  description,
  primary,
  secondary,
  image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=70",
}: {
  title: string;
  description: string;
  primary: CtaLink;
  secondary?: CtaLink;
  image?: string;
}) {
  return (
    <AnimatedSection className="relative overflow-hidden rounded-3xl">
      <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
      <div className="absolute inset-0 bg-[#091f46]/88" />
      <div className="relative px-6 py-12 text-center sm:px-12">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={primary.href}
            className="rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-transform hover:-translate-y-0.5"
          >
            {primary.label}
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
