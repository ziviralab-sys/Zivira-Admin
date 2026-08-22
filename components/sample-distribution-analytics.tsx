"use client";
// components/sample-distribution-analytics.tsx
// Zivira_Project_Basic.docx Topic 11 — Sample Distribution Analytics
// Topic 12 — Sample vs Doctor Input Analysis
//
// "Total Samples Issued / Samples Distributed / Samples Remaining,
// Doctor-wise Samples, Product-wise Samples." Issued = stock handed to an
// MR (this component's own "Issue Stock" form, POST /sample-allocations);
// Distributed = what the MR actually gave doctors (already captured on
// every DCR); Remaining is computed server-side as Issued − Distributed.
//
// Backend response for /company/analytics/sample-distribution is NOT the
// standard {data: T[]} envelope — it's computeSampleDistribution()'s own
// shape: { byRep, byProduct, byDoctor, totals }. This view renders all
// four breakdowns exactly as returned, field names copied verbatim from
// src/utils/sample-distribution.ts.
//
// New file — purely additive, does not touch any existing component.
import { PackageCheck, Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { BackButton } from "@/components/back-button";
import { apiClient, type DoctorSampleRow, type ProductSampleRow, type RepSampleBalanceRow, type SampleAllocationRow } from "@/lib/api-client";

export function SampleDistributionAnalytics() {
  const [byRep, setByRep] = useState<RepSampleBalanceRow[]>([]);
  const [byProduct, setByProduct] = useState<ProductSampleRow[]>([]);
  const [byDoctor, setByDoctor] = useState<DoctorSampleRow[]>([]);
  const [totals, setTotals] = useState<{ totalIssued: number; totalDistributed: number; totalRemaining: number } | null>(null);
  const [allocations, setAllocations] = useState<SampleAllocationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employeeCode: "", productCode: "", productName: "", batchNumber: "", qtyIssued: "" });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [dist, allocs] = await Promise.all([apiClient.sampleDistribution(), apiClient.sampleAllocations()]);
      setByRep(dist.byRep);
      setByProduct(dist.byProduct);
      setByDoctor(dist.byDoctor);
      setTotals(dist.totals);
      setAllocations(allocs.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function issueStock() {
    if (!form.employeeCode || !form.productCode || !form.productName || !form.qtyIssued) {
      setError("Employee, Product Code, Product Name and Quantity are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiClient.issueSampleAllocation({
        employeeCode: form.employeeCode.trim(),
        productCode: form.productCode.trim(),
        productName: form.productName.trim(),
        batchNumber: form.batchNumber.trim() || undefined,
        qtyIssued: Number(form.qtyIssued)
      });
      setForm({ employeeCode: "", productCode: "", productName: "", batchNumber: "", qtyIssued: "" });
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Issue failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">SFA Analytics &amp; BI</p>
          <h2>Sample Distribution Analytics</h2>
          <p>Total samples issued vs distributed vs remaining — rep-wise, product-wise and doctor-wise — plus the stock-issue ledger.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button" onClick={() => setShowForm((v) => !v)} type="button"><Plus size={15} /> Issue Stock</button>
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      {totals && (
        <div className="grid grid-3" style={{ marginBottom: 20, gap: 12 }}>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Total Issued</p><p style={{ fontSize: 26, fontWeight: 700 }}>{totals.totalIssued}</p></div>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Total Distributed</p><p style={{ fontSize: 26, fontWeight: 700, color: "#15803d" }}>{totals.totalDistributed}</p></div>
          <div className="card" style={{ padding: 16 }}><p className="muted" style={{ fontSize: 12 }}>Total Remaining</p><p style={{ fontSize: 26, fontWeight: 700, color: totals.totalRemaining < 0 ? "#b91c1c" : "var(--ink)" }}>{totals.totalRemaining}</p></div>
        </div>
      )}

      {showForm && (
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <div className="grid grid-3" style={{ gap: 10 }}>
            <input className="input" placeholder="Employee Code" value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} />
            <input className="input" placeholder="Product Code" value={form.productCode} onChange={(e) => setForm({ ...form, productCode: e.target.value })} />
            <input className="input" placeholder="Product Name" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
            <input className="input" placeholder="Batch No. (optional)" value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} />
            <input className="input" placeholder="Quantity Issued" type="number" min={1} value={form.qtyIssued} onChange={(e) => setForm({ ...form, qtyIssued: e.target.value })} />
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button className="button" onClick={issueStock} disabled={saving} type="button">{saving ? "Saving…" : "Save"}</button>
            <button className="button button-secondary" onClick={() => setShowForm(false)} type="button">Cancel</button>
          </div>
        </div>
      )}

      <h3 className="section-title" style={{ marginBottom: 10 }}>Product-wise Distribution</h3>
      <div className="subdivision-table-card" style={{ marginBottom: 28 }}>
        <table className="subdivision-table">
          <thead><tr><th>Product</th><th>Total Issued</th><th>Total Distributed</th><th>Remaining</th></tr></thead>
          <tbody>
            {byProduct.map((d) => (
              <tr key={d.productCode}>
                <td><strong style={{ color: "var(--ink)" }}>{d.productName}</strong></td>
                <td>{d.totalIssued}</td>
                <td>{d.totalDistributed}</td>
                <td style={{ fontWeight: 700, color: d.totalRemaining < 0 ? "#b91c1c" : "var(--ink)" }}>{d.totalRemaining}</td>
              </tr>
            ))}
            {!loading && byProduct.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>
                <PackageCheck size={26} style={{ margin: "0 auto 8px", display: "block", opacity: 0.3 }} />
                No sample distribution data yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 className="section-title" style={{ marginBottom: 10 }}>Rep-wise Balance</h3>
      <div className="subdivision-table-card" style={{ marginBottom: 28 }}>
        <table className="subdivision-table">
          <thead><tr><th>Representative</th><th>Total Issued</th><th>Total Distributed</th><th>Remaining</th></tr></thead>
          <tbody>
            {byRep.map((r) => (
              <tr key={r.employeeCode}>
                <td><strong style={{ color: "var(--ink)" }}>{r.employeeName ?? r.employeeCode}</strong></td>
                <td>{r.totalIssued}</td>
                <td>{r.totalDistributed}</td>
                <td style={{ fontWeight: 700, color: r.totalRemaining < 0 ? "#b91c1c" : "var(--ink)" }}>{r.totalRemaining}</td>
              </tr>
            ))}
            {!loading && byRep.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No rep sample balances yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 className="section-title" style={{ marginBottom: 10 }}>Doctor-wise Samples Received</h3>
      <div className="subdivision-table-card" style={{ marginBottom: 28 }}>
        <table className="subdivision-table">
          <thead><tr><th>Doctor</th><th>Total Samples Received</th></tr></thead>
          <tbody>
            {byDoctor.map((d) => (
              <tr key={d.doctorId}>
                <td><strong style={{ color: "var(--ink)" }}>{d.doctorName}</strong></td>
                <td>{d.totalSamplesReceived}</td>
              </tr>
            ))}
            {!loading && byDoctor.length === 0 && (
              <tr><td colSpan={2} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No doctor-wise sample data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 className="section-title" style={{ marginBottom: 10 }}>Stock Issue Ledger</h3>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>Allocation ID</th><th>Employee</th><th>Product</th><th>Batch</th><th>Qty Issued</th><th>Month</th></tr></thead>
          <tbody>
            {allocations.map((a) => (
              <tr key={a.id}>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{a.allocationId}</td>
                <td>{a.employeeName ?? a.employeeCode}</td>
                <td>{a.productName}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{a.batchNumber ?? "—"}</td>
                <td>{a.qtyIssued}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{a.month}</td>
              </tr>
            ))}
            {!loading && allocations.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No stock issued yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
