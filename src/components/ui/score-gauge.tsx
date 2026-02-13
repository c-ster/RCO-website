"use client";

import { cn } from "@/lib/utils";

export interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

function getScoreColor(score: number): { stroke: string; text: string; glow: string } {
  if (score >= 80) {
    return {
      stroke: "stroke-success",
      text: "text-success",
      glow: "drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]",
    };
  }
  if (score >= 50) {
    return {
      stroke: "stroke-warning",
      text: "text-warning",
      glow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    };
  }
  return {
    stroke: "stroke-danger",
    text: "text-danger",
    glow: "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  };
}

export function ScoreGauge({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  className,
}: ScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedScore / 100) * circumference;
  const offset = circumference - progress;
  const colors = getScoreColor(clampedScore);

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-1", className)}
      role="meter"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Score: ${clampedScore}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn("transform -rotate-90", colors.glow)}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-surface-elevated"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(colors.stroke, "transition-all duration-700 ease-out")}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className={cn(
            "fill-current font-bold tabular-nums",
            "transform rotate-90 origin-center",
            colors.text
          )}
          style={{ fontSize: size * 0.28 }}
        >
          {Math.round(clampedScore)}
        </text>
      </svg>
      {label && (
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
