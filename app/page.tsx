import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobCard from "./JobCard";
import BcLogo from "./_components/BcLogo";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "Open" },
    orderBy: { createdAt: "desc" },
  });

  const openJobs = jobs.filter((j) => new Date(j.closingDate) >= new Date());

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f7f4" }}>
      {/* Nav */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e5e0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <BcLogo size={32} />
          </div>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Careers</span>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #fff 0%, #f8f7f4 100%)", borderBottom: "1px solid #e8e5e0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px 48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: "4px 12px", marginBottom: 18 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }}></span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8", letterSpacing: "0.3px" }}>
              {openJobs.length} open position{openJobs.length !== 1 ? "s" : ""}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, letterSpacing: "-1px", margin: "0 0 14px" }}>
            Build the future of<br />
            <span style={{ color: "#1d4ed8" }}>digital finance</span> with us
          </h1>
          <p style={{ fontSize: 15.5, color: "#64748b", maxWidth: 460, lineHeight: 1.7, margin: 0 }}>
            {"We're a team of builders working on financial technology that serves communities across Africa. Come do the best work of your career."}
          </p>
        </div>
      </div>

      {/* Jobs */}
      <main style={{ flex: 1, maxWidth: 960, margin: "0 auto", width: "100%", padding: "36px 24px 60px" }}>
        {openJobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>No open positions right now. Check back soon.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {openJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                summary={job.summary}
                location={job.location}
                employmentType={job.employmentType}
                closingDate={job.closingDate.toISOString()}
              />
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #e8e5e0", padding: "20px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>© {new Date().getFullYear()} BrightCore Technologies Ltd.</span>
          <span style={{ fontSize: 13, color: "#cbd5e1" }}>All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
