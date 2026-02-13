"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ReasoningTraceProps {
  trace: Record<string, unknown>;
}

function TraceCategory({
  title,
  content,
}: {
  title: string;
  content: unknown;
}) {
  const [expanded, setExpanded] = useState(false);

  const displayContent = typeof content === "string"
    ? content
    : JSON.stringify(content, null, 2);

  // Clean up the title for display
  const displayTitle = title
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="border border-border-subtle rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3",
          "text-left text-sm font-medium text-text-primary",
          "hover:bg-surface-elevated/50 transition-colors",
          "cursor-pointer"
        )}
      >
        <span>{displayTitle}</span>
        <svg
          className={cn(
            "w-4 h-4 text-text-muted transition-transform duration-200",
            expanded && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-border-subtle bg-surface">
              <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto">
                {displayContent}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ReasoningTrace({ trace }: ReasoningTraceProps) {
  const entries = Object.entries(trace);

  if (entries.length === 0) return null;

  return (
    <Card variant="elevated" header="Reasoning Trace">
      <div className="space-y-2">
        {entries.map(([key, value]) => (
          <TraceCategory key={key} title={key} content={value} />
        ))}
      </div>
    </Card>
  );
}
