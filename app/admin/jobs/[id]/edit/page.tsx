import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";
import EditJobForm from "./EditJobForm";
import AdminNav from "../../../_components/AdminNav";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) redirect("/admin/jobs");

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", flexDirection: "column" }}>
      <AdminNav />
      <main style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: "36px 24px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13 }}>
          <Link href="/admin/jobs" style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 500 }}>Dashboard</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <Link href={`/admin/jobs/${id}`} style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 500 }}>{job.title}</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ color: "#374151", fontWeight: 600 }}>Edit</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Edit job</h1>
          <p style={{ fontSize: 13.5, color: "#94a3b8" }}>Changes will be reflected on the public jobs listing immediately.</p>
        </div>

        <EditJobForm job={{ ...job, closingDate: job.closingDate.toISOString() }} />
      </main>
    </div>
  );
}
