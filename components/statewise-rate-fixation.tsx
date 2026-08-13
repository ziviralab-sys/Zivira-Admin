"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

type RateRow = {
  id: string;
  productName: string;
  batchNo: string;
  mfgDate: string;
  expDate: string;
  pack: string;
  ptr: string;
  pts: string;
  mrp: string;
  currency: string;
  effectiveDate: string;
  status: "Active" | "Inactive";
};

const initialRates: RateRow[] = [];

export function StatewiseRateFixation() {
  const [rates, setRates] = useState<RateRow[]>(initialRates);
  const [productList, setProductList] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [formRow, setFormRow] = useState<RateRow>({
    id: "",
    productName: "",
    batchNo: "",
    mfgDate: "",
    expDate: "",
    pack: "",
    ptr: "",
    pts: "",
    mrp: "",
    currency: "INR",
    effectiveDate: "",
    status: "Active"
  });
  const [currencyFilter, setCurrencyFilter] = useState<string>("All");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterMenuOpen, setStatusFilterMenuOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RateRow | null>(null);

  useEffect(() => {
    // Fetch products to populate the product dropdown in the form
    apiClient.productCatalog()
      .then(res => {
        const names = res.data.map(p => p.productName);
        setProductList(names.length > 0 ? names : ["Zivifresh 0.05% Cream", "Zivifresh Gel"]);
      })
      .catch(() => {
        setProductList(["Zivifresh 0.05% Cream", "Zivifresh Gel"]);
      });
  }, []);

  const filtered = rates.filter(
    (r) =>
      (r.productName.toLowerCase().includes(search.toLowerCase()) ||
       r.batchNo.toLowerCase().includes(search.toLowerCase())) &&
      (currencyFilter === "All" || (r.currency || "INR") === currencyFilter) &&
      (statusFilter === "All" || (r.status || "Active") === statusFilter)
  );

  function handleAdd() {
    setFormRow({
      id: "",
      productName: productList[0] || "",
      batchNo: "",
      mfgDate: "",
      expDate: "",
      pack: "",
      ptr: "",
      pts: "",
      mrp: "",
      currency: "INR",
      effectiveDate: "",
      status: "Active"
    });
    setView("add");
  }

  function handleEdit(row: RateRow) {
    setFormRow({ ...row });
    setEditTarget(row);
    setView("edit");
  }

  function handleSave() {
    if (!formRow.productName || !formRow.batchNo) return;

    if (view === "add") {
      const newRate: RateRow = {
        ...formRow,
        id: `RAT${String(rates.length + 1).padStart(4, "0")}`
      };
      setRates([...rates, newRate]);
    } else {
      setRates(rates.map(r => r.id === formRow.id ? { ...formRow } : r));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setRates(rates.filter(r => r.id !== id));
  }

  if (view === "add" || view === "edit") {
    return (
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Master Setup</p>
            <h2>{view === "add" ? "Add Rate Master Record" : "Edit Rate Master Record"}</h2>
            <p>Maintain pricing information (PTR, PTS, MRP) for manufacturing batches.</p>
          </div>
          <button className="button button-secondary" onClick={() => setView("list")} type="button">
            <RotateCcw size={16} /> Back
          </button>
        </div>
        <div className="subdivision-form-card">
          <label className="field">
            <span>Product</span>
            <select
              value={formRow.productName}
              onChange={(e) => setFormRow({ ...formRow, productName: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            >
              {productList.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Batch Number</span>
            <input
              value={formRow.batchNo}
              onChange={(e) => setFormRow({ ...formRow, batchNo: e.target.value })}
              placeholder="e.g. ZVF240101"
            />
          </label>
          <label className="field">
            <span>Manufacturing Date</span>
            <input
              type="date"
              value={formRow.mfgDate}
              onChange={(e) => setFormRow({ ...formRow, mfgDate: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            />
          </label>
          <label className="field">
            <span>Expiry Date</span>
            <input
              type="date"
              value={formRow.expDate}
              onChange={(e) => setFormRow({ ...formRow, expDate: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            />
          </label>
          <label className="field">
            <span>Pack Size</span>
            <input
              value={formRow.pack}
              onChange={(e) => setFormRow({ ...formRow, pack: e.target.value })}
              placeholder="e.g. 15 g Tube"
            />
          </label>
          <label className="field">
            <span>PTR (Price to Retailer)</span>
            <input
              type="number"
              value={formRow.ptr}
              onChange={(e) => setFormRow({ ...formRow, ptr: e.target.value })}
              placeholder="95.00"
            />
          </label>
          <label className="field">
            <span>PTS (Price to Stockist)</span>
            <input
              type="number"
              value={formRow.pts}
              onChange={(e) => setFormRow({ ...formRow, pts: e.target.value })}
              placeholder="90.00"
            />
          </label>
          <label className="field">
            <span>MRP (Maximum Retail Price)</span>
            <input
              type="number"
              value={formRow.mrp}
              onChange={(e) => setFormRow({ ...formRow, mrp: e.target.value })}
              placeholder="120.00"
            />
          </label>
          <label className="field">
            <span>Currency</span>
            <select
              value={formRow.currency}
              onChange={(e) => setFormRow({ ...formRow, currency: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label className="field">
            <span>Effective Date</span>
            <input
              type="date"
              value={formRow.effectiveDate}
              onChange={(e) => setFormRow({ ...formRow, effectiveDate: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select
              value={formRow.status}
              onChange={(e) => setFormRow({ ...formRow, status: e.target.value as any })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
          <button className="button" style={{ marginTop: "12px" }} onClick={handleSave} type="button" disabled={!formRow.productName || !formRow.batchNo}>
            <Check size={16} /> Add Rate
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Rate Master</h2>
          <p>Configure product batch rates, PTR, PTS, and MRP.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="button" onClick={handleAdd} type="button">
            <Plus size={16} /> Add Batch Rate
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by product or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "360px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "14px",
            outline: "none"
          }}
        />
      </div>

      <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
        <article>
          <span>Total Rates</span>
          <strong>{rates.length}</strong>
        </article>
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto", minHeight: "280px" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Rate Code</th>
              <th>Product</th>
              <th>Batch No</th>
              <th>Mfg Date</th>
              <th>Expiry Date</th>
              <th>Pack</th>
              <th>PTR (₹)</th>
              <th>PTS (₹)</th>
              <th>MRP (₹)</th>
              <th style={{ minWidth: "130px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "space-between" }}>
                  <span>Currency</span>
                  <button
                    type="button"
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {filterMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      minWidth: "110px",
                      display: "flex",
                      flexDirection: "column",
                      padding: "4px 0"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => { setCurrencyFilter("INR"); setFilterMenuOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        background: currencyFilter === "INR" ? "var(--line)" : "none",
                        border: "none",
                        color: "var(--ink)",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: currencyFilter === "INR" ? 600 : 400
                      }}
                    >
                      INR
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrencyFilter("USD"); setFilterMenuOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        background: currencyFilter === "USD" ? "var(--line)" : "none",
                        border: "none",
                        color: "var(--ink)",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: currencyFilter === "USD" ? 600 : 400
                      }}
                    >
                      USD
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCurrencyFilter("All"); setFilterMenuOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        borderTop: "1px solid var(--border)",
                        background: "none",
                        color: "var(--muted)",
                        fontSize: "11px",
                        cursor: "pointer"
                      }}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </th>
              <th>Effective Date</th>
              <th style={{ minWidth: "130px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "space-between" }}>
                  <span>Status</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilterMenuOpen(!statusFilterMenuOpen)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {statusFilterMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      minWidth: "110px",
                      display: "flex",
                      flexDirection: "column",
                      padding: "4px 0"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => { setStatusFilter("Active"); setStatusFilterMenuOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        background: statusFilter === "Active" ? "var(--line)" : "none",
                        border: "none",
                        color: "var(--ink)",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: statusFilter === "Active" ? 600 : 400
                      }}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter("Inactive"); setStatusFilterMenuOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        background: statusFilter === "Inactive" ? "var(--line)" : "none",
                        border: "none",
                        color: "var(--ink)",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: statusFilter === "Inactive" ? 600 : 400
                      }}
                    >
                      Inactive
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter("All"); setStatusFilterMenuOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        borderTop: "1px solid var(--border)",
                        background: "none",
                        color: "var(--muted)",
                        fontSize: "11px",
                        cursor: "pointer"
                      }}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: 600 }}>{row.id}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.productName}</strong></td>
                <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{row.batchNo}</span></td>
                <td>{row.mfgDate}</td>
                <td>{row.expDate}</td>
                <td>{row.pack}</td>
                <td>{row.ptr}</td>
                <td>{row.pts}</td>
                <td style={{ fontWeight: 600, color: "var(--brand)" }}>{row.mrp}</td>
                <td>{row.currency || "INR"}</td>
                <td>{row.effectiveDate}</td>
                <td>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: 600,
                    background: (row.status || "Active") === "Active" ? "#10b98115" : "#ef444415",
                    color: (row.status || "Active") === "Active" ? "#10b981" : "#ef4444",
                    border: (row.status || "Active") === "Active" ? "1px solid #10b98125" : "1px solid #ef444425"
                  }}>
                    {row.status || "Active"}
                  </span>
                </td>
                <td>
                  <button className="subdivision-icon-button" onClick={() => handleEdit(row)} title="Edit" type="button">
                    <Pencil size={15} />
                  </button>
                </td>
                <td>
                  <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} title="Delete" type="button">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={14} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No rates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
