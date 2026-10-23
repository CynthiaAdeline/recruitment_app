import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";
import AdminNav from "../../_components/AdminNav";
import ApplicantRow from "../../_components/ApplicantRow";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminJobDetailPage({ params, searchParams }: Props) {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const { status } = await searchParams;

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) redirect("/admin/jobs");

  const applications = await prisma.application.findMany({
    where: { jobId: id, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
  });

  const allCounts = await prisma.application.groupBy({
    by: ["status"], where: { jobId: id }, _count: true,
  });
  const countMap = Object.fromEntries(allCounts.map(c => [c.status, c._count]));
  const total = Object.values(countMap).reduce((s, v) => s + v, 0);
  const isExpired = new Date(job.closingDate) < new Date();
  const isOpen = job.status === "Open" && !isExpired;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", flexDirection: "column" }}>
      <AdminNav />
      <main style={{ flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "36px 24px 60px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 13 }}>
          <Link href="/admin/jobs" style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 500 }}>Dashboard</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ color: "#374151", fontWeight: 600 }}>{job.title}</span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 14, padding: "22px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", margin: 0 }}>{job.title}</h1>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: isOpen ? "#d1fae5" : "#f1f5f9", color: isOpen ? "#065f46" : "#64748b" }}>
                {isOpen ? "Open" : isExpired && job.status === "Open" ? "Expired" : "Closed"}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              {job.location} · {job.employmentType} · Closes {new Date(job.closingDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <Link href={`/admin/jobs/${id}/edit`} style={{ fontSize: 13, fontWeight: 600, color: "#374151", background: "#f8f7f4", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 16px", textDecoration: "none" }}>
            Edit Job
          </Link>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {([["", "All", total], ["Pending", "Pending", countMap["Pending"] ?? 0], ["Accepted", "Accepted", countMap["Accepted"] ?? 0], ["Rejected", "Rejected", countMap["Rejected"] ?? 0]] as [string, string, number][]).map(([val, label, count]) => {
            const active = (status ?? "") === val;
            return (
              <Link key={val} href={val ? `?status=${val}` : "?"} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                textDecoration: "none",
                background: active ? "#0f172a" : "#fff",
                color: active ? "#fff" : "#374151",
                border: `1px solid ${active ? "#0f172a" : "#e2e8f0"}`,
              }}>
                {label}
                <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: active ? "rgba(255,255,255,0.2)" : "#f1f5f9", color: active ? "#fff" : "#64748b" }}>{count}</span>
              </Link>
            );
          })}
        </div>

        {applications.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 14, padding: "60px 24px", textAlign: "center" }}>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>{status ? `No ${status.toLowerCase()} applications.` : "No applications yet."}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {applications.map((app, i) => (
              <ApplicantRow
                key={app.id}
                id={app.id}
                fullName={app.fullName}
                email={app.email}
                createdAt={app.createdAt.toISOString()}
                status={app.status}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


