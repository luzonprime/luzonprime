import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center">
      <Image src="/logo.png" alt="LuzonPrime" width={160} height={163} className="mb-6" priority />
      <span className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        Coming Soon
      </span>
      <h1 className="font-heading max-w-2xl text-4xl font-bold text-[var(--color-primary)] sm:text-5xl dark:text-[var(--color-text)]">
        LuzonPrime
      </h1>
      <p className="mt-4 max-w-xl text-lg text-[var(--color-text-muted)]">
        Your trusted partner for buying, selling, and renting prime real
        estate. We&apos;re putting the finishing touches on the site.
      </p>
      <a
        href="mailto:info@luzonprime.com"
        className="mt-8 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)]"
      >
        Get in touch
      </a>
    </div>
  );
}
