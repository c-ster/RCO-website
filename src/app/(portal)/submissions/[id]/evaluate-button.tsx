"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EvaluateButtonProps {
  submissionId: string;
}

export function EvaluateButton({ submissionId }: EvaluateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleEvaluate() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/agent/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? `Evaluation failed (${response.status})`);
      }

      // Refresh the page to show the evaluation
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="primary"
        size="sm"
        loading={loading}
        onClick={handleEvaluate}
      >
        {loading ? "Evaluating..." : "Trigger Evaluation"}
      </Button>
      {error && (
        <p className="text-xs text-danger max-w-[200px] text-right">{error}</p>
      )}
    </div>
  );
}
