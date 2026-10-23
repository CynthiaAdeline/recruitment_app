"use client";

import Link from "next/link";

interface Props {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  status: string;
  index: number;
}

function StatusBadge({ status }: { status: string }) {
  const s = status === "Accepted"
    ? { bg: "#d1fae5", color: "#065f46" }
    : status === "Rejected"
    ? { bg: "#fee2e2", color: "#991b1b" }
    : { bg: "#fef3c7", color: "#92400e" };
  return (
    <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

export default function ApplicantRow({ id, fullName, email, createdAt, status, index }: Props) {
  return (
    <Link href={`/admin/applications/${id}`} style={{ textDecoration: "none" }}>
      <div
        style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transition: "all 0.15s", cursor: "pointer" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#93c5fd"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(29,78,216,0.07)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e8e5e0"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: `hsl(${(index * 53) % 360}, 55%, 90%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: `hsl(${(index * 53) % 360}, 45%, 35%)` }}>
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>{fullName}</p>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>
              {email} · Applied {new Date(createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusBadge status={status} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </Link>
  );
}
