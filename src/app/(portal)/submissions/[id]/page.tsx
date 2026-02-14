import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { formatDate } from "@/lib/utils";
import { EvaluateButton } from "./evaluate-button";
import { ReasoningTrace } from "./reasoning-trace";
import type { RecommendationTier } from "@/generated/prisma";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

const TIER_LABELS: Record<RecommendationTier, string> = {
  HIGH_MATCH: "High Match",
  PARTIAL_MATCH: "Partial Match",
  NON_RESPONSIVE: "Non-Responsive",
};

const TIER_VARIANTS: Record<RecommendationTier, "high" | "partial" | "non-responsive"> = {
  HIGH_MATCH: "high",
  PARTIAL_MATCH: "partial",
  NON_RESPONSIVE: "non-responsive",
};

interface SwapC {
  size?: string;
  weight?: string;
  power?: string;
  cooling?: string;
}

interface SoftwareDetails {
  language?: string;
  classification?: string;
  integrationMethod?: string;
  dataRequirements?: string;
}

interface TechnicalVitals {
  capabilityType?: string;
  trlLevel?: number;
  costEstimate?: number;
  deploymentReadyMonths?: number;
  swapC?: SwapC;
  softwareDetails?: SoftwareDetails;
  additionalContext?: string;
  [key: string]: unknown;
}

const CAPABILITY_TYPE_LABELS: Record<string, string> = {
  hardware: "Hardware / Physical System",
  software: "Software / AI / ML",
  hybrid: "Hybrid (Hardware + Software)",
  service: "Service / Process / Methodology",
};

const CLASSIFICATION_LABELS: Record<string, string> = {
  unclassified: "Unclassified",
  cui: "CUI (Controlled Unclassified)",
  secret: "Secret",
  "top-secret": "Top Secret / SCI",
};

const INTEGRATION_LABELS: Record<string, string> = {
  api: "API / REST / gRPC",
  containerized: "Containerized (Docker / K8s)",
  standalone: "Standalone Application",
  embedded: "Embedded / On-device",
  cloud: "Cloud-hosted (SaaS / PaaS)",
  sdk: "SDK / Library",
  other: "Other",
};

interface Citation {
  source?: string;
  text?: string;
  page?: string | number;
  [key: string]: unknown;
}

interface DigitalFoundryMatchEntry {
  platformName?: string;
  compatibilityScore?: number;
  deploymentWindow?: string;
  exerciseName?: string | null;
  details?: string;
  [key: string]: unknown;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const submission = await prisma.submission.findUnique({
    where: { id },
    select: { capabilityText: true },
  });

  return {
    title: submission
      ? `${submission.capabilityText.slice(0, 50)} | NAV-FORGE Portal`
      : "Submission | NAV-FORGE Portal",
  };
}

export default async function SubmissionDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      evaluation: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!submission) notFound();

  // Submitters can only see their own submissions
  if (session.user.role === "SUBMITTER" && submission.userId !== session.user.id) {
    notFound();
  }

  const evaluation = submission.evaluation;
  const technicalVitals = submission.technicalVitals as TechnicalVitals | null;
  const citations = evaluation?.citations as Citation[] | null;
  const dfMatch = evaluation?.digitalfoundryMatch;
  const dfMatches: DigitalFoundryMatchEntry[] = dfMatch
    ? Array.isArray(dfMatch)
      ? (dfMatch as DigitalFoundryMatchEntry[])
      : [dfMatch as DigitalFoundryMatchEntry]
    : [];

  const reasoningTrace = evaluation?.reasoningTrace as Record<string, unknown> | null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back link */}
      <Link
        href="/submissions"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Submissions
      </Link>

      {/* Header row with status */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Submission Detail
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Submitted by {submission.user.name ?? submission.user.email} on{" "}
            {formatDate(submission.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              submission.status === "EVALUATED"
                ? "high"
                : submission.status === "EVALUATING"
                  ? "partial"
                  : submission.status === "SUBMITTED"
                    ? "info"
                    : "default"
            }
          >
            {submission.status}
          </Badge>
          {submission.status === "SUBMITTED" && (
            <EvaluateButton submissionId={submission.id} />
          )}
        </div>
      </div>

      {/* Capability Text */}
      <Card variant="elevated" header="Capability Description">
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
          {submission.capabilityText}
        </p>
      </Card>

      {/* Evaluation Scores */}
      {evaluation && (
        <>
          {/* Recommendation + Scores */}
          <Card variant="glow" header="Evaluation Results">
            <div className="flex flex-col gap-6">
              {/* Recommendation tier */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">Recommendation:</span>
                <Badge variant={TIER_VARIANTS[evaluation.recommendation]} className="text-sm px-3 py-1">
                  {TIER_LABELS[evaluation.recommendation]}
                </Badge>
              </div>

              {/* Score gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                <ScoreGauge
                  score={evaluation.uciTotal}
                  label="UCI Total"
                  size={100}
                />
                <ScoreGauge
                  score={evaluation.strategicAlignment}
                  label="Strategic"
                  size={100}
                />
                <ScoreGauge
                  score={evaluation.technicalMaturity}
                  label="Technical"
                  size={100}
                />
                <ScoreGauge
                  score={evaluation.digitalfoundryViability}
                  label="DF Viability"
                  size={100}
                />
              </div>

              {/* Summary blurb */}
              {evaluation.summaryBlurb && (
                <div className="pt-4 border-t border-border-subtle">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Summary
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {evaluation.summaryBlurb}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Reasoning Trace */}
          {reasoningTrace && (
            <ReasoningTrace trace={reasoningTrace} />
          )}

          {/* Citations */}
          {citations && citations.length > 0 && (
            <Card variant="elevated" header="Citations">
              <ul className="space-y-3">
                {citations.map((citation, index) => (
                  <li
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-surface border border-border-subtle"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      {citation.source && (
                        <p className="text-sm font-medium text-text-primary">
                          {citation.source}
                        </p>
                      )}
                      {citation.text && (
                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                          {citation.text}
                        </p>
                      )}
                      {citation.page && (
                        <p className="text-xs text-text-muted mt-0.5">
                          Page: {citation.page}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* DigitalFoundry Matches */}
          {dfMatches.length > 0 && (
            <Card variant="elevated" header="DigitalFoundry Platform Matches">
              <div className="space-y-3">
                {dfMatches.map((match, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-surface border border-border-subtle"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary">
                          {match.platformName ?? "Platform"}
                        </h4>
                        {match.deploymentWindow && (
                          <p className="text-xs text-text-secondary mt-0.5">
                            Deployment: {match.deploymentWindow}
                          </p>
                        )}
                        {match.exerciseName && (
                          <Badge variant="info" className="mt-1.5">
                            {match.exerciseName}
                          </Badge>
                        )}
                      </div>
                      {match.compatibilityScore != null && (
                        <div className="text-right">
                          <span className="text-lg font-bold tabular-nums text-accent">
                            {Math.round(match.compatibilityScore)}
                          </span>
                          <p className="text-xs text-text-muted">Score</p>
                        </div>
                      )}
                    </div>
                    {match.details && (
                      <p className="text-xs text-text-secondary mt-2">
                        {match.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Technical Vitals */}
      {technicalVitals && (
        <Card variant="elevated" header="Technical Vitals">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Capability Type */}
            {technicalVitals.capabilityType && (
              <div className="p-3 rounded-lg bg-surface border border-border-subtle sm:col-span-2">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  Capability Type
                </p>
                <p className="text-sm font-semibold text-accent">
                  {CAPABILITY_TYPE_LABELS[technicalVitals.capabilityType] ?? technicalVitals.capabilityType}
                </p>
              </div>
            )}
            {technicalVitals.trlLevel != null && (
              <div className="p-3 rounded-lg bg-surface border border-border-subtle">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  Technology Readiness Level
                </p>
                <p className="text-lg font-bold text-text-primary tabular-nums">
                  TRL {technicalVitals.trlLevel}
                </p>
              </div>
            )}
            {technicalVitals.costEstimate != null && (
              <div className="p-3 rounded-lg bg-surface border border-border-subtle">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  Cost Estimate
                </p>
                <p className="text-sm font-medium text-text-primary">
                  ${Number(technicalVitals.costEstimate).toLocaleString()}
                </p>
              </div>
            )}
            {technicalVitals.deploymentReadyMonths != null && (
              <div className="p-3 rounded-lg bg-surface border border-border-subtle">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  Deployment Timeline
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {technicalVitals.deploymentReadyMonths} months
                </p>
              </div>
            )}
            {/* SWaP-C Section */}
            {technicalVitals.swapC && (
              <div className="p-3 rounded-lg bg-surface border border-border-subtle sm:col-span-2">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                  SWaP-C (Size, Weight, Power &amp; Cooling)
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {technicalVitals.swapC.size && (
                    <div>
                      <span className="text-text-muted text-xs">Size:</span>{" "}
                      <span className="text-text-primary">{technicalVitals.swapC.size}</span>
                    </div>
                  )}
                  {technicalVitals.swapC.weight && (
                    <div>
                      <span className="text-text-muted text-xs">Weight:</span>{" "}
                      <span className="text-text-primary">{technicalVitals.swapC.weight}</span>
                    </div>
                  )}
                  {technicalVitals.swapC.power && (
                    <div>
                      <span className="text-text-muted text-xs">Power:</span>{" "}
                      <span className="text-text-primary">{technicalVitals.swapC.power}</span>
                    </div>
                  )}
                  {technicalVitals.swapC.cooling && (
                    <div>
                      <span className="text-text-muted text-xs">Cooling:</span>{" "}
                      <span className="text-text-primary">{technicalVitals.swapC.cooling}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Software Details Section */}
            {technicalVitals.softwareDetails && (
              <div className="p-3 rounded-lg bg-surface border border-border-subtle sm:col-span-2">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                  Software &amp; Integration Details
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {technicalVitals.softwareDetails.language && (
                    <div>
                      <span className="text-text-muted text-xs">Language / Framework:</span>{" "}
                      <span className="text-text-primary">{technicalVitals.softwareDetails.language}</span>
                    </div>
                  )}
                  {technicalVitals.softwareDetails.classification && (
                    <div>
                      <span className="text-text-muted text-xs">Classification:</span>{" "}
                      <span className="text-text-primary">
                        {CLASSIFICATION_LABELS[technicalVitals.softwareDetails.classification] ?? technicalVitals.softwareDetails.classification}
                      </span>
                    </div>
                  )}
                  {technicalVitals.softwareDetails.integrationMethod && (
                    <div>
                      <span className="text-text-muted text-xs">Integration:</span>{" "}
                      <span className="text-text-primary">
                        {INTEGRATION_LABELS[technicalVitals.softwareDetails.integrationMethod] ?? technicalVitals.softwareDetails.integrationMethod}
                      </span>
                    </div>
                  )}
                  {technicalVitals.softwareDetails.dataRequirements && (
                    <div>
                      <span className="text-text-muted text-xs">Data Requirements:</span>{" "}
                      <span className="text-text-primary">{technicalVitals.softwareDetails.dataRequirements}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Additional Context */}
            {technicalVitals.additionalContext && (
              <div className="p-3 rounded-lg bg-surface border border-border-subtle sm:col-span-2">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                  Additional Technical Context
                </p>
                <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                  {technicalVitals.additionalContext}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tags */}
      {submission.digitalfoundryTags.length > 0 && (
        <Card variant="elevated" header="DigitalFoundry Tags">
          <div className="flex flex-wrap gap-2">
            {submission.digitalfoundryTags.map((tag) => (
              <Badge key={tag} variant="info">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
