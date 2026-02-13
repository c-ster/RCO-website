import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "high" | "partial" | "non-responsive" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-elevated text-text-secondary border border-border-subtle",
  high: "bg-tier-high/15 text-tier-high border border-tier-high/30",
  partial: "bg-tier-partial/15 text-tier-partial border border-tier-partial/30",
  "non-responsive":
    "bg-tier-non-responsive/15 text-tier-non-responsive border border-tier-non-responsive/30",
  info: "bg-info/15 text-info border border-info/30",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-xs font-medium whitespace-nowrap",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
