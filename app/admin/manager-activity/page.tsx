"use client";
import { useEffect, useState } from "react";
import { apiClient, type ManagerActivityRecord } from "@/lib/api-client";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ManagerActivityPage() {
  const [data, setData] = useState<ManagerActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.managerActivity();
      setData(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <>
      <div className="page-header">
        <p className="eyebrow">ADMIN · MANAGER ACTIVITY</p>
        <h1 className="page-title">Manager Review Stats</h1>
        <p className="page-description">Track how each manager reviews their team DCRs. Flagged = auto-approve rate above 20%.</p>
      </div>
      <div className="toolbar">
        <Link href="/admin/dcr" className="button button-secondary"><ArrowLeft size={17} />Back to DCRs</Link>
        <button className="button button-secondary" onClick={load}><RefreshCw size={16} />Refresh</button>
      </div>
      {error && <p className="form-error">{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, fontSize: 13 }}>
        <thead style={{ background: "#f8fafc" }}>
          <tr>
            {["Manager","Role","Approved","Rejected","Auto-Approved","Pending","Auto Rate","Status"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #e2e8f0", fontWeight: 600, color: "#475569" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={r.manager.id} style={{ background: r.flagged ? "#fef2f2" : i % 2 === 0 ? "#fff" : "#f8fafc" }}>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9", fontWeight: 600 }}>{r.manager.name}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>{r.manager.role}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9", color: "#15803d" }}>{r.approved}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9", color: "#b91c1c" }}>{r.rejected}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9", color: "#d97706" }}>{r.autoApproved}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9", color: "#7c3aed" }}>{r.pending}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, color: r.autoApproveRate > 20 ? "#b91c1c" : "#15803d" }}>{r.autoApproveRate}%</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>
                {r.flagged
                  ? <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "2px 8px", borderRadius: 12, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <AlertTriangle size={12} />Flagged
                    </span>
                  : <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>OK</span>
                }
              </td>
            </tr>
          ))}
          {data.length === 0 && !loading && (
            <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>No manager data found</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}
