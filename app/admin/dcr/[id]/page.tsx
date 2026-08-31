"use client";
import { useEffect, useState } from "react";
import { apiClient, type DcrRecord } from "@/lib/api-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminDcrDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [dcr, setDcr] = useState<DcrRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    params.then(p =>
      apiClient.dcrDetail(p.id)
        .then(r => { if (!cancelled) setDcr(r.data); })
        .catch(e => { if (!cancelled) setError(e.message); })
    );
    return () => { cancelled = true; };
  }, [params]);

  if (error) return <p className="form-error">{error}</p>;
  if (!dcr) return <p className="muted">Loading...</p>;

  const row = (label: string, val: unknown) => val ? (
    <tr key={label} style={{ borderBottom: "1px solid #f1f5f9" }}>
      <td style={{ padding: "10px 12px", fontWeight: 600, color: "#475569", width: 200 }}>{label}</td>
      <td style={{ padding: "10px 12px" }}>{String(val)}</td>
    </tr>
  ) : null;

  return (
    <>
      <div className="page-header">
        <p className="eyebrow">ADMIN · DCR DETAIL</p>
        <h1 className="page-title">DCR — {dcr.employeeCode}</h1>
        <p className="page-description">{new Date(dcr.visitDate).toLocaleDateString()} · {dcr.callSession} · {dcr.callTime}</p>
      </div>
      <div className="toolbar">
        <Link href="/admin/dcr" className="button button-secondary"><ArrowLeft size={17} />Back to DCRs</Link>
      </div>
      {dcr.isAutoApproved && (
        <div className="card" style={{ background: "#fef3c7", borderLeft: "4px solid #d97706", marginBottom: 16 }}>
          <p style={{ color: "#92400e" }}>This DCR was auto-approved — manager did not review within 24 hours.</p>
        </div>
      )}
      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <tbody>
            {row("Employee Code", dcr.employeeCode)}
            {row("Visit Date", new Date(dcr.visitDate).toLocaleDateString())}
            {row("Call Session", dcr.callSession)}
            {row("Call Time", dcr.callTime)}
            {row("Doctor", dcr.doctorId ? `${dcr.doctorId.name} · ${dcr.doctorId.specialty} · ${dcr.doctorId.city}` : null)}
            {row("Products Detailed", dcr.productsDetailed.join(", "))}
            {row("Visit Outcome", dcr.visitOutcome)}
            {row("Outcome Notes", dcr.outcomeNotes)}
            {row("Notes", dcr.notes)}
            {row("Joint Visit", dcr.jointWork?.wasJoint ? `Yes — with ${dcr.jointWork.managerName}` : "No")}
            {row("Samples Given", dcr.samplesGiven?.map(s => `${s.product} x${s.qty}`).join(", "))}
            {row("Inputs Given", dcr.inputsGiven?.map(s => `${s.inputType} x${s.qty}`).join(", "))}
            {row("Next Follow-up", dcr.nextFollowUpDate ? new Date(dcr.nextFollowUpDate).toLocaleDateString() : null)}
            {row("Status", dcr.isAutoApproved ? "AUTO-APPROVED (manager did not review)" : "APPROVED")}
            {row("Reviewed By", dcr.managerId?.displayName)}
          </tbody>
        </table>
      </div>
    </>
  );
}
