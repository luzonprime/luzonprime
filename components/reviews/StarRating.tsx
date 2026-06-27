"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {STARS.map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={value === n}
          className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
        >
          <Star
            size={22}
            className={cn(
              "transition-colors",
              (hover || value) >= n
                ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
                : "fill-transparent text-[var(--color-border)]"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function StarRatingDisplay({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
      {STARS.map((n) => (
        <Star
          key={n}
          size={size}
          className={cn(
            value >= n
              ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
              : "fill-transparent text-[var(--color-border)]"
          )}
        />
      ))}
    </div>
  );
}
