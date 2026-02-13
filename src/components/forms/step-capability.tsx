"use client";

import { Textarea } from "@/components/ui/textarea";
import type { SubmissionStep1 } from "@/lib/validators/submission";

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
          Provide a comprehensive description of the capability you are
          submitting. Include the problem it solves, how it works, key
          differentiators from existing solutions, and any relevant operational
          context. The more detail you provide, the better the evaluation team
          can assess fit for fleet integration.
        </p>
      </div>

      <Textarea
        name="capabilityText"
        label="Capability Description"
        placeholder="Describe the capability, its intended use case, operational advantages, and how it addresses current gaps in fleet readiness..."
        rows={12}
        maxLength={5000}
        showCharCount
        value={data.capabilityText ?? ""}
        error={errors.capabilityText}
        hint="Minimum 50 characters required"
        onChange={(e) => onChange({ capabilityText: e.target.value })}
      />
    </div>
  );
}
