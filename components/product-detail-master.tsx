"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, X, ChevronDown, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type ProductCatalogItem } from "@/lib/api-client";

type FormFields = {
  id: string;
  productCode: string;
  productName: string;
  brandName: string;
  strength: string;
  pack: string;
  sku: string;
  division: string;
  uom: string;
  status: "ACTIVE" | "INACTIVE";
};

const emptyFormRow: FormFields = {
  id: "",
  productCode: "",
  productName: "",
  brandName: "",
  strength: "",
  pack: "",
  sku: "",
  division: "Zivira",
  uom: "Tube",
  status: "ACTIVE"
};

function ProductForm({ row, onSave, onBack, saving, error }: { row: any; onSave: (f: FormFields) => void; onBack: () => void; saving: boolean; error: string | null }) {
  const [form, setForm] = useState<FormFields>({
    id: row.id ?? "",
    productCode: row.productCode ?? "",
    productName: row.productName ?? "",
    brandName: row.brandName ?? "",
    strength: row.strength ?? "",
    pack: row.pack ?? "",
    sku: row.sku ?? "",
    division: row.division ?? "Zivira",
    uom: row.uom ?? "Tube",
    status: row.status ?? "ACTIVE"
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Product Master" : "Add Product Master"}</h2>
          <p>Maintain the master product catalog.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button">
          <RotateCcw size={16} /> Back
        </button>
      </div>
      <div className="subdivision-form-card">
        {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
        <label className="field">
          <span>Product Code</span>
          <input
            value={form.productCode}
            onChange={(e) => setForm({ ...form, productCode: e.target.value })}
            placeholder="e.g. PRD0001"
          />
        </label>
        <label className="field">
          <span>* Product Name</span>
          <input
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            placeholder="e.g. Zivifresh 0.05% Cream"
          />
        </label>
        <label className="field">
          <span>Brand</span>
          <input
            value={form.brandName}
            onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            placeholder="e.g. Zivifresh 0.05%"
          />
        </label>
        <label className="field">
          <span>Strength</span>
          <input
            value={form.strength}
            onChange={(e) => setForm({ ...form, strength: e.target.value })}
            placeholder="e.g. 15 g"
          />
        </label>
        <label className="field">
          <span>Pack</span>
          <input
            value={form.pack}
            onChange={(e) => setForm({ ...form, pack: e.target.value })}
            placeholder="e.g. Tube"
          />
        </label>
        <label className="field">
          <span>SKU</span>
          <input
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            placeholder="e.g. ZIVF-001"
          />
        </label>
        <label className="field">
          <span>Division</span>
          <select
            value={form.division}
            onChange={(e) => setForm({ ...form, division: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Astra">Astra</option>
            <option value="Aura">Aura</option>
            <option value="Zivira">Zivira</option>
          </select>
        </label>
        <label className="field">
          <span>UOM (Unit of Measurement)</span>
          <input
            value={form.uom}
            onChange={(e) => setForm({ ...form, uom: e.target.value })}
            placeholder="e.g. Tube"
          />
        </label>
        <label className="field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as "ACTIVE" | "INACTIVE" })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={saving || !form.productName.trim()}>
          <Check size={16} /> Add Product
        </button>
      </div>
    </section>
  );
}

export function ProductDetailMaster() {
  const [all, setAll] = useState<ProductCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<ProductCatalogItem | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<FormFields | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.productCatalog();
      // Supplement mock fields if missing
      const mapped = res.data.map((p, i) => ({
        ...p,
        productCode: p.productCode || `PRD${String(i + 1).padStart(4, "0")}`,
        strength: p.strength || "0.05%",
        pack: p.pack || "15 g Tube",
        sku: p.sku || `ZIVF-${String(i + 1).padStart(3, "0")}`,
        division: p.division || "Zivira",
        uom: p.uom || "Tube"
      }));
      setAll(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const rows = all.filter(r => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return r.status === "ACTIVE";
    if (statusFilter === "Inactive") return r.status === "INACTIVE";
    return true;
  });

  function beginInline(row: ProductCatalogItem) {
    setInlineEditId(row.id);
    setDraftRow({
      id: row.id,
      productCode: row.productCode ?? "",
      productName: row.productName,
      brandName: row.brandName ?? "",
      strength: row.strength ?? "",
      pack: row.pack ?? "",
      sku: row.sku ?? "",
      division: row.division ?? "Zivira",
      uom: row.uom ?? "Tube",
      status: row.status
    });
  }

  function cancelInline() {
    setInlineEditId(null);
    setDraftRow(null);
  }

  async function saveInline() {
    if (!inlineEditId || !draftRow) return;
    setSaving(true);
    try {
      setAll(all.map(p => p.id === inlineEditId ? {
        ...p,
        productCode: draftRow.productCode,
        productName: draftRow.productName,
        brandName: draftRow.brandName,
        strength: draftRow.strength,
        pack: draftRow.pack,
        sku: draftRow.sku,
        division: draftRow.division,
        uom: draftRow.uom,
        status: draftRow.status
      } : p));
      cancelInline();
    } catch (err) {
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  function handleSaveForm(form: FormFields) {
    setSaving(true);
    if (view === "add") {
      const newProduct: ProductCatalogItem = {
        id: Math.random().toString(36).slice(2, 9),
        productCode: form.productCode || `PRD${String(all.length + 1).padStart(4, "0")}`,
        productName: form.productName,
        brandName: form.brandName,
        strength: form.strength,
        pack: form.pack,
        sku: form.sku || `ZIVF-${String(all.length + 1).padStart(3, "0")}`,
        division: form.division,
        uom: form.uom,
        status: form.status
      };
      setAll([newProduct, ...all]);
    } else {
      setAll(all.map(p => p.id === form.id ? {
        ...p,
        productCode: form.productCode,
        productName: form.productName,
        brandName: form.brandName,
        strength: form.strength,
        pack: form.pack,
        sku: form.sku,
        division: form.division,
        uom: form.uom,
        status: form.status
      } : p));
    }
    setSaving(false);
    setView("list");
  }

  function handleDeactivate(id: string) {
    setAll(all.map(p => p.id === id ? { ...p, status: "INACTIVE" as const } : p));
  }

  if (view === "add") return <ProductForm row={{}} onSave={handleSaveForm} onBack={() => setView("list")} saving={saving} error={error} />;
  if (view === "edit" && editTarget) return <ProductForm row={editTarget} onSave={handleSaveForm} onBack={() => { setView("list"); setEditTarget(null); }} saving={saving} error={error} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Product Master</h2>
          <p>Create and manage the master product catalog.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="button" onClick={() => setView("add")} type="button">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

      <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
        <article>
          <span>Total Products</span>
          <strong>{rows.length}</strong>
        </article>
        <article>
          <span>Active Products</span>
          <strong>{rows.filter(r => r.status === "ACTIVE").length}</strong>
        </article>
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Strength</th>
              <th>Pack</th>
              <th>SKU</th>
              <th>Division</th>
              <th>UOM</th>
              <th style={{ minWidth: "130px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Status</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilterOpen(!statusFilterOpen)}
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
                {statusFilterOpen && (
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
                      onClick={() => { setStatusFilter("Active"); setStatusFilterOpen(false); }}
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
                      onClick={() => { setStatusFilter("Inactive"); setStatusFilterOpen(false); }}
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
                      onClick={() => { setStatusFilter("All"); setStatusFilterOpen(false); }}
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
              <th>Inactive</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  Loading...
                </td>
              </tr>
            )}
            {!loading && rows.map((row) => {
              return (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>
                    {row.productCode}
                  </td>
                  <td>
                    <strong style={{ color: "var(--ink)" }}>{row.productName}</strong>
                  </td>
                  <td>
                    {row.brandName || "—"}
                  </td>
                  <td>
                    {row.strength || "—"}
                  </td>
                  <td>
                    {row.pack || "—"}
                  </td>
                  <td>
                    {row.sku || "—"}
                  </td>
                  <td>
                    {row.division || "—"}
                  </td>
                  <td>
                    {row.uom || "—"}
                  </td>
                  <td>
                    <span style={{ 
                      padding: "2px 8px", 
                      borderRadius: "999px", 
                      fontSize: "11px", 
                      fontWeight: 600, 
                      background: row.status === "ACTIVE" ? "#10b98115" : "#ef444415", 
                      color: row.status === "ACTIVE" ? "#10b981" : "#ef4444",
                      border: row.status === "ACTIVE" ? "1px solid #10b98125" : "1px solid #ef444425"
                    }}>
                      {row.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} title="Edit" type="button">
                      <Pencil size={15} />
                    </button>
                  </td>
                  <td>
                    <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} title="Deactivate" type="button" disabled={row.status === "INACTIVE"}>
                      <Ban />
                    </button>
                  </td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={12} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
