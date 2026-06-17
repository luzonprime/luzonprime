export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#F7F8FA] px-6 text-center dark:bg-[#0F1623]">
      <span className="mb-4 text-sm font-medium uppercase tracking-widest text-[#C9A84C]">
        Coming Soon
      </span>
      <h1 className="max-w-2xl text-4xl font-bold text-[#1B2D5B] sm:text-5xl dark:text-[#F3F4F6]">
        LuzonPrime
      </h1>
      <p className="mt-4 max-w-xl text-lg text-[#6B7280] dark:text-[#9CA3AF]">
        Your trusted partner for buying, selling, and renting prime real
        estate. We&apos;re putting the finishing touches on the site.
      </p>
      <a
        href="mailto:info@luzonprime.com"
        className="mt-8 rounded-full bg-[#1B2D5B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2A4080]"
      >
        Get in touch
      </a>
    </div>
  );
}
