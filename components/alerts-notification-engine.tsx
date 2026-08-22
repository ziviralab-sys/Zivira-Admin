"use client";
// components/alerts-notification-engine.tsx
// Zivira_Project_Basic.docx Topic 15 — Alert & Notification Engine
//
// Automated alert types from the doc, all computed server-side (src/utils/
// alerts-engine.ts): DCR Not Submitted, Doctor Not Visited 90 Days,
// Product Not Promoted, Low Coverage, Sample Stock Low, Salary Hold,
// Territory Inactive. Field names (type/severity/message/subjectCode/
// subjectLabel) match the backend's Alert type exactly.
//
// New file — purely additive, does not touch any existing component.
import { AlertTriangle, Bell, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/back-button";
import { apiClient, type AlertRow } from "@/lib/api-client";

const SEVERITY_STYLE: Record<string, { bg: string; color: string }> = {
  HIGH: { bg: "#fee2e2", color: "#b91c1c" },
  MEDIUM: { bg: "#fef9c3", color: "#a16207" },
  LOW: { bg: "#f3f4f6", color: "#6b7280" }
};

export function AlertsNotificationEngine() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [summary, setSummary] = useState<{ high: number; medium: number; low: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.alertsEngine();
      setAlerts(res.data);
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
          <h2>Alert &amp; Notification Engine</h2>
          <p>DCR gaps, unvisited doctors, low coverage, low sample stock, and salary holds — surfaced automatically, ranked by severity.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      {summary && (
        <div className="grid grid-3" style={{ marginBottom: 20, gap: 12 }}>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>High Severity</p><p style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c" }}>{summary.high}</p></div>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Medium Severity</p><p style={{ fontSize: 26, fontWeight: 700, color: "#a16207" }}>{summary.medium}</p></div>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Low Severity</p><p style={{ fontSize: 26, fontWeight: 700, color: "#6b7280" }}>{summary.low}</p></div>
        </div>
      )}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>Severity</th><th>Type</th><th>Message</th><th>Related To</th></tr></thead>
          <tbody>
            {alerts.map((a, i) => {
              const sc = SEVERITY_STYLE[a.severity] ?? SEVERITY_STYLE.LOW;
              return (
                <tr key={`${a.type}-${a.subjectCode ?? i}`}>
                  <td><span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}><Bell size={11} /> {a.severity}</span></td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{a.type.replace(/_/g, " ")}</td>
                  <td>{a.message}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{a.subjectLabel ?? a.subjectCode ?? "—"}</td>
                </tr>
              );
            })}
            {!loading && alerts.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
                <AlertTriangle size={28} style={{ margin: "0 auto 8px", display: "block", opacity: 0.3 }} />
                No active alerts — everything looks healthy.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
