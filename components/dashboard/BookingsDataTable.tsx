"use client";

import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import type { Booking } from "@/types";

const STATUS_STYLES: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export function BookingsDataTable({
  bookings,
  propertyTitles,
  names,
}: {
  bookings: Booking[];
  propertyTitles: Record<string, string>;
  names: Record<string, string>;
}) {
  const columns: DataTableColumn<Booking>[] = [
    {
      key: "scheduled_at",
      header: "Scheduled for",
      sortable: true,
      render: (b) => new Date(b.scheduled_at).toLocaleString(),
    },
    {
      key: "property_id",
      header: "Property",
      render: (b) => (b.property_id && propertyTitles[b.property_id]) ?? "—",
    },
    { key: "user_id", header: "Client", render: (b) => (b.user_id && names[b.user_id]) ?? "—" },
    { key: "agent_id", header: "Agent", render: (b) => (b.agent_id && names[b.agent_id]) ?? "—" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (b) => (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status]}`}>
          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={bookings}
      searchPlaceholder="Search bookings..."
      emptyMessage="No bookings yet."
    />
  );
}
