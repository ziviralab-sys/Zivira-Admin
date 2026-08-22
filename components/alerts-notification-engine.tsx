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
import { useEffect, useMemo, useState } from "react";
import { BackButton } from "@/components/back-button";
import { apiClient, type AlertRow } from "@/lib/api-client";

const SEVERITY_STYLE: Record<string, { bg: string; color: string }> = {
  HIGH: { bg: "#fee2e2", color: "#b91c1c" },
  MEDIUM: { bg: "#fef9c3", color: "#a16207" },
  LOW: { bg: "#f3f4f6", color: "#6b7280" }
};

// Filter pills — one per alert type from src/utils/alerts-engine.ts, plus
// "All". Order and labels match Zivira_Project_Basic.docx item 7's ref
// screenshot exactly. Counts are computed live from whatever the engine
// returns, never hardcoded, so a pill's number always matches its filter.
const TYPE_FILTERS: { key: AlertRow["type"] | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "SALARY_HOLD", label: "Salary Hold" },
  { key: "DOCTOR_NOT_VISITED_90_DAYS", label: "Doctor Not Visited 90+ Days" },
  { key: "TERRITORY_INACTIVE", label: "Territory Inactive" },
  { key: "LOW_COVERAGE", label: "Low Coverage" },
  { key: "DCR_NOT_SUBMITTED", label: "DCR Not Submitted" },
  { key: "SAMPLE_STOCK_LOW", label: "Sample Stock Low" },
  { key: "PRODUCT_NOT_PROMOTED", label: "Product Not Promoted" }
];

export function AlertsNotificationEngine() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [summary, setSummary] = useState<{ high: number; medium: number; low: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState<AlertRow["type"] | "ALL">("ALL");

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

  const pillCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: alerts.length };
    for (const t of TYPE_FILTERS) {
      if (t.key === "ALL") continue;
      counts[t.key] = alerts.filter((a) => a.type === t.key).length;
    }
    return counts;
  }, [alerts]);

  const visibleAlerts = typeFilter === "ALL" ? alerts : alerts.filter((a) => a.type === typeFilter);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Alerts</p>
          <h2>Alert &amp; Notification Engine</h2>
          <p>Automated alerts pulled live from compliance, coverage, payroll, and sample-stock signals across the platform.</p>
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

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {TYPE_FILTERS.map((t) => {
          const active = typeFilter === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTypeFilter(t.key)}
              className="button"
              style={{
                padding: "5px 12px", fontSize: 12, borderRadius: 999, minHeight: "unset",
                background: active ? "var(--brand)" : "var(--panel)",
                color: active ? "#fff" : "var(--ink)",
                border: `1px solid ${active ? "var(--brand)" : "var(--line)"}`
              }}
            >
              {t.label} ({pillCounts[t.key] ?? 0})
            </button>
          );
        })}
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>Severity</th><th>Type</th><th>Alert</th></tr></thead>
          <tbody>
            {visibleAlerts.map((a, i) => {
              const sc = SEVERITY_STYLE[a.severity] ?? SEVERITY_STYLE.LOW;
              return (
                <tr key={`${a.type}-${a.subjectCode ?? i}`}>
                  <td><span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}><Bell size={11} /> {a.severity}</span></td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{a.type.replace(/_/g, " ")}</td>
                  <td>{a.message}</td>
                </tr>
              );
            })}
            {!loading && visibleAlerts.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
                <AlertTriangle size={28} style={{ margin: "0 auto 8px", display: "block", opacity: 0.3 }} />
                {alerts.length === 0 ? "No active alerts — everything looks healthy." : "No alerts match this filter."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
