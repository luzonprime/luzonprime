"use client";

import { useState, useTransition } from "react";
import { submitBuyAbility } from "@/app/actions/buyability";
import { CREDIT_OPTIONS, estimateBudget } from "@/lib/buyability";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/shared/Price";
import { PropertyCard } from "@/components/listings/PropertyCard";
import type { Property } from "@/types";

const selectClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]";

export function BuyAbilityForm({
  defaultEmail = "",
  locations = [],
  propertyId,
  propertyTitle,
  preselectedLocation,
}: {
  defaultEmail?: string;
  locations?: string[];
  propertyId?: string;
  propertyTitle?: string;
  preselectedLocation?: string;
}) {
  const [form, setForm] = useState({
    location: preselectedLocation ?? "",
    credit_score: "",
    annual_income: "",
    down_payment: "",
    monthly_debt: "",
    email: defaultEmail,
  });
  const [result, setResult] = useState<{ budget: number; matches: Property[] } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  const liveBudget = estimateBudget({
    annual_income: Number(form.annual_income) || 0,
    down_payment: Number(form.down_payment) || 0,
    monthly_debt: Number(form.monthly_debt) || 0,
    credit_score: form.credit_score,
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const r = await submitBuyAbility({
          property_id: propertyId ?? null,
          email: form.email,
          location: form.location || null,
          credit_score: form.credit_score || null,
          annual_income: Number(form.annual_income) || null,
          down_payment: Number(form.down_payment) || null,
          monthly_debt: Number(form.monthly_debt) || null,
        });
        setResult(r);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div>
      {propertyTitle && (
        <p className="mb-4 rounded-xl bg-[var(--color-primary)]/10 px-4 py-3 text-sm text-[var(--color-heading)]">
          Checking Buy-Ability for <strong>{propertyTitle}</strong>.
        </p>
      )}

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text)]">Location</label>
          <input
            list="ba-locations"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Lekki, Lagos"
            className={selectClass}
          />
          <datalist id="ba-locations">
            {locations.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
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
          label="Annual income"
          type="number"
          min={0}
          placeholder="Pre-tax, per year"
          value={form.annual_income}
          onChange={(e) => set("annual_income", e.target.value)}
        />
        <Input
          label="Down payment"
          type="number"
          min={0}
          placeholder="Amount available"
          value={form.down_payment}
          onChange={(e) => set("down_payment", e.target.value)}
        />
        <Input
          label="Monthly debt"
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

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            Estimated budget
          </p>
          <Price amount={liveBudget} className="text-2xl font-bold text-[var(--color-heading)]" />
        </div>

        {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}

        <Button type="submit" disabled={isPending} className="sm:col-span-2">
          {isPending ? "Calculating…" : "Get your Buy-Ability"}
        </Button>
      </form>

      {result && (
        <div className="mt-10">
          <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">
            Homes within your Buy-Ability
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Estimated budget <Price amount={result.budget} className="font-semibold text-[var(--color-heading)]" /> — showing
            buy-ability homes within ±10%.
          </p>
          {result.matches.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.matches.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-text-muted)]">
              No buy-ability homes match yet — our team will follow up by email with
              tailored options.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
