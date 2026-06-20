"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, ImageOff, MapPin, Maximize, Pencil, Trash2 } from "lucide-react";
import type { Property } from "@/types";
import { formatNaira, LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/utils";
import { deleteProperty, publishProperty } from "@/app/actions/properties";
import { DashboardCardGrid } from "@/components/dashboard/DashboardCardGrid";

export function PropertiesCardGrid({
  properties,
  role,
  basePath,
  agentNames = {},
  action,
}: {
  properties: Property[];
  role: "agent" | "admin";
  basePath: string;
  agentNames?: Record<string, string>;
  action?: React.ReactNode;
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

  return (
    <DashboardCardGrid
      rows={rows}
      action={action}
      searchPlaceholder="Search properties..."
      emptyMessage="No properties yet."
      searchableText={(p) =>
        [p.title, p.area, p.city, p.location].filter(Boolean).join(" ")
      }
      renderCard={(p) => {
        const cover = p.images?.[0];
        const busy = isPending && pendingId === p.id;
        return (
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="relative aspect-[16/10] bg-[var(--color-bg-muted)]">
              {cover ? (
                <Image
                  src={cover}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                  <ImageOff size={26} />
                </div>
              )}
              <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                {p.listing_type && (
                  <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-semibold text-white">
                    {LISTING_TYPE_LABELS[p.listing_type] ?? p.listing_type}
                  </span>
                )}
                <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold text-white">
                  {STATUS_LABELS[p.status] ?? p.status}
                </span>
                {p.buy_ability && (
                  <span className="rounded-full bg-green-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                    Buy-Ability{p.buy_ability_percent != null ? ` ${p.buy_ability_percent}%` : ""}
                  </span>
                )}
              </div>
              {role === "admin" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleTogglePublish(p.id, !p.is_published)}
                  className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    p.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {p.is_published ? "Published" : "Draft"}
                </button>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="line-clamp-1 font-semibold text-[var(--color-text)]">
                {p.title}
              </h3>
              {(p.area || p.city) && (
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                  <MapPin size={12} className="shrink-0" />
                  <span className="line-clamp-1">
                    {[p.area, p.city].filter(Boolean).join(", ")}
                  </span>
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
                {p.bedrooms != null && (
                  <span className="flex items-center gap-1">
                    <BedDouble size={13} /> {p.bedrooms}
                  </span>
                )}
                {p.bathrooms != null && (
                  <span className="flex items-center gap-1">
                    <Bath size={13} /> {p.bathrooms}
                  </span>
                )}
                {p.size_sqm != null && (
                  <span className="flex items-center gap-1">
                    <Maximize size={13} /> {p.size_sqm} m²
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm font-bold text-[var(--color-heading)]">
                {formatNaira(p.price) ?? p.price_label ?? "Price on request"}
              </p>

              {role === "admin" && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {(p.agent_id && agentNames[p.agent_id]) || "Unassigned"}
                </p>
              )}

              <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-[var(--color-border)] pt-4">
                <Link
                  href={`${basePath}/${p.id}/edit`}
                  aria-label={`Edit ${p.title}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  disabled={busy}
                  aria-label={`Delete ${p.title}`}
                  onClick={() => handleDelete(p.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
