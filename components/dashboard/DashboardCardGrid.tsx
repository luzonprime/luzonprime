"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

/**
 * Responsive card-grid shell for image-bearing dashboard records (properties,
 * users, agents). Mirrors DataTable's search/pagination UX but renders cards
 * that work across mobile, tablet, and desktop.
 */
export function DashboardCardGrid<T extends { id: string }>({
  rows,
  searchableText,
  renderCard,
  searchPlaceholder = "Search...",
  emptyMessage = "Nothing to show yet.",
  pageSize = 12,
}: {
  rows: T[];
  searchableText: (row: T) => string;
  renderCard: (row: T) => React.ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => searchableText(row).toLowerCase().includes(q));
  }, [rows, query, searchableText]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="relative mb-4 max-w-xs">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-sm text-[var(--color-text-muted)]">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((row) => (
              <div key={row.id}>{renderCard(row)}</div>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-text-muted)]">
              <span>
                Page {currentPage} of {pageCount}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--color-bg-muted)] disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage >= pageCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--color-bg-muted)] disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
