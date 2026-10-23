import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";

export async function GET() {
  const jobs = await prisma.job.findMany({
    where: { status: "Open" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      location: true,
      employmentType: true,
      closingDate: true,
      summary: true,
      status: true,
      _count: { select: { applications: true } },
    },
  });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, location, employmentType, closingDate, summary, description, responsibilities, requirements } = body;

  if (!title || !location || !employmentType || !closingDate || !summary || !description || !responsibilities || !requirements) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      title,
      location,
      employmentType,
      closingDate: new Date(closingDate),
      summary,
      description,
      responsibilities,
      requirements,
    },
  });
  return NextResponse.json(job, { status: 201 });
}
