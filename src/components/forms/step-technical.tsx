"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, type SelectOption } from "@/components/ui/select";
import type { FullSubmission } from "@/lib/validators/submission";

interface StepTechnicalProps {
  data: Partial<FullSubmission>;
  errors: Record<string, string>;
  onChange: (data: Partial<FullSubmission>) => void;
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

const CLASSIFICATION_OPTIONS: SelectOption[] = [
  { value: "unclassified", label: "Unclassified" },
  { value: "cui", label: "CUI (Controlled Unclassified)" },
  { value: "secret", label: "Secret" },
  { value: "top-secret", label: "Top Secret / SCI" },
];

const INTEGRATION_OPTIONS: SelectOption[] = [
  { value: "api", label: "API / REST / gRPC" },
  { value: "containerized", label: "Containerized (Docker / K8s)" },
  { value: "standalone", label: "Standalone Application" },
  { value: "embedded", label: "Embedded / On-device" },
  { value: "cloud", label: "Cloud-hosted (SaaS / PaaS)" },
  { value: "sdk", label: "SDK / Library" },
  { value: "other", label: "Other" },
];

export function StepTechnical({ data, errors, onChange }: StepTechnicalProps) {
  const capType = data.capabilityType;
  const showSwapC = capType === "hardware" || capType === "hybrid";
  const showSoftware = capType === "software" || capType === "hybrid";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">
          Technical Specifications
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Provide the technical details relevant to your{" "}
          {capType === "hardware" ? "hardware system" :
           capType === "software" ? "software capability" :
           capType === "hybrid" ? "hybrid system" :
           "capability"}.
          Fill in what applies — not all fields are required for every project type.
        </p>
      </div>

      {/* Core fields (always shown) */}
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
          hint="Total project or per-unit cost estimate"
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

      {/* SWaP-C Section (hardware / hybrid only) */}
      {showSwapC && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              SWaP-C Requirements
            </h3>
            <p className="text-xs text-text-muted">
              Size, Weight, Power, and Cooling specifications for platform integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-border-subtle bg-surface-elevated/30">
            <Input
              name="swapC.size"
              label="Size"
              placeholder='e.g. 12" x 8" x 4" or 2U rack-mount'
              value={data.swapC?.size ?? ""}
              error={errors["swapC.size"]}
              onChange={(e) =>
                onChange({
                  swapC: { ...data.swapC, size: e.target.value } as FullSubmission["swapC"],
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
                  swapC: { ...data.swapC, weight: e.target.value } as FullSubmission["swapC"],
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
                  swapC: { ...data.swapC, power: e.target.value } as FullSubmission["swapC"],
                })
              }
            />
            <Input
              name="swapC.cooling"
              label="Cooling"
              placeholder="e.g. Passive air-cooled"
              value={data.swapC?.cooling ?? ""}
              error={errors["swapC.cooling"]}
              onChange={(e) =>
                onChange({
                  swapC: { ...data.swapC, cooling: e.target.value } as FullSubmission["swapC"],
                })
              }
            />
          </div>
        </div>
      )}

      {/* Software / AI Details (software / hybrid only) */}
      {showSoftware && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Software & Integration Details
            </h3>
            <p className="text-xs text-text-muted">
              Technical details about your software, AI/ML models, or digital capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-border-subtle bg-surface-elevated/30">
            <Input
              name="softwareDetails.language"
              label="Primary Language / Framework"
              placeholder="e.g. Python, Rust, C++, React"
              value={data.softwareDetails?.language ?? ""}
              error={errors["softwareDetails.language"]}
              onChange={(e) =>
                onChange({
                  softwareDetails: { ...data.softwareDetails, language: e.target.value },
                })
              }
            />

            <Select
              name="softwareDetails.classification"
              label="Data Classification"
              options={CLASSIFICATION_OPTIONS}
              placeholder="Select classification..."
              value={data.softwareDetails?.classification ?? ""}
              error={errors["softwareDetails.classification"]}
              onChange={(e) =>
                onChange({
                  softwareDetails: { ...data.softwareDetails, classification: e.target.value },
                })
              }
            />

            <Select
              name="softwareDetails.integrationMethod"
              label="Integration Method"
              options={INTEGRATION_OPTIONS}
              placeholder="How does it integrate?"
              value={data.softwareDetails?.integrationMethod ?? ""}
              error={errors["softwareDetails.integrationMethod"]}
              onChange={(e) =>
                onChange({
                  softwareDetails: { ...data.softwareDetails, integrationMethod: e.target.value },
                })
              }
            />

            <Input
              name="softwareDetails.dataRequirements"
              label="Data Requirements"
              placeholder="e.g. Training data, sensor feeds, APIs"
              value={data.softwareDetails?.dataRequirements ?? ""}
              error={errors["softwareDetails.dataRequirements"]}
              onChange={(e) =>
                onChange({
                  softwareDetails: { ...data.softwareDetails, dataRequirements: e.target.value },
                })
              }
            />
          </div>
        </div>
      )}

      {/* Additional Context (always shown) */}
      <Textarea
        name="additionalContext"
        label="Additional Technical Context (Optional)"
        placeholder="Any other relevant technical details: dependencies, certifications, existing integrations, IP considerations..."
        rows={4}
        maxLength={3000}
        showCharCount
        value={data.additionalContext ?? ""}
        error={errors.additionalContext}
        onChange={(e) => onChange({ additionalContext: e.target.value })}
      />
    </div>
  );
}
