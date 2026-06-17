import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { PropertyFilters } from "@/components/listings/PropertyFilters";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";

export const metadata = {
  title: "Listings | LuzonPrime",
  description: "Browse verified properties for sale, rent, and off-plan across Lagos.",
};

interface ListingsSearchParams {
  listing_type?: string;
  property_type?: string;
  location?: string;
  bedrooms?: string;
  price_range?: string;
  features?: string;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<ListingsSearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("properties").select("*").eq("is_published", true);

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

  const { data } = await query.order("created_at", { ascending: false });
  const properties = (data ?? []) as Property[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
        Listings
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        {properties.length} {properties.length === 1 ? "property" : "properties"} found
      </p>

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
        </div>
      </div>
    </div>
  );
}
