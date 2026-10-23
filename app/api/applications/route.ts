import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  const status = searchParams.get("status");

  const applications = await prisma.application.findMany({
    where: {
      ...(jobId ? { jobId } : {}),
      ...(status ? { status } : {}),
    },
    include: { job: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const jobId = formData.get("jobId") as string;
  const fullName = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const coverNote = (formData.get("coverNote") as string)?.trim();
  const cv = formData.get("cv") as File | null;

  // Validate required fields
  if (!jobId || !fullName || !email || !phone || !coverNote || !cv) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Validate phone
  if (!/^\+?[\d\s\-()]{7,20}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  // Validate CV file
  if (cv.type !== "application/pdf") {
    return NextResponse.json({ error: "CV must be a PDF file" }, { status: 400 });
  }
  if (cv.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "CV must be under 5 MB" }, { status: 400 });
  }

  // Check job exists and is open
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "Open" || new Date(job.closingDate) < new Date()) {
    return NextResponse.json({ error: "This job is no longer accepting applications" }, { status: 400 });
  }

  // Check duplicate application
  const existing = await prisma.application.findUnique({
    where: { jobId_email: { jobId, email } },
  });
  if (existing) {
    return NextResponse.json({ error: "You have already applied for this job" }, { status: 409 });
  }

  // Save CV file
  const uploadsDir = path.join(process.cwd(), "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
  const cvPath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await cv.arrayBuffer());
  await writeFile(cvPath, buffer);

  const application = await prisma.application.create({
    data: { jobId, fullName, email, phone, coverNote, cvPath: filename },
  });

  return NextResponse.json({ id: application.id }, { status: 201 });
}
