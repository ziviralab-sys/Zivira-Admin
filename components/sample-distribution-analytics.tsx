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
import { ExportMenuButton } from "@/components/export-menu-button";
import { apiClient, type DoctorSampleRow, type Employee, type Product, type ProductSampleRow, type RepSampleBalanceRow, type SampleAllocationRow } from "@/lib/api-client";

export function SampleDistributionAnalytics() {
  const [byRep, setByRep] = useState<RepSampleBalanceRow[]>([]);
  const [byProduct, setByProduct] = useState<ProductSampleRow[]>([]);
  const [byDoctor, setByDoctor] = useState<DoctorSampleRow[]>([]);
  const [totals, setTotals] = useState<{ totalIssued: number; totalDistributed: number; totalRemaining: number } | null>(null);
  const [allocations, setAllocations] = useState<SampleAllocationRow[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employeeCode: "", productCode: "", productName: "", batchNumber: "", qtyIssued: "" });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [dist, allocs, emps, prods] = await Promise.all([
        apiClient.sampleDistribution(), apiClient.sampleAllocations(), apiClient.employees(), apiClient.products()
      ]);
      setByRep(dist.byRep);
      setByProduct(dist.byProduct);
      setByDoctor(dist.byDoctor);
      setTotals(dist.totals);
      setAllocations(allocs.data);
      setEmployees(emps.data);
      setProducts(prods.data);
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
          <p className="subdivision-eyebrow">Samples</p>
          <h2>Sample Distribution Analytics</h2>
          <p>Issued vs distributed vs remaining sample stock, by rep, by product, and by doctor.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
          <ExportMenuButton
            filename="sample-distribution"
            sections={[
              { title: "By Product", headers: ["Product", "Issued", "Distributed", "Remaining"], rows: byProduct.map((d) => [d.productName, d.totalIssued, d.totalDistributed, d.totalRemaining]) },
              { title: "By Rep", headers: ["Representative", "Issued", "Distributed", "Remaining"], rows: byRep.map((r) => [r.employeeName ?? r.employeeCode, r.totalIssued, r.totalDistributed, r.totalRemaining]) },
              { title: "By Doctor", headers: ["Doctor", "Total Samples Received"], rows: byDoctor.map((d) => [d.doctorName, d.totalSamplesReceived]) },
              { title: "Stock Ledger", headers: ["Allocation ID", "Employee", "Product", "Batch", "Qty Issued", "Month"], rows: allocations.map((a) => [a.allocationId, a.employeeName ?? a.employeeCode, a.productName, a.batchNumber ?? "—", a.qtyIssued, a.month]) }
            ]}
          />
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

      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div className="grid" style={{ gap: 10, gridTemplateColumns: "1.4fr 1.4fr 1fr 0.7fr auto", alignItems: "end" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
            Representative
            <select className="input" value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}>
              <option value="">Select…</option>
              {employees.map((e) => <option key={e.employeeCode} value={e.employeeCode}>{e.name} ({e.employeeCode})</option>)}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
            Product
            <select
              className="input"
              value={form.productCode}
              onChange={(e) => {
                const p = products.find((pr) => pr.code === e.target.value);
                setForm({ ...form, productCode: e.target.value, productName: p?.name ?? "" });
              }}
            >
              <option value="">Select…</option>
              {products.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
            Batch No.
            <input className="input" placeholder="Optional" value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
            Qty
            <input className="input" placeholder="50" type="number" min={1} value={form.qtyIssued} onChange={(e) => setForm({ ...form, qtyIssued: e.target.value })} />
          </label>
          <button className="button" onClick={issueStock} disabled={saving} type="button" style={{ whiteSpace: "nowrap" }}>
            <Plus size={15} /> {saving ? "Saving…" : "Issue Stock"}
          </button>
        </div>
      </div>

      <h3 className="section-title" style={{ marginBottom: 10 }}>Product-wise Distribution</h3>
      <div className="subdivision-table-card" style={{ marginBottom: 28 }}>
        <table className="subdivision-table">
          <thead><tr><th>Product</th><th>Issued</th><th>Distributed</th><th>Remaining</th></tr></thead>
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
          <thead><tr><th>Representative</th><th>Issued</th><th>Distributed</th><th>Remaining</th></tr></thead>
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
