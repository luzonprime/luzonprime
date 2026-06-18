import { SkylineSketch } from "@/components/home/SkylineSketch";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export function BlueprintStatement() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-bg)] px-4 py-20 sm:px-[1.125rem]">
      <SkylineSketch
        aria-hidden
        strokeWidth={1.4}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full text-[var(--color-primary)] opacity-[0.07] dark:text-white dark:opacity-[0.09]"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <AnimatedSection>
          <h2 className="font-heading text-3xl font-bold leading-tight text-[var(--color-text)] sm:text-4xl md:text-5xl">
            A premium real estate company, creating value through trusted
            property expertise.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--color-text-muted)]">
            We connect buyers, investors, and developers to high-value real
            estate across multiple cities and currencies. From residential homes
            to commercial spaces and off-plan opportunities, we deliver trusted
            guidance backed by market insight and experience.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
