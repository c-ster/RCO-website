"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepCapability } from "@/components/forms/step-capability";
import { StepTechnical } from "@/components/forms/step-technical";
import { StepTags } from "@/components/forms/step-tags";
import { StepReview } from "@/components/forms/step-review";
import {
  submissionStep1Schema,
  submissionStep2Schema,
  submissionStep3Schema,
  type FullSubmission,
} from "@/lib/validators/submission";
import { createSubmission, type SubmissionActionResult } from "@/app/actions/submissions";

const STEPS = [
  { label: "Capability", description: "Description" },
  { label: "Technical", description: "Specifications" },
  { label: "Tags", description: "Classification" },
  { label: "Review", description: "Submit" },
];

const stepValidators = [
  submissionStep1Schema,
  submissionStep2Schema,
  submissionStep3Schema,
  null, // review step has no additional validation
] as const;

function flattenErrors(
  issues: { path: (string | number)[]; message: string }[]
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.join(".");
    if (!map[key]) {
      map[key] = issue.message;
    }
  }
  return map;
}

export function IntakeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FullSubmission>>({});
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const [actionState, formAction] = useActionState<SubmissionActionResult, FormData>(
    createSubmission,
    { success: false, error: undefined }
  );
  const [isPending, startTransition] = useTransition();

  const updateFormData = useCallback(
    (partial: Partial<FullSubmission>) => {
      setFormData((prev) => ({ ...prev, ...partial }));
      // Clear errors for fields being updated
      if (Object.keys(stepErrors).length > 0) {
        const clearedKeys = Object.keys(partial);
        setStepErrors((prev) => {
          const next = { ...prev };
          for (const key of clearedKeys) {
            delete next[key];
            // Also clear nested keys (e.g. swapC.size)
            for (const errKey of Object.keys(next)) {
              if (errKey.startsWith(key + ".")) {
                delete next[errKey];
              }
            }
          }
          return next;
        });
      }
    },
    [stepErrors]
  );

  function validateCurrentStep(): boolean {
    const validator = stepValidators[currentStep];
    if (!validator) return true;

    const result = validator.safeParse(formData);
    if (result.success) {
      setStepErrors({});
      return true;
    }

    const errors = flattenErrors(
      result.error.issues.map((i) => ({
        path: i.path as (string | number)[],
        message: i.message,
      }))
    );
    setStepErrors(errors);
    return false;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setDirection("forward");
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    setStepErrors({});
  }

  function handleBack() {
    setDirection("backward");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setStepErrors({});
  }

  function handleSubmit() {
    startTransition(() => {
      const fd = new FormData();
      fd.set("data", JSON.stringify(formData));
      formAction(fd);
    });
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Capability Submission
        </h1>
        <p className="text-sm text-text-muted">
          NAV-FORGE Intake Pipeline
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <Card variant="elevated" className="relative overflow-hidden">
        <div
          key={currentStep}
          className={
            direction === "forward" ? "animate-step-forward" : "animate-step-backward"
          }
        >
          {currentStep === 0 && (
            <StepCapability
              data={formData}
              errors={stepErrors}
              onChange={updateFormData}
            />
          )}
          {currentStep === 1 && (
            <StepTechnical
              data={formData}
              errors={stepErrors}
              onChange={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <StepTags
              data={formData}
              errors={stepErrors}
              onChange={updateFormData}
            />
          )}
          {currentStep === 3 && <StepReview data={formData} />}
        </div>
      </Card>

      {/* Server action error */}
      {actionState.error && (
        <div
          className="rounded-lg border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {actionState.error}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={isFirstStep || isPending}
          className={isFirstStep ? "invisible" : ""}
        >
          <svg
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Button>

        <div className="text-xs text-text-muted">
          Step {currentStep + 1} of {STEPS.length}
        </div>

        {isLastStep ? (
          <Button
            variant="primary"
            size="lg"
            loading={isPending}
            onClick={handleSubmit}
          >
            Submit Capability
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>
            Next
            <svg
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
