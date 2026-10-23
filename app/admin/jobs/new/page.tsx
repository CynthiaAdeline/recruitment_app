"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BcLogo from "@/app/_components/BcLogo";

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", location: "", employmentType: "Full-time",
    closingDate: "", summary: "", description: "", responsibilities: "", requirements: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) { router.push("/admin/jobs"); router.refresh(); }
    else { const d = await res.json(); setError(d.error ?? "Failed to create job"); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", flexDirection: "column" }}>
      <header style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 8 }}>
          <BcLogo size={28} dark />
          <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 4px" }}>·</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Post a Job</span>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: "36px 24px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13 }}>
          <Link href="/admin/jobs" style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 500 }}>Dashboard</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ color: "#374151", fontWeight: 600 }}>New Job</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Post a new position</h1>
          <p style={{ fontSize: 13.5, color: "#94a3b8" }}>Fill in the details below. All fields are required.</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontSize: 13.5, color: "#dc2626" }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Section title="Basic Info">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              <Field label="Job Title"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} placeholder="e.g. Full Stack Developer" /></Field>
              <Field label="Location"><input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inp} placeholder="e.g. Kigali, Rwanda" /></Field>
              <Field label="Employment Type">
                <select value={form.employmentType} onChange={e => setForm({ ...form, employmentType: e.target.value })} style={inp}>
                  <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                </select>
              </Field>
              <Field label="Closing Date"><input required type="date" value={form.closingDate} onChange={e => setForm({ ...form, closingDate: e.target.value })} style={inp} /></Field>
            </div>
            <Field label="Short Summary" hint="One sentence shown on the jobs listing page.">
              <input required value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} style={inp} placeholder="e.g. Build scalable web applications for our SACCO platform." />
            </Field>
          </Section>

          <Section title="Job Details">
            <Field label="Full Description"><textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, resize: "vertical" }} placeholder="Describe the role and your company…" /></Field>
            <Field label="Responsibilities"><textarea required rows={4} value={form.responsibilities} onChange={e => setForm({ ...form, responsibilities: e.target.value })} style={{ ...inp, resize: "vertical" }} placeholder="- Lead feature development&#10;- Collaborate with the team…" /></Field>
            <Field label="Requirements"><textarea required rows={4} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} style={{ ...inp, resize: "vertical" }} placeholder="- 3+ years of experience with React&#10;- Strong SQL skills…" /></Field>
          </Section>

          <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
            <button type="submit" disabled={loading} style={{
              background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8, #1e40af)",
              color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px",
              fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: loading ? "none" : "0 2px 8px rgba(29,78,216,0.3)",
            }}>
              {loading ? <><div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Posting…</> : "Post Job"}
            </button>
            <Link href="/admin/jobs" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#374151", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Cancel</Link>
          </div>
        </form>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 14, padding: "24px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", margin: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  border: "1.5px solid #e2e8f0", borderRadius: 9,
  padding: "10px 14px", fontSize: 14, color: "#0f172a",
  outline: "none", fontFamily: "inherit", background: "#fff",
};
