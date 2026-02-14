import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic";
import { SYSTEM_PROMPT, buildEvaluationPrompt } from "@/lib/prompts/evaluator";

// Allow up to 60 seconds for the AI evaluation
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { submissionId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.submissionId) {
    return NextResponse.json({ error: "submissionId is required" }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({
    where: { id: body.submissionId },
    include: { evaluation: true },
  });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  if (submission.evaluation) {
    return NextResponse.json({ error: "Already evaluated" }, { status: 409 });
  }

  // Update status to evaluating
  await prisma.submission.update({
    where: { id: submission.id },
    data: { status: "EVALUATING" },
  });

  const hostPlatforms = await prisma.hostPlatform.findMany();

  const technicalVitals = submission.technicalVitals as {
    trlLevel: number;
    costEstimate: number;
    deploymentReadyMonths: number;
    swapC: { size: string; weight: string; power: string; cooling: string };
  };

  const prompt = buildEvaluationPrompt(
    {
      capabilityText: submission.capabilityText,
      technicalVitals,
      digitalfoundryTags: submission.digitalfoundryTags,
    },
    hostPlatforms.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      availableSlots: p.availableSlots,
      deploymentWindow: p.deploymentWindow,
      exerciseName: p.exerciseName,
    })),
  );

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }).catch((err) => {
      console.error("Anthropic API error details:", {
        status: err?.status,
        message: err?.message,
        type: err?.error?.type,
      });
      throw err;
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response - strip markdown code fences if present
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
    const evaluation = JSON.parse(cleanJson);

    // Determine recommendation tier
    const recommendation =
      evaluation.uciTotal >= 80
        ? "HIGH_MATCH"
        : evaluation.uciTotal >= 50
          ? "PARTIAL_MATCH"
          : "NON_RESPONSIVE";

    // Store evaluation
    const savedEvaluation = await prisma.evaluation.create({
      data: {
        submissionId: submission.id,
        uciTotal: evaluation.uciTotal,
        strategicAlignment: evaluation.strategicAlignment,
        technicalMaturity: evaluation.technicalMaturity,
        digitalfoundryViability: evaluation.digitalfoundryViability,
        reasoningTrace: evaluation.reasoningTrace,
        recommendation,
        digitalfoundryMatch: evaluation.digitalfoundryMatch,
        citations: evaluation.citations,
        summaryBlurb: evaluation.summaryBlurb,
      },
    });

    // Update submission status
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: "EVALUATED" },
    });

    return NextResponse.json({
      success: true,
      data: savedEvaluation,
    });
  } catch (error) {
    // Revert status on failure
    await prisma.submission.update({
      where: { id: submission.id },
      data: { status: "SUBMITTED" },
    });

    const errMsg = error instanceof Error ? error.message : String(error);
    const errStatus = (error as { status?: number })?.status;
    console.error("Evaluation failed:", errMsg, errStatus);
    return NextResponse.json(
      {
        error: errStatus === 401
          ? "Anthropic API key is invalid or missing. Check ANTHROPIC_API_KEY."
          : errStatus === 404
            ? "Model not found. The specified Claude model may not be available."
            : `Evaluation failed: ${errMsg}`,
      },
      { status: 500 },
    );
  }
}
