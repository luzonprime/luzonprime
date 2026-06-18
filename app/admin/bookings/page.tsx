import { createClient } from "@/lib/supabase/server";
import { BookingsDataTable } from "@/components/dashboard/BookingsDataTable";
import type { Booking, Profile, Property } from "@/types";

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const [{ data: bookings }, { data: properties }, { data: profiles }] = await Promise.all([
    supabase.from("bookings").select("*").order("scheduled_at", { ascending: true }),
    supabase.from("properties").select("id, title"),
    supabase.from("profiles").select("*"),
  ]);

  const propertyTitles = Object.fromEntries(
    ((properties ?? []) as Pick<Property, "id" | "title">[]).map((p) => [p.id, p.title])
  );
  const names = Object.fromEntries(
    ((profiles ?? []) as Profile[]).map((p) => [p.id, p.full_name ?? p.id])
  );

  const rows = (bookings ?? []) as Booking[];

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        {rows.length} consultation{rows.length === 1 ? "" : "s"} booked.
      </p>
      <BookingsDataTable bookings={rows} propertyTitles={propertyTitles} names={names} />
    </div>
  );
}
