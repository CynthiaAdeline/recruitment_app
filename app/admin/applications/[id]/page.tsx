import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookie } from "@/lib/auth";
import AdminNav from "../../_components/AdminNav";
import ApplicationActions from "./ApplicationActions";

export const dynamic = "force-dynamic";

export default async function AdminApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const app = await prisma.application.findUnique({
    where: { id },
    include: { job: { select: { title: true, id: true } } },
  });
  if (!app) redirect("/admin/jobs");

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", flexDirection: "column" }}>
      <AdminNav />
      <main style={{ flex: 1, maxWidth: 800, margin: "0 auto", width: "100%", padding: "36px 24px 60px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13 }}>
          <Link href="/admin/jobs" style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 500 }}>Dashboard</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <Link href={`/admin/jobs/${app.job.id}`} style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 500 }}>{app.job.title}</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ color: "#374151", fontWeight: 600 }}>{app.fullName}</span>
        </div>

        {/* Applicant card */}
        <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                {app.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 3px", letterSpacing: "-0.3px" }}>{app.fullName}</h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0 }}>Applied for <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{app.job.title}</span></p>
              </div>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 24 }}>
              <Detail label="Email" value={app.email} icon="mail" />
              <Detail label="Phone" value={app.phone} icon="phone" />
              <Detail label="Applied on" value={new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} icon="calendar" />
            </div>

            <div style={{ height: 1, background: "#f1f5f9", marginBottom: 20 }} />

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Cover Note</p>
              <div style={{ background: "#f8f7f4", border: "1px solid #e8e5e0", borderRadius: 10, padding: "16px 18px" }}>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-line", margin: 0 }}>{app.coverNote}</p>
              </div>
            </div>

            {app.note && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Admin Note</p>
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 18px" }}>
                  <p style={{ fontSize: 14, color: "#78350f", lineHeight: 1.7, margin: 0 }}>{app.note}</p>
                </div>
              </div>
            )}

            <a href={`/api/cv/${app.id}`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f8f7f4", border: "1px solid #e2e8f0",
              borderRadius: 9, padding: "10px 18px",
              fontSize: 13.5, fontWeight: 600, color: "#374151", textDecoration: "none",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Download CV
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
          </div>
        </div>

        <ApplicationActions applicationId={app.id} currentStatus={app.status} currentNote={app.note ?? ""} jobId={app.job.id} />
      </main>
    </div>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    mail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, color: "#94a3b8" }}>
        {icons[icon]}
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      </div>
      <p style={{ fontSize: 14, color: "#0f172a", fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status === "Accepted" ? { bg: "rgba(209,250,229,0.2)", color: "#86efac", border: "rgba(134,239,172,0.3)" }
    : status === "Rejected" ? { bg: "rgba(254,226,226,0.2)", color: "#fca5a5", border: "rgba(252,165,165,0.3)" }
    : { bg: "rgba(254,243,199,0.2)", color: "#fde68a", border: "rgba(253,230,138,0.3)" };
  return <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{status}</span>;
}
