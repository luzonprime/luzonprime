"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { crudCreate, crudUpdate, crudDelete } from "@/app/actions/admin-crud";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type CrudRow = { id: string } & Record<string, unknown>;

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "checkbox" | "image";
  options?: { value: string; label: string }[];
  placeholder?: string;
};

export function CrudManager({
  table,
  rows,
  fields,
  primaryField,
  secondaryField,
  addLabel = "Add new",
  searchPlaceholder = "Search…",
  groupBy,
  groupLabels,
  detailFields = [],
}: {
  table: string;
  rows: CrudRow[];
  fields: CrudField[];
  primaryField: string;
  secondaryField?: string;
  addLabel?: string;
  searchPlaceholder?: string;
  groupBy?: string;
  groupLabels?: Record<string, string>;
  detailFields?: { name: string; label: string }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<CrudRow | "new" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const imageField = fields.find((f) => f.type === "image")?.name;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    const keys = [primaryField, secondaryField, ...detailFields.map((d) => d.name)].filter(
      Boolean
    ) as string[];
    return rows.filter((r) =>
      keys.map((k) => String(r[k] ?? "")).join(" ").toLowerCase().includes(q)
    );
  }, [rows, query, primaryField, secondaryField, detailFields]);

  const groups = useMemo(() => {
    if (!groupBy) return [{ key: "", label: "", rows: filtered }];
    const map = new Map<string, CrudRow[]>();
    for (const r of filtered) {
      const g = String(r[groupBy] ?? "");
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(r);
    }
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, rs]) => ({
        key,
        label: groupLabels?.[key] ?? key,
        rows: rs.sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)),
      }));
  }, [filtered, groupBy, groupLabels]);

  function openNew() {
    const init: Record<string, unknown> = {};
    for (const f of fields) init[f.name] = f.type === "checkbox" ? true : "";
    setForm(init);
    setError(null);
    setEditing("new");
  }

  function openEdit(row: CrudRow) {
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

  function remove(row: CrudRow) {
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

  async function uploadImage(name: string, file: File) {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      // eslint-disable-next-line react-hooks/purity -- unique upload path inside an event handler
      const path = `site/${table}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("property-images")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("property-images").getPublicUrl(path);
      setForm((s) => ({ ...s, [name]: data.publicUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function renderCard(row: CrudRow) {
    return (
      <li
        key={row.id}
        className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <div className="flex min-w-0 items-start gap-3">
          {imageField && (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg-muted)]">
              {row[imageField] ? (
                <Image src={String(row[imageField])} alt="" fill sizes="48px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                  <ImagePlus size={16} />
                </span>
              )}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-[var(--color-text)]">
                {String(row[primaryField] ?? "—")}
              </p>
              {"sort_order" in row && (
                <span className="shrink-0 rounded-full bg-[var(--color-bg-muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                  #{String(row.sort_order ?? 0)}
                </span>
              )}
            </div>
            {secondaryField && row[secondaryField] != null && (
              <p className="truncate text-xs text-[var(--color-text-muted)]">
                {String(row[secondaryField])}
              </p>
            )}
            {detailFields.map(
              (d) =>
                row[d.name] != null &&
                String(row[d.name]) !== "" && (
                  <p key={d.name} className="truncate text-xs text-[var(--color-text-muted)]">
                    <span className="font-medium">{d.label}:</span> {String(row[d.name])}
                  </p>
                )
            )}
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                row.is_active === false
                  ? "bg-gray-100 text-gray-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {row.is_active === false ? "Hidden" : "Active"}
            </span>
          </div>
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
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} /> {addLabel}
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-text-muted)]">
          {query ? "No matches." : "Nothing yet — add your first item."}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.key || "all"}>
              {group.label && (
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  {group.label}
                </h3>
              )}
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.rows.map(renderCard)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <h3 className="font-heading text-lg font-bold text-[var(--color-text)]">
                {editing === "new" ? addLabel : "Edit item"}
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
                  if (f.type === "image") {
                    return (
                      <div key={f.name} className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--color-text)]">{f.label}</label>
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg-muted)]">
                            {value ? (
                              <Image src={String(value)} alt="" fill sizes="56px" className="object-cover" />
                            ) : (
                              <span className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                                <ImagePlus size={18} />
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            onChange={(e) => e.target.files?.[0] && uploadImage(f.name, e.target.files[0])}
                            className="text-xs text-[var(--color-text-muted)]"
                          />
                        </div>
                        {uploading && <span className="text-xs text-[var(--color-text-muted)]">Uploading…</span>}
                      </div>
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

                <Button type="submit" disabled={isPending || uploading} className="mt-1">
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
