"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import type { Review } from "@/types";
import { ReviewComposer } from "./ReviewComposer";
import { ReviewNode, type ReviewTreeNode } from "./ReviewNode";
import { StarRatingDisplay } from "./StarRating";

function buildTree(flat: Review[]): ReviewTreeNode[] {
  const map = new Map<string, ReviewTreeNode>();
  for (const r of flat) map.set(r.id, { ...r, children: [] });

  const roots: ReviewTreeNode[] = [];
  for (const r of flat) {
    const node = map.get(r.id)!;
    if (r.parent_id && map.has(r.parent_id)) {
      map.get(r.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const oldestFirst = (a: ReviewTreeNode, b: ReviewTreeNode) =>
    +new Date(a.created_at) - +new Date(b.created_at);
  // Replies read top-to-bottom chronologically; root reviews show newest first.
  map.forEach((n) => n.children.sort(oldestFirst));
  roots.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return roots;
}

export function ReviewsBoard({
  reviews,
  currentUserId,
  isLoggedIn,
  isAdmin = false,
}: {
  reviews: Review[];
  currentUserId: string | null;
  isLoggedIn: boolean;
  isAdmin?: boolean;
}) {
  const roots = useMemo(() => buildTree(reviews), [reviews]);

  const rated = reviews.filter((r) => !r.parent_id && r.rating);
  const average = rated.length
    ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
    : 0;
  const reviewCount = reviews.filter((r) => !r.parent_id).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Summary */}
      {reviewCount > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] px-5 py-4">
          {average > 0 && (
            <>
              <span className="text-3xl font-bold text-[var(--color-text)]">
                {average.toFixed(1)}
              </span>
              <StarRatingDisplay value={Math.round(average)} size={18} />
            </>
          )}
          <span className="text-sm text-[var(--color-text-muted)]">
            {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {/* Composer / login gate */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Leave a review</h2>
        {isLoggedIn ? (
          <div className="mt-4">
            <ReviewComposer
              withRating
              placeholder="Share your experience working with Luzon Prime Realtors…"
              submitLabel="Post review"
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Please{" "}
            <Link
              href="/login?redirect=/reviews"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              log in
            </Link>{" "}
            to write a review or reply to others.
          </p>
        )}
      </section>

      {/* Thread */}
      {roots.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] px-6 py-14 text-center">
          <MessageSquare className="text-[var(--color-text-muted)]" size={28} />
          <p className="text-sm text-[var(--color-text-muted)]">
            No reviews yet — be the first to share your experience.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {roots.map((node) => (
            <ReviewNode
              key={node.id}
              node={node}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
