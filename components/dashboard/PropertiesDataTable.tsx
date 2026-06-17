"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Property } from "@/types";
import { formatNaira, LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/utils";
import { deleteProperty, publishProperty } from "@/app/actions/properties";

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

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-sm text-[var(--color-text-muted)]">
        No properties yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-[var(--color-bg-muted)] text-xs uppercase text-[var(--color-text-muted)]">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            {role === "admin" && <th className="px-4 py-3">Agent</th>}
            <th className="px-4 py-3">Price</th>
            {role === "admin" && <th className="px-4 py-3">Published</th>}
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {rows.map((property) => (
            <tr key={property.id} className="text-[var(--color-text)]">
              <td className="px-4 py-3 font-medium">{property.title}</td>
              <td className="px-4 py-3 text-[var(--color-text-muted)]">
                {property.listing_type ? LISTING_TYPE_LABELS[property.listing_type] : "—"}
              </td>
              <td className="px-4 py-3 text-[var(--color-text-muted)]">
                {STATUS_LABELS[property.status] ?? property.status}
              </td>
              {role === "admin" && (
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {(property.agent_id && agentNames[property.agent_id]) ?? "Unassigned"}
                </td>
              )}
              <td className="px-4 py-3">{formatNaira(property.price) ?? property.price_label ?? "—"}</td>
              {role === "admin" && (
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={isPending && pendingId === property.id}
                    onClick={() => handleTogglePublish(property.id, !property.is_published)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      property.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {property.is_published ? "Published" : "Draft"}
                  </button>
                </td>
              )}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
