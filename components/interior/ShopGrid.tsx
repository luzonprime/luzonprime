"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sofa } from "lucide-react";
import type { ShopItem } from "@/types";
import { cn } from "@/lib/utils";
import { Price } from "@/components/shared/Price";

export function ShopGrid({ items }: { items: ShopItem[] }) {
  const types = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.item_type && set.add(i.item_type));
    return ["All", ...[...set].sort()];
  }, [items]);

  const [active, setActive] = useState("All");
  const filtered = active === "All" ? items : items.filter((i) => i.item_type === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === t
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white dark:border-white dark:bg-white dark:text-[var(--color-primary)]"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/interior-designs/shop/${item.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-muted)]">
              {item.cover_image ? (
                <Image
                  src={item.cover_image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                  <Sofa size={28} />
                </div>
              )}
              {item.is_new && (
                <span className="absolute left-3 top-3 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-xs font-semibold text-white">
                  New
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4 text-center">
              {item.item_type && (
                <span className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  {item.item_type}
                </span>
              )}
              <h3 className="mt-1 font-medium text-[var(--color-text)]">{item.name}</h3>
              <span className="mt-auto pt-2 text-sm font-semibold text-[var(--color-heading)]">
                <Price amount={item.price} fallback={item.price_label ?? "Get price"} /> →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
