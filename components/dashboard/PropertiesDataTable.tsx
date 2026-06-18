"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Property } from "@/types";
import { formatNaira, LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/utils";
import { deleteProperty, publishProperty } from "@/app/actions/properties";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";

export function PropertiesDataTable({
  properties,
  role,
  basePath,
  agentNames = {},
}: {
  properties: Property[];
  role: "agent" | "admin";
  basePath: string;
  agentNames?: Record<string, string>;
}) {
  const [rows, setRows] = useState(properties);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleTogglePublish(id: string, next: boolean) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await publishProperty(id, next);
        setRows((prev) => prev.map((p) => (p.id === id ? { ...p, is_published: next } : p)));
      } finally {
        setPendingId(null);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    setPendingId(id);
    startTransition(async () => {
      try {
        await deleteProperty(id);
        setRows((prev) => prev.filter((p) => p.id !== id));
      } finally {
        setPendingId(null);
      }
    });
  }

  const columns: DataTableColumn<Property>[] = [
    { key: "title", header: "Title", sortable: true },
    {
      key: "listing_type",
      header: "Type",
      sortable: true,
      render: (p) => (p.listing_type ? LISTING_TYPE_LABELS[p.listing_type] ?? p.listing_type : "—"),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (p) => STATUS_LABELS[p.status] ?? p.status,
    },
    ...(role === "admin"
      ? [
          {
            key: "agent_id",
            header: "Agent",
            render: (p: Property) => (p.agent_id && agentNames[p.agent_id]) ?? "Unassigned",
          } as DataTableColumn<Property>,
        ]
      : []),
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (p) => formatNaira(p.price) ?? p.price_label ?? "—",
    },
    ...(role === "admin"
      ? [
          {
            key: "is_published",
            header: "Published",
            render: (p: Property) => (
              <button
                type="button"
                disabled={isPending && pendingId === p.id}
                onClick={() => handleTogglePublish(p.id, !p.is_published)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  p.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {p.is_published ? "Published" : "Draft"}
              </button>
            ),
          } as DataTableColumn<Property>,
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      searchPlaceholder="Search properties..."
      emptyMessage="No properties yet."
      rowActions={(property) => (
        <>
          <Link
            href={`${basePath}/${property.id}/edit`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            disabled={isPending && pendingId === property.id}
            onClick={() => handleDelete(property.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
    />
  );
}
