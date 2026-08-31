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
import { BackButton } from "@/components/back-button";
import { ExportMenuButton } from "@/components/export-menu-button";
import { apiClient, type ComplianceRow } from "@/lib/api-client";

function MetricCard({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <p className="muted" style={{ fontSize: 11, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: tone ?? "var(--ink)" }}>{value}</p>
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
          <p className="subdivision-eyebrow">Compliance</p>
          <h2>Attendance &amp; Compliance Analytics</h2>
          <p>DCR submission compliance and chronic-defaulter detection — live from field DCR records. Working days exclude Sundays.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
          <ExportMenuButton
            filename="compliance-analytics"
            sections={[{
              title: "Compliance",
              headers: ["Employee", "Code", "Role", "Today", "Missed Wk", "Missed Mo", "Compliance %", "Missed (30D)", "Warning", "Salary Hold"],
              rows: rows.map((r) => [
                r.employeeName ?? r.employeeCode, r.employeeCode, r.role ?? "—",
                r.pendingDCR ? "Pending" : r.submittedToday ? "Submitted" : "—",
                r.missedThisWeek, r.missedThisMonth, `${r.compliancePercent}%`,
                r.missedLast30Days, r.warningLevel, r.salaryHold ? "Hold" : "—"
              ])
            }]}
          />
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      {summary && (
        <div className="grid" style={{ marginBottom: 24, gap: 12, gridTemplateColumns: "repeat(5, 1fr)" }}>
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
              <th>Employee</th><th>Role</th><th>Today</th>
              <th>Missed Wk</th><th>Missed Mo</th>
              <th>Compliance %</th><th>Missed (30D)</th><th>Warning</th><th>Salary Hold</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.employeeCode} style={r.chronicDefaulter ? { background: "#fef2f2" } : undefined}>
                <td><strong style={{ color: "var(--ink)" }}>{r.employeeName ?? r.employeeCode}</strong> <span style={{ color: "var(--muted)", fontSize: 11 }}>({r.employeeCode})</span></td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.role ?? "—"}</td>
                <td>{r.pendingDCR ? <span style={{ color: "#a16207", fontWeight: 700 }}>Pending</span> : r.submittedToday ? <span style={{ color: "#15803d", fontWeight: 700 }}>Submitted</span> : <span style={{ color: "var(--muted)" }}>—</span>}</td>
                <td>{r.missedThisWeek}</td>
                <td>{r.missedThisMonth}</td>
                <td style={{ fontWeight: 700, color: r.compliancePercent < 70 ? "#b91c1c" : r.compliancePercent < 90 ? "#a16207" : "#15803d" }}>{r.compliancePercent}%</td>
                <td>{r.missedLast30Days}</td>
                <td>
                  {r.warningLevel === "NONE" ? (
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: r.warningLevel === "HIGH" ? "#fee2e2" : r.warningLevel === "MEDIUM" ? "#fef9c3" : "#f3f4f6", color: r.warningLevel === "HIGH" ? "#b91c1c" : r.warningLevel === "MEDIUM" ? "#a16207" : "#6b7280", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                      <ShieldAlert size={12} /> {r.warningLevel}
                    </span>
                  )}
                </td>
                <td>{r.salaryHold ? <span style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Hold</span> : <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>}</td>
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
