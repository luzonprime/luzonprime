import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  pageCount,
  makeHref,
}: {
  currentPage: number;
  pageCount: number;
  makeHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  const windowSize = 5;
  let start = Math.max(1, currentPage - 2);
  const end = Math.min(pageCount, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {currentPage > 1 ? (
        <Link href={makeHref(currentPage - 1)} aria-label="Previous page" className={cn(base, "border border-[var(--color-border)] hover:bg-[var(--color-bg-muted)]")}>
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span aria-disabled className={cn(base, "border border-[var(--color-border)] opacity-40")}>
          <ChevronLeft size={18} />
        </span>
      )}

      {start > 1 && (
        <span className="px-1 text-sm text-[var(--color-text-muted)]">…</span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={makeHref(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={cn(
            base,
            p === currentPage
              ? "bg-[var(--color-primary)] text-white"
              : "border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]"
          )}
        >
          {p}
        </Link>
      ))}

      {end < pageCount && (
        <span className="px-1 text-sm text-[var(--color-text-muted)]">…</span>
      )}

      {currentPage < pageCount ? (
        <Link href={makeHref(currentPage + 1)} aria-label="Next page" className={cn(base, "border border-[var(--color-border)] hover:bg-[var(--color-bg-muted)]")}>
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span aria-disabled className={cn(base, "border border-[var(--color-border)] opacity-40")}>
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
