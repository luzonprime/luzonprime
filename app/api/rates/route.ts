import { NextResponse } from "next/server";
import { BASE_CURRENCY, currencyForCountry } from "@/lib/currency";

// Detects the visitor's currency from geo headers and returns live FX rates
// (base = NGN). Rates are cached upstream for an hour; geo is per-request.
export async function GET(request: Request) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  const detected = currencyForCountry(country);

  let rates: Record<string, number> = { [BASE_CURRENCY]: 1 };
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.rates && typeof json.rates === "object") {
        rates = { ...json.rates, [BASE_CURRENCY]: 1 };
      }
    }
  } catch {
    // Network issue — client falls back to base currency display.
  }

  return NextResponse.json({ base: BASE_CURRENCY, detected, rates });
}
