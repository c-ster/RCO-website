"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import type { RecommendationTier } from "@/generated/prisma";
import { Card } from "@/components/ui/card";

interface HeatmapDataPoint {
  id: string;
  name: string;
  strategicAlignment: number;
  technicalMaturity: number;
  uciTotal: number;
  recommendation: RecommendationTier;
}

interface StrategicHeatmapProps {
  data: HeatmapDataPoint[];
}

const TIER_COLORS: Record<RecommendationTier, string> = {
  HIGH_MATCH: "var(--tier-high)",
  PARTIAL_MATCH: "var(--tier-partial)",
  NON_RESPONSIVE: "var(--tier-non-responsive)",
};

const TIER_LABELS: Record<RecommendationTier, string> = {
  HIGH_MATCH: "High Match",
  PARTIAL_MATCH: "Partial Match",
  NON_RESPONSIVE: "Non-Responsive",
};

interface TooltipPayloadItem {
  payload: HeatmapDataPoint;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-surface-elevated border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-text-primary mb-1 max-w-[200px] truncate">
        {data.name}
      </p>
      <div className="space-y-0.5 text-xs text-text-secondary">
        <p>Strategic: {Math.round(data.strategicAlignment)}</p>
        <p>Technical: {Math.round(data.technicalMaturity)}</p>
        <p>UCI Total: {Math.round(data.uciTotal)}</p>
        <p className="font-medium" style={{ color: TIER_COLORS[data.recommendation] }}>
          {TIER_LABELS[data.recommendation]}
        </p>
      </div>
    </div>
  );
}

export function StrategicHeatmap({ data }: StrategicHeatmapProps) {
  const tiers: RecommendationTier[] = ["HIGH_MATCH", "PARTIAL_MATCH", "NON_RESPONSIVE"];

  const groupedData = tiers.reduce(
    (acc, tier) => {
      acc[tier] = data.filter((d) => d.recommendation === tier);
      return acc;
    },
    {} as Record<RecommendationTier, HeatmapDataPoint[]>,
  );

  return (
    <Card variant="elevated" header="Strategic Alignment vs Technical Maturity">
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.5}
            />
            <XAxis
              type="number"
              dataKey="strategicAlignment"
              name="Strategic Alignment"
              domain={[0, 100]}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
              label={{
                value: "Strategic Alignment",
                position: "insideBottom",
                offset: -10,
                fill: "var(--text-secondary)",
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey="technicalMaturity"
              name="Technical Maturity"
              domain={[0, 100]}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
              label={{
                value: "Technical Maturity",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                fill: "var(--text-secondary)",
                fontSize: 12,
              }}
            />
            <ZAxis
              type="number"
              dataKey="uciTotal"
              range={[60, 400]}
              name="UCI Total"
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }}
            />
            {tiers.map((tier) =>
              groupedData[tier].length > 0 ? (
                <Scatter
                  key={tier}
                  name={TIER_LABELS[tier]}
                  data={groupedData[tier]}
                  fill={TIER_COLORS[tier]}
                  fillOpacity={0.7}
                  stroke={TIER_COLORS[tier]}
                  strokeWidth={1}
                />
              ) : null,
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border-subtle">
        {tiers.map((tier) => (
          <div key={tier} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: TIER_COLORS[tier] }}
            />
            <span className="text-xs text-text-muted">{TIER_LABELS[tier]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
