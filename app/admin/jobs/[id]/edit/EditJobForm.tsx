"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Job {
  id: string; title: string; location: string; employmentType: string;
  closingDate: string; summary: string; description: string;
  responsibilities: string; requirements: string; status: string;
}

export default function EditJobForm({ job }: { job: Job }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: job.title, location: job.location, employmentType: job.employmentType,
    closingDate: job.closingDate.split("T")[0], summary: job.summary,
    description: job.description, responsibilities: job.responsibilities, requirements: job.requirements,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) { router.push("/admin/jobs"); router.refresh(); }
    else { const d = await res.json(); setError(d.error ?? "Failed to update job"); }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style={{ fontSize: 13.5, color: "#dc2626" }}>{error}</span>
        </div>
      )}

      <Section title="Basic Info">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <Field label="Job Title"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} /></Field>
          <Field label="Location"><input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inp} /></Field>
          <Field label="Employment Type">
            <select value={form.employmentType} onChange={e => setForm({ ...form, employmentType: e.target.value })} style={inp}>
              <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
            </select>
          </Field>
          <Field label="Closing Date"><input required type="date" value={form.closingDate} onChange={e => setForm({ ...form, closingDate: e.target.value })} style={inp} /></Field>
        </div>
        <Field label="Short Summary"><input required value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} style={inp} /></Field>
      </Section>

      <Section title="Job Details">
        <Field label="Full Description"><textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, resize: "vertical" }} /></Field>
        <Field label="Responsibilities"><textarea required rows={4} value={form.responsibilities} onChange={e => setForm({ ...form, responsibilities: e.target.value })} style={{ ...inp, resize: "vertical" }} /></Field>
        <Field label="Requirements"><textarea required rows={4} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} style={{ ...inp, resize: "vertical" }} /></Field>
      </Section>

      <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
        <button type="submit" disabled={loading} style={{
          background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8, #1e40af)",
          color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px",
          fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          display: "inline-flex", alignItems: "center", gap: 8,
          boxShadow: loading ? "none" : "0 2px 8px rgba(29,78,216,0.3)",
        }}>
          {loading ? <><div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Saving…</> : "Save Changes"}
        </button>
        <Link href="/admin/jobs" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#374151", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Cancel</Link>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  border: "1.5px solid #e2e8f0", borderRadius: 9,
  padding: "10px 14px", fontSize: 14, color: "#0f172a",
  outline: "none", fontFamily: "inherit", background: "#fff",
};
