"use client";

import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/components/shared/CurrencyProvider";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={cn("relative", className)}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        aria-label="Display currency"
        className="appearance-none rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-3 pr-7 text-xs font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
      >
        {SUPPORTED_CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        aria-hidden
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
      />
    </div>
  );
}
