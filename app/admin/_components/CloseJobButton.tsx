"use client";

import { useRouter } from "next/navigation";

export default function CloseJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();

  async function handleClose() {
    if (!confirm("Close this job? It will stop accepting new applications.")) return;
    await fetch(`/api/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Closed" }),
    });
    router.refresh();
  }

  return (
    <button onClick={handleClose} style={{
      fontSize: 12.5, fontWeight: 600, color: "#dc2626",
      background: "#fef2f2", border: "1px solid #fecaca",
      borderRadius: 8, padding: "7px 14px", cursor: "pointer",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
    >
      Close
    </button>
  );
}
