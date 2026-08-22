"use client";
// components/compliance-analytics.tsx
// Zivira_Project_Basic.docx Topic 2 — Attendance & Compliance Analytics
// Topic 4 — Chronic Defaulter Detection
//
// Dashboard metrics per the doc: Submitted Today, Pending DCR, Missed
// Yesterday, Missed This Week, Missed This Month, Compliance %. Chronic
// Defaulter rule from the doc: "Missed DCR > 5 within 30 Days" — already
// computed server-side as `chronicDefaulter` on every row, so this view
// just highlights it (red row + badge) rather than recomputing anything.
//
// New file — purely additive, does not touch any existing component.
import { AlertTriangle, RefreshCw, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type ComplianceRow } from "@/lib/api-client";

function MetricCard({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <p className="muted" style={{ fontSize: 12, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 700, color: tone ?? "var(--ink)" }}>{value}</p>
    </div>
  );
}

export function ComplianceAnalytics() {
  const [rows, setRows] = useState<ComplianceRow[]>([]);
  const [summary, setSummary] = useState<{ submittedToday: number; pendingDCR: number; missedYesterday: number; chronicDefaulters: number; avgCompliancePercent: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.complianceAnalytics();
      setRows(res.data);
      setSummary(res.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">SFA Analytics &amp; BI</p>
          <h2>Attendance &amp; Compliance Analytics</h2>
          <p>DCR submission discipline across the team, with automatic Chronic Defaulter detection (missed &gt; 5 days in the trailing 30).</p>
        </div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      {summary && (
        <div className="grid grid-3" style={{ marginBottom: 24, gap: 12 }}>
          <MetricCard label="Submitted Today" value={summary.submittedToday} tone="#15803d" />
          <MetricCard label="Pending DCR" value={summary.pendingDCR} tone="#a16207" />
          <MetricCard label="Missed Yesterday" value={summary.missedYesterday} tone="#b91c1c" />
          <MetricCard label="Chronic Defaulters" value={summary.chronicDefaulters} tone="#b91c1c" />
          <MetricCard label="Avg Compliance %" value={`${summary.avgCompliancePercent}%`} />
        </div>
      )}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Employee</th><th>Role</th><th>Submitted Today</th><th>Pending DCR</th>
              <th>Missed Yesterday</th><th>Missed This Week</th><th>Missed This Month</th>
              <th>Compliance %</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.employeeCode} style={r.chronicDefaulter ? { background: "#fef2f2" } : undefined}>
                <td><strong style={{ color: "var(--ink)" }}>{r.employeeName ?? r.name ?? r.employeeCode}</strong> <span style={{ color: "var(--muted)", fontSize: 11 }}>({r.employeeCode})</span></td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.role ?? "—"}</td>
                <td>{r.submittedToday ? <span style={{ color: "#15803d", fontWeight: 700 }}>Submitted</span> : <span style={{ color: "var(--muted)" }}>—</span>}</td>
                <td>{r.pendingDCR ? <span style={{ color: "#a16207", fontWeight: 700 }}>Pending</span> : <span style={{ color: "var(--muted)" }}>—</span>}</td>
                <td>{r.missedYesterday ? <span style={{ color: "#b91c1c", fontWeight: 700 }}>Missed</span> : "—"}</td>
                <td>{r.missedThisWeek}</td>
                <td>{r.missedThisMonth}</td>
                <td style={{ fontWeight: 700, color: r.compliancePercent < 70 ? "#b91c1c" : r.compliancePercent < 90 ? "#a16207" : "#15803d" }}>{r.compliancePercent}%</td>
                <td>
                  {r.chronicDefaulter ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fee2e2", color: "#b91c1c", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                      <ShieldAlert size={12} /> Chronic Defaulter
                    </span>
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>OK</span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
                <AlertTriangle size={28} style={{ margin: "0 auto 8px", display: "block", opacity: 0.3 }} />
                No active employees found for this tenant.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
