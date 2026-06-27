"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, Quote } from "lucide-react";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";
import { GoogleReviewsCta, GoogleG } from "@/components/shared/GoogleReviews";

export type HomeReview = {
  id: string;
  author_name: string | null;
  author_role: string | null;
  rating: number | null;
  body: string;
  source: "site" | "google";
};

function initials(name: string | null) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const REVIEW_PREVIEW_LIMIT = 240;

function ReviewCard({ review }: { review: HomeReview }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > REVIEW_PREVIEW_LIMIT;
  const shown =
    isLong && !expanded
      ? `${review.body.slice(0, REVIEW_PREVIEW_LIMIT).trimEnd()}…`
      : review.body;

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <Quote
        size={26}
        className="text-[var(--color-accent)]"
        fill="currentColor"
        strokeWidth={0}
      />
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text)]">
        {shown}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="ml-1 font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline dark:text-[var(--color-accent)]"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </blockquote>
      <div className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">
          {initials(review.author_name)}
        </div>
        <div className="min-w-0 flex-1">
          <figcaption className="truncate text-sm font-semibold text-[var(--color-text)]">
            {review.author_name ?? "Anonymous"}
          </figcaption>
          {review.source === "google" ? (
            <p className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <GoogleG size={11} /> Posted on Google
            </p>
          ) : (
            review.author_role && (
              <p className="truncate text-xs text-[var(--color-text-muted)]">
                {review.author_role}
              </p>
            )
          )}
        </div>
        {review.rating ? (
          <div className="flex shrink-0 gap-0.5 text-[var(--color-accent)]">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
        ) : null}
      </div>
    </figure>
  );
}

export function ClientReviews({
  reviews,
  totalCount,
  google,
}: {
  reviews: HomeReview[];
  totalCount: number;
  google: { url: string | null; rating: number | null; count: number | null };
}) {
  if (reviews.length === 0) return null;

  const rated = reviews.filter((r) => r.rating);
  const average = rated.length
    ? rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length
    : 5;

  return (
    <section className="bg-[var(--color-bg-muted)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        {/* Summary / CTA rail */}
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
          <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Loved by our clients
          </h2>
          <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
            Real words from buyers, renters, and investors who trusted us with
            one of life&apos;s biggest decisions.
          </p>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-heading text-5xl font-bold text-[var(--color-text)]">
              {average.toFixed(1)}
            </span>
            <div className="mb-1.5">
              <div className="flex gap-0.5 text-[var(--color-accent)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.round(average) ? "currentColor" : "none"}
                    strokeWidth={i < Math.round(average) ? 0 : 1.5}
                    className={i >= Math.round(average) ? "text-[var(--color-border)]" : ""}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {totalCount} review{totalCount === 1 ? "" : "s"} & counting
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
            <GoogleReviewsCta url={google.url} rating={google.rating} count={google.count} />
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-light)]"
            >
              Read &amp; write reviews
              <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>

        {/* Review cards */}
        <AnimatedStagger className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <AnimatedStaggerItem key={r.id}>
              <ReviewCard review={r} />
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
