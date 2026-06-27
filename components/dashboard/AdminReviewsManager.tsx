"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Eye,
  EyeOff,
  Trash2,
  CornerUpLeft,
  Pencil,
  Check,
  X,
} from "lucide-react";
import type { Review } from "@/types";
import { cn } from "@/lib/utils";
import { GoogleG } from "@/components/shared/GoogleReviews";
import { createReview, deleteReview, updateReview } from "@/app/actions/reviews";

type Node = Review & { children: Node[] };

function buildTree(flat: Review[]): Node[] {
  const map = new Map<string, Node>();
  for (const r of flat) map.set(r.id, { ...r, children: [] });
  const roots: Node[] = [];
  for (const r of flat) {
    const node = map.get(r.id)!;
    if (r.parent_id && map.has(r.parent_id)) map.get(r.parent_id)!.children.push(node);
    else roots.push(node);
  }
  const chrono = (a: Node, b: Node) => +new Date(a.created_at) - +new Date(b.created_at);
  map.forEach((n) => n.children.sort(chrono));
  roots.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return roots;
}

function ReviewRow({ node, depth }: { node: Node; depth: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(node.body);

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className={cn(depth > 0 && "ml-3 border-l border-[var(--color-border)] pl-3 sm:ml-5 sm:pl-5")}>
      <div
        className={cn(
          "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
          node.is_hidden && "opacity-60"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">
            {node.author_name ?? "Anonymous"}
          </span>
          {node.source === "google" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
              <GoogleG size={11} /> Google
            </span>
          )}
          {node.rating ? (
            <span className="flex items-center gap-0.5 text-[var(--color-accent)]">
              {Array.from({ length: node.rating }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
          ) : null}
          {node.is_featured && (
            <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
              Featured
            </span>
          )}
          {node.is_hidden && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
              Hidden
            </span>
          )}
          <span className="ml-auto text-[11px] text-[var(--color-text-muted)]">
            {new Date(node.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {editing ? (
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  run(async () => {
                    await updateReview(node.id, { body: editText });
                    setEditing(false);
                  })
                }
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                <Check size={13} /> Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditText(node.body);
                  setEditing(false);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)]"
              >
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[var(--color-text)]">
            {node.body}
          </p>
        )}

        {/* Actions */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => updateReview(node.id, { is_hidden: !node.is_hidden }))}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] disabled:opacity-50"
          >
            {node.is_hidden ? <Eye size={13} /> : <EyeOff size={13} />}
            {node.is_hidden ? "Show" : "Hide"}
          </button>

          {!node.parent_id && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => updateReview(node.id, { is_featured: !node.is_featured }))}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] disabled:opacity-50"
            >
              <Star size={13} fill={node.is_featured ? "currentColor" : "none"} />
              {node.is_featured ? "Unfeature" : "Feature"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setReplying((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
          >
            <CornerUpLeft size={13} /> Reply
          </button>

          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
          >
            <Pencil size={13} /> Edit
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!window.confirm("Delete this review and all of its replies?")) return;
              run(() => deleteReview(node.id));
            }}
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>

        {replying && (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              rows={2}
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply as Luzon Prime Realtors…"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pending || !replyText.trim()}
                onClick={() =>
                  run(async () => {
                    await createReview({ body: replyText, parentId: node.id });
                    setReplyText("");
                    setReplying(false);
                  })
                }
                className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                Post reply
              </button>
              <button
                type="button"
                onClick={() => setReplying(false)}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {node.children.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          {node.children.map((child) => (
            <ReviewRow key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminReviewsManager({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<"all" | "visible" | "hidden" | "featured">("all");
  const roots = useMemo(() => buildTree(reviews), [reviews]);

  const filtered = roots.filter((r) => {
    if (filter === "visible") return !r.is_hidden;
    if (filter === "hidden") return r.is_hidden;
    if (filter === "featured") return r.is_featured;
    return true;
  });

  const tabs = [
    { key: "all", label: `All (${roots.length})` },
    { key: "visible", label: "Visible" },
    { key: "hidden", label: "Hidden" },
    { key: "featured", label: "Featured" },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === t.key
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
          No reviews in this view.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((node) => (
            <ReviewRow key={node.id} node={node} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}
