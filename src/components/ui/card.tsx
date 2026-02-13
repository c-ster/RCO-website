import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "glow";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  header?: ReactNode;
  footer?: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-surface border border-border-subtle",
  elevated: "bg-surface-elevated border border-border shadow-lg",
  glow: cn(
    "bg-surface border border-accent/30",
    "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    "hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-shadow duration-300"
  ),
};

export function Card({
  variant = "default",
  header,
  footer,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded-xl overflow-hidden", variantStyles[variant], className)}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-border-subtle">
          {typeof header === "string" ? (
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              {header}
            </h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-3 border-t border-border-subtle bg-surface-elevated/50">
          {footer}
        </div>
      )}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-b border-border-subtle",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-3 border-t border-border-subtle bg-surface-elevated/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
