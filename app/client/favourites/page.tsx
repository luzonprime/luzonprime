import Link from "next/link";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard } from "@/components/listings/PropertyCard";
import type { Property } from "@/types";

export const metadata = { title: "My Favourites" };

export default async function ClientFavouritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: favRows } = await supabase
    .from("favourites")
    .select("property_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const ids = (favRows ?? []).map((r) => (r as { property_id: string }).property_id);

  let properties: Property[] = [];
  if (ids.length) {
    const { data } = await supabase.from("properties").select("*").in("id", ids);
    properties = (data ?? []) as Property[];
    const order = new Map(ids.map((id, i) => [id, i]));
    properties.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">
          My favourites
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Listings you&apos;ve saved for later.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
          <Heart size={28} className="mx-auto text-[var(--color-text-muted)]" />
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            No favourites yet. Tap the heart on any listing to save it.{" "}
            <Link href="/listings" className="font-semibold text-[var(--color-heading)]">
              Browse listings
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
