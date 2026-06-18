"use client";

import { useCurrency } from "@/components/shared/CurrencyProvider";
import { BASE_CURRENCY, formatCurrency } from "@/lib/currency";

/**
 * Renders a base-currency (NGN) amount converted to the user's selected /
 * detected currency. Falls back to a label or "Price on request" when there
 * is no amount, and to the base currency when no rate is available.
 */
export function Price({
  amount,
  fallback,
  className,
}: {
  amount: number | null | undefined;
  fallback?: string | null;
  className?: string;
}) {
  const { currency, rates } = useCurrency();

  if (amount == null) {
    return <span className={className}>{fallback ?? "Price on request"}</span>;
  }

  const rate = rates[currency];
  const displayCurrency = rate != null ? currency : BASE_CURRENCY;
  const converted = rate != null ? amount * rate : amount;

  return (
    <span className={className} suppressHydrationWarning>
      {formatCurrency(converted, displayCurrency)}
    </span>
  );
}
