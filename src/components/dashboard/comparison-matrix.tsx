"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ComparisonEntry {
  name: string;
  strategicAlignment: number;
  technicalMaturity: number;
  digitalfoundryViability: number;
}

interface ComparisonMatrixProps {
  data: ComparisonEntry[];
}

const COMPARISON_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#06b6d4", // cyan
  "#a855f7", // purple
];

const DIMENSION_LABELS: Record<string, string> = {
  strategicAlignment: "Strategic Alignment",
  technicalMaturity: "Technical Maturity",
  digitalfoundryViability: "DigitalFoundry Viability",
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface-elevated border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-text-secondary mb-1">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-xs"
          style={{ color: entry.color }}
        >
          {entry.name}: {Math.round(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function ComparisonMatrix({ data }: ComparisonMatrixProps) {
  // Transform data for radar chart: each dimension becomes a data point
  const dimensions = ["strategicAlignment", "technicalMaturity", "digitalfoundryViability"];

  const radarData = dimensions.map((dim) => {
    const point: Record<string, string | number> = {
      dimension: DIMENSION_LABELS[dim],
    };
    data.slice(0, 5).forEach((entry) => {
      point[entry.name] = entry[dim as keyof ComparisonEntry] as number;
    });
    return point;
  });

  const entries = data.slice(0, 5);

  return (
    <Card variant="elevated" header="Submission Comparison">
      {entries.length === 0 ? (
        <div className="h-[350px] flex items-center justify-center text-text-muted text-sm">
          No evaluated submissions to compare
        </div>
      ) : (
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={radarData}
              margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
            >
              <PolarGrid
                stroke="var(--border)"
                strokeOpacity={0.5}
              />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                axisLine={false}
              />
              {entries.map((entry, index) => (
                <Radar
                  key={entry.name}
                  name={entry.name}
                  dataKey={entry.name}
                  stroke={COMPARISON_COLORS[index % COMPARISON_COLORS.length]}
                  fill={COMPARISON_COLORS[index % COMPARISON_COLORS.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }}
                iconType="line"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
