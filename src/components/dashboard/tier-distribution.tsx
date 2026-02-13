"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";

interface TierDistributionProps {
  data: {
    high: number;
    partial: number;
    nonResponsive: number;
  };
}

const TIER_CONFIG = [
  { key: "high", label: "High Match", color: "var(--tier-high)" },
  { key: "partial", label: "Partial Match", color: "var(--tier-partial)" },
  { key: "nonResponsive", label: "Non-Responsive", color: "var(--tier-non-responsive)" },
] as const;

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { fill: string };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  return (
    <div className="bg-surface-elevated border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-medium" style={{ color: entry.payload.fill }}>
        {entry.name}
      </p>
      <p className="text-sm font-bold text-text-primary">{entry.value}</p>
    </div>
  );
}

export function TierDistribution({ data }: TierDistributionProps) {
  const total = data.high + data.partial + data.nonResponsive;

  const chartData = TIER_CONFIG.map((tier) => ({
    name: tier.label,
    value: data[tier.key],
    fill: tier.color,
  })).filter((d) => d.value > 0);

  return (
    <Card variant="elevated" header="Tier Distribution">
      {total === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-text-muted text-sm">
          No evaluations yet
        </div>
      ) : (
        <div className="h-[280px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-text-primary tabular-nums">
              {total}
            </span>
            <span className="text-xs text-text-muted uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="flex items-center justify-center gap-5 pt-2 border-t border-border-subtle">
        {TIER_CONFIG.map((tier) => (
          <div key={tier.key} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tier.color }}
            />
            <span className="text-xs text-text-muted">
              {tier.label} ({data[tier.key]})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
