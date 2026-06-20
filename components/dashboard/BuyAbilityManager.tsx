"use client";

import { useState, useTransition } from "react";
import { Mail, Trash2, X } from "lucide-react";
import {
  respondBuyAbility,
  updateBuyAbilityStatus,
  deleteBuyAbilitySubmission,
} from "@/app/actions/buyability";
import { DashboardCardGrid } from "@/components/dashboard/DashboardCardGrid";
import { Button } from "@/components/ui/Button";
import type { BuyAbilitySubmission } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  closed: "bg-gray-100 text-gray-600",
};

function money(n: number | null) {
  return n != null ? `₦${Number(n).toLocaleString()}` : "—";
}

export function BuyAbilityManager({
  submissions,
  propertyTitles,
}: {
  submissions: BuyAbilitySubmission[];
  propertyTitles: Record<string, string>;
}) {
  const [rows, setRows] = useState(submissions);
  const [responding, setResponding] = useState<BuyAbilitySubmission | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setStatus(id: string, status: string) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await updateBuyAbilityStatus(id, status);
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      } finally {
        setPendingId(null);
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this submission?")) return;
    setPendingId(id);
    startTransition(async () => {
      try {
        await deleteBuyAbilitySubmission(id);
        setRows((prev) => prev.filter((r) => r.id !== id));
      } finally {
        setPendingId(null);
      }
    });
  }

  function sendResponse() {
    if (!responding) return;
    setError(null);
    startTransition(async () => {
      try {
        await respondBuyAbility(responding.id, responding.email, message);
        setRows((prev) =>
          prev.map((r) => (r.id === responding.id ? { ...r, status: "contacted" } : r))
        );
        setResponding(null);
        setMessage("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not send.");
      }
    });
  }

  return (
    <>
      <DashboardCardGrid
        rows={rows}
        searchPlaceholder="Search submissions..."
        emptyMessage="No Buy-Ability submissions yet."
        searchableText={(s) =>
          [s.email, s.location, s.status, s.property_id && propertyTitles[s.property_id]]
            .filter(Boolean)
            .join(" ")
        }
        renderCard={(s) => {
          const busy = isPending && pendingId === s.id;
          return (
            <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-semibold text-[var(--color-text)]">
                  {s.email}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    STATUS_STYLES[s.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <dl className="mt-3 space-y-1 text-xs text-[var(--color-text-muted)]">
                {s.location && (
                  <div className="flex justify-between gap-2">
                    <dt>Location</dt>
                    <dd className="text-[var(--color-text)]">{s.location}</dd>
                  </div>
                )}
                {s.property_id && propertyTitles[s.property_id] && (
                  <div className="flex justify-between gap-2">
                    <dt>Property</dt>
                    <dd className="truncate text-[var(--color-text)]">
                      {propertyTitles[s.property_id]}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <dt>Credit</dt>
                  <dd className="text-[var(--color-text)]">{s.credit_score ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Income / yr</dt>
                  <dd className="text-[var(--color-text)]">{money(s.annual_income)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Down payment</dt>
                  <dd className="text-[var(--color-text)]">{money(s.down_payment)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Monthly debt</dt>
                  <dd className="text-[var(--color-text)]">{money(s.monthly_debt)}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4">
                <select
                  value={s.status}
                  disabled={busy}
                  onChange={(e) => setStatus(s.id, e.target.value)}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setResponding(s);
                    setMessage("");
                    setError(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]"
                >
                  <Mail size={13} /> Respond
                </button>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  disabled={busy}
                  aria-label="Delete"
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        }}
      />

      {responding && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-start justify-between">
              <h3 className="font-heading text-lg font-bold text-[var(--color-text)]">
                Respond to {responding.email}
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setResponding(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Sends from info@luzonprime.com and marks the submission as contacted.
            </p>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your response…"
              className="mt-4 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResponding(null)}>
                Cancel
              </Button>
              <Button onClick={sendResponse} disabled={isPending || !message.trim()}>
                {isPending ? "Sending…" : "Send response"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
