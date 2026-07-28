"use client";
import { useCallback, useEffect, useState } from "react";
import { apiClient, type DcrRecord } from "@/lib/api-client";
import { AlertTriangle, Download, RefreshCw } from "lucide-react";
import Link from "next/link";

const OUTCOMES = ["", "Positive", "Neutral", "Negative", "No Response"];
const SESSIONS = ["", "Morning", "Afternoon", "Evening"];

export default function AdminDcrPage() {
  const [dcrs, setDcrs] = useState<DcrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [empFilter, setEmpFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.dcrs({
        visitOutcome: outcomeFilter || undefined,
        callSession: sessionFilter || undefined,
        employeeCode: empFilter || undefined
      });
      setDcrs(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [outcomeFilter, sessionFilter, empFilter]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { void load(); }, 600000);
    return () => window.clearInterval(timer);
  }, [load]);

  function exportCsv() {
    const headers = ["ID","Employee","Date","Session","Time","Outcome","Products","Doctor","AutoApproved"];
    const rows = dcrs.map(d => [
      d.id, d.employeeCode, new Date(d.visitDate).toLocaleDateString(),
      d.callSession, d.callTime, d.visitOutcome,
      d.productsDetailed.join("|"), d.doctorId?.name ?? "",
      d.isAutoApproved ? "YES" : "NO"
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = "dcr-report.csv";
    a.click();
  }

  return (
    <>
      <div className="page-header">
        <p className="eyebrow">ADMIN · DCR INTELLIGENCE</p>
        <h1 className="page-title">DCR Reports</h1>
        <p className="page-description">Live Pharma SFA DCR pipeline from Field Force to Manager review and Corporate HQ. This page refreshes every 10 minutes.</p>
      </div>
      <div className="toolbar" style={{ flexWrap: "wrap", gap: 8 }}>
        <select value={outcomeFilter} onChange={e => setOutcomeFilter(e.target.value)}>
          {OUTCOMES.map(o => <option key={o} value={o}>{o || "All Outcomes"}</option>)}
        </select>
        <select value={sessionFilter} onChange={e => setSessionFilter(e.target.value)}>
          {SESSIONS.map(s => <option key={s} value={s}>{s || "All Sessions"}</option>)}
        </select>
        <input placeholder="Filter by Employee Code" value={empFilter} onChange={e => setEmpFilter(e.target.value)}
          style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6 }} />
        <button className="button button-secondary" onClick={load}>
          <RefreshCw size={16} />{loading ? "Loading..." : "Apply"}
        </button>
        <button className="button button-secondary" onClick={exportCsv}>
          <Download size={16} />Export CSV
        </button>
        <Link href="/admin/manager-activity" className="button button-secondary">
          <AlertTriangle size={16} />Manager Activity
        </Link>
      </div>
      {error && <p className="form-error">{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, fontSize: 13 }}>
        <thead style={{ background: "#f8fafc" }}>
          <tr>
            {["Employee","Date","Session","Time","Doctor","Outcome","Products","Status"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #e2e8f0", fontWeight: 600, color: "#475569" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dcrs.map((d, i) => (
            <tr key={d.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>
                <Link href={`/admin/dcr/${d.id}`} style={{ color: "#2563eb", fontWeight: 600 }}>{d.employeeCode}</Link>
              </td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>{new Date(d.visitDate).toLocaleDateString()}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>{d.callSession}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>{d.callTime}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>{d.doctorId?.name ?? "—"}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 12,
                  background: d.visitOutcome === "Positive" ? "#dcfce7" : d.visitOutcome === "Negative" ? "#fee2e2" : "#f1f5f9",
                  color: d.visitOutcome === "Positive" ? "#15803d" : d.visitOutcome === "Negative" ? "#b91c1c" : "#475569"
                }}>{d.visitOutcome}</span>
              </td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>{d.productsDetailed.join(", ")}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ background: d.status === "SUBMITTED" ? "#fef3c7" : "#dcfce7", color: d.status === "SUBMITTED" ? "#92400e" : "#15803d", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>
                  {d.status.replace(/_/g, " ")}
                </span>
              </td>
            </tr>
          ))}
          {dcrs.length === 0 && !loading && (
            <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>No DCRs found</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}
