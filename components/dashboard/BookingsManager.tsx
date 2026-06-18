"use client";

import { useState, useTransition } from "react";
import { CalendarCheck, Trash2 } from "lucide-react";
import { updateBookingStatus, deleteBooking } from "@/app/actions/bookings";
import { DashboardCardGrid } from "@/components/dashboard/DashboardCardGrid";
import type { Booking } from "@/types";

const STATUS_STYLES: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export function BookingsManager({
  bookings,
  propertyTitles,
  names,
}: {
  bookings: Booking[];
  propertyTitles: Record<string, string>;
  names: Record<string, string>;
}) {
  const [rows, setRows] = useState(bookings);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function setStatus(id: string, status: Booking["status"]) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await updateBookingStatus(id, status);
        setRows((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      } finally {
        setPendingId(null);
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    setPendingId(id);
    startTransition(async () => {
      try {
        await deleteBooking(id);
        setRows((prev) => prev.filter((b) => b.id !== id));
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <DashboardCardGrid
      rows={rows}
      searchPlaceholder="Search bookings..."
      emptyMessage="No bookings yet."
      searchableText={(b) =>
        [
          b.property_id && propertyTitles[b.property_id],
          b.user_id && names[b.user_id],
          b.status,
        ]
          .filter(Boolean)
          .join(" ")
      }
      renderCard={(b) => {
        const busy = isPending && pendingId === b.id;
        return (
          <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <CalendarCheck size={18} className="text-[var(--color-heading)]" />
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {new Date(b.scheduled_at).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[b.status]}`}
              >
                {b.status}
              </span>
            </div>

            <dl className="mt-3 space-y-1 text-xs text-[var(--color-text-muted)]">
              {b.property_id && propertyTitles[b.property_id] && (
                <div className="flex justify-between gap-2">
                  <dt>Property</dt>
                  <dd className="truncate text-[var(--color-text)]">
                    {propertyTitles[b.property_id]}
                  </dd>
                </div>
              )}
              {b.user_id && names[b.user_id] && (
                <div className="flex justify-between gap-2">
                  <dt>Client</dt>
                  <dd className="text-[var(--color-text)]">{names[b.user_id]}</dd>
                </div>
              )}
            </dl>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4">
              <select
                value={b.status}
                disabled={busy}
                onChange={(e) => setStatus(b.id, e.target.value as Booking["status"])}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="button"
                onClick={() => remove(b.id)}
                disabled={busy}
                aria-label="Delete booking"
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-500/10"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      }}
    />
  );
}
