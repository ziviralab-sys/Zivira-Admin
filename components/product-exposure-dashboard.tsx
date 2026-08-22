"use client";
// components/product-exposure-dashboard.tsx
// Zivira_Project_Basic.docx Topic 9 — Product Exposure Analytics
// Topic 10 — Product-wise Performance Dashboard
//
// Answers the doc's questions directly: which product is promoted most /
// ignored, which representative promotes it, which territory performs
// best. Field names match src/utils/product-analytics.ts's
// ProductExposureRow exactly.
//
// New file — purely additive, does not touch any existing component.
import { PackageSearch, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/back-button";
import { apiClient, type ProductExposureRow } from "@/lib/api-client";

export function ProductExposureDashboard() {
  const [rows, setRows] = useState<ProductExposureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.productExposure();
      setRows(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  // Backend already sorts by totalSamplesGiven desc — re-sort defensively
  // in case a future backend change drops that ordering.
  const sorted = [...rows].sort((a, b) => b.totalSamplesGiven - a.totalSamplesGiven);
  const mostPromoted = sorted[0];
  const leastPromoted = sorted[sorted.length - 1];

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">SFA Analytics &amp; BI</p>
          <h2>Product Exposure &amp; Performance</h2>
          <p>Which products are promoted most/least, doctor and rep coverage, top performing territory/manager, and prescription-interest signal per product.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      {rows.length > 0 && (
        <div className="grid grid-2" style={{ marginBottom: 20, gap: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <p className="muted" style={{ fontSize: 12 }}>Most promoted product</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#15803d" }}>{mostPromoted?.productName}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>{mostPromoted?.totalSamplesGiven} samples given · {mostPromoted?.distinctDoctors} doctors</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <p className="muted" style={{ fontSize: 12 }}>Least promoted product</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#b91c1c" }}>{leastPromoted?.productName}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>{leastPromoted?.totalSamplesGiven} samples given · {leastPromoted?.distinctDoctors} doctors</p>
          </div>
        </div>
      )}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Product</th><th>Samples Given</th><th>Doctors Covered</th><th>Reps Promoting</th>
              <th>High Interest</th><th>Medium</th><th>Low</th><th>None</th>
              <th>Top Rep</th><th>Top Territory</th><th>Top Manager</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.productCode}>
                <td><strong style={{ color: "var(--ink)" }}>{r.productName}</strong></td>
                <td>{r.totalSamplesGiven}</td>
                <td>{r.distinctDoctors}</td>
                <td>{r.distinctReps}</td>
                <td style={{ color: "#15803d" }}>{r.prescriptionInterestHigh}</td>
                <td style={{ color: "#a16207" }}>{r.prescriptionInterestMedium}</td>
                <td style={{ color: "#b91c1c" }}>{r.prescriptionInterestLow}</td>
                <td style={{ color: "var(--muted)" }}>{r.prescriptionInterestNone}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.topRepName ? `${r.topRepName} (${r.topRepQty})` : "—"}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.topTerritory ? `${r.topTerritory} (${r.topTerritoryQty})` : "—"}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.topManagerName ? `${r.topManagerName} (${r.topManagerQty})` : "—"}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={11} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
                <PackageSearch size={28} style={{ margin: "0 auto 8px", display: "block", opacity: 0.3 }} />
                No product exposure data yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
