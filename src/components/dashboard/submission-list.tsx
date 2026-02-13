"use client";

import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatScore } from "@/lib/utils";
import type { RecommendationTier, SubmissionStatus } from "@/generated/prisma";

interface SubmissionRow {
  id: string;
  capabilityText: string;
  status: SubmissionStatus;
  createdAt: string;
  evaluation?: {
    uciTotal: number;
    recommendation: RecommendationTier;
  } | null;
}

interface SubmissionListProps {
  submissions: SubmissionRow[];
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  EVALUATING: "Evaluating",
  EVALUATED: "Evaluated",
  ARCHIVED: "Archived",
};

const STATUS_VARIANTS: Record<SubmissionStatus, "default" | "info" | "high" | "partial"> = {
  DRAFT: "default",
  SUBMITTED: "info",
  EVALUATING: "partial",
  EVALUATED: "high",
  ARCHIVED: "default",
};

const TIER_LABELS: Record<RecommendationTier, string> = {
  HIGH_MATCH: "High Match",
  PARTIAL_MATCH: "Partial Match",
  NON_RESPONSIVE: "Non-Responsive",
};

const TIER_VARIANTS: Record<RecommendationTier, "high" | "partial" | "non-responsive"> = {
  HIGH_MATCH: "high",
  PARTIAL_MATCH: "partial",
  NON_RESPONSIVE: "non-responsive",
};

type SubmissionRecord = Record<string, unknown> & SubmissionRow;

const columns: Column<SubmissionRecord>[] = [
  {
    key: "capabilityText",
    header: "Capability",
    sortable: true,
    className: "max-w-[300px]",
    render: (value) => (
      <span className="block truncate text-text-primary font-medium">
        {String(value).slice(0, 80)}
        {String(value).length > 80 ? "..." : ""}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (value) => {
      const status = value as SubmissionStatus;
      return (
        <Badge variant={STATUS_VARIANTS[status]}>
          {STATUS_LABELS[status]}
        </Badge>
      );
    },
  },
  {
    key: "evaluation",
    header: "UCI Score",
    sortable: false,
    render: (_value, row) => {
      const sub = row as unknown as SubmissionRow;
      if (!sub.evaluation) return <span className="text-text-muted">--</span>;
      return (
        <span className="font-mono font-semibold tabular-nums text-text-primary">
          {formatScore(sub.evaluation.uciTotal)}
        </span>
      );
    },
  },
  {
    key: "recommendation",
    header: "Recommendation",
    sortable: false,
    render: (_value, row) => {
      const sub = row as unknown as SubmissionRow;
      if (!sub.evaluation?.recommendation) return <span className="text-text-muted">--</span>;
      return (
        <Badge variant={TIER_VARIANTS[sub.evaluation.recommendation]}>
          {TIER_LABELS[sub.evaluation.recommendation]}
        </Badge>
      );
    },
  },
  {
    key: "createdAt",
    header: "Date",
    sortable: true,
    render: (value) => (
      <span className="text-text-secondary text-xs">
        {formatDate(String(value))}
      </span>
    ),
  },
];

export function SubmissionList({ submissions }: SubmissionListProps) {
  const router = useRouter();

  const tableData: SubmissionRecord[] = submissions.map((s) => ({
    ...s,
    recommendation: s.evaluation?.recommendation ?? null,
  })) as unknown as SubmissionRecord[];

  return (
    <DataTable
      columns={columns}
      data={tableData}
      keyField="id"
      emptyMessage="No submissions found"
      onRowClick={(row) => {
        const sub = row as unknown as SubmissionRow;
        router.push(`/submissions/${sub.id}`);
      }}
    />
  );
}
