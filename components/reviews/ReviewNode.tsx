"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CornerUpLeft, Trash2 } from "lucide-react";
import type { Review } from "@/types";
import { cn } from "@/lib/utils";
import { deleteReview } from "@/app/actions/reviews";
import { GoogleG } from "@/components/shared/GoogleReviews";
import { ReviewComposer } from "./ReviewComposer";
import { StarRatingDisplay } from "./StarRating";

export type ReviewTreeNode = Review & { children: ReviewTreeNode[] };

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// UTC-based + locale-independent so server and client render identically (no
// hydration mismatch).
function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function initials(name: string | null) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function ReviewNode({
  node,
  currentUserId,
  isLoggedIn,
  isAdmin = false,
  depth,
}: {
  node: ReviewTreeNode;
  currentUserId: string | null;
  isLoggedIn: boolean;
  isAdmin?: boolean;
  depth: number;
}) {
  const router = useRouter();
  const [replying, setReplying] = useState(false);
  const [pending, startTransition] = useTransition();

  const canDelete = isAdmin || (currentUserId !== null && node.user_id === currentUserId);

  function handleDelete() {
    if (!window.confirm("Delete this comment and all of its replies?")) return;
    startTransition(async () => {
      try {
        await deleteReview(node.id);
        router.refresh();
      } catch {
        // RLS will block unauthorized deletes; nothing actionable to show here.
      }
    });
  }

  return (
    <div
      className={cn(
        depth > 0 && "ml-2 border-l border-[var(--color-border)] pl-3 sm:ml-4 sm:pl-5"
      )}
    >
      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">
            {initials(node.author_name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {node.author_name ?? "Anonymous"}
              </span>
              {node.source === "google" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                  <GoogleG size={11} /> Google
                </span>
              )}
              <span className="text-xs text-[var(--color-text-muted)]">
                {formatDate(node.created_at)}
              </span>
            </div>
            {node.author_role && (
              <p className="text-xs text-[var(--color-text-muted)]">{node.author_role}</p>
            )}
            {node.rating ? (
              <div className="mt-1">
                <StarRatingDisplay value={node.rating} />
              </div>
            ) : null}
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[var(--color-text)]">
              {node.body}
            </p>

            <div className="mt-3 flex items-center gap-4">
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => setReplying((v) => !v)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                >
                  <CornerUpLeft size={13} />
                  Reply
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={pending}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  {pending ? "Deleting…" : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>

        {replying && (
          <div className="mt-3 pl-12">
            <ReviewComposer
              parentId={node.id}
              placeholder={`Reply to ${node.author_name ?? "this comment"}…`}
              submitLabel="Reply"
              autoFocus
              onDone={() => setReplying(false)}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}
      </article>

      {node.children.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {node.children.map((child) => (
            <ReviewNode
              key={child.id}
              node={child}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
