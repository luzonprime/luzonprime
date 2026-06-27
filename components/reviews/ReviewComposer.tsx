"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createReview } from "@/app/actions/reviews";
import { StarRatingInput } from "./StarRating";

export function ReviewComposer({
  parentId = null,
  withRating = false,
  placeholder = "Write a comment…",
  submitLabel = "Post",
  onDone,
  onCancel,
  autoFocus = false,
}: {
  parentId?: string | null;
  withRating?: boolean;
  placeholder?: string;
  submitLabel?: string;
  onDone?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      setError("Please write something first.");
      return;
    }
    if (withRating && rating === 0) {
      setError("Please pick a star rating.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await createReview({
          body: trimmed,
          rating: withRating ? rating : null,
          parentId,
        });
        setBody("");
        setRating(0);
        onDone?.();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {withRating && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--color-text)]">Your rating</span>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>
      )}
      <textarea
        rows={withRating ? 4 : 3}
        autoFocus={autoFocus}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        maxLength={2000}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending} className="px-5 py-2 text-xs">
          {pending ? "Posting…" : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
            className="px-5 py-2 text-xs"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
