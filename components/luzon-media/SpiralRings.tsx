/**
 * Concentric ring backdrop echoing the Luzon Media spiral mark.
 *
 * Drawn as strokes only so it reads as a faint engraving over dark panels —
 * the same trick SkylineSketch uses in the footer. Colour is inherited from
 * `currentColor`, opacity is set by the caller.
 */
export function SpiralRings({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  // Ring radii fall off geometrically, which is what gives the spiral mark its
  // sense of depth; the two arcs mimic its open, sweeping tails.
  const radii = [318, 262, 214, 172, 136, 104, 76, 52];

  return (
    <svg
      viewBox="0 0 720 720"
      fill="none"
      stroke="currentColor"
      aria-hidden
      className={className}
      {...props}
    >
      {radii.map((r, i) => (
        <circle
          key={r}
          cx={360}
          cy={360}
          r={r}
          strokeWidth={i % 2 === 0 ? 1.2 : 0.6}
          opacity={1 - i * 0.07}
        />
      ))}
      {/* Open sweeps, offset from the rings, standing in for the spiral tails. */}
      <path
        d="M360 18a342 342 0 0 1 296 171"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d="M360 702a342 342 0 0 1-296-171"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <circle cx={360} cy={360} r={26} fill="currentColor" opacity={0.35} stroke="none" />
    </svg>
  );
}
