"use client";

import Link from "next/link";

interface Props {
  id: string;
  title: string;
  summary: string;
  location: string;
  employmentType: string;
  closingDate: string;
}

export default function JobCard({ id, title, summary, location, employmentType, closingDate }: Props) {
  return (
    <Link href={`/jobs/${id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8e5e0",
          borderRadius: 14,
          padding: "20px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          cursor: "pointer",
          transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#93c5fd";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(29,78,216,0.08)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#e8e5e0";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
            <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.2px", margin: 0 }}>{title}</h2>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", background: "#d1fae5", borderRadius: 20, padding: "2px 8px" }}>Hiring</span>
          </div>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 10px", lineHeight: 1.5 }}>{summary}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12.5, color: "#94a3b8" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              {employmentType}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Closes {new Date(closingDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
        <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", color: "#1d4ed8" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
      </div>
    </Link>
  );
}
