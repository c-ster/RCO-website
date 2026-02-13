import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { StrategicHeatmap } from "@/components/dashboard/strategic-heatmap";
import { ComparisonMatrix } from "@/components/dashboard/comparison-matrix";
import { SubmissionList } from "@/components/dashboard/submission-list";
import { TierDistribution } from "@/components/dashboard/tier-distribution";
import { DigitalFoundryMatches } from "@/components/dashboard/digitalfoundry-matches";
import type { RecommendationTier } from "@/generated/prisma";

export const metadata = {
  title: "Command Dashboard | NAV-FORGE Portal",
  description: "Operational overview of capability submissions, evaluations, and platform matches.",
};

interface DeploymentWindow {
  start?: string;
  end?: string;
}

interface DigitalFoundryMatchEntry {
  platformName?: string;
  capabilityName?: string;
  compatibilityScore?: number;
  deploymentWindow?: string;
  exerciseName?: string | null;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Only DIRECTOR and REVIEWER can see the dashboard
  const role = session.user.role;
  if (role !== "DIRECTOR" && role !== "REVIEWER") {
    redirect("/submissions");
  }

  // Fetch all submissions with evaluations
  const submissions = await prisma.submission.findMany({
    include: {
      evaluation: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Compute aggregate stats
  const totalSubmissions = submissions.length;
  const pendingReview = submissions.filter(
    (s) => s.status === "SUBMITTED" || s.status === "EVALUATING",
  ).length;

  const evaluatedSubmissions = submissions.filter((s) => s.evaluation);
  const highMatches = evaluatedSubmissions.filter(
    (s) => s.evaluation?.recommendation === "HIGH_MATCH",
  ).length;
  const avgUci =
    evaluatedSubmissions.length > 0
      ? evaluatedSubmissions.reduce(
          (sum, s) => sum + (s.evaluation?.uciTotal ?? 0),
          0,
        ) / evaluatedSubmissions.length
      : 0;

  // Tier distribution counts
  const tierDistribution = {
    high: evaluatedSubmissions.filter(
      (s) => s.evaluation?.recommendation === "HIGH_MATCH",
    ).length,
    partial: evaluatedSubmissions.filter(
      (s) => s.evaluation?.recommendation === "PARTIAL_MATCH",
    ).length,
    nonResponsive: evaluatedSubmissions.filter(
      (s) => s.evaluation?.recommendation === "NON_RESPONSIVE",
    ).length,
  };

  // Heatmap data: only evaluated submissions
  const heatmapData = evaluatedSubmissions.map((s) => ({
    id: s.id,
    name: s.capabilityText.slice(0, 50),
    strategicAlignment: s.evaluation!.strategicAlignment,
    technicalMaturity: s.evaluation!.technicalMaturity,
    uciTotal: s.evaluation!.uciTotal,
    recommendation: s.evaluation!.recommendation as RecommendationTier,
  }));

  // Comparison matrix: top 5 evaluated submissions by UCI
  const topSubmissions = [...evaluatedSubmissions]
    .sort((a, b) => (b.evaluation?.uciTotal ?? 0) - (a.evaluation?.uciTotal ?? 0))
    .slice(0, 5)
    .map((s) => ({
      name: s.capabilityText.slice(0, 25) + (s.capabilityText.length > 25 ? "..." : ""),
      strategicAlignment: s.evaluation!.strategicAlignment,
      technicalMaturity: s.evaluation!.technicalMaturity,
      digitalfoundryViability: s.evaluation!.digitalfoundryViability,
    }));

  // DigitalFoundry matches: extract from evaluations that have digitalfoundryMatch
  const dfMatches: {
    platformName: string;
    capabilityName: string;
    compatibilityScore: number;
    deploymentWindow: string;
    exerciseName?: string | null;
  }[] = [];

  for (const s of evaluatedSubmissions) {
    if (s.evaluation?.digitalfoundryMatch) {
      const matchData = s.evaluation.digitalfoundryMatch;
      const matches = Array.isArray(matchData) ? matchData : [matchData];
      for (const m of matches as DigitalFoundryMatchEntry[]) {
        dfMatches.push({
          platformName: m.platformName ?? "Unknown Platform",
          capabilityName: s.capabilityText.slice(0, 60),
          compatibilityScore: m.compatibilityScore ?? 0,
          deploymentWindow: m.deploymentWindow ?? "TBD",
          exerciseName: m.exerciseName ?? null,
        });
      }
    }
  }

  // Also check host platforms for general match data
  if (dfMatches.length === 0) {
    const platforms = await prisma.hostPlatform.findMany({ take: 5 });
    for (const p of platforms) {
      const dw = p.deploymentWindow as DeploymentWindow | null;
      dfMatches.push({
        platformName: p.name,
        capabilityName: `${p.type} - Available for integration`,
        compatibilityScore: 0,
        deploymentWindow: dw?.start && dw?.end ? `${dw.start} - ${dw.end}` : "Open",
        exerciseName: p.exerciseName,
      });
    }
  }

  // Submission list data (serializable)
  const submissionListData = submissions.map((s) => ({
    id: s.id,
    capabilityText: s.capabilityText,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
    evaluation: s.evaluation
      ? {
          uciTotal: s.evaluation.uciTotal,
          recommendation: s.evaluation.recommendation,
        }
      : null,
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Command Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Operational overview of the NAV-FORGE capability pipeline
        </p>
      </div>

      {/* Stats grid */}
      <StatsGrid
        stats={{
          totalSubmissions,
          pendingReview,
          highMatches,
          avgUci,
        }}
      />

      {/* Charts: heatmap + comparison side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategicHeatmap data={heatmapData} />
        <ComparisonMatrix data={topSubmissions} />
      </div>

      {/* Full-width submission list */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          All Submissions
        </h2>
        <SubmissionList submissions={submissionListData} />
      </div>

      {/* Tier distribution + DF matches side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TierDistribution data={tierDistribution} />
        <DigitalFoundryMatches matches={dfMatches.slice(0, 8)} />
      </div>
    </div>
  );
}
