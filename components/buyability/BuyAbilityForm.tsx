"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Check, MapPin, Maximize, X } from "lucide-react";
import { matchBuyAbility, submitBuyAbility } from "@/app/actions/buyability";
import { CREDIT_OPTIONS, estimateBudget } from "@/lib/buyability";
import { BASE_CURRENCY, formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/components/shared/CurrencyProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/shared/Skeleton";
import { Price } from "@/components/shared/Price";
import { InfoTip } from "@/components/shared/InfoTip";
import type { Property } from "@/types";

const TIPS = {
  location: "Where you'd like to buy. We match buy-ability homes in this area.",
  credit: "Your credit band sets the mortgage rate used in the estimate — better credit, lower rate, higher budget.",
  income: "Your pre-tax yearly income. It's the main driver of how much you can afford.",
  down: "Cash you can pay upfront. It adds directly to your budget.",
  debt: "Existing monthly obligations (loans, cards, alimony). Higher debt lowers your budget.",
  email: "Where we'll send your estimate and tailored follow-up options.",
  homes:
    "Homes whose Buy-Ability amount — the eligible percentage of the price — fits your estimated budget (up to 10% above).",
};

const selectClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]";

const REQUIRED: { key: "annual_income" | "down_payment" | "monthly_debt" | "credit_score"; label: string }[] = [
  { key: "annual_income", label: "annual income" },
  { key: "down_payment", label: "down payment" },
  { key: "monthly_debt", label: "monthly debt" },
  { key: "credit_score", label: "credit score" },
];

export function BuyAbilityForm({
  defaultEmail = "",
  locations = [],
  preselected,
}: {
  defaultEmail?: string;
  locations?: string[];
  preselected?: Property;
}) {
  const fromListing = !!preselected;
  const fromListingEligible = preselected
    ? (preselected.price ?? 0) * ((preselected.buy_ability_percent ?? 100) / 100)
    : 0;
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
  const [selected, setSelected] = useState<Property[]>(preselected ? [preselected] : []);
  const [matches, setMatches] = useState<Property[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [committedBudget, setCommittedBudget] = useState(0); // selected currency
  const [budgetTyping, setBudgetTyping] = useState(false);
  const [detail, setDetail] = useState<Property | null>(null);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  const missing = REQUIRED.filter((r) => !form[r.key]);

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

  const results = fromListing ? [preselected!] : matches;
  const showResultsSection = fromListing || committedBudget > 0 || matchesLoading;
  const isSelected = (p: Property) => selected.some((x) => x.id === p.id);

  function toggle(p: Property) {
    if (fromListing) return; // listing recommendation can't be deselected
    setSelected((prev) =>
      prev.some((x) => x.id === p.id) ? prev.filter((x) => x.id !== p.id) : [...prev, p]
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
          selectedIds: selected.map((p) => p.id),
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

  const estimatedNode = fromListing ? (
    <Price amount={fromListingEligible} className="font-semibold text-[var(--color-heading)]" />
  ) : (
    <span className="font-semibold text-[var(--color-heading)]">
      {formatCurrency(committedBudget, currency)}
    </span>
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-4">
        <p className="text-sm font-semibold text-[var(--color-text)]">How Buy-Ability works</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
          We estimate your budget from your income, debts, down payment, and credit
          score — using a 36% debt-to-income guideline over a 30-year term. Then we
          show buy-ability homes whose eligible amount (a set percentage of the
          price) fits that budget.
        </p>
      </div>

      {!fromListing && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)]">
              Location <InfoTip text={TIPS.location} />
            </label>
            {locations.length === 0 ? (
              <input disabled placeholder="No location exist" className={`${selectClass} opacity-60`} />
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
            <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text)]">
              Credit score <InfoTip text={TIPS.credit} />
            </label>
            <select value={form.credit_score} onChange={(e) => set("credit_score", e.target.value)} className={selectClass}>
              <option value="">Select…</option>
              {CREDIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <Input label={`Annual income (${currency})`} labelInfo={<InfoTip text={TIPS.income} />} type="number" min={0} placeholder="Pre-tax, per year" value={form.annual_income} onChange={(e) => set("annual_income", e.target.value)} />
          <Input label={`Down payment (${currency})`} labelInfo={<InfoTip text={TIPS.down} />} type="number" min={0} value={form.down_payment} onChange={(e) => set("down_payment", e.target.value)} />
          <Input label={`Monthly debt (${currency})`} labelInfo={<InfoTip text={TIPS.debt} />} type="number" min={0} placeholder="Loans, cards, alimony" value={form.monthly_debt} onChange={(e) => set("monthly_debt", e.target.value)} />
          <Input label="Email address" labelInfo={<InfoTip text={TIPS.email} />} type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
      )}

      {fromListing && (
        <Input label="Email address" labelInfo={<InfoTip text={TIPS.email} />} type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} className="max-w-md" />
      )}

      {/* Estimated budget */}
      <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Estimated budget</p>
        {!fromListing && missing.length > 0 ? (
          <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
            Add your {missing.map((m) => m.label).join(", ")} to see it.
          </p>
        ) : budgetTyping ? (
          <Skeleton className="mt-2 h-8 w-40" />
        ) : fromListing ? (
          <Price amount={fromListingEligible} className="text-2xl font-bold text-[var(--color-heading)]" />
        ) : (
          <p className="text-2xl font-bold text-[var(--color-heading)]">{formatCurrency(committedBudget, currency)}</p>
        )}
      </div>

      {/* Homes within your Buy-Ability — only once a budget exists */}
      {showResultsSection && (
        <div className="mt-8">
          <h2 className="font-heading flex items-center gap-2 text-xl font-bold text-[var(--color-text)]">
            Homes within your Buy-Ability <InfoTip text={TIPS.homes} />
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Estimated budget {estimatedNode}</p>

          <div className="mt-5">
            {matchesLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                    <Skeleton className="aspect-[4/3] rounded-none" />
                    <div className="space-y-2 p-4">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-text-muted)]">
                No buy-ability homes match yet — submit and our team will follow up.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => {
                  const sel = isSelected(p);
                  return (
                    <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setDetail(p)}
                      onKeyDown={(e) => e.key === "Enter" && setDetail(p)}
                      className={`group relative cursor-pointer overflow-hidden rounded-2xl border text-left transition-all ${
                        sel ? "border-green-600 ring-2 ring-green-600/30" : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
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
                        {/* corner selector */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(p);
                          }}
                          aria-label={sel ? "Selected" : "Select home"}
                          aria-pressed={sel}
                          disabled={fromListing}
                          className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                            sel
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-white bg-black/30 text-transparent hover:bg-black/40"
                          } ${fromListing ? "cursor-default" : ""}`}
                        >
                          <Check size={15} />
                        </button>
                      </div>
                      <div className="p-4">
                        <Price amount={p.price} fallback={p.price_label} className="text-sm font-bold text-[var(--color-heading)]" />
                        <p className="mt-0.5 truncate text-sm font-medium text-[var(--color-text)]">{p.title}</p>
                        {(p.area || p.city) && (
                          <p className="truncate text-xs text-[var(--color-text-muted)]">{[p.area, p.city].filter(Boolean).join(", ")}</p>
                        )}
                      </div>
                    </div>
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
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isPending} className="mt-6">
        {isPending ? "Submitting…" : "Get your Buy-Ability"}
      </Button>

      {/* Property details dialog */}
      {detail && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4" onClick={() => setDetail(null)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-[var(--color-bg-muted)]">
              {detail.images?.[0] ? (
                <Image src={detail.images[0]} alt={detail.title} fill sizes="(max-width: 640px) 100vw, 512px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                  <MapPin size={28} />
                </div>
              )}
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDetail(null)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <Price amount={detail.price} fallback={detail.price_label} className="text-xl font-bold text-[var(--color-heading)]" />
              <h3 className="mt-1 font-heading text-lg font-bold text-[var(--color-text)]">{detail.title}</h3>
              {(detail.area || detail.city) && (
                <p className="mt-0.5 flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                  <MapPin size={14} /> {[detail.area, detail.city].filter(Boolean).join(", ")}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
                {detail.bedrooms != null && (
                  <span className="flex items-center gap-1.5"><BedDouble size={15} /> {detail.bedrooms} bd</span>
                )}
                {detail.bathrooms != null && (
                  <span className="flex items-center gap-1.5"><Bath size={15} /> {detail.bathrooms} ba</span>
                )}
                {detail.size_sqm != null && (
                  <span className="flex items-center gap-1.5"><Maximize size={15} /> {detail.size_sqm} m²</span>
                )}
              </div>
              {detail.description && (
                <p className="mt-3 line-clamp-3 text-sm text-[var(--color-text-muted)]">{detail.description}</p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {fromListing ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/10 px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-500">
                    <Check size={16} /> Selected for your request
                  </span>
                ) : (
                  <Button
                    onClick={() => {
                      toggle(detail);
                    }}
                    className={isSelected(detail) ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isSelected(detail) ? "Deselect" : "Select this home"}
                  </Button>
                )}
                <Link href={`/listings/${detail.slug}`} className="text-sm font-semibold text-[var(--color-heading)]">
                  View full listing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
