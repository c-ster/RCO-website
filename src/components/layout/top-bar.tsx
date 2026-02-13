"use client";

import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string;
  pageTitle?: string;
}

export function TopBar({ userName, userEmail, userRole, pageTitle }: TopBarProps) {
  const roleBadgeVariant = userRole === "DIRECTOR"
    ? "info"
    : userRole === "REVIEWER"
      ? "partial"
      : "default";

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border-subtle bg-surface/50 backdrop-blur-sm">
      <div>
        {pageTitle && (
          <h2 className="text-lg font-semibold text-text-primary">{pageTitle}</h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Badge variant={roleBadgeVariant}>{userRole}</Badge>
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">{userName || userEmail}</p>
          {userName && userEmail && (
            <p className="text-xs text-text-muted">{userEmail}</p>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary border border-border rounded-md hover:bg-surface-elevated transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
