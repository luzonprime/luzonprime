"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_desc", label: "Price (high to low)" },
  { value: "price_asc", label: "Price (low to high)" },
  { value: "beds_desc", label: "Most bedrooms" },
  { value: "baths_desc", label: "Most bathrooms" },
  { value: "size_desc", label: "Largest (sq m)" },
];

export function ListingsSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    const qs = params.toString();
    router.push(`/listings${qs ? `?${qs}` : ""}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
      <ArrowUpDown size={15} className="shrink-0" />
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort listings"
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
