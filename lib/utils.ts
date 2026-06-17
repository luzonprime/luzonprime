import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount: number | null | undefined) {
  if (amount == null) return null;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const LISTING_TYPE_LABELS: Record<string, string> = {
  for_sale: "For Sale",
  for_rent: "For Rent",
  off_plan: "Off-Plan",
};

export const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  rented: "Rented",
};
