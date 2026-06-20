"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import { matchBuyAbility, submitBuyAbility } from "@/app/actions/buyability";
import { CREDIT_OPTIONS, estimateBudget } from "@/lib/buyability";
import { BASE_CURRENCY, formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/components/shared/CurrencyProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/shared/Skeleton";
import { Price } from "@/components/shared/Price";
import type { Property } from "@/types";

const selectClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]";

const REQUIRED: { key: "annual_income" | "down_payment" | "monthly_debt" | "credit_score"; label: string }[] = [
  { key: "annual_income", label: "Annual income" },
  { key: "down_payment", label: "Down payment" },
  { key: "monthly_debt", label: "Monthly debt" },
  { key: "credit_score", label: "Credit score" },
];

export function BuyAbilityForm({
  defaultEmail = "",
  locations = [],
  preselected,
}: {
  defaultEmail?: string;
  locations?: string[];
  preselected?: { id: string; title: string; price: number | null; city: string | null };
}) {
  const fromListing = !!preselected;
  const { currency, rates } = useCurrency();
  const rate = rates[currency] ?? 1;

  const [form, setForm] = useState({
    location: preselected?.city ?? "",
    credit_score: "",
    annual_income: "",
    down_payment: "",
    monthly_debt: "",
    email: defaultEmail,
  });
  const [selected, setSelected] = useState<Property[]>([]);
  const [matches, setMatches] = useState<Property[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [committedBudget, setCommittedBudget] = useState(0); // in selected currency
  const [budgetTyping, setBudgetTyping] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  const missing = REQUIRED.filter((r) => !form[r.key]);

  // Debounced budget (300ms) — shimmer while typing.
  useEffect(() => {
    if (fromListing) return;
    if (missing.length > 0) {
      setCommittedBudget(0);
      setBudgetTyping(false);
      return;
    }
    setBudgetTyping(true);
    const t = setTimeout(() => {
      setCommittedBudget(
        estimateBudget({
          annual_income: Number(form.annual_income) || 0,
          down_payment: Number(form.down_payment) || 0,
          monthly_debt: Number(form.monthly_debt) || 0,
          credit_score: form.credit_score,
        })
      );
      setBudgetTyping(false);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.annual_income, form.down_payment, form.monthly_debt, form.credit_score, fromListing]);

  const budgetNgn =
    currency === BASE_CURRENCY ? committedBudget : rate ? committedBudget / rate : committedBudget;

  // Debounced live recommendations (300ms) — shimmer while loading.
  useEffect(() => {
    if (fromListing || committedBudget <= 0) {
      setMatches([]);
      return;
    }
    setMatchesLoading(true);
    const t = setTimeout(async () => {
      const m = await matchBuyAbility(Math.round(budgetNgn), form.location || null);
      setMatches(m);
      setMatchesLoading(false);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committedBudget, form.location, currency, fromListing]);

  // From-listing: the property is pre-selected; budget = its price.
  const fromListingBudgetNgn = preselected?.price ?? 0;
  const preselectedList = useMemo(
    () =>
      preselected
        ? [{ id: preselected.id, title: preselected.title, price: preselected.price } as Property]
        : [],
    [preselected]
  );

  function toggle(p: Property) {
    setSelected((prev) =>
      prev.some((x) => x.id === p.id) ? prev.filter((x) => x.id !== p.id) : [...prev, p]
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ids = fromListing ? [preselected!.id] : selected.map((p) => p.id);
    startTransition(async () => {
      try {
        await submitBuyAbility({
          property_id: preselected?.id ?? null,
          email: form.email,
          location: form.location || null,
          credit_score: form.credit_score || null,
          annual_income: Number(form.annual_income) || null,
          down_payment: Number(form.down_payment) || null,
          monthly_debt: Number(form.monthly_debt) || null,
          selectedIds: ids,
        });
        setDone(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-8 text-center">
        <p className="font-heading text-xl font-bold text-[var(--color-text)]">
          Thanks — we&apos;ve got your Buy-Ability request.
        </p>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Our team will reach out by email with tailored options shortly.
        </p>
      </div>
    );
  }

  const budgetDisplay = fromListing ? fromListingBudgetNgn : committedBudget;

  return (
    <form onSubmit={onSubmit}>
      {!fromListing && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text)]">Location</label>
            {locations.length === 0 ? (
              <input
                disabled
                placeholder="No location exist"
                className={`${selectClass} opacity-60`}
              />
            ) : (
              <>
                <input
                  list="ba-locations"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Search locations…"
                  className={selectClass}
                />
                <datalist id="ba-locations">
                  {locations.map((l) => (
                    <option key={l} value={l} />
                  ))}
                </datalist>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text)]">Credit score</label>
            <select
              value={form.credit_score}
              onChange={(e) => set("credit_score", e.target.value)}
              className={selectClass}
            >
              <option value="">Select…</option>
              {CREDIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label={`Annual income (${currency})`}
            type="number"
            min={0}
            placeholder="Pre-tax, per year"
            value={form.annual_income}
            onChange={(e) => set("annual_income", e.target.value)}
          />
          <Input
            label={`Down payment (${currency})`}
            type="number"
            min={0}
            value={form.down_payment}
            onChange={(e) => set("down_payment", e.target.value)}
          />
          <Input
            label={`Monthly debt (${currency})`}
            type="number"
            min={0}
            placeholder="Loans, cards, alimony"
            value={form.monthly_debt}
            onChange={(e) => set("monthly_debt", e.target.value)}
          />
          <Input
            label="Email address"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
      )}

      {fromListing && (
        <Input
          label="Email address"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className="max-w-md"
        />
      )}

      {/* Estimated budget box */}
      <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
          Estimated budget
        </p>
        {!fromListing && missing.length > 0 ? (
          <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
            Add your {missing.map((m) => m.label.toLowerCase()).join(", ")} to see it.
          </p>
        ) : budgetTyping ? (
          <Skeleton className="mt-2 h-8 w-40" />
        ) : (
          <p className="text-2xl font-bold text-[var(--color-heading)]">
            {fromListing ? (
              <Price amount={budgetDisplay} />
            ) : (
              formatCurrency(budgetDisplay, currency)
            )}
          </p>
        )}
      </div>

      {/* Homes within your Buy-Ability */}
      <div className="mt-8">
        <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">
          Homes within your Buy-Ability
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Estimated budget{" "}
          {fromListing ? (
            <Price amount={budgetDisplay} className="font-semibold text-[var(--color-heading)]" />
          ) : missing.length > 0 || budgetTyping ? (
            <span className="font-semibold text-[var(--color-heading)]">—</span>
          ) : (
            <span className="font-semibold text-[var(--color-heading)]">
              {formatCurrency(budgetDisplay, currency)}
            </span>
          )}
        </p>

        <div className="mt-5">
          {(fromListing ? preselectedList : matches).length === 0 && !matchesLoading ? (
            <p className="rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-text-muted)]">
              {fromListing
                ? "Selected property will be saved with your request."
                : missing.length > 0
                  ? "Fill the fields above to see matched homes."
                  : "No buy-ability homes match yet — submit and our team will follow up."}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchesLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                      <Skeleton className="aspect-[4/3] rounded-none" />
                      <div className="space-y-2 p-4">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                : (fromListing ? preselectedList : matches).map((p) => {
                    const isSel = fromListing || selected.some((x) => x.id === p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => !fromListing && toggle(p)}
                        className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all ${
                          isSel
                            ? "border-green-600 ring-2 ring-green-600/30"
                            : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-[var(--color-bg-muted)]">
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt={p.title} fill sizes="33vw" className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                              <MapPin size={24} />
                            </div>
                          )}
                          {isSel && (
                            <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                              <Check size={14} />
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <Price amount={p.price} fallback={p.price_label} className="text-sm font-bold text-[var(--color-heading)]" />
                          <p className="mt-0.5 truncate text-sm font-medium text-[var(--color-text)]">{p.title}</p>
                          {(p.area || p.city) && (
                            <p className="truncate text-xs text-[var(--color-text-muted)]">
                              {[p.area, p.city].filter(Boolean).join(", ")}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
            </div>
          )}
          {!fromListing && selected.length > 0 && (
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              {selected.length} selected — these are saved with your request.
            </p>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isPending} className="mt-6">
        {isPending ? "Submitting…" : "Get your Buy-Ability"}
      </Button>
    </form>
  );
}
