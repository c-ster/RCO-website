"use client";

import { Card } from "@/components/ui/card";
import type { FullSubmission } from "@/lib/validators/submission";

interface StepReviewProps {
  data: Partial<FullSubmission>;
}

const TRL_LABELS: Record<number, string> = {
  1: "TRL 1 - Basic principles observed",
  2: "TRL 2 - Technology concept formulated",
  3: "TRL 3 - Experimental proof of concept",
  4: "TRL 4 - Technology validated in lab",
  5: "TRL 5 - Technology validated in relevant environment",
  6: "TRL 6 - Technology demonstrated in relevant environment",
  7: "TRL 7 - System prototype demonstration in operational environment",
  8: "TRL 8 - System complete and qualified",
  9: "TRL 9 - Actual system proven in operational environment",
};

function ReviewField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
        {label}
      </dt>
      <dd className="text-sm text-text-primary">{value || "--"}</dd>
    </div>
  );
}

export function StepReview({ data }: StepReviewProps) {
  const costFormatted = data.costEstimate
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(data.costEstimate)
    : "--";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">
          Review Submission
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Please review all the information below before submitting. Once
          submitted, your capability will enter the evaluation pipeline.
        </p>
      </div>

      {/* Capability Description */}
      <Card variant="default" header="Capability Description">
        <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
          {data.capabilityText || "--"}
        </p>
      </Card>

      {/* Technical Specifications */}
      <Card variant="default" header="Technical Specifications">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReviewField
            label="Technology Readiness Level"
            value={
              data.trlLevel ? TRL_LABELS[data.trlLevel] : "--"
            }
          />
          <ReviewField label="Cost Estimate" value={costFormatted} />
          <ReviewField
            label="Deployment Ready"
            value={
              data.deploymentReadyMonths
                ? `${data.deploymentReadyMonths} month${data.deploymentReadyMonths === 1 ? "" : "s"}`
                : "--"
            }
          />
        </dl>
      </Card>

      {/* SWaP-C */}
      <Card variant="default" header="SWaP-C Requirements">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReviewField label="Size" value={data.swapC?.size} />
          <ReviewField label="Weight" value={data.swapC?.weight} />
          <ReviewField label="Power" value={data.swapC?.power} />
          <ReviewField label="Cooling" value={data.swapC?.cooling} />
        </dl>
      </Card>

      {/* DigitalFoundry Tags */}
      <Card variant="default" header="DigitalFoundry Classification">
        {data.digitalfoundryTags && data.digitalfoundryTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.digitalfoundryTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No tags selected</p>
        )}
      </Card>
    </div>
  );
}
