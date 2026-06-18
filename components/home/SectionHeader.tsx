import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  seeAllHref,
  seeAllLabel = "See all",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            <span className="h-1 w-8 rounded-full bg-[var(--color-primary)] dark:bg-white" />
            {eyebrow}
          </span>
        )}
        <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-[var(--color-primary)]"
        >
          {seeAllLabel}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
