import { z } from "zod/v4";

// Capability types that determine which fields are shown
export const CAPABILITY_TYPES = [
  { value: "hardware", label: "Hardware / Physical System", description: "Sensors, platforms, weapons, physical devices" },
  { value: "software", label: "Software / AI / ML", description: "Applications, algorithms, AI models, cyber tools" },
  { value: "hybrid", label: "Hybrid (Hardware + Software)", description: "Systems with both physical and software components" },
  { value: "service", label: "Service / Process / Methodology", description: "Testing services, operational concepts, training" },
] as const;

export type CapabilityType = (typeof CAPABILITY_TYPES)[number]["value"];

// Step 1: Capability description + type
export const submissionStep1Schema = z.object({
  capabilityType: z.enum(["hardware", "software", "hybrid", "service"]),
  capabilityText: z
    .string()
    .min(50, "Please provide at least 50 characters describing your capability")
    .max(10000),
});

// Step 2: Technical details - flexible based on type
// SWaP-C is optional (only relevant for hardware/hybrid)
export const submissionStep2Schema = z.object({
  trlLevel: z.number().int().min(1).max(9),
  costEstimate: z.number().positive("Cost must be a positive number"),
  deploymentReadyMonths: z.number().int().min(1).max(60),
  // Optional fields that appear based on capability type
  swapC: z.object({
    size: z.string().min(1, "Size is required"),
    weight: z.string().min(1, "Weight is required"),
    power: z.string().min(1, "Power is required"),
    cooling: z.string().min(1, "Cooling is required"),
  }).optional(),
  // Software / AI fields
  softwareDetails: z.object({
    language: z.string().optional(),
    classification: z.string().optional(),
    dataRequirements: z.string().optional(),
    integrationMethod: z.string().optional(),
  }).optional(),
  // Open-ended additional context
  additionalContext: z.string().max(3000).optional(),
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

// Grouped tags for better organization
export const DIGITALFOUNDRY_TAG_GROUPS = {
  "Platform Domain": [
    "UUV", "UAV", "USV", "Subsurface", "Surface", "Airborne", "Space", "Ground",
  ],
  "Technology Area": [
    "AI/ML", "Cyber", "Electronic Warfare", "ISR", "Communications",
    "Edge Computing", "Cloud/SaaS", "Digital Twin", "Simulation",
    "Directed Energy", "Quantum", "Blockchain/DLT",
  ],
  "Capability Type": [
    "Sensors", "Navigation", "C2", "Fires", "Logistics",
    "Autonomous", "Manned-Unmanned Teaming", "Training",
    "Test & Evaluation", "Sustainment",
  ],
  "Characteristics": [
    "Low-Power", "High-Bandwidth", "Low-SWaP", "Open Architecture",
    "MOSA Compliant", "Zero Trust", "Rad-Hard", "EMI Hardened",
  ],
} as const;

// Flat list for backward compatibility
export const DIGITALFOUNDRY_TAG_OPTIONS = Object.values(DIGITALFOUNDRY_TAG_GROUPS).flat();
