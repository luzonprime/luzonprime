import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types";

/**
 * A single partner logo tile.
 *
 * Logos arrive in wildly different aspect ratios and with different baked-in
 * background colours (white, navy, solid black…). Two things keep them tidy:
 *  - a fixed-height frame with `object-contain` so every logo is normalised to
 *    the same footprint regardless of its native size, and
 *  - a per-partner `bg_color` painted behind the logo so a logo that ships with
 *    (say) a black background blends into its tile instead of floating in an
 *    awkward white letterbox. Falls back to white when unset.
 */
export function PartnerTile({
  partner,
  className,
}: {
  partner: Pick<Partner, "name" | "logo_url" | "website_url" | "bg_color">;
  className?: string;
}) {
  const bg = partner.bg_color?.trim() || null;

  const inner = (
    <div
      className={cn(
        "group relative flex h-24 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] p-5 shadow-sm transition-shadow sm:h-28",
        !bg && "bg-white",
        partner.website_url && "hover:shadow-md",
        className
      )}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      {partner.logo_url ? (
        <Image
          src={partner.logo_url}
          alt={partner.name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <span className="flex flex-col items-center gap-1 text-[var(--color-text-muted)]">
          <Building2 size={22} />
          <span className="line-clamp-1 text-xs font-medium">{partner.name}</span>
        </span>
      )}
    </div>
  );

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${partner.name}`}
        title={partner.name}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        {inner}
      </a>
    );
  }

  return inner;
}
