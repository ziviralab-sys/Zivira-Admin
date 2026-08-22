"use client";
// components/payroll-hold-engine.tsx
// Zivira_Project_Basic.docx Topic 3 — Salary Integration Engine
//
// Workflow per the doc: Employee -> No DCR -> HR Notification -> Employee
// Explanation -> Manager Approval -> Payroll Released. The backend already
// computes/persists this workflow state (PayrollStatusModel); this view is
// read + a single "Release" action mirroring the existing admin-override
// PATCH /company/analytics/payroll/:id/release endpoint.
//
// New file — purely additive, does not touch any existing component.
import { Lock, RefreshCw, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/back-button";
import { apiClient, type PayrollStatusRow } from "@/lib/api-client";

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  HOLD: { bg: "#fee2e2", color: "#b91c1c", label: "On Hold" },
  EXPLANATION_SUBMITTED: { bg: "#fef9c3", color: "#a16207", label: "Explanation Submitted" },
  RELEASED: { bg: "#dcfce7", color: "#15803d", label: "Released" }
};

export function PayrollHoldEngine() {
  const [rows, setRows] = useState<PayrollStatusRow[]>([]);
  const [summary, setSummary] = useState<{ onHold: number; pendingApproval: number; released: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.payrollAnalytics();
      setRows(res.data);
      setSummary(res.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  async function release(id: string) {
    setBusyId(id);
    try {
      await apiClient.releasePayroll(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Release failed");
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">SFA Analytics &amp; BI</p>
          <h2>Payroll — Compliance Hold Queue</h2>
          <p>Employee -&gt; No DCR -&gt; HR Notification -&gt; Employee Explanation -&gt; Manager Approval -&gt; Payroll Released.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      {summary && (
        <div className="grid grid-3" style={{ marginBottom: 24, gap: 12 }}>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>On Hold</p><p style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c" }}>{summary.onHold}</p></div>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Pending Approval</p><p style={{ fontSize: 26, fontWeight: 700, color: "#a16207" }}>{summary.pendingApproval}</p></div>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Released</p><p style={{ fontSize: 26, fontWeight: 700, color: "#15803d" }}>{summary.released}</p></div>
        </div>
      )}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Employee</th><th>Role</th><th>Month</th><th>Missed Days</th>
              <th>Hold Reason</th><th>Explanation</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const sc = STATUS_STYLE[r.status] ?? STATUS_STYLE.RELEASED;
              return (
                <tr key={r.id}>
                  <td><strong style={{ color: "var(--ink)" }}>{r.employeeName ?? r.employeeCode}</strong> <span style={{ color: "var(--muted)", fontSize: 11 }}>({r.employeeCode})</span></td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.role ?? "—"}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.month}</td>
                  <td>{r.missedDaysSnapshot ?? 0}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)", maxWidth: 160 }}>{r.holdReason ?? "—"}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)", maxWidth: 160 }}>{r.employeeExplanation ?? "—"}</td>
                  <td><span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{sc.label}</span></td>
                  <td>
                    {r.status !== "RELEASED" ? (
                      <button className="button" style={{ padding: "5px 12px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }} onClick={() => release(r.id)} disabled={busyId === r.id} type="button">
                        <Unlock size={13} /> {busyId === r.id ? "Releasing…" : "Release"}
                      </button>
                    ) : (
                      <span style={{ color: "var(--muted)", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}><Lock size={12} /> Released</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No payroll status records for this month yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
