"use client";
// components/rep-manager-analysis.tsx
// Zivira_Project_Basic.docx Topic 5 — Representative vs Manager Analysis
// Topic 6 — Joint Field Work Analysis
//
// Two tables from one endpoint: reps (doctors visited vs manager joint
// visits vs coverage %) and managers (total/average joint calls, joint
// call %, ranking) — exactly the fields the doc's example table lists
// (Representative | Doctors | Manager Joint Calls | Coverage %).
//
// New file — purely additive, does not touch any existing component.
import { RefreshCw, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type ManagerJointWorkRow, type RepAnalysisRow } from "@/lib/api-client";

function coverageTone(pct: number) {
  return pct < 40 ? "#b91c1c" : pct < 70 ? "#a16207" : "#15803d";
}

export function RepManagerAnalysis() {
  const [reps, setReps] = useState<RepAnalysisRow[]>([]);
  const [managers, setManagers] = useState<ManagerJointWorkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.repManagerAnalysis();
      setReps(res.data);
      setManagers(res.managers ?? []);
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
          <h2>Representative vs Manager Analysis</h2>
          <p>Identifies managers who are not adequately supporting their teams — favoritism and neglected reportees included.</p>
        </div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><Users size={16} /> Representatives</h3>
      <div className="subdivision-table-card" style={{ marginBottom: 28 }}>
        <table className="subdivision-table">
          <thead><tr><th>Representative</th><th>Reporting Manager</th><th>Doctors Visited</th><th>Manager Joint Visits</th><th>Coverage %</th></tr></thead>
          <tbody>
            {reps.map((r) => (
              <tr key={r.employeeCode}>
                <td><strong style={{ color: "var(--ink)" }}>{r.name}</strong> <span style={{ color: "var(--muted)", fontSize: 11 }}>({r.employeeCode})</span></td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.reportingManagerName ?? r.reportingManager ?? "—"}</td>
                <td>{r.doctorsVisited}</td>
                <td>{r.managerJointVisits}</td>
                <td style={{ fontWeight: 700, color: coverageTone(r.coveragePercent) }}>{r.coveragePercent}%</td>
              </tr>
            ))}
            {!loading && reps.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>No representative data for this month yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><Trophy size={16} /> Manager Joint-Work Ranking</h3>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>Rank</th><th>Manager</th><th>Team Size</th><th>Total Joint Calls</th><th>Average Joint Calls</th><th>Joint Call %</th></tr></thead>
          <tbody>
            {managers.map((m, i) => (
              <tr key={m.managerCode}>
                <td style={{ color: "var(--muted)" }}>{m.rank ?? i + 1}</td>
                <td><strong style={{ color: "var(--ink)" }}>{m.managerName ?? m.managerCode}</strong></td>
                <td>{m.teamSize}</td>
                <td>{m.totalJointCalls}</td>
                <td>{m.averageJointCalls}</td>
                <td style={{ fontWeight: 700, color: coverageTone(m.jointCallPercent) }}>{m.jointCallPercent}%</td>
              </tr>
            ))}
            {!loading && managers.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>No manager joint-work data for this month yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
