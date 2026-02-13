"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-danger/10">
          <svg
            className="w-8 h-8 text-danger"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary">Something went wrong</h2>
        <p className="text-sm text-text-secondary">
          An unexpected error occurred. This has been logged for review.
        </p>
        {error.digest && (
          <p className="text-xs text-text-muted font-mono">Error ID: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
