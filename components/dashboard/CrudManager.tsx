"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { crudCreate, crudUpdate, crudDelete } from "@/app/actions/admin-crud";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  placeholder?: string;
};

export type CrudRow = { id: string } & Record<string, unknown>;
type Row = CrudRow;

export function CrudManager({
  table,
  rows,
  fields,
  primaryField,
  secondaryField,
  addLabel = "Add new",
}: {
  table: string;
  rows: Row[];
  fields: CrudField[];
  primaryField: string;
  secondaryField?: string;
  addLabel?: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    const init: Record<string, unknown> = {};
    for (const f of fields) init[f.name] = f.type === "checkbox" ? true : "";
    setForm(init);
    setError(null);
    setEditing("new");
  }

  function openEdit(row: Row) {
    const init: Record<string, unknown> = {};
    for (const f of fields) init[f.name] = row[f.name] ?? (f.type === "checkbox" ? false : "");
    setForm(init);
    setError(null);
    setEditing(row);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        if (editing === "new") await crudCreate(table, form);
        else if (editing) await crudUpdate(table, editing.id, form);
        setEditing(null);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  function remove(row: Row) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await crudDelete(table, row.id);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-text-muted)]">
          {rows.length} item{rows.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} /> {addLabel}
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-text-muted)]">
          Nothing yet — add your first item.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--color-text)]">
                  {String(row[primaryField] ?? "—")}
                </p>
                {secondaryField && (
                  <p className="truncate text-xs text-[var(--color-text-muted)]">
                    {String(row[secondaryField] ?? "")}
                  </p>
                )}
                {row.is_active === false && (
                  <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                    Hidden
                  </span>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label="Edit"
                  onClick={() => openEdit(row)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={() => remove(row)}
                  disabled={isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing !== null && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <h3 className="font-heading text-lg font-bold text-[var(--color-text)]">
                {editing === "new" ? `${addLabel}` : "Edit item"}
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setEditing(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
                className="flex flex-col gap-4"
              >
                {fields.map((f) => {
                  const value = form[f.name];
                  if (f.type === "checkbox") {
                    return (
                      <label key={f.name} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.checked }))}
                        />
                        {f.label}
                      </label>
                    );
                  }
                  if (f.type === "select") {
                    return (
                      <div key={f.name} className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--color-text)]">{f.label}</label>
                        <select
                          value={String(value ?? "")}
                          onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                        >
                          <option value="">Select…</option>
                          {f.options?.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (f.type === "textarea") {
                    return (
                      <div key={f.name} className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--color-text)]">{f.label}</label>
                        <textarea
                          rows={4}
                          value={String(value ?? "")}
                          placeholder={f.placeholder}
                          onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                        />
                      </div>
                    );
                  }
                  return (
                    <Input
                      key={f.name}
                      label={f.label}
                      type={f.type === "number" ? "number" : "text"}
                      placeholder={f.placeholder}
                      value={String(value ?? "")}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value,
                        }))
                      }
                    />
                  );
                })}

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" disabled={isPending} className="mt-1">
                  {isPending ? "Saving…" : "Save"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
