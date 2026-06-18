import Link from "next/link";
import { CalendarCheck, Inbox, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import type { Booking, Inquiry, Profile } from "@/types";

const INQUIRY_STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  closed: "bg-gray-100 text-gray-600",
};

const BOOKING_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ClientOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: inquiryData }, { data: bookingData }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("inquiries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_at", { ascending: false }),
    ]);

  const inquiries = (inquiryData ?? []) as Inquiry[];
  const bookings = (bookingData ?? []) as Booking[];
  const firstName =
    (profile as Profile | null)?.full_name?.split(/\s+/)[0] ?? "there";
  const upcoming = bookings.filter(
    (b) => b.status !== "cancelled" && new Date(b.scheduled_at) >= new Date()
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">
          Welcome back, {firstName} 👋
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Track your inquiries and consultations in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard icon={Inbox} label="My inquiries" value={inquiries.length} />
        <StatCard icon={CalendarCheck} label="Upcoming visits" value={upcoming} />
        <Link href="/listings" className="contents">
          <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] p-5 text-white transition-transform hover:-translate-y-0.5">
            <Search size={20} />
            <span className="mt-4 text-sm font-semibold">Browse listings →</span>
          </div>
        </Link>
      </div>

      {/* Inquiries */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">My inquiries</h3>
        {inquiries.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            You haven&apos;t made any inquiries yet.{" "}
            <Link href="/listings" className="font-semibold text-[var(--color-heading)]">
              Find a property
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-[var(--color-border)]">
            {inquiries.slice(0, 6).map((inq) => (
              <li key={inq.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--color-text)]">
                    {inq.inquiry_type
                      ? inq.inquiry_type[0].toUpperCase() + inq.inquiry_type.slice(1)
                      : "General"}{" "}
                    inquiry
                  </p>
                  {inq.message && (
                    <p className="truncate text-xs text-[var(--color-text-muted)]">
                      {inq.message}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    INQUIRY_STATUS_STYLES[inq.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {inq.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bookings */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">My consultations</h3>
        {bookings.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            No consultations booked yet.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-[var(--color-border)]">
            {bookings.slice(0, 6).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {formatDateTime(b.scheduled_at)}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    BOOKING_STATUS_STYLES[b.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
