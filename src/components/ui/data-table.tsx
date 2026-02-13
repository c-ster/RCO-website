"use client";

import { useState, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  key: string;
  direction: SortDirection;
}

function SortArrow({ direction }: { direction: SortDirection }) {
  return (
    <span className="inline-flex ml-1.5" aria-hidden="true">
      <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 2.5L10 6H4L7 2.5Z"
          className={cn(
            "transition-colors",
            direction === "asc" ? "fill-accent" : "fill-text-muted/40"
          )}
        />
        <path
          d="M7 11.5L4 8H10L7 11.5Z"
          className={cn(
            "transition-colors",
            direction === "desc" ? "fill-accent" : "fill-text-muted/40"
          )}
        />
      </svg>
    </span>
  );
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = "id",
  emptyMessage = "No data available",
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>({ key: "", direction: null });

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key: "", direction: null };
      return { key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sort.direction === "desc" ? -comparison : comparison;
    });
  }, [data, sort]);

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-border-subtle bg-surface",
        className
      )}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-elevated/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted",
                  col.sortable && "cursor-pointer select-none hover:text-text-secondary",
                  col.className
                )}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                aria-sort={
                  sort.key === col.key && sort.direction
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <span className="inline-flex items-center">
                  {col.header}
                  {col.sortable && (
                    <SortArrow
                      direction={sort.key === col.key ? sort.direction : null}
                    />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={String(row[keyField] ?? rowIndex)}
                className={cn(
                  "transition-colors duration-100",
                  "hover:bg-surface-elevated/70",
                  onRowClick && "cursor-pointer"
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-text-primary",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : (String(row[col.key] ?? ""))}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
