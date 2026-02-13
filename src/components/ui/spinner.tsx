"use client";

import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <svg
      className={cn("animate-spin", sizeMap[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6)); }
          50% { filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.9)); }
        }
      `}</style>
      <circle
        cx="12"
        cy="4"
        r="1.5"
        fill="currentColor"
        style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }}
      />
    </svg>
  );
}
