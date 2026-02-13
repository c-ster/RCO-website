import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where =
    session.user.role === "DIRECTOR" || session.user.role === "REVIEWER"
      ? {}
      : { userId: session.user.id };

  const submissions = await prisma.submission.findMany({
    where,
    include: {
      evaluation: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: submissions });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      capabilityText: body.capabilityText as string,
      technicalVitals: body.technicalVitals,
      digitalfoundryTags: body.digitalfoundryTags as string[],
      status: "SUBMITTED",
    },
  });

  return NextResponse.json({ success: true, data: submission }, { status: 201 });
}
