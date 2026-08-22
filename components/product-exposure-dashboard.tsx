"use client";
// components/product-exposure-dashboard.tsx
// Zivira_Project_Basic.docx Topic 9 — Product Exposure Analytics
// Topic 10 — Product-wise Performance Dashboard
//
// Answers the doc's questions directly: which product is promoted most /
// ignored, which representative promotes it, which region performs best.
//
// New file — purely additive, does not touch any existing component.
import { PackageSearch, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
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

  const sorted = [...rows].sort((a, b) => b.doctorsCovered - a.doctorsCovered);
  const mostPromoted = sorted[0];
  const leastPromoted = sorted[sorted.length - 1];

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">SFA Analytics &amp; BI</p>
          <h2>Product Exposure &amp; Performance</h2>
          <p>Which products are promoted most/least, doctor coverage, and prescription-interest signal per product.</p>
        </div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      {rows.length > 0 && (
        <div className="grid grid-2" style={{ marginBottom: 20, gap: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <p className="muted" style={{ fontSize: 12 }}>Most promoted product</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#15803d" }}>{mostPromoted?.productName}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>{mostPromoted?.doctorsCovered} doctors covered</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <p className="muted" style={{ fontSize: 12 }}>Least promoted product</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#b91c1c" }}>{leastPromoted?.productName}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>{leastPromoted?.doctorsCovered} doctors covered</p>
          </div>
        </div>
      )}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Product</th><th>Doctors Covered</th><th>Samples Given</th>
              <th>High Interest</th><th>Medium Interest</th><th>Low Interest</th>
              <th>Top Representative</th><th>Top Region</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.productCode ?? r.productName}>
                <td><strong style={{ color: "var(--ink)" }}>{r.productName}</strong></td>
                <td>{r.doctorsCovered}</td>
                <td>{r.samplesGiven}</td>
                <td style={{ color: "#15803d" }}>{r.prescriptionInterestHigh ?? 0}</td>
                <td style={{ color: "#a16207" }}>{r.prescriptionInterestMedium ?? 0}</td>
                <td style={{ color: "#b91c1c" }}>{r.prescriptionInterestLow ?? 0}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.topRepresentative ?? "—"}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.topRegion ?? "—"}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
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
