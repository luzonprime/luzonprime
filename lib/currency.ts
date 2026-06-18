// Multi-currency config. Stored property prices are in BASE_CURRENCY (NGN);
// display prices are converted to the user's detected/selected currency.

export const BASE_CURRENCY = "NGN";

export interface CurrencyDef {
  code: string;
  label: string;
}

export const SUPPORTED_CURRENCIES: CurrencyDef[] = [
  { code: "NGN", label: "Nigerian Naira" },
  { code: "USD", label: "US Dollar" },
  { code: "GBP", label: "British Pound" },
  { code: "EUR", label: "Euro" },
  { code: "GHS", label: "Ghanaian Cedi" },
  { code: "ZAR", label: "South African Rand" },
  { code: "AED", label: "UAE Dirham" },
  { code: "CAD", label: "Canadian Dollar" },
];

const SUPPORTED_CODES = new Set(SUPPORTED_CURRENCIES.map((c) => c.code));

// ISO country code -> display currency (only mapped to supported currencies).
const COUNTRY_CURRENCY: Record<string, string> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  GH: "GHS",
  ZA: "ZAR",
  AE: "AED",
  CA: "CAD",
  // Eurozone
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", IE: "EUR",
  PT: "EUR", BE: "EUR", AT: "EUR", FI: "EUR", GR: "EUR", LU: "EUR",
};

export function currencyForCountry(country?: string | null): string {
  if (!country) return "USD";
  return COUNTRY_CURRENCY[country.toUpperCase()] ?? "USD";
}

export function isSupportedCurrency(code: string | null | undefined): boolean {
  return !!code && SUPPORTED_CODES.has(code);
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Unknown currency code — fall back to a plain number with the code.
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}
