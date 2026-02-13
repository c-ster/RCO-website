import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SubmissionList } from "@/components/dashboard/submission-list";

export const metadata = {
  title: "Submissions | NAV-FORGE Portal",
  description: "View and manage capability submissions.",
};

export default async function SubmissionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const userId = session.user.id;

  // Directors and reviewers see all submissions; submitters see only their own
  const submissions = await prisma.submission.findMany({
    where:
      role === "DIRECTOR" || role === "REVIEWER"
        ? undefined
        : { userId },
    include: {
      evaluation: {
        select: {
          uciTotal: true,
          recommendation: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

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

  const title =
    role === "DIRECTOR"
      ? "All Submissions"
      : role === "REVIEWER"
        ? "Submissions for Review"
        : "My Submissions";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {role === "SUBMITTER"
            ? "Track your capability submissions and their evaluation status."
            : "Review and manage capability submissions across the pipeline."}
        </p>
      </div>

      <SubmissionList submissions={submissionListData} />
    </div>
  );
}
