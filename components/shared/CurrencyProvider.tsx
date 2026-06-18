"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BASE_CURRENCY, isSupportedCurrency } from "@/lib/currency";

interface CurrencyState {
  currency: string;
  setCurrency: (code: string) => void;
  rates: Record<string, number>;
  ready: boolean;
}

const CurrencyContext = createContext<CurrencyState | null>(null);
const STORAGE_KEY = "lp_currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState(BASE_CURRENCY);
  const [rates, setRates] = useState<Record<string, number>>({ [BASE_CURRENCY]: 1 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    fetch("/api/rates")
      .then((r) => r.json())
      .then((data: { base: string; detected: string; rates: Record<string, number> }) => {
        if (!active) return;
        if (data?.rates) setRates({ ...data.rates, [data.base]: 1 });
        // Stored user choice wins; otherwise use geo-detected currency.
        if (isSupportedCurrency(stored)) setCurrencyState(stored as string);
        else if (isSupportedCurrency(data?.detected)) setCurrencyState(data.detected);
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        if (isSupportedCurrency(stored)) setCurrencyState(stored as string);
        setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const setCurrency = useCallback((code: string) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, ready }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyState {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
