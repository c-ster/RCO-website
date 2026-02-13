"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fullSubmissionSchema } from "@/lib/validators/submission";

export type SubmissionActionResult = {
  success: boolean;
  error?: string;
};

export async function createSubmission(
  _prevState: SubmissionActionResult,
  formData: FormData
): Promise<SubmissionActionResult> {
  // Authenticate
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to submit." };
  }

  // Parse JSON payload from form data
  const raw = formData.get("data");
  if (typeof raw !== "string") {
    return { success: false, error: "Invalid submission data." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { success: false, error: "Malformed submission data." };
  }

  // Validate against full schema
  const result = fullSubmissionSchema.safeParse(parsed);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? "Validation failed. Please review all fields.",
    };
  }

  const data = result.data;

  // Create submission in database
  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      capabilityText: data.capabilityText,
      technicalVitals: {
        trlLevel: data.trlLevel,
        costEstimate: data.costEstimate,
        deploymentReadyMonths: data.deploymentReadyMonths,
        swapC: data.swapC,
      },
      digitalfoundryTags: data.digitalfoundryTags,
      status: "SUBMITTED",
    },
  });

  redirect(`/submissions/${submission.id}`);
}
