"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-accent text-white",
    "hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:hover:shadow-none disabled:active:scale-100"
  ),
  secondary: cn(
    "bg-surface-elevated text-text-primary border border-border",
    "hover:bg-surface hover:border-border",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:active:scale-100"
  ),
  danger: cn(
    "bg-danger text-white",
    "hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:hover:shadow-none disabled:active:scale-100"
  ),
  ghost: cn(
    "bg-transparent text-text-secondary",
    "hover:bg-surface-elevated hover:text-text-primary",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:active:scale-100"
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium",
          "transition-all duration-150 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "cursor-pointer disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && <Spinner size={size === "lg" ? "md" : "sm"} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
