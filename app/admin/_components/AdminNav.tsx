"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BcLogo from "@/app/_components/BcLogo";

export default function AdminNav() {
  const router = useRouter();
  const path = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const isJobs = path.startsWith("/admin/jobs") || path.startsWith("/admin/applications");

  return (
    <header style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BcLogo size={28} dark />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500, marginLeft: 2 }}>Admin</span>
          </div>

          <nav style={{ display: "flex", gap: 4 }}>
            <NavLink href="/admin/jobs" active={isJobs} label="Jobs" />
            <a href="/" target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 7, fontSize: 13, fontWeight: 500,
              color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "all 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              Public site
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </nav>
        </div>

        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 7, padding: "6px 12px", fontSize: 12.5, fontWeight: 600,
          color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.15s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.3)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out
        </button>
      </div>
    </header>
  );
}

function NavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link href={href} style={{
      padding: "5px 12px", borderRadius: 7, fontSize: 13, fontWeight: 600,
      color: active ? "#fff" : "rgba(255,255,255,0.45)",
      background: active ? "rgba(255,255,255,0.1)" : "transparent",
      textDecoration: "none", transition: "all 0.15s",
    }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.8)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)"; }}
    >
      {label}
    </Link>
  );
}
