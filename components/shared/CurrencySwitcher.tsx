"use client";

import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/components/shared/CurrencyProvider";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencySwitcher({
  className,
  onMedia = false,
}: {
  className?: string;
  onMedia?: boolean;
}) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={cn("relative", className)}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        aria-label="Display currency"
        className={cn(
          "appearance-none rounded-full border py-1.5 pl-3 pr-7 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30",
          onMedia
            ? "border-white/40 bg-white/10 text-white [&>option]:text-[var(--color-text)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
        )}
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
        className={cn(
          "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2",
          onMedia ? "text-white" : "text-[var(--color-text-muted)]"
        )}
      />
    </div>
  );
}
