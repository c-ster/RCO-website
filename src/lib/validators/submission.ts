import { z } from "zod/v4";

export const submissionStep1Schema = z.object({
  capabilityText: z
    .string()
    .min(50, "Please provide at least 50 characters describing your capability")
    .max(5000),
});

export const submissionStep2Schema = z.object({
  trlLevel: z.number().int().min(1).max(9),
  costEstimate: z.number().positive("Cost must be a positive number"),
  deploymentReadyMonths: z.number().int().min(1).max(60),
  swapC: z.object({
    size: z.string().min(1, "Size is required"),
    weight: z.string().min(1, "Weight is required"),
    power: z.string().min(1, "Power is required"),
    cooling: z.string().min(1, "Cooling is required"),
  }),
});

export const submissionStep3Schema = z.object({
  digitalfoundryTags: z
    .array(z.string())
    .min(1, "Select at least one tag"),
});

export const fullSubmissionSchema = submissionStep1Schema
  .merge(submissionStep2Schema)
  .merge(submissionStep3Schema);

export type SubmissionStep1 = z.infer<typeof submissionStep1Schema>;
export type SubmissionStep2 = z.infer<typeof submissionStep2Schema>;
export type SubmissionStep3 = z.infer<typeof submissionStep3Schema>;
export type FullSubmission = z.infer<typeof fullSubmissionSchema>;

export const DIGITALFOUNDRY_TAG_OPTIONS = [
  "UUV", "UAV", "USV", "Subsurface", "Surface", "Airborne",
  "Cyber", "Electronic Warfare", "ISR", "Communications",
  "AI/ML", "Edge Computing", "Low-Power", "High-Bandwidth",
  "Autonomous", "Manned-Unmanned Teaming", "Logistics",
  "C2", "Fires", "Sensors", "Navigation", "Directed Energy",
] as const;
