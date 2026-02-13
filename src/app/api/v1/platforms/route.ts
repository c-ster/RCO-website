import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const platforms = await prisma.hostPlatform.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ success: true, data: platforms });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const platform = await prisma.hostPlatform.create({
    data: {
      name: body.name as string,
      type: body.type as string,
      availableSlots: body.availableSlots,
      deploymentWindow: body.deploymentWindow,
      exerciseName: body.exerciseName as string | undefined,
    },
  });

  return NextResponse.json({ success: true, data: platform }, { status: 201 });
}
