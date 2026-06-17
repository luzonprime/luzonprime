import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]",
          variant === "outline" &&
            "border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
