"use client";

import { Download } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import type { Subscriber } from "@/types";

function exportCsv(rows: Subscriber[]) {
  const header = ["Email", "Name", "Status", "Subscribed at"];
  const lines = rows.map((r) =>
    [r.email, r.name ?? "", r.status, new Date(r.created_at).toISOString()]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SubscribersDataTable({ subscribers }: { subscribers: Subscriber[] }) {
  const columns: DataTableColumn<Subscriber>[] = [
    { key: "email", header: "Email", sortable: true },
    { key: "name", header: "Name", sortable: true, render: (s) => s.name ?? "—" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (s) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {s.status === "active" ? "Active" : "Unsubscribed"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Subscribed",
      sortable: true,
      render: (s) => new Date(s.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => exportCsv(subscribers)}
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>
      <DataTable
        columns={columns}
        rows={subscribers}
        searchPlaceholder="Search subscribers..."
        emptyMessage="No subscribers yet."
      />
    </div>
  );
}
