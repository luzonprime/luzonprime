"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize, MapPin } from "lucide-react";
import type { Property } from "@/types";
import { LISTING_TYPE_LABELS, STATUS_LABELS, cn } from "@/lib/utils";
import { Price } from "@/components/shared/Price";
import { FavouriteButton } from "@/components/listings/FavouriteButton";

export function PropertyCard({ property }: { property: Property }) {
  const images = property.images?.length ? property.images : [];
  const [activeImage, setActiveImage] = useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (images.length < 2) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - left) / width;
    setActiveImage(Math.min(images.length - 1, Math.floor(ratio * images.length)));
  }

  return (
    <Link
      href={`/listings/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveImage(0)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-bg-muted)]"
      >
        {images.length > 0 ? (
          <Image
            src={images[activeImage]}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
            <MapPin size={28} />
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-white/60 transition-all",
                  i === activeImage && "w-4 bg-white"
                )}
              />
            ))}
          </div>
        )}

        <FavouriteButton propertyId={property.id} className="absolute right-3 top-3" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {property.listing_type && (
            <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-xs font-semibold text-white">
              {LISTING_TYPE_LABELS[property.listing_type] ?? property.listing_type}
            </span>
          )}
          <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-xs font-semibold text-white">
            {STATUS_LABELS[property.status] ?? property.status}
          </span>
          {property.buy_ability && (
            <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white">
              Buy-Ability{property.buy_ability_percent != null ? ` ${property.buy_ability_percent}%` : ""}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <Price
          amount={property.price}
          fallback={property.price_label}
          className="text-lg font-bold text-[var(--color-heading)]"
        />
        <h3 className="mt-1 truncate text-sm font-semibold text-[var(--color-text)]">
          {property.title}
        </h3>
        {(property.area || property.city) && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <MapPin size={12} />
            {[property.area, property.city].filter(Boolean).join(", ")}
          </p>
        )}

        <div className="mt-3 flex items-center gap-4 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-muted)]">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={14} /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={14} /> {property.bathrooms}
            </span>
          )}
          {property.size_sqm != null && (
            <span className="flex items-center gap-1">
              <Maximize size={14} /> {property.size_sqm}m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
