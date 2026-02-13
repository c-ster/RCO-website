"use client";

import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import type { SubmissionStep2 } from "@/lib/validators/submission";

interface StepTechnicalProps {
  data: Partial<SubmissionStep2>;
  errors: Record<string, string>;
  onChange: (data: Partial<SubmissionStep2>) => void;
}

const TRL_OPTIONS: SelectOption[] = [
  { value: "1", label: "TRL 1 - Basic principles observed" },
  { value: "2", label: "TRL 2 - Technology concept formulated" },
  { value: "3", label: "TRL 3 - Experimental proof of concept" },
  { value: "4", label: "TRL 4 - Technology validated in lab" },
  { value: "5", label: "TRL 5 - Technology validated in relevant environment" },
  { value: "6", label: "TRL 6 - Technology demonstrated in relevant environment" },
  { value: "7", label: "TRL 7 - System prototype demonstration in operational environment" },
  { value: "8", label: "TRL 8 - System complete and qualified" },
  { value: "9", label: "TRL 9 - Actual system proven in operational environment" },
];

export function StepTechnical({ data, errors, onChange }: StepTechnicalProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">
          Technical Specifications
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Provide the technical details of your capability. This information
          helps the evaluation team assess maturity, integration feasibility,
          and deployment readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          name="trlLevel"
          label="Technology Readiness Level (TRL)"
          options={TRL_OPTIONS}
          placeholder="Select TRL level..."
          value={data.trlLevel?.toString() ?? ""}
          error={errors.trlLevel}
          onChange={(e) =>
            onChange({ trlLevel: e.target.value ? Number(e.target.value) : undefined })
          }
        />

        <Input
          name="costEstimate"
          type="number"
          label="Cost Estimate (USD)"
          placeholder="e.g. 250000"
          value={data.costEstimate ?? ""}
          error={errors.costEstimate}
          hint="Estimated per-unit cost in US dollars"
          min={0}
          step="any"
          onChange={(e) =>
            onChange({
              costEstimate: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />

        <Input
          name="deploymentReadyMonths"
          type="number"
          label="Deployment Ready (Months)"
          placeholder="e.g. 12"
          value={data.deploymentReadyMonths ?? ""}
          error={errors.deploymentReadyMonths}
          hint="Estimated months until deployment ready (1-60)"
          min={1}
          max={60}
          onChange={(e) =>
            onChange({
              deploymentReadyMonths: e.target.value
                ? Number(e.target.value)
                : undefined,
            })
          }
        />
      </div>

      {/* SWaP-C Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            SWaP-C Requirements
          </h3>
          <p className="text-xs text-text-muted">
            Size, Weight, Power, and Cooling specifications for platform
            integration assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-border-subtle bg-surface-elevated/30">
          <Input
            name="swapC.size"
            label="Size"
            placeholder='e.g. 12" x 8" x 4" (rack-mountable)'
            value={data.swapC?.size ?? ""}
            error={errors["swapC.size"]}
            onChange={(e) =>
              onChange({
                swapC: { ...data.swapC, size: e.target.value } as SubmissionStep2["swapC"],
              })
            }
          />

          <Input
            name="swapC.weight"
            label="Weight"
            placeholder="e.g. 15 lbs"
            value={data.swapC?.weight ?? ""}
            error={errors["swapC.weight"]}
            onChange={(e) =>
              onChange({
                swapC: { ...data.swapC, weight: e.target.value } as SubmissionStep2["swapC"],
              })
            }
          />

          <Input
            name="swapC.power"
            label="Power"
            placeholder="e.g. 120W, 28VDC"
            value={data.swapC?.power ?? ""}
            error={errors["swapC.power"]}
            onChange={(e) =>
              onChange({
                swapC: { ...data.swapC, power: e.target.value } as SubmissionStep2["swapC"],
              })
            }
          />

          <Input
            name="swapC.cooling"
            label="Cooling"
            placeholder="e.g. Passive air-cooled, no active cooling required"
            value={data.swapC?.cooling ?? ""}
            error={errors["swapC.cooling"]}
            onChange={(e) =>
              onChange({
                swapC: { ...data.swapC, cooling: e.target.value } as SubmissionStep2["swapC"],
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
