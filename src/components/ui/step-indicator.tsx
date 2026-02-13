import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  description?: string;
}

export type StepStatus = "completed" | "active" | "upcoming";

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

function getStepStatus(index: number, currentStep: number): StepStatus {
  if (index < currentStep) return "completed";
  if (index === currentStep) return "active";
  return "upcoming";
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-white"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const status = getStepStatus(index, currentStep);
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <div className="flex flex-col items-center gap-1.5">
                {/* Step circle */}
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    "transition-all duration-300",
                    status === "completed" &&
                      "bg-success shadow-[0_0_10px_rgba(34,197,94,0.4)]",
                    status === "active" &&
                      "bg-accent shadow-[0_0_12px_rgba(59,130,246,0.5)] ring-2 ring-accent/30",
                    status === "upcoming" &&
                      "bg-surface-elevated border border-border text-text-muted"
                  )}
                  aria-current={status === "active" ? "step" : undefined}
                >
                  {status === "completed" ? (
                    <CheckIcon />
                  ) : (
                    <span
                      className={cn(
                        status === "active" ? "text-white" : "text-text-muted"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                {/* Step label */}
                <span
                  className={cn(
                    "text-xs font-medium text-center max-w-[80px]",
                    status === "active" && "text-accent",
                    status === "completed" && "text-success",
                    status === "upcoming" && "text-text-muted"
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[10px] text-text-muted text-center max-w-[100px]">
                    {step.description}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300",
                    status === "completed" ? "bg-success" : "bg-border-subtle"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
