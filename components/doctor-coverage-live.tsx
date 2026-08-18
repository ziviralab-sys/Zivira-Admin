"use client";
import type { DoctorCoverageRow } from "@zivira/types";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { downloadCsv } from "@/lib/download-csv";
import { formatDate } from "@/lib/format-date";
export function DoctorCoverageLive() {
  const [rows, setRows] = useState<DoctorCoverageRow[]>([]);
  const [threshold, setThreshold] = useState(500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    try {
      const [coverage, config] = await Promise.all([apiClient.doctorCoverage(), apiClient.giftValueThreshold()]);
      setRows(coverage.data);
      setThreshold(config.data.GIFT_VALUE_THRESHOLD_RS ?? 500);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to load doctor coverage"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  function exportCsv() {
    downloadCsv("doctor-coverage.csv", rows.map(r => ({
      DoctorName: r.doctorName, Specialty: r.specialty ?? "", AssignedMR: r.assignedMR ?? "",
      TotalVisits: r.totalVisits, TotalSamples: r.totalSamples, TotalGifts: r.totalGifts,
      TotalGiftValueRs: r.totalGiftValueRs, LastVisitDate: r.lastVisitDate ? formatDate(r.lastVisitDate) : "",
      OverGiftThreshold: r.overGiftThreshold ? "Yes" : "No"
    })));
  }
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">MIS Reports</p>
          <h2>Doctor Coverage</h2>
          <p>Visits, drug samples and gifts given per doctor this month — live from DCR submissions (PRD Section 12.2 &amp; 12.3). MCI gift-value alert threshold: ₹{threshold}.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
          <button className="button" onClick={exportCsv} disabled={!rows.length} type="button">Export CSV</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Doctor Name</th><th>Specialty</th><th>Assigned MR</th><th>Total Visits</th>
              <th>Total Samples (units)</th><th>Total Gifts (units)</th><th>Gift Value (₹)</th><th>Last Visit Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.doctorId} style={r.overGiftThreshold ? { background: "#fff8e8" } : undefined}>
                <td><strong>{r.doctorName}</strong></td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.specialty ?? "—"}</td>
                <td>{r.assignedMR ?? "—"}</td>
                <td>{r.totalVisits}</td>
                <td>{r.totalSamples}</td>
                <td>{r.totalGifts}</td>
                <td>
                  {r.overGiftThreshold && <AlertTriangle size={13} color="#b45309" style={{ marginRight: 4, verticalAlign: "middle" }} />}
                  ₹{r.totalGiftValueRs}
                </td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.lastVisitDate ? formatDate(r.lastVisitDate) : "—"}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No doctors found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
