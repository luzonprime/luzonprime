"use client";

import { cn } from "@/lib/utils";

/**
 * Seamless infinite marquee. Renders the children twice inside a track that
 * scrolls by -50%, so the loop is gapless. Respects prefers-reduced-motion
 * (the .marquee-track rule in globals.css freezes it).
 */
export function Marquee({
  children,
  speedSeconds = 38,
  reverse = false,
  pauseOnHover = true,
  className,
}: {
  children: React.ReactNode;
  speedSeconds?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("group relative w-full overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={cn(
          "marquee-track flex w-max flex-nowrap items-center",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          animationName: "marquee",
          animationDuration: `${speedSeconds}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
