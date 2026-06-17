"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const LISTING_TYPES = [
  { value: "", label: "Any type" },
  { value: "for_sale", label: "For Sale" },
  { value: "for_rent", label: "For Rent" },
  { value: "off_plan", label: "Off-Plan" },
];

const BEDROOMS = [
  { value: "", label: "Any beds" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-25000000", label: "Under ₦25M" },
  { value: "25000000-75000000", label: "₦25M – ₦75M" },
  { value: "75000000-200000000", label: "₦75M – ₦200M" },
  { value: "200000000-", label: "₦200M+" },
];

export function SearchBar() {
  const router = useRouter();
  const [listingType, setListingType] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [priceRange, setPriceRange] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.set("listing_type", listingType);
    if (location) params.set("location", location);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (priceRange) params.set("price_range", priceRange);
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur-sm sm:rounded-full sm:p-2"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-1">
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="w-full rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm font-medium text-gray-900 outline-none sm:w-auto"
        >
          {LISTING_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="hidden h-6 w-px bg-gray-200 sm:block" />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location, e.g. Ikoyi"
          className="w-full min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        <span className="hidden h-6 w-px bg-gray-200 sm:block" />

        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="w-full rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm font-medium text-gray-900 outline-none sm:w-auto"
        >
          {BEDROOMS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="hidden h-6 w-px bg-gray-200 sm:block" />

        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm font-medium text-gray-900 outline-none sm:w-auto"
        >
          {PRICE_RANGES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)] sm:w-auto sm:shrink-0 sm:rounded-full"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </form>
  );
}
