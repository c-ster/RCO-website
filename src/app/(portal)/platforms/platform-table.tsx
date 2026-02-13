"use client";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

interface PlatformRow {
  id: string;
  name: string;
  type: string;
  availableSlots: string;
  deploymentWindow: string;
  exerciseName: string;
}

interface PlatformTableProps {
  platforms: PlatformRow[];
}

const TYPE_COLORS: Record<string, "high" | "partial" | "info" | "default"> = {
  DDG: "high",
  SSN: "info",
  CVN: "partial",
  LCS: "high",
  UAV: "info",
  UUV: "info",
  USV: "partial",
};

type PlatformRecord = Record<string, unknown> & PlatformRow;

const columns: Column<PlatformRecord>[] = [
  {
    key: "name",
    header: "Platform Name",
    sortable: true,
    render: (value) => (
      <span className="font-medium text-text-primary">{String(value)}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    render: (value) => {
      const type = String(value);
      return (
        <Badge variant={TYPE_COLORS[type] ?? "default"}>
          {type}
        </Badge>
      );
    },
  },
  {
    key: "availableSlots",
    header: "Available Slots",
    sortable: false,
    render: (value) => (
      <span className="text-text-secondary font-mono text-xs">
        {String(value)}
      </span>
    ),
  },
  {
    key: "deploymentWindow",
    header: "Deployment Window",
    sortable: false,
    render: (value) => (
      <span className="text-text-secondary text-xs">
        {String(value)}
      </span>
    ),
  },
  {
    key: "exerciseName",
    header: "Exercise",
    sortable: true,
    render: (value) => {
      const name = String(value);
      return name === "--" ? (
        <span className="text-text-muted">--</span>
      ) : (
        <Badge variant="info">{name}</Badge>
      );
    },
  },
];

export function PlatformTable({ platforms }: PlatformTableProps) {
  const tableData = platforms as unknown as PlatformRecord[];

  return (
    <DataTable
      columns={columns}
      data={tableData}
      keyField="id"
      emptyMessage="No host platforms configured"
    />
  );
}
