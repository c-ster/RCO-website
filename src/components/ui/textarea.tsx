"use client";

import { forwardRef, useState, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      maxLength,
      showCharCount = true,
      className,
      id,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [charCount, setCharCount] = useState(
      () => String(value ?? defaultValue ?? "").length
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            "w-full rounded-lg px-3 py-2 text-sm min-h-[100px] resize-y",
            "bg-surface-elevated text-text-primary",
            "border border-border-subtle",
            "placeholder:text-text-muted",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-danger focus:ring-danger focus:border-danger",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          {...props}
        />
        <div className="flex items-center justify-between">
          <div>
            {error && (
              <p
                id={`${textareaId}-error`}
                className="text-xs text-danger"
                role="alert"
              >
                {error}
              </p>
            )}
            {!error && hint && (
              <p id={`${textareaId}-hint`} className="text-xs text-text-muted">
                {hint}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p
              className={cn(
                "text-xs text-text-muted tabular-nums",
                charCount >= maxLength && "text-danger"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
