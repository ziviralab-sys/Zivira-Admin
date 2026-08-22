"use client";
// components/kpi-engine-dashboard.tsx
// Zivira_Project_Basic.docx Topic 14 — KPI Engine
//
// Representative KPIs: Doctors Visited, Calls Completed, DCR Submitted,
// Products Promoted, Samples Distributed, Conversion Rate.
// Manager KPIs: Joint Calls, Coverage %, Team Compliance, Doctor Coverage,
// Manager Effectiveness.
//
// New file — purely additive, does not touch any existing component.
import { Gauge, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
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
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><Gauge size={16} /> Representative KPIs</h3>
      <div className="subdivision-table-card" style={{ marginBottom: 28 }}>
        <table className="subdivision-table">
          <thead>
            <tr><th>Representative</th><th>Doctors Visited</th><th>Calls Completed</th><th>DCR Submitted</th><th>Products Promoted</th><th>Samples Distributed</th><th>Conversion Rate</th></tr>
          </thead>
          <tbody>
            {reps.map((r) => (
              <tr key={r.employeeCode}>
                <td><strong style={{ color: "var(--ink)" }}>{r.name ?? r.employeeCode}</strong></td>
                <td>{r.doctorsVisited}</td>
                <td>{r.callsCompleted}</td>
                <td>{r.dcrSubmitted}</td>
                <td>{r.productsPromoted}</td>
                <td>{r.samplesDistributed}</td>
                <td>{r.conversionRate != null ? `${r.conversionRate}%` : "—"}</td>
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
            <tr><th>Manager</th><th>Joint Calls</th><th>Coverage %</th><th>Team Compliance %</th><th>Doctor Coverage</th><th>Manager Effectiveness</th></tr>
          </thead>
          <tbody>
            {managers.map((m) => (
              <tr key={m.employeeCode}>
                <td><strong style={{ color: "var(--ink)" }}>{m.name ?? m.employeeCode}</strong></td>
                <td>{m.jointCalls}</td>
                <td>{m.coveragePercent}%</td>
                <td>{m.teamCompliancePercent}%</td>
                <td>{m.doctorCoverage ?? "—"}</td>
                <td>{m.managerEffectiveness != null ? `${m.managerEffectiveness}%` : "—"}</td>
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
