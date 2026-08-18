"use client";
import { Clock, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type DcrRecord } from "@/lib/api-client";
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  SUBMITTED:        { bg:"#fef9c3", color:"#a16207" },
  MANAGER_APPROVED: { bg:"#dbeafe", color:"#1d4ed8" },
  APPROVED:         { bg:"#dcfce7", color:"#15803d" },
  REJECTED:         { bg:"#fee2e2", color:"#b91c1c" },
  DRAFT:            { bg:"#f3f4f6", color:"#6b7280" }
};
export function AdminDcrView() {
  const [dcrs, setDcrs]       = useState<DcrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  async function load() {
    setLoading(true); setError("");
    try { setDcrs((await apiClient.dcrs()).data); }
    catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }
  async function approve(id: string) {
    try { await apiClient.approveDcr(id); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Approval failed"); }
  }
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { void load(); }, 600000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Admin Review</p>
          <h2>DCR Reports</h2>
          <p style={{ display:"flex", alignItems:"center", gap:6 }}><Clock size={13} /> Live DCR records from Field Force and Manager review. Auto-refreshes every 10 minutes for MIS demo flow.</p>
        </div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>S.No</th><th>Employee</th><th>Visit Date</th><th>Session</th><th>Time</th>
              <th>Products</th><th>Samples</th><th>Inputs</th><th>Joint Work</th>
              <th>Manager Approved By</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dcrs.map((dcr, i) => {
              const sc = STATUS_COLORS[dcr.status] ?? STATUS_COLORS["DRAFT"];
              return (
                <tr key={dcr.id}>
                  <td style={{ color:"var(--muted)" }}>{i+1}</td>
                  <td><strong style={{ color:"var(--ink)" }}>{dcr.employeeCode}</strong></td>
                  <td style={{ fontSize:12, color:"var(--muted)" }}>{new Date(dcr.visitDate).toLocaleDateString("en-IN")}</td>
                  <td style={{ fontSize:11, fontWeight:600, color:"var(--muted)" }}>{dcr.callSession ?? "—"}</td>
                  <td style={{ fontSize:12, color:"var(--muted)" }}>{dcr.callTime ?? "—"}</td>
                  <td style={{ fontSize:12, color:"var(--muted)", maxWidth:130 }}>{dcr.productsDetailed?.join(", ") || "—"}</td>
                  <td style={{ fontSize:12 }}>{dcr.samplesGiven?.length ? dcr.samplesGiven.map(s => `${s.productName}×${s.qty}`).join(", ") : "—"}</td>
                  <td style={{ fontSize:12 }}>{dcr.inputsGiven?.length ? dcr.inputsGiven.map(s => `${s.inputName}×${s.qty}`).join(", ") : "—"}</td>
                  <td style={{ fontSize:12 }}>{dcr.jointWork?.accompanyingManager ? `${dcr.jointWork.accompanyingManager} · ${dcr.jointWork.jointWorkType?.replace(/_/g," ")}` : "—"}</td>
                  <td style={{ fontSize:12, color:"var(--muted)" }}>{dcr.managerApprovedBy ?? "—"}</td>
                  <td><span style={{ ...sc, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>{dcr.status.replace(/_/g," ")}</span></td>
                  <td>
                    {dcr.status === "MANAGER_APPROVED" ? (
                      <button onClick={() => approve(dcr.id)} type="button" className="button" style={{ padding:"5px 12px", fontSize:12 }}>Approve</button>
                    ) : <span style={{ color:"var(--muted)", fontSize:12 }}>—</span>}
                  </td>
                </tr>
              );
            })}
            {!loading && dcrs.length === 0 && (
              <tr><td colSpan={12} style={{ textAlign:"center", color:"var(--muted)", padding:40 }}>
                <Clock size={28} style={{ margin:"0 auto 8px", display:"block", opacity:0.3 }} />
                No DCRs visible yet — entries appear after 24 hours from submission.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
