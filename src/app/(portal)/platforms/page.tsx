import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PlatformTable } from "./platform-table";

export const metadata = {
  title: "Host Platforms | NAV-FORGE Portal",
  description: "View and manage available host platforms for capability deployment.",
};

interface DeploymentWindow {
  start?: string;
  end?: string;
}

interface AvailableSlots {
  total?: number;
  available?: number;
  [key: string]: unknown;
}

export default async function PlatformsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;

  // Only DIRECTOR and REVIEWER can view platforms
  if (role !== "DIRECTOR" && role !== "REVIEWER") {
    redirect("/submissions");
  }

  const platforms = await prisma.hostPlatform.findMany({
    orderBy: { createdAt: "desc" },
  });

  const platformData = platforms.map((p) => {
    const slots = p.availableSlots as AvailableSlots | null;
    const dw = p.deploymentWindow as DeploymentWindow | null;

    return {
      id: p.id,
      name: p.name,
      type: p.type,
      availableSlots: slots
        ? `${slots.available ?? "?"} / ${slots.total ?? "?"}`
        : "N/A",
      deploymentWindow:
        dw?.start && dw?.end
          ? `${dw.start} - ${dw.end}`
          : "Open",
      exerciseName: p.exerciseName ?? "--",
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Host Platforms
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Available naval platforms for capability integration and deployment.
          </p>
        </div>
        {role === "DIRECTOR" && (
          <a
            href="/platforms/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Platform
          </a>
        )}
      </div>

      <PlatformTable platforms={platformData} />
    </div>
  );
}
