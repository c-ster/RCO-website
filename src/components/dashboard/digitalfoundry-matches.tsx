"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface DigitalFoundryMatch {
  platformName: string;
  capabilityName: string;
  compatibilityScore: number;
  deploymentWindow: string;
  exerciseName?: string | null;
}

interface DigitalFoundryMatchesProps {
  matches: DigitalFoundryMatch[];
}

function getScoreTier(score: number): "high" | "partial" | "non-responsive" {
  if (score >= 80) return "high";
  if (score >= 50) return "partial";
  return "non-responsive";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-tier-high";
  if (score >= 50) return "text-tier-partial";
  return "text-tier-non-responsive";
}

export function DigitalFoundryMatches({ matches }: DigitalFoundryMatchesProps) {
  return (
    <Card variant="elevated" header="DigitalFoundry Matches">
      {matches.length === 0 ? (
        <div className="py-8 text-center text-text-muted text-sm">
          No DigitalFoundry matches available
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match, index) => (
            <motion.div
              key={`${match.platformName}-${match.capabilityName}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "p-3 rounded-lg bg-surface border border-border-subtle",
                "hover:border-border transition-colors"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-text-primary">
                    {match.platformName}
                  </h4>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {match.capabilityName.slice(0, 60)}
                    {match.capabilityName.length > 60 ? "..." : ""}
                  </p>
                </div>
                <span className={cn("text-lg font-bold tabular-nums", getScoreColor(match.compatibilityScore))}>
                  {Math.round(match.compatibilityScore)}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getScoreTier(match.compatibilityScore)}>
                  {match.compatibilityScore >= 80 ? "Compatible" : match.compatibilityScore >= 50 ? "Partial" : "Low"}
                </Badge>
                <span className="text-xs text-text-muted">
                  {match.deploymentWindow}
                </span>
                {match.exerciseName && (
                  <Badge variant="info">{match.exerciseName}</Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
