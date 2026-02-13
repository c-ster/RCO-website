"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PLATFORM_TYPES = ["DDG", "SSN", "CVN", "LCS", "UAV", "UUV", "USV"] as const;

interface FormData {
  name: string;
  type: string;
  availableSlots: string;
  deploymentWindowStart: string;
  deploymentWindowEnd: string;
  exerciseName: string;
}

function FormField({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

const inputClassName = cn(
  "w-full px-3 py-2 rounded-lg text-sm text-text-primary",
  "bg-surface border border-border-subtle",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
  "placeholder:text-text-muted",
  "transition-colors",
);

export default function NewPlatformPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "DDG",
    availableSlots: '{\n  "total": 4,\n  "available": 2\n}',
    deploymentWindowStart: "",
    deploymentWindowEnd: "",
    exerciseName: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = "Platform name is required";
    }

    if (!formData.type) {
      errors.type = "Platform type is required";
    }

    // Validate JSON for available slots
    try {
      JSON.parse(formData.availableSlots);
    } catch {
      errors.availableSlots = "Must be valid JSON";
    }

    if (!formData.deploymentWindowStart) {
      errors.deploymentWindowStart = "Start date is required";
    }

    if (!formData.deploymentWindowEnd) {
      errors.deploymentWindowEnd = "End date is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const body = {
        name: formData.name.trim(),
        type: formData.type,
        availableSlots: JSON.parse(formData.availableSlots),
        deploymentWindow: {
          start: formData.deploymentWindowStart,
          end: formData.deploymentWindowEnd,
        },
        exerciseName: formData.exerciseName.trim() || null,
      };

      const response = await fetch("/api/v1/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? `Failed to create platform (${response.status})`);
      }

      router.push("/platforms");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create platform");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/platforms"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Platforms
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Add Host Platform
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Register a new naval platform for capability deployment matching.
        </p>
      </div>

      <Card variant="elevated">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Platform Name */}
          <FormField label="Platform Name" error={fieldErrors.name} required>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g., USS Zumwalt (DDG-1000)"
              className={inputClassName}
            />
          </FormField>

          {/* Platform Type */}
          <FormField label="Platform Type" error={fieldErrors.type} required>
            <select
              value={formData.type}
              onChange={(e) => updateField("type", e.target.value)}
              className={inputClassName}
            >
              {PLATFORM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>

          {/* Available Slots */}
          <FormField label="Available Slots (JSON)" error={fieldErrors.availableSlots} required>
            <textarea
              value={formData.availableSlots}
              onChange={(e) => updateField("availableSlots", e.target.value)}
              rows={4}
              className={cn(inputClassName, "font-mono text-xs")}
              placeholder='{ "total": 4, "available": 2 }'
            />
          </FormField>

          {/* Deployment Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Deployment Window Start"
              error={fieldErrors.deploymentWindowStart}
              required
            >
              <input
                type="date"
                value={formData.deploymentWindowStart}
                onChange={(e) => updateField("deploymentWindowStart", e.target.value)}
                className={inputClassName}
              />
            </FormField>
            <FormField
              label="Deployment Window End"
              error={fieldErrors.deploymentWindowEnd}
              required
            >
              <input
                type="date"
                value={formData.deploymentWindowEnd}
                onChange={(e) => updateField("deploymentWindowEnd", e.target.value)}
                className={inputClassName}
              />
            </FormField>
          </div>

          {/* Exercise Name */}
          <FormField label="Exercise Name">
            <input
              type="text"
              value={formData.exerciseName}
              onChange={(e) => updateField("exerciseName", e.target.value)}
              placeholder="e.g., RIMPAC 2026"
              className={inputClassName}
            />
          </FormField>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/30">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <Link href="/platforms">
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={loading}>
              {loading ? "Creating..." : "Create Platform"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
