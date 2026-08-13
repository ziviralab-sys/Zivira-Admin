"use client";
import type { TourPlan } from "@zivira/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { downloadCsv } from "@/lib/download-csv";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  SUBMITTED: { bg: "#fef9c3", color: "#a16207" },
  APPROVED:  { bg: "#d1fae5", color: "#065f46" },
  REJECTED:  { bg: "#fee2e2", color: "#b91c1c" },
  VOIDED:    { bg: "#f3f4f6", color: "#6b7280" },
  DRAFT:     { bg: "#e0e7ff", color: "#3730a3" }
};

export function AdminTourPlans() {
  const [tps, setTps] = useState<TourPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setTps((await apiClient.adminTourPlans()).data); }
    catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  function exportCsv() {
    downloadCsv("tour-plans.csv", tps.map(tp => ({
      TpId: tp.tpId, MR: tp.employeeName ?? tp.employeeCode, Month: tp.month, Status: tp.status,
      AssignedManager: tp.assignedManager, PrimaryManager: tp.primaryManager, VoidedBy: tp.voidedBy ?? "",
      VoidReason: tp.voidReason ?? "", ReassignedTo: tp.reassignedToTpId ?? "", ParentTpId: tp.parentTpId ?? ""
    })));
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Activities</p>
          <h2>Tour Plans — All Managers</h2>
          <p>Every Tour Plan across the tenant, including voided/reassigned history (PRD Section 12.1).</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
          <button className="button" onClick={exportCsv} disabled={!tps.length} type="button">Export CSV</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        <table className="subdivision-table">
          <thead>
            <tr><th>TP ID</th><th>MR</th><th>Month</th><th>Assigned Manager</th><th>Primary Manager</th><th>Status</th><th>History</th></tr>
          </thead>
          <tbody>
            {tps.map(tp => {
              const sc = STATUS_COLORS[tp.status] ?? STATUS_COLORS.DRAFT;
              return (
                <tr key={tp.id}>
                  <td><strong>{tp.tpId}</strong></td>
                  <td>{tp.employeeName ?? tp.employeeCode}</td>
                  <td>{tp.month}</td>
                  <td>{tp.assignedManager}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{tp.primaryManager}</td>
                  <td><span style={{ ...sc, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{tp.status}</span></td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>
                    {tp.status === "VOIDED" && `Voided by ${tp.voidedBy}: ${tp.voidReason}${tp.reassignedToTpId ? ` → ${tp.reassignedToTpId}` : ""}`}
                    {tp.parentTpId && `Reassigned from ${tp.parentTpId}`}
                  </td>
                </tr>
              );
            })}
            {!loading && tps.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No Tour Plans yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
