"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const LISTING_TYPES = [
  { value: "", label: "Any type" },
  { value: "for_sale", label: "For Sale" },
  { value: "for_rent", label: "For Rent" },
  { value: "off_plan", label: "Off-Plan" },
];

const PROPERTY_TYPES = ["", "apartment", "duplex", "bungalow", "land", "commercial", "office", "warehouse"];

const BEDROOMS = ["", "1", "2", "3", "4", "5"];

const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-25000000", label: "Under ₦25M" },
  { value: "25000000-75000000", label: "₦25M – ₦75M" },
  { value: "75000000-200000000", label: "₦75M – ₦200M" },
  { value: "200000000-", label: "₦200M+" },
];

const FEATURES = ["Pool", "Gym", "Elevator", "Parking", "Security", "Balcony"];

const selectClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  function currentValues() {
    return {
      listing_type: searchParams.get("listing_type") ?? "",
      property_type: searchParams.get("property_type") ?? "",
      location: searchParams.get("location") ?? "",
      bedrooms: searchParams.get("bedrooms") ?? "",
      price_range: searchParams.get("price_range") ?? "",
      features: searchParams.get("features") ?? "",
    };
  }

  const [draft, setDraft] = useState(currentValues);
  const [listingTypeOpts, setListingTypeOpts] = useState(LISTING_TYPES);
  const [propertyTypeOpts, setPropertyTypeOpts] = useState<{ value: string; label: string }[]>(
    PROPERTY_TYPES.map((t) => ({ value: t, label: t === "" ? "Any type" : t }))
  );

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("taxonomy_terms")
      .select("kind, slug, label")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!data) return;
        const lt = data.filter((t) => t.kind === "listing_type").map((t) => ({ value: t.slug, label: t.label }));
        const pt = data.filter((t) => t.kind === "property_type").map((t) => ({ value: t.slug, label: t.label }));
        if (lt.length) setListingTypeOpts([{ value: "", label: "Any type" }, ...lt]);
        if (pt.length) setPropertyTypeOpts([{ value: "", label: "Any type" }, ...pt]);
      });
  }, []);

  function update(key: string, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFeature(feature: string) {
    const current = draft.features ? draft.features.split(",") : [];
    const next = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    update("features", next.join(","));
  }

  function applyFilters() {
    const params = new URLSearchParams();
    Object.entries(draft).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
    setMobileOpen(false);
  }

  function clearFilters() {
    setDraft({ listing_type: "", property_type: "", location: "", bedrooms: "", price_range: "", features: "" });
    router.push("/listings");
    setMobileOpen(false);
  }

  const filterFields = (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Location</label>
        <Input
          value={draft.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="e.g. Ikoyi"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Listing type</label>
        <select value={draft.listing_type} onChange={(e) => update("listing_type", e.target.value)} className={selectClass}>
          {listingTypeOpts.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Property type</label>
        <select value={draft.property_type} onChange={(e) => update("property_type", e.target.value)} className={selectClass}>
          {propertyTypeOpts.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Bedrooms</label>
        <select value={draft.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={selectClass}>
          {BEDROOMS.map((b) => (
            <option key={b} value={b}>
              {b === "" ? "Any beds" : `${b}+`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Price range</label>
        <select value={draft.price_range} onChange={(e) => update("price_range", e.target.value)} className={selectClass}>
          {PRICE_RANGES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">Features</label>
        <div className="flex flex-wrap gap-2">
          {FEATURES.map((feature) => {
            const active = draft.features.split(",").includes(feature);
            return (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] text-[var(--color-text)]"
                }`}
              >
                {feature}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" onClick={applyFilters} className="flex-1">
          Apply filters
        </Button>
        <Button type="button" variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:w-72 lg:shrink-0">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          {filterFields}
        </div>
      </div>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex items-center gap-2 self-start rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] lg:hidden"
      >
        <Filter size={15} /> Filters
      </button>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-[var(--color-bg)] p-5 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[var(--color-text)]">Filters</h2>
                <button type="button" onClick={() => setMobileOpen(false)}>
                  <X size={20} className="text-[var(--color-text)]" />
                </button>
              </div>
              {filterFields}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
