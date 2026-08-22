"use client";
// components/executive-dashboard.tsx
// Zivira_Project_Basic.docx Topic 16 — Executive Dashboard
//
// "The Managing Director (MD), CEO, National Sales Manager, or RGM should
// have a centralized dashboard with key metrics." Composed client-side
// from the existing analytics endpoints — no new backend endpoint needed,
// every number below already exists behind /company/analytics/*,
// /company/doctor-coverage and /company/dashboard. Field names pulled
// from each endpoint match the backend's own row types exactly (see
// rep-manager-analysis.tsx / territory-coverage-analytics.tsx for the
// same fields used individually).
//
// New file — purely additive, does not touch any existing component.
import { BarChart3, RefreshCw, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/back-button";
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
  topPerformers: { name: string; jointVisitPercent: number }[];
  bottomPerformers: { name: string; jointVisitPercent: number }[];
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
      const [dashboard, compliance, repManager, alerts, payroll, territory] = await Promise.all([
        apiClient.dashboard(),
        apiClient.complianceAnalytics(),
        apiClient.repManagerAnalysis(),
        apiClient.alertsEngine(),
        apiClient.payrollAnalytics(),
        apiClient.territoryCoverage()
      ]);

      const reps = repManager.data ?? [];
      const sortedByJointWork = [...reps].sort((a, b) => b.jointVisitPercent - a.jointVisitPercent);

      setMetrics({
        totalEmployees: dashboard.data.metrics.employeeCount,
        activeRepresentatives: reps.length,
        todaysDoctorCalls: dashboard.data.metrics.dcrSubmittedToday,
        dcrSubmissionRate: compliance.summary.avgCompliancePercent,
        territoryCoverageAlerts: territory.data.filter((d) => d.alertBucket).length,
        jointFieldVisits: reps.reduce((s, r) => s + r.jointVisits, 0),
        chronicDefaulters: compliance.summary.chronicDefaulters,
        payrollOnHold: payroll.summary.onHold,
        topPerformers: sortedByJointWork.slice(0, 3).map((r) => ({ name: r.employeeName ?? r.employeeCode, jointVisitPercent: r.jointVisitPercent })),
        bottomPerformers: sortedByJointWork.slice(-3).reverse().map((r) => ({ name: r.employeeName ?? r.employeeCode, jointVisitPercent: r.jointVisitPercent })),
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
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      {metrics && (
        <>
          <div className="grid grid-3" style={{ marginBottom: 24, gap: 12 }}>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Total Employees</p><p style={{ fontSize: 26, fontWeight: 700 }}>{metrics.totalEmployees}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Active Representatives</p><p style={{ fontSize: 26, fontWeight: 700 }}>{metrics.activeRepresentatives}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Today&apos;s Doctor Calls</p><p style={{ fontSize: 26, fontWeight: 700 }}>{metrics.todaysDoctorCalls}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>DCR Submission Rate</p><p style={{ fontSize: 26, fontWeight: 700, color: "#15803d" }}>{metrics.dcrSubmissionRate}%</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Territory Coverage Alerts</p><p style={{ fontSize: 26, fontWeight: 700, color: "#a16207" }}>{metrics.territoryCoverageAlerts}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Joint Field Visits</p><p style={{ fontSize: 26, fontWeight: 700 }}>{metrics.jointFieldVisits}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Chronic Defaulters</p><p style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c" }}>{metrics.chronicDefaulters}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Payroll On Hold</p><p style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c" }}>{metrics.payrollOnHold}</p></div>
            <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>High-Severity Alerts</p><p style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c" }}>{metrics.highAlerts}</p></div>
          </div>

          <div className="grid grid-2" style={{ gap: 20 }}>
            <div className="card" style={{ padding: 16 }}>
              <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><TrendingUp size={16} color="#15803d" /> Top Performers (Joint Visit %)</h3>
              {metrics.topPerformers.map((p) => (
                <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span>{p.name}</span><strong style={{ color: "#15803d" }}>{p.jointVisitPercent}%</strong>
                </div>
              ))}
              {metrics.topPerformers.length === 0 && <p className="muted">No data yet.</p>}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><BarChart3 size={16} color="#b91c1c" /> Bottom Performers (Joint Visit %)</h3>
              {metrics.bottomPerformers.map((p) => (
                <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span>{p.name}</span><strong style={{ color: "#b91c1c" }}>{p.jointVisitPercent}%</strong>
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
