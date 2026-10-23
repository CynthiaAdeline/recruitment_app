import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";
import AdminNav from "../_components/AdminNav";
import CloseJobButton from "../_components/CloseJobButton";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
      applications: { select: { status: true } },
    },
  });

  const totalApps = jobs.reduce((s, j) => s + j._count.applications, 0);
  const openJobs = jobs.filter((j) => j.status === "Open" && new Date(j.closingDate) >= new Date()).length;
  const pending = jobs.reduce((s, j) => s + j.applications.filter(a => a.status === "Pending").length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", flexDirection: "column" }}>
      <AdminNav />
      <main style={{ flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "36px 24px 60px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: 13.5, color: "#94a3b8", marginTop: 4 }}>Manage your job listings and applications.</p>
          </div>
          <Link href="/admin/jobs/new" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
            color: "#fff", textDecoration: "none", borderRadius: 10,
            padding: "10px 20px", fontSize: 13.5, fontWeight: 700,
            boxShadow: "0 2px 8px rgba(29,78,216,0.3)", letterSpacing: "-0.1px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 32 }}>
          <StatCard label="Total Jobs" value={jobs.length} icon="briefcase" color="#6366f1" />
          <StatCard label="Open Positions" value={openJobs} icon="check-circle" color="#059669" />
          <StatCard label="Total Applications" value={totalApps} icon="users" color="#0ea5e9" />
          <StatCard label="Awaiting Review" value={pending} icon="clock" color="#f59e0b" />
        </div>

        {/* Jobs list */}
        {jobs.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 16, padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>No jobs yet. Post your first position to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {jobs.map((job) => {
              const p = job.applications.filter(a => a.status === "Pending").length;
              const a = job.applications.filter(a => a.status === "Accepted").length;
              const r = job.applications.filter(a => a.status === "Rejected").length;
              const isExpired = new Date(job.closingDate) < new Date();
              const isOpen = job.status === "Open" && !isExpired;

              return (
                <div key={job.id} style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.2px" }}>{job.title}</h2>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: isOpen ? "#d1fae5" : "#f1f5f9",
                          color: isOpen ? "#065f46" : "#64748b",
                          letterSpacing: "0.2px",
                        }}>
                          {isOpen ? "Open" : isExpired && job.status === "Open" ? "Expired" : "Closed"}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px" }}>
                        {job.location} · {job.employmentType} · Closes {new Date(job.closingDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <div style={{ display: "flex", gap: 14, fontSize: 12.5 }}>
                        <span style={{ color: "#d97706", fontWeight: 600 }}>{p} pending</span>
                        <span style={{ color: "#059669", fontWeight: 600 }}>{a} accepted</span>
                        <span style={{ color: "#dc2626", fontWeight: 600 }}>{r} rejected</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <Link href={`/admin/jobs/${job.id}`} style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: 12.5, fontWeight: 600, color: "#1d4ed8",
                        background: "#eff6ff", border: "1px solid #bfdbfe",
                        borderRadius: 8, padding: "7px 14px", textDecoration: "none",
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Applicants ({job._count.applications})
                      </Link>
                      <Link href={`/admin/jobs/${job.id}/edit`} style={{
                        fontSize: 12.5, fontWeight: 600, color: "#374151",
                        background: "#f8f7f4", border: "1px solid #e2e8f0",
                        borderRadius: 8, padding: "7px 14px", textDecoration: "none",
                      }}>
                        Edit
                      </Link>
                      {job.status === "Open" && <CloseJobButton jobId={job.id} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    briefcase: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    "check-circle": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  };
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
        {icons[icon]}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}
