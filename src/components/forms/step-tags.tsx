"use client";

import { cn } from "@/lib/utils";
import {
  DIGITALFOUNDRY_TAG_GROUPS,
  type SubmissionStep3,
} from "@/lib/validators/submission";

interface StepTagsProps {
  data: Partial<SubmissionStep3>;
  errors: Record<string, string>;
  onChange: (data: Partial<SubmissionStep3>) => void;
}

export function StepTags({ data, errors, onChange }: StepTagsProps) {
  const selectedTags = data.digitalfoundryTags ?? [];

  function toggleTag(tag: string) {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onChange({ digitalfoundryTags: next });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">
          DigitalFoundry Classification
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Select all applicable domain tags for your capability. These tags
          determine which DigitalFoundry integration pathways and host platform
          matches are evaluated. Select at least one.
        </p>
      </div>

      {/* Grouped tag sections */}
      <div className="space-y-5">
        {Object.entries(DIGITALFOUNDRY_TAG_GROUPS).map(([group, tags]) => (
          <div key={group} className="space-y-2">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              {group}
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium",
                      "border transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      "cursor-pointer",
                      isSelected
                        ? "bg-accent/15 text-accent border-accent shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                        : "bg-surface-elevated text-text-secondary border-border-subtle hover:border-border hover:text-text-primary"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {errors.digitalfoundryTags && (
        <p className="text-xs text-danger" role="alert">
          {errors.digitalfoundryTags}
        </p>
      )}

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle">
          <span className="text-xs text-text-muted w-full mb-1">
            {selectedTags.length} selected:
          </span>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30"
            >
              {tag}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className="hover:text-white transition-colors cursor-pointer"
                aria-label={`Remove ${tag}`}
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
