"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BcLogo from "@/app/_components/BcLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/jobs");
    } else {
      const data = await res.json();
      setError(data.error ?? "Login failed. Please check your credentials.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f8f7f4" }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: "none",
        background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)",
        padding: "48px", flexDirection: "column", justifyContent: "space-between",
      }} className="login-left">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BcLogo size={36} dark />
        </div>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.8px", lineHeight: 1.2, marginBottom: 16 }}>
            Manage your<br />recruitment pipeline
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 340 }}>
            Post jobs, review applications, and make hiring decisions — all in one place.
          </p>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["Post jobs", "Create and manage open positions"], ["Review CVs", "Download and assess applications"], ["Make decisions", "Accept or reject with notes"]].map(([title, desc]) => (
            <div key={title}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 3 }}>{title}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Logo for mobile */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
            <BcLogo size={32} />
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 6 }}>Admin sign in</h1>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 32 }}>Enter your credentials to access the portal.</p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ fontSize: 13.5, color: "#dc2626" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@brightcore.com"
                style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 9, padding: "11px 14px", fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff" }}
                onFocus={e => (e.target.style.borderColor = "#93c5fd")}
                onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 9, padding: "11px 44px 11px 14px", fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff" }}
                  onFocus={e => (e.target.style.borderColor = "#93c5fd")}
                  onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
                  {showPw
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: 8,
              background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
              color: "#fff", border: "none", borderRadius: 10,
              padding: "13px", fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: loading ? "none" : "0 2px 8px rgba(29,78,216,0.3)",
              transition: "all 0.15s ease",
            }}>
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Signing in…
                </>
              ) : "Sign in to Admin Portal"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .login-left { display: flex !important; } }
      `}</style>
    </div>
  );
}
