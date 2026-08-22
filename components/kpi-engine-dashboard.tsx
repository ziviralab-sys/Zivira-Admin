"use client";
// components/kpi-engine-dashboard.tsx
// Zivira_Project_Basic.docx Topic 14 — KPI Engine
//
// Representative KPIs: Doctors Visited, DCR Submitted, Products Promoted,
// Samples Distributed, Conversion Rate (proxy: % of visits with HIGH/
// MEDIUM prescription interest), Compliance %.
// Manager KPIs: Joint Call %, Team Compliance %, Doctor Coverage %,
// Manager Effectiveness Score. Field names match src/utils/kpi-engine.ts
// (RepKpiRow / ManagerKpiRow) exactly.
//
// New file — purely additive, does not touch any existing component.
import { Gauge, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/back-button";
import { apiClient, type ManagerKpi, type RepKpi } from "@/lib/api-client";

export function KpiEngineDashboard() {
  const [reps, setReps] = useState<RepKpi[]>([]);
  const [managers, setManagers] = useState<ManagerKpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.kpiEngine();
      setReps(res.reps);
      setManagers(res.managers);
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
          <h2>KPI Engine</h2>
          <p>Automatically calculated Representative and Manager KPIs for the current month.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><Gauge size={16} /> Representative KPIs</h3>
      <div className="subdivision-table-card" style={{ marginBottom: 28 }}>
        <table className="subdivision-table">
          <thead>
            <tr><th>Representative</th><th>Doctors Visited</th><th>DCR Submitted</th><th>Products Promoted</th><th>Samples Distributed</th><th>Conversion Rate</th><th>Compliance %</th></tr>
          </thead>
          <tbody>
            {reps.map((r) => (
              <tr key={r.employeeCode}>
                <td><strong style={{ color: "var(--ink)" }}>{r.employeeName ?? r.employeeCode}</strong></td>
                <td>{r.doctorsVisited}</td>
                <td>{r.dcrSubmitted}</td>
                <td>{r.productsPromoted}</td>
                <td>{r.samplesDistributed}</td>
                <td>{r.conversionRatePercent}%</td>
                <td style={{ fontWeight: 700, color: r.compliancePercent < 70 ? "#b91c1c" : r.compliancePercent < 90 ? "#a16207" : "#15803d" }}>{r.compliancePercent}%</td>
              </tr>
            ))}
            {!loading && reps.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>No representative KPI data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 className="section-title" style={{ marginBottom: 10 }}>Manager KPIs</h3>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>Manager</th><th>Team Size</th><th>Joint Call %</th><th>Team Compliance %</th><th>Doctor Coverage %</th><th>Manager Effectiveness</th></tr>
          </thead>
          <tbody>
            {managers.map((m) => (
              <tr key={m.managerCode}>
                <td><strong style={{ color: "var(--ink)" }}>{m.managerName ?? m.managerCode}</strong></td>
                <td>{m.teamSize}</td>
                <td>{m.jointCallPercent}%</td>
                <td>{m.teamCompliancePercent}%</td>
                <td>{m.doctorCoveragePercent}%</td>
                <td style={{ fontWeight: 700 }}>{m.managerEffectivenessScore}%</td>
              </tr>
            ))}
            {!loading && managers.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>No manager KPI data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
