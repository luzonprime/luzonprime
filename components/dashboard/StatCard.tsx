import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: string; direction: "up" | "down" };
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-heading)]">
          <Icon size={18} />
        </div>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-semibold",
              trend.direction === "up" ? "text-green-600" : "text-red-500"
            )}
          >
            {trend.direction === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-[var(--color-heading)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}
