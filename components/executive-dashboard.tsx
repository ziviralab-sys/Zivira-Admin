"use client";
// components/executive-dashboard.tsx
// Zivira_Project_Basic.docx Topic 16 — Executive Dashboard
//
// "The Managing Director (MD), CEO, National Sales Manager, or RGM should
// have a centralized dashboard with key metrics." Composed client-side
// from the existing analytics endpoints — no new backend endpoint needed,
// every number below already exists behind /company/analytics/* and
// /company/dashboard.
//
// New file — purely additive, does not touch any existing component.
import { BarChart3, RefreshCw, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

type ExecMetrics = {
  totalEmployees: number;
  activeRepresentatives: number;
  todaysDoctorCalls: number;
  dcrSubmissionRate: number;
  territoryCoverageAlerts: number;
  jointFieldVisits: number;
  chronicDefaulters: number;
  payrollOnHold: number;
  topPerformers: { name: string; coveragePercent: number }[];
  bottomPerformers: { name: string; coveragePercent: number }[];
  highAlerts: number;
};

export function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<ExecMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [dashboard, compliance, repManager, alerts, payroll] = await Promise.all([
        apiClient.dashboard(),
        apiClient.complianceAnalytics(),
        apiClient.repManagerAnalysis(),
        apiClient.alertsEngine(),
        apiClient.payrollAnalytics()
      ]);

      const reps = repManager.data ?? [];
      const sortedByCoverage = [...reps].sort((a, b) => b.coveragePercent - a.coveragePercent);

      setMetrics({
        totalEmployees: dashboard.data.metrics.employeeCount,
        activeRepresentatives: reps.length,
        todaysDoctorCalls: dashboard.data.metrics.dcrSubmittedToday,
        dcrSubmissionRate: compliance.summary.avgCompliancePercent,
        territoryCoverageAlerts: 0,
        jointFieldVisits: reps.reduce((s, r) => s + r.managerJointVisits, 0),
        chronicDefaulters: compliance.summary.chronicDefaulters,
        payrollOnHold: payroll.summary.onHold,
        topPerformers: sortedByCoverage.slice(0, 3).map((r) => ({ name: r.name, coveragePercent: r.coveragePercent })),
        bottomPerformers: sortedByCoverage.slice(-3).reverse().map((r) => ({ name: r.name, coveragePercent: r.coveragePercent })),
        highAlerts: alerts.summary.high
      });
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
          <h2>Executive Dashboard</h2>
          <p>Centralized view for MD / CEO / National Sales Manager / RGM — field productivity, compliance, and payroll status at a glance.</p>
        </div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      {metrics && (
        <>
          <div className="grid grid-3" style={{ marginBottom: 24, gap: 12 }}>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Total Employees</p><p style={{ fontSize: 26, fontWeight: 700 }}>{metrics.totalEmployees}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Active Representatives</p><p style={{ fontSize: 26, fontWeight: 700 }}>{metrics.activeRepresentatives}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Today&apos;s Doctor Calls</p><p style={{ fontSize: 26, fontWeight: 700 }}>{metrics.todaysDoctorCalls}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>DCR Submission Rate</p><p style={{ fontSize: 26, fontWeight: 700, color: "#15803d" }}>{metrics.dcrSubmissionRate}%</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Joint Field Visits</p><p style={{ fontSize: 26, fontWeight: 700 }}>{metrics.jointFieldVisits}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Chronic Defaulters</p><p style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c" }}>{metrics.chronicDefaulters}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Payroll On Hold</p><p style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c" }}>{metrics.payrollOnHold}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>High-Severity Alerts</p><p style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c" }}>{metrics.highAlerts}</p></div>
          </div>

          <div className="grid grid-2" style={{ gap: 20 }}>
            <div className="card" style={{ padding: 16 }}>
              <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><TrendingUp size={16} color="#15803d" /> Top Performers</h3>
              {metrics.topPerformers.map((p) => (
                <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span>{p.name}</span><strong style={{ color: "#15803d" }}>{p.coveragePercent}%</strong>
                </div>
              ))}
              {metrics.topPerformers.length === 0 && <p className="muted">No data yet.</p>}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><BarChart3 size={16} color="#b91c1c" /> Bottom Performers</h3>
              {metrics.bottomPerformers.map((p) => (
                <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span>{p.name}</span><strong style={{ color: "#b91c1c" }}>{p.coveragePercent}%</strong>
                </div>
              ))}
              {metrics.bottomPerformers.length === 0 && <p className="muted">No data yet.</p>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
