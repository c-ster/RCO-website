"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface StatsGridProps {
  stats: {
    totalSubmissions: number;
    pendingReview: number;
    highMatches: number;
    avgUci: number;
  };
}

const statCards = [
  {
    key: "totalSubmissions" as const,
    label: "Total Submissions",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    key: "pendingReview" as const,
    label: "Pending Review",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    key: "highMatches" as const,
    label: "High Matches",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    key: "avgUci" as const,
    label: "Average UCI",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    color: "text-info",
    bgColor: "bg-info/10",
    format: (v: number) => v.toFixed(1),
  },
];

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const value = stats[card.key];
        const displayValue = card.format ? card.format(value) : value;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card variant="elevated" className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {card.label}
                  </p>
                  <p className={cn("text-3xl font-bold tabular-nums", card.color)}>
                    {displayValue}
                  </p>
                </div>
                <div className={cn("p-2.5 rounded-lg", card.bgColor)}>
                  <span className={card.color}>{card.icon}</span>
                </div>
              </div>
              {/* Subtle gradient accent at bottom */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5",
                  card.key === "totalSubmissions" && "bg-gradient-to-r from-accent/80 to-accent/0",
                  card.key === "pendingReview" && "bg-gradient-to-r from-warning/80 to-warning/0",
                  card.key === "highMatches" && "bg-gradient-to-r from-success/80 to-success/0",
                  card.key === "avgUci" && "bg-gradient-to-r from-info/80 to-info/0",
                )}
              />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
