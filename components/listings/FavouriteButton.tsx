"use client";

import { Heart } from "lucide-react";
import { useFavourites } from "@/components/shared/FavouritesProvider";
import { cn } from "@/lib/utils";

export function FavouriteButton({
  propertyId,
  className,
  size = 16,
}: {
  propertyId: string;
  className?: string;
  size?: number;
}) {
  const { isFavourite, toggle } = useFavourites();
  const fav = isFavourite(propertyId);
  return (
    <button
      type="button"
      aria-label={fav ? "Remove from favourites" : "Save to favourites"}
      aria-pressed={fav}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle(propertyId);
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--color-primary)] shadow-sm backdrop-blur transition hover:bg-white",
        className
      )}
    >
      <Heart size={size} className={cn(fav && "fill-red-500 text-red-500")} />
    </button>
  );
}
