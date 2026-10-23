"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BcLogo from "@/app/_components/BcLogo";

interface Job {
  id: string;
  title: string;
  location: string;
  employmentType: string;
  closingDate: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  status: string;
}

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  coverNote: string;
  cv: File | null;
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [cvName, setCvName] = useState("");
  const [form, setForm] = useState<FormState>({ fullName: "", email: "", phone: "", coverNote: "", cv: null });

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((data) => { setJob(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const isClosed = job && (job.status !== "Open" || new Date(job.closingDate) < new Date());

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,20}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.coverNote.trim()) e.coverNote = "Cover note is required";
    if (!form.cv) e.cv = "Please upload your CV";
    else if (form.cv.type !== "application/pdf") e.cv = "CV must be a PDF file";
    else if (form.cv.size > 5 * 1024 * 1024) e.cv = "CV must be under 5 MB";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.append("jobId", id);
    fd.append("fullName", form.fullName);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("coverNote", form.coverNote);
    fd.append("cv", form.cv!);
    const res = await fetch("/api/applications", { method: "POST", body: fd });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) setSuccess(true);
    else setServerError(data.error ?? "Something went wrong. Please try again.");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7f4" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#1d4ed8", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Loading…</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7f4" }}>
        <p style={{ color: "#94a3b8", fontSize: 15 }}>Job not found.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f7f4" }}>

      {/* Nav */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e5e0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px", height: 60, display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <BcLogo size={28} />
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
          <Link href="/" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", flexShrink: 0 }}>Careers</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
          <Link href={`/jobs/${id}`} style={{ fontSize: 13, color: "#64748b", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none", minWidth: 0 }}>{job.title}</Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: "24px 16px 60px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 24, fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#1d4ed8")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          All positions
        </Link>

        {/* Job detail card */}
        <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", margin: "0 0 10px" }}>
                  {job.title}
                </h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {job.location}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    {job.employmentType}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Closes {new Date(job.closingDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
              {isClosed ? (
                <span style={{ background: "rgba(255,255,255,0.15)", color: "#fca5a5", border: "1px solid rgba(252,165,165,0.3)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                  Position Closed
                </span>
              ) : (
                <span style={{ background: "rgba(255,255,255,0.15)", color: "#86efac", border: "1px solid rgba(134,239,172,0.3)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                  Now Hiring
                </span>
              )}
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            <Section title="About the role" content={job.description} />
            <Divider />
            <Section title="What you'll do" content={job.responsibilities} />
            <Divider />
            <Section title="What we're looking for" content={job.requirements} />
          </div>
        </div>

        {/* Application form */}
        {isClosed ? (
          <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 16, padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Applications closed</h3>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>This position is no longer accepting applications.</p>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", borderRadius: 9, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
              View other positions
            </Link>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 16, padding: "20px" }}>
            {success ? (
              <div style={{ textAlign: "center", padding: "32px 20px" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Application submitted!</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                  Thanks for applying for <strong>{job.title}</strong>. We review every application carefully and will be in touch soon.
                </p>
                <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f8f7f4", border: "1px solid #e2e8f0", color: "#374151", borderRadius: 9, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  View other positions
                </Link>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px", margin: "0 0 4px" }}>Apply for this role</h2>
                  <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>Takes about 3 minutes. All fields are required.</p>
                </div>

                {serverError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{ fontSize: 13.5, color: "#dc2626" }}>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                    <Field label="Full Name" error={errors.fullName}>
                      <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                        placeholder="" style={fieldStyle(!!errors.fullName)} />
                    </Field>
                    <Field label="Email Address" error={errors.email}>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="" style={fieldStyle(!!errors.email)} />
                    </Field>
                  </div>

                  <Field label="Phone Number" error={errors.phone}>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="078" style={{ ...fieldStyle(!!errors.phone), maxWidth: 280 }} />
                  </Field>

                  <Field label="Cover Note" error={errors.coverNote} hint="Tell us what excites you about this role and what you'd bring to the team.">
                    <textarea value={form.coverNote} onChange={e => setForm({ ...form, coverNote: e.target.value })}
                      placeholder="" rows={5}
                      style={{ ...fieldStyle(!!errors.coverNote), resize: "vertical", minHeight: 120 }} />
                  </Field>

                  <Field label="CV / Résumé" error={errors.cv} hint="PDF only · Max 5 MB">
                    <label style={{
                      display: "flex", alignItems: "center", gap: 12,
                      border: `2px dashed ${errors.cv ? "#fca5a5" : "#e2e8f0"}`,
                      borderRadius: 10, padding: "14px 18px", cursor: "pointer",
                      background: errors.cv ? "#fef2f2" : "#fafafa",
                    }}
                      onMouseEnter={e => { if (!errors.cv) (e.currentTarget as HTMLLabelElement).style.borderColor = "#93c5fd"; }}
                      onMouseLeave={e => { if (!errors.cv) (e.currentTarget as HTMLLabelElement).style.borderColor = "#e2e8f0"; }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: cvName ? "#eff6ff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={cvName ? "#1d4ed8" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: cvName ? "#1d4ed8" : "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {cvName || "Click to upload your CV"}
                        </p>
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>PDF · Max 5 MB</p>
                      </div>
                      <input type="file" accept="application/pdf" style={{ display: "none" }}
                        onChange={e => {
                          const f = e.target.files?.[0] ?? null;
                          setForm({ ...form, cv: f });
                          setCvName(f?.name ?? "");
                        }} />
                    </label>
                  </Field>

                  <div>
                    <button type="submit" disabled={submitting} style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: submitting ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                      color: "#fff", border: "none", borderRadius: 10,
                      padding: "12px 28px", fontSize: 14, fontWeight: 700,
                      cursor: submitting ? "not-allowed" : "pointer",
                      boxShadow: submitting ? "none" : "0 2px 8px rgba(29,78,216,0.3)",
                      transition: "all 0.15s",
                    }}>
                      {submitting ? (
                        <>
                          <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Submit Application
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <footer style={{ borderTop: "1px solid #e8e5e0", padding: "20px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>© {new Date().getFullYear()} BrightCore Technologies Ltd.</span>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>{title}</h2>
      <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-line", margin: 0 }}>{content}</p>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#f1f5f9", margin: "22px 0" }} />;
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
      {hint && !error && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 5, margin: "5px 0 0" }}>{hint}</p>}
      {error && (
        <p style={{ fontSize: 12.5, color: "#dc2626", marginTop: 5, display: "flex", alignItems: "center", gap: 4, margin: "5px 0 0" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}
    </div>
  );
}

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: 9,
    padding: "10px 14px",
    fontSize: 14,
    color: "#0f172a",
    background: hasError ? "#fef2f2" : "#fff",
    transition: "border-color 0.15s",
  };
}
