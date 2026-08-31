"use client";
// components/products-discussed-report.tsx
// BI Reports > Doctor Reports > "Products Discussed" — Zivira_Project_Basic.docx
// item 6 (every BI Reports link opens a page with the report's own detail).
//
// No dedicated backend endpoint exists for this slice, so it's derived
// client-side from the same field DCR records every other DCR-driven report
// already reads (apiClient.dcrs() → productsDetailed[]) rather than
// introducing a new API call. Purely additive — reads existing data only.
import { PackageSearch, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BackButton } from "@/components/back-button";
import { apiClient, type DcrRecord } from "@/lib/api-client";

export function ProductsDiscussedReport() {
  const [dcrs, setDcrs] = useState<DcrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.dcrs();
      setDcrs(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => {
    const byProduct = new Map<string, { product: string; mentions: number; doctors: Set<string>; reps: Set<string> }>();
    for (const d of dcrs) {
      const doctorLabel = typeof d.doctorId === "object" ? d.doctorId?.name : undefined;
      for (const product of d.productsDetailed ?? []) {
        if (!product) continue;
        const entry = byProduct.get(product) ?? { product, mentions: 0, doctors: new Set<string>(), reps: new Set<string>() };
        entry.mentions += 1;
        if (doctorLabel) entry.doctors.add(doctorLabel);
        if (d.employeeCode) entry.reps.add(d.employeeCode);
        byProduct.set(product, entry);
      }
    }
    return [...byProduct.values()].sort((a, b) => b.mentions - a.mentions);
  }, [dcrs]);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Doctor Reports</p>
          <h2>Products Discussed</h2>
          <p>Which products came up most often on doctor visits, and how many doctors and reps each one reached — derived from field DCR records.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>Product</th><th>Times Discussed</th><th>Distinct Doctors</th><th>Distinct Reps</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.product}>
                <td><strong style={{ color: "var(--ink)" }}>{r.product}</strong></td>
                <td>{r.mentions}</td>
                <td>{r.doctors.size}</td>
                <td>{r.reps.size}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
                <PackageSearch size={28} style={{ margin: "0 auto 8px", display: "block", opacity: 0.3 }} />
                No DCR records with product details yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
