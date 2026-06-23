"use client";

import { useState } from "react";

interface ShowMoreTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function ShowMoreText({ text, maxLines = 4, className = "" }: ShowMoreTextProps) {
  const [expanded, setExpanded] = useState(false);

  // Only show toggle if text is likely to overflow (rough heuristic: > 180 chars)
  const isLong = text.length > 180;

  return (
    <div className={className}>
      <p
        className={`text-sm text-[var(--color-text-muted)] transition-all ${
          !expanded && isLong ? `line-clamp-${maxLines}` : ""
        }`}
      >
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-xs font-medium text-[var(--color-accent)] hover:opacity-75 transition-opacity"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}