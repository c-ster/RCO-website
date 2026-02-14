"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CAPABILITY_TYPES, type SubmissionStep1 } from "@/lib/validators/submission";

interface StepCapabilityProps {
  data: Partial<SubmissionStep1>;
  errors: Record<string, string>;
  onChange: (data: Partial<SubmissionStep1>) => void;
}

export function StepCapability({ data, errors, onChange }: StepCapabilityProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">
          Describe Your Capability
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Select the type of capability and provide a comprehensive description.
          This can be hardware, software, a hybrid system, or a service/methodology.
        </p>
      </div>

      {/* Capability Type Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Capability Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CAPABILITY_TYPES.map((type) => {
            const isSelected = data.capabilityType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange({ capabilityType: type.value })}
                className={cn(
                  "flex flex-col items-start gap-1 p-4 rounded-lg border text-left transition-all cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isSelected
                    ? "bg-accent/10 border-accent text-accent shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                    : "bg-surface-elevated border-border-subtle text-text-secondary hover:border-border hover:text-text-primary"
                )}
              >
                <span className="text-sm font-semibold">{type.label}</span>
                <span className={cn(
                  "text-xs",
                  isSelected ? "text-accent/80" : "text-text-muted"
                )}>
                  {type.description}
                </span>
              </button>
            );
          })}
        </div>
        {errors.capabilityType && (
          <p className="text-xs text-danger" role="alert">
            {errors.capabilityType}
          </p>
        )}
      </div>

      <Textarea
        name="capabilityText"
        label="Capability Description"
        placeholder="Describe the capability, its intended use case, operational advantages, and how it addresses current gaps..."
        rows={10}
        maxLength={10000}
        showCharCount
        value={data.capabilityText ?? ""}
        error={errors.capabilityText}
        hint="Minimum 50 characters. Include problem statement, solution approach, key differentiators, and operational context."
        onChange={(e) => onChange({ capabilityText: e.target.value })}
      />
    </div>
  );
}
