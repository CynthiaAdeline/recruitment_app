import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { _count: { select: { applications: true } } },
  });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, location, employmentType, closingDate, summary, description, responsibilities, requirements, status } = body;

  const job = await prisma.job.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(location && { location }),
      ...(employmentType && { employmentType }),
      ...(closingDate && { closingDate: new Date(closingDate) }),
      ...(summary && { summary }),
      ...(description && { description }),
      ...(responsibilities && { responsibilities }),
      ...(requirements && { requirements }),
      ...(status && { status }),
    },
  });
  return NextResponse.json(job);
}
