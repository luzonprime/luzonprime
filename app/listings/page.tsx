import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { PropertyFilters } from "@/components/listings/PropertyFilters";
import { ListingsSort } from "@/components/listings/ListingsSort";
import { Pagination } from "@/components/listings/Pagination";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";

const PAGE_SIZE = 9;

const SORTS: Record<string, { column: string; ascending: boolean }> = {
  newest: { column: "created_at", ascending: false },
  price_desc: { column: "price", ascending: false },
  price_asc: { column: "price", ascending: true },
  beds_desc: { column: "bedrooms", ascending: false },
  baths_desc: { column: "bathrooms", ascending: false },
  size_desc: { column: "size_sqm", ascending: false },
};

export const metadata = {
  title: "Listings | Luzon Prime Realtors",
  description: "Browse verified properties for sale, rent, and off-plan across Lagos.",
};

interface ListingsSearchParams {
  listing_type?: string;
  property_type?: string;
  location?: string;
  bedrooms?: string;
  price_range?: string;
  features?: string;
  sort?: string;
  page?: string;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<ListingsSearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  if (params.listing_type) query = query.eq("listing_type", params.listing_type);
  if (params.property_type) query = query.eq("property_type", params.property_type);
  if (params.bedrooms) query = query.gte("bedrooms", Number(params.bedrooms));

  if (params.location) {
    const loc = params.location.replace(/[%,]/g, "");
    query = query.or(
      `location.ilike.%${loc}%,area.ilike.%${loc}%,city.ilike.%${loc}%`
    );
  }

  if (params.price_range) {
    const [min, max] = params.price_range.split("-");
    if (min) query = query.gte("price", Number(min));
    if (max) query = query.lte("price", Number(max));
  }

  if (params.features) {
    const features = params.features.split(",").filter(Boolean);
    if (features.length) query = query.overlaps("features", features);
  }

  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const sort = SORTS[params.sort ?? "newest"] ?? SORTS.newest;

  const { data, count } = await query
    .order(sort.column, { ascending: sort.ascending, nullsFirst: false })
    .range(from, from + PAGE_SIZE - 1);
  const properties = (data ?? []) as Property[];
  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function makeHref(p: number) {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value && key !== "page") sp.set(key, String(value));
    }
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/listings?${qs}` : "/listings";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-[1.125rem] lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
        Listings
      </h1>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-text-muted)]">
          {total} {total === 1 ? "property" : "properties"} found
        </p>
        <ListingsSort />
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <PropertyFilters />

        <div className="min-w-0 flex-1">
          {properties.length > 0 ? (
            <AnimatedStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <AnimatedStaggerItem key={property.id}>
                  <PropertyCard property={property} />
                </AnimatedStaggerItem>
              ))}
            </AnimatedStagger>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-16 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                No properties match your filters. Try adjusting your search.
              </p>
            </div>
          )}

          <Pagination currentPage={page} pageCount={pageCount} makeHref={makeHref} />
        </div>
      </div>
    </div>
  );
}
