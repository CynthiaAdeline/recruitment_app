"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  applicationId: string;
  currentStatus: string;
  currentNote: string;
  jobId: string;
}

export default function ApplicationActions({ applicationId, currentStatus, currentNote, jobId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState(currentNote);
  const [loading, setLoading] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave(newStatus: string) {
    setLoading(newStatus);
    setSaved(false);
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, note }),
    });
    setLoading(null);
    if (res.ok) {
      setStatus(newStatus);
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e5e0", borderRadius: 16, padding: "24px 28px" }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.2px", marginBottom: 4 }}>Decision</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Update the status of this application. The current status is <strong style={{ color: "#374151" }}>{status}</strong>.</p>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          Note <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          placeholder="Add an internal note about this decision…"
          style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 9, padding: "10px 14px", fontSize: 14, color: "#0f172a", outline: "none", resize: "vertical", fontFamily: "inherit", minHeight: 80 }}
          onFocus={e => (e.target.style.borderColor = "#93c5fd")}
          onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
        />
      </div>

      {saved && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 13, color: "#059669", fontWeight: 600 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Decision saved successfully
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <ActionButton
          label="Accept"
          newStatus="Accepted"
          current={status}
          loading={loading}
          onClick={() => handleSave("Accepted")}
          bg="linear-gradient(135deg, #059669, #047857)"
          shadow="rgba(5,150,105,0.3)"
        />
        <ActionButton
          label="Reject"
          newStatus="Rejected"
          current={status}
          loading={loading}
          onClick={() => handleSave("Rejected")}
          bg="linear-gradient(135deg, #dc2626, #b91c1c)"
          shadow="rgba(220,38,38,0.3)"
        />
        <ActionButton
          label="Reset to Pending"
          newStatus="Pending"
          current={status}
          loading={loading}
          onClick={() => handleSave("Pending")}
          bg="#f1f5f9"
          shadow="none"
          textColor="#374151"
          border="1px solid #e2e8f0"
        />
      </div>
    </div>
  );
}

function ActionButton({ label, newStatus, current, loading, onClick, bg, shadow, textColor = "#fff", border = "none" }: {
  label: string; newStatus: string; current: string; loading: string | null;
  onClick: () => void; bg: string; shadow: string; textColor?: string; border?: string;
}) {
  const isActive = loading === newStatus;
  const isCurrent = current === newStatus;
  const isDisabled = !!loading || isCurrent;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        background: isCurrent ? "#f1f5f9" : bg,
        color: isCurrent ? "#94a3b8" : textColor,
        border: isCurrent ? "1px solid #e2e8f0" : border,
        borderRadius: 9, padding: "10px 22px",
        fontSize: 13.5, fontWeight: 700,
        cursor: isDisabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", gap: 7,
        boxShadow: isCurrent || !shadow ? "none" : `0 2px 8px ${shadow}`,
        opacity: isDisabled && !isCurrent ? 0.6 : 1,
        transition: "all 0.15s",
      }}
    >
      {isActive && (
        <div style={{ width: 13, height: 13, border: `2px solid ${textColor === "#fff" ? "rgba(255,255,255,0.4)" : "#cbd5e1"}`, borderTopColor: textColor === "#fff" ? "#fff" : "#374151", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      )}
      {isCurrent && !isActive && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      )}
      {label}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
