"use client";

import { StatusFilterDropdown } from "@/components/status-filter-dropdown";
import type { Employee } from "@zivira/types";
import { Check, ChevronRight, ChevronDown, Package, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, Users, X, Ban } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { apiClient, type ProductCatalogItem } from "@/lib/api-client";
import { formatDate } from "@/lib/format-date";

type SubdivisionRow = { id: string; division: string; subdivisionName: string; productwiseCount: number; fieldforcewiseCount: number; status: "ACTIVE" | "INACTIVE"; description?: string; };

const emptyFormRow: SubdivisionRow = { id: "", division: "Astra", subdivisionName: "AST", productwiseCount: 0, fieldforcewiseCount: 0, status: "ACTIVE", description: "" };

const designationColors: Record<string, string> = {
  "ZONAL BUSINESS MANAGER": "#7c3aed",
  "REGIONAL BUSINESS MANAGER": "#2563eb",
  "AREA BUSINESS MANAGER": "#0891b2",
  "BUSINESS EXECUTIVE": "#10b981",
  "SENIOR BUSINESS EXECUTIVE": "#059669",
  "SALES MANAGER": "#d97706",
  "MARKETING HEAD": "#db2777",
  "BUSINESS HEAD": "#dc2626",
  "BUSINESS RELATIONSHIP MANAGER SOUTH INDIA": "#9333ea"
};

const categoryColors: Record<string, string> = {
  "ANTI-ALLERGY":"#3b82f6","ANTI-GLAUCOMA":"#10b981","TEAR SUBSTITUTE":"#06b6d4",
  "NSAID":"#f59e0b","CORTICOSTEROID":"#8b5cf6","ANTI-OXIDANT":"#ec4899",
  "ANTI-INFECTIVE":"#ef4444","ANTI-INFECTIVE+STEROID COMB":"#f97316",
  "STERILE WIPES":"#6b7280","SPREADING AGENT":"#84cc16"
};

function DesignationBadge({ designation }: { designation: string }) {
  const short = designation.replace("BUSINESS EXECUTIVE","BE").replace("AREA BUSINESS MANAGER","ABM").replace("REGIONAL BUSINESS MANAGER","RBM").replace("ZONAL BUSINESS MANAGER","ZBM").replace("SALES MANAGER","SM").replace("MARKETING HEAD","MH").replace("BUSINESS HEAD","BH").replace("SENIOR BUSINESS EXECUTIVE","Sr. BE");
  const color = designationColors[designation] ?? "#6b7280";
  return (
    <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"999px", fontSize:"11px", fontWeight:600, background:`${color}15`, color, border:`1px solid ${color}25`, whiteSpace:"nowrap" }}>
      {short}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const color = categoryColors[category] ?? "#6b7280";
  return <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"999px", fontSize:"11px", fontWeight:600, background:`${color}18`, color, border:`1px solid ${color}30` }}>{category}</span>;
}

function FieldForceView({ subdivisionName, onBack }: { subdivisionName: string; onBack: () => void }) {
  const [rows, setRows] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClient.employeesByDivision(subdivisionName).then(res => setRows(res.data)).catch(() => setRows([]));
  }, [subdivisionName]);

  const designations = [...new Set(rows.map(r => r.designation))];
  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.territory ?? "").toLowerCase().includes(search.toLowerCase()) ||
    r.designation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — FieldForce View</p>
          <h2>{subdivisionName}</h2>
          <p>{rows.length} field force members across {designations.length} designations</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
        <article><span>Total Field Force</span><strong>{rows.length}</strong></article>
        <article><span>Designation Types</span><strong>{designations.length}</strong></article>
        <article><span>Sub-Division</span><strong>{subdivisionName}</strong></article>
      </div>
      <div style={{ marginBottom:"16px" }}>
        <input
          placeholder="Search by name, HQ or designation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:"100%", maxWidth:"360px", padding:"8px 14px", borderRadius:"8px", border:"1px solid #e5e7eb", fontSize:"14px", outline:"none" }}
        />
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>S.No</th><th>FieldForce Name</th><th>Designation</th><th>HQ</th><th>Reporting To</th></tr>
          </thead>
          <tbody>
            {filtered.map((r, index) => (
              <tr key={r.id}>
                <td style={{ color:"var(--muted)", fontWeight:500 }}>{index + 1}</td>
                <td><strong style={{ color:"var(--ink)" }}>{r.name}</strong></td>
                <td><DesignationBadge designation={r.designation} /></td>
                <td><span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"6px", background:"var(--line)", fontSize:"12px", fontWeight:600, color:"var(--ink)" }}>{r.territory ?? "—"}</span></td>
                <td style={{ fontSize:"13px", color:"var(--muted)" }}>{r.reportingManager ?? "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No results found</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProductwiseView({ subdivisionName, onBack }: { subdivisionName: string; onBack: () => void }) {
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);

  useEffect(() => {
    apiClient.productCatalogByDivision(subdivisionName).then(res => setProducts(res.data)).catch(() => setProducts([]));
  }, [subdivisionName]);

  // Category = the product's therapy. Group has no source anywhere in the Excel workbook
  // (confirmed by an exhaustive cell-level scan of all 21 sheets) so it stays "—".
  const categories = [...new Set(products.map(p => p.therapy).filter((t): t is string => !!t))];
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — Productwise View</p>
          <h2>{subdivisionName}</h2>
          <p>{products.length} products across {categories.length} categories</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
        <article><span>Total Products</span><strong>{products.length}</strong></article>
        <article><span>Categories</span><strong>{categories.length}</strong></article>
        <article><span>Sub-Division</span><strong>{subdivisionName}</strong></article>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"16px" }}>
        {categories.map(cat => <CategoryBadge key={cat} category={cat} />)}
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>S.No</th><th>Product Name</th><th>Description</th><th>Sale Unit</th><th>Category</th><th>Group</th></tr></thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.id}>
                <td style={{ color:"var(--muted)", fontWeight:500 }}>{index + 1}</td>
                <td><strong style={{ color:"var(--ink)" }}>{p.productName}</strong></td>
                <td style={{ color:"var(--muted)", fontSize:"13px" }}>{p.molecule ?? "—"}</td>
                <td><span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"6px", background:"var(--line)", fontSize:"12px", fontWeight:600, color:"var(--ink)" }}>{p.saleUnit ?? "—"}</span></td>
                <td>{p.therapy ? <CategoryBadge category={p.therapy} /> : "—"}</td>
                <td>—</td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={6} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No products found</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeleteConfirmDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"var(--panel)", borderRadius:"16px", padding:"32px 28px", maxWidth:"400px", width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
          <span style={{ background:"#fef2f2", borderRadius:"50%", width:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ban />
          </span>
          <div>
            <h3 style={{ margin:0, fontSize:"17px", fontWeight:700, color:"var(--ink)" }}>Deactivate Sub-Division?</h3>
            <p style={{ margin:"4px 0 0", fontSize:"13px", color:"var(--muted)" }}>This action cannot be undone.</p>
          </div>
        </div>
        <p style={{ fontSize:"14px", color:"var(--ink)", margin:"0 0 24px", lineHeight:1.6 }}>
          Are you sure you want to deactivate <strong>{name}</strong>? All associated product and fieldforce mappings will be affected.
        </p>
        <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end" }}>
          <button className="button button-secondary" onClick={onCancel} type="button">Cancel</button>
          <button onClick={onConfirm} type="button" style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 18px", borderRadius:"8px", border:"none", background:"#ef4444", color:"#fff", fontWeight:600, fontSize:"14px", cursor:"pointer" }}>
            <Ban /> Yes, Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

function toRow(s: any): SubdivisionRow {
  const mapName = (val: string) => {
    if (!val) return val;
    if (val.toUpperCase() === "ZIVIRA LABS" || val.toUpperCase() === "ZIVIRA EAST") return "Zivira";
    return val.replace(/Zivira Labs/gi, "Zivira");
  };
  return {
    id: s.id,
    division: mapName(s.division || "Astra"),
    subdivisionName: mapName(s.subdivisionName || "AST"),
    productwiseCount: s.productwiseCount || 0,
    fieldforcewiseCount: s.fieldforcewiseCount || 0,
    status: s.status || "ACTIVE",
    description: s.description || ""
  };
}

export function SubdivisionMaster() {
  const [rows, setRows] = useState<SubdivisionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<SubdivisionRow | null>(null);
  const [formRow, setFormRow] = useState<SubdivisionRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubdivisionRow | null>(null);
  const [productwiseTarget, setProductwiseTarget] = useState<string | null>(null);
  const [fieldforcewiseTarget, setFieldforcewiseTarget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [divisionFilter, setDivisionFilter] = useState<string>("All");
  const [divisionFilterOpen, setDivisionFilterOpen] = useState(false);
  const [subdivisionNameFilter, setSubdivisionNameFilter] = useState<string>("All");
  const [subdivisionNameFilterOpen, setSubdivisionNameFilterOpen] = useState(false);

  const displayedRows = rows.filter(r => {
    if (statusFilter !== "All") {
      if (statusFilter === "Active" && r.status !== "ACTIVE") return false;
      if (statusFilter === "Inactive" && r.status !== "INACTIVE") return false;
    }
    if (divisionFilter !== "All" && r.division !== divisionFilter) return false;
    if (subdivisionNameFilter !== "All" && r.subdivisionName !== subdivisionNameFilter) return false;
    return true;
  });

  async function loadSubdivisions() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.subdivisions();
      setRows(res.data.map(toRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sub-divisions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSubdivisions(); }, []);

  function beginInlineEdit(row: SubdivisionRow) { setInlineEditId(row.id); setDraftRow({ ...row }); setFormRow(null); }
  function cancelInlineEdit() { setInlineEditId(null); setDraftRow(null); }

  async function updateInlineEdit() {
    if (!draftRow) return;
    setSaving(true);
    try {
      await apiClient.updateSubdivision(draftRow.id, { 
        division: draftRow.division, 
        subdivisionName: draftRow.subdivisionName,
        status: draftRow.status,
        description: draftRow.description
      } as any);
      await loadSubdivisions();
      cancelInlineEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sub-division");
    } finally {
      setSaving(false);
    }
  }

  function openEditForm(row: SubdivisionRow) { setFormRow({ ...row }); cancelInlineEdit(); }
  function openAddForm() { setFormRow({ ...emptyFormRow }); cancelInlineEdit(); }

  async function saveForm() {
    if (!formRow) return;
    setSaving(true);
    setError(null);
    try {
      if (formRow.id) {
        await apiClient.updateSubdivision(formRow.id, { 
          division: formRow.division, 
          subdivisionName: formRow.subdivisionName,
          status: formRow.status,
          description: formRow.description
        } as any);
      } else {
        await apiClient.createSubdivision({ 
          division: formRow.division, 
          subdivisionName: formRow.subdivisionName,
          status: formRow.status,
          description: formRow.description
        } as any);
      }
      await loadSubdivisions();
      setFormRow(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save sub-division");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await apiClient.deactivateSubdivision(deleteTarget.id);
      setRows(c => c.filter(r => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate sub-division");
    } finally {
      setSaving(false);
    }
  }

  if (fieldforcewiseTarget) return <FieldForceView subdivisionName={fieldforcewiseTarget} onBack={() => setFieldforcewiseTarget(null)} />;
  if (productwiseTarget) return <ProductwiseView subdivisionName={productwiseTarget} onBack={() => setProductwiseTarget(null)} />;

  if (formRow) {
    return (
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div><p className="subdivision-eyebrow">Master Setup</p><h2>{formRow.id ? "Edit Division Master" : "Add Division Master"}</h2><p>Maintain divisions and status information.</p></div>
          <button className="button button-secondary" onClick={() => setFormRow(null)} type="button"><RotateCcw size={16} /> Back</button>
        </div>
        <div className="subdivision-form-card">
          {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
          <label className="field">
            <span>Division Name</span>
            <select 
              value={formRow.division} 
              onChange={e => setFormRow({ ...formRow, division: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            >
              <option value="Astra">Astra</option>
              <option value="Aura">Aura</option>
              <option value="Zivira">Zivira</option>
            </select>
          </label>
          <label className="field">
            <span>Division Short Name</span>
            <select
              value={formRow.subdivisionName}
              onChange={e => setFormRow({ ...formRow, subdivisionName: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            >
              <option value="AST">AST</option>
              <option value="AUR">AUR</option>
              <option value="ZIV">ZIV</option>
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select 
              value={formRow.status} 
              onChange={e => setFormRow({ ...formRow, status: e.target.value as "ACTIVE" | "INACTIVE" })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          <button className="button" onClick={saveForm} type="button" disabled={saving}><Check size={16} /> {saving ? "Saving..." : "Add Division"}</button>
        </div>
      </section>
    );
  }

  return (
    <>
      {deleteTarget && <DeleteConfirmDialog name={deleteTarget.subdivisionName} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div><p className="subdivision-eyebrow">Master Setup</p><h2>Division Master</h2><p>Create and manage business divisions.</p></div>
          <div className="subdivision-actions">
            
            <button className="button" onClick={openAddForm} type="button"><Plus size={16} /> Add Division</button>
          </div>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
        <div className="subdivision-stats">
          <article><span>Total Divisions</span><strong>{rows.length}</strong></article>
        </div>
        <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
          <table className="subdivision-table">
            <thead>
              <tr>
                <th>Division Code</th>
                <th style={{ minWidth: "160px", position: "relative" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Division Name</span>
                    <button
                      type="button"
                      onClick={() => setDivisionFilterOpen(!divisionFilterOpen)}
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
                  {divisionFilterOpen && (
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
                        minWidth: "120px",
                        display: "flex",
                        flexDirection: "column",
                        padding: "4px 0"
                      }}
                    >
                      {["Astra", "Aura", "Zivira"].map((div) => (
                        <button
                          key={div}
                          type="button"
                          onClick={() => { setDivisionFilter(div); setDivisionFilterOpen(false); }}
                          style={{
                            padding: "6px 12px",
                            textAlign: "left",
                            background: divisionFilter === div ? "var(--line)" : "none",
                            border: "none",
                            color: "var(--ink)",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontWeight: divisionFilter === div ? 600 : 400
                          }}
                        >
                          {div}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => { setDivisionFilter("All"); setDivisionFilterOpen(false); }}
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
                <th style={{ minWidth: "180px", position: "relative" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Division Short Name</span>
                    <button
                      type="button"
                      onClick={() => setSubdivisionNameFilterOpen(!subdivisionNameFilterOpen)}
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
                  {subdivisionNameFilterOpen && (
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
                        minWidth: "120px",
                        display: "flex",
                        flexDirection: "column",
                        padding: "4px 0"
                      }}
                    >
                      {["AST", "AUR", "ZIV"].map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => { setSubdivisionNameFilter(sub); setSubdivisionNameFilterOpen(false); }}
                          style={{
                            padding: "6px 12px",
                            textAlign: "left",
                            background: subdivisionNameFilter === sub ? "var(--line)" : "none",
                            border: "none",
                            color: "var(--ink)",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontWeight: subdivisionNameFilter === sub ? 600 : 400
                          }}
                        >
                          {sub}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => { setSubdivisionNameFilter("All"); setSubdivisionNameFilterOpen(false); }}
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
                <th style={{ minWidth: "140px" }}>
                  <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
                </th>
                <th>Edit</th>
                <th>Inactive</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>Loading...</td></tr>}
              {!loading && displayedRows.map((row, index) => {
                const editing = inlineEditId === row.id && draftRow;
                return (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600 }}>DOC{String(index + 1).padStart(4, "0")}</td>
                    <td>
                      {editing ? (
                        <select 
                          value={draftRow.division} 
                          onChange={e => setDraftRow({ ...draftRow, division: e.target.value })}
                          className="subdivision-inline-input"
                          style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc", background: "var(--panel)" }}
                        >
                          <option value="Astra">Astra</option>
                          <option value="Aura">Aura</option>
                          <option value="Zivira">Zivira</option>
                        </select>
                      ) : row.division}
                    </td>
                    <td>
                      {editing ? (
                        <select
                          value={draftRow.subdivisionName}
                          onChange={e => setDraftRow({ ...draftRow, subdivisionName: e.target.value })}
                          className="subdivision-inline-input"
                          style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc", background: "var(--panel)" }}
                        >
                          <option value="AST">AST</option>
                          <option value="AUR">AUR</option>
                          <option value="ZIV">ZIV</option>
                        </select>
                      ) : row.subdivisionName}
                    </td>
                    <td>
                      {editing ? (
                        <select 
                          value={draftRow.status} 
                          onChange={e => setDraftRow({ ...draftRow, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                          className="subdivision-inline-input"
                          style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc", background: "var(--panel)" }}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      ) : (
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
                      )}
                    </td>
                    <td>
                      {editing ? (
                        <span className="subdivision-inline-actions">
                           <button aria-label="Update" onClick={updateInlineEdit} title="Update" type="button" disabled={saving}><Check size={15} /></button>
                           <button aria-label="Cancel" onClick={cancelInlineEdit} title="Cancel" type="button" disabled={saving}><X size={15} /></button>
                        </span>
                      ) : (
                        <button className="subdivision-icon-button" onClick={() => openEditForm(row)} title="Edit" type="button"><Pencil size={15} /></button>
                      )}
                    </td>
                    <td><button className="subdivision-danger-button" onClick={() => setDeleteTarget(row)} title="Deactivate" type="button"><Ban /></button></td>
                  </tr>
                );
              })}
              {!loading && rows.length === 0 && <tr><td colSpan={6} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No divisions found</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// ─── Standalone Productwise View (for direct tab routing) ───────────────────

// Regional Zone Master mock data mapped by subdivision name
const mockRegionsData: Record<string, Array<{ zoneName: string; regionName: string; regionCode: string; state: string; manager: string }>> = {
  "ZIVIRA EAST": [
    { zoneName: "East Zone", regionName: "Zivira East Region", regionCode: "REG-ZIV-E01", state: "West Bengal", manager: "Rahul Sharma" },
    { zoneName: "East Zone", regionName: "Kolkata Region", regionCode: "REG-ZIV-E02", state: "West Bengal", manager: "Priya Nair" }
  ],
  "ZIVIRA WEST": [
    { zoneName: "West Zone", regionName: "Mumbai Region", regionCode: "REG-ZIV-W01", state: "Maharashtra", manager: "Arvind Kumar" }
  ],
  "ZIVIRA": [
    { zoneName: "South Zone", regionName: "Tamil Nadu Region", regionCode: "REG-ZIV-S01", state: "Tamil Nadu", manager: "Karthik Iyer" }
  ],
  "ASTRA": [
    { zoneName: "South Zone", regionName: "Chennai Region", regionCode: "REG-AST-S01", state: "Tamil Nadu", manager: "Vignesh Raj" },
    { zoneName: "North Zone", regionName: "Delhi Region", regionCode: "REG-AST-N01", state: "Delhi", manager: "Meena Patel" }
  ],
  "AURA": [
    { zoneName: "South Zone", regionName: "Hyderabad Region", regionCode: "REG-AUR-S01", state: "Telangana", manager: "Anil Reddy" }
  ]
};

export function SubdivisionProductwise() {
  const [subdivisionOptions, setSubdivisionOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [regions, setRegions] = useState<Array<{ zoneName: string; regionName: string; regionCode: string; state: string; manager: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    apiClient.subdivisions()
      .then(res => {
        const seen = new Set<string>();
        const names = res.data
          .filter(s => s.status === "ACTIVE")
          .map(s => s.division)
          .filter(name => {
            const key = name.toUpperCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        setSubdivisionOptions(names);
        if (names.length > 0) setSelected(names[0]);
      })
      .catch(err => setError(err instanceof Error ? err.message : "Failed to load sub-divisions"));
  }, []);

  async function handleGo() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      // Simulate API fetch delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const key = selected.toUpperCase();
      const matched = mockRegionsData[key] || [
        { zoneName: "South Zone", regionName: `${selected} Region`, regionCode: `REG-${selected.slice(0, 3).toUpperCase()}-001`, state: "Tamil Nadu", manager: "Priya Nair" }
      ];
      setRegions(matched);
    } catch (err) {
      setError("Failed to load region/zone details");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — Regional Zone Master</p>
          <h2>Regional Zone Master</h2>
          <p>Select a subdivision and click Go to view its regional zone configurations.</p>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <span style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "var(--ink)" }}>Sub Division Name</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div ref={dropdownRef} className="command-select" style={{ position: "relative" }}>
            <button
              className="command-select-button"
              style={{
                width: "220px",
                height: "38px",
                minHeight: "38px",
                paddingLeft: "16px",
                position: "relative"
              }}
              onClick={() => setOpenMenu(!openMenu)}
              type="button"
            >
              <span>{selected || "Select Sub Division"}</span>
              <ChevronDown size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
            </button>
            {openMenu && (
              <div className="command-select-menu" style={{ width: "220px", top: "calc(100% + 6px)" }}>
                {subdivisionOptions.length === 0 && (
                  <button className="command-select-option" disabled type="button">
                    <span>No sub-divisions</span>
                  </button>
                )}
                {subdivisionOptions.map(name => (
                  <button
                     key={name}
                    className={selected === name ? "command-select-option command-select-option-active" : "command-select-option"}
                    onClick={() => { setSelected(name); setOpenMenu(false); }}
                    type="button"
                  >
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="button" onClick={handleGo} type="button" disabled={!selected || loading} style={{ height: "38px" }}>
            {loading ? "Loading..." : "Go"}
          </button>
          {regions.length > 0 && (
            <button className="button button-secondary" onClick={handlePrint} type="button" style={{ height: "38px" }}>
              Print
            </button>
          )}
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

      <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
        <article><span>Total Regional Zones</span><strong>{regions.length}</strong></article>
        <article><span>Sub-Division</span><strong>{selected || "—"}</strong></article>
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Zone Name</th>
              <th>Region Name</th>
              <th>Region Code</th>
              <th>State</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((r, index) => (
              <tr key={index}>
                <td style={{ color: "#9ca3af", fontWeight: 500 }}>{index + 1}</td>
                <td><strong style={{ color: "#111827" }}>{r.zoneName}</strong></td>
                <td>{r.regionName}</td>
                <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{r.regionCode}</span></td>
                <td>{r.state}</td>
                <td>{r.manager}</td>
              </tr>
            ))}
            {regions.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: "32px" }}>No regions found</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Standalone Fieldforcewise View (for direct tab routing) ─────────────────

// Territory / Headquarters Master mock data
const mockHQData: Record<string, Array<{ hqCode: string; hqName: string; state: string; city: string; metroType: string; zone: string; region: string; patchName: string }>> = {
  "ZIVIRA EAST": [
    { hqCode: "HQ-ZIV-E01", hqName: "Kolkata Central HQ", state: "West Bengal", city: "Kolkata", metroType: "Metro", zone: "East", region: "West Bengal Region", patchName: "Salt Lake Patch" },
    { hqCode: "HQ-ZIV-E02", hqName: "Kolkata North HQ", state: "West Bengal", city: "Kolkata", metroType: "Metro", zone: "East", region: "West Bengal Region", patchName: "Howrah Patch" }
  ],
  "ASTRA": [
    { hqCode: "HQ0001", hqName: "Chennai Central HQ", state: "Tamil Nadu", city: "Chennai", metroType: "Metro", zone: "South", region: "Tamil Nadu Region", patchName: "T. Nagar Patch" },
    { hqCode: "HQ0002", hqName: "Chennai North HQ", state: "Tamil Nadu", city: "Chennai", metroType: "Metro", zone: "South", region: "Tamil Nadu Region", patchName: "Anna Nagar Patch" },
    { hqCode: "HQ0003", hqName: "Coimbatore HQ", state: "Tamil Nadu", city: "Coimbatore", metroType: "Non-Metro", zone: "South", region: "Tamil Nadu Region", patchName: "Gandhipuram Patch" }
  ],
  "AURA": [
    { hqCode: "HQ0005", hqName: "Hyderabad HQ", state: "Telangana", city: "Hyderabad", metroType: "Metro", zone: "South", region: "Telangana Region", patchName: "Banjara Hills Patch" }
  ],
  "ZIVIRA": [
    { hqCode: "HQ0004", hqName: "Bengaluru HQ", state: "Karnataka", city: "Bengaluru", metroType: "Metro", zone: "South", region: "Karnataka Region", patchName: "Indiranagar Patch" }
  ]
};

export function SubdivisionFieldforcewise() {
  const [subdivisionOptions, setSubdivisionOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [hqs, setHqs] = useState<Array<{ hqCode: string; hqName: string; state: string; city: string; metroType: string; zone: string; region: string; patchName: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    apiClient.subdivisions()
      .then(res => {
        const seen = new Set<string>();
        const names = res.data
          .filter(s => s.status === "ACTIVE")
          .map(s => s.division)
          .filter(name => {
            const key = name.toUpperCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        setSubdivisionOptions(names);
        if (names.length > 0) setSelected(names[0]);
      })
      .catch(err => setError(err instanceof Error ? err.message : "Failed to load sub-divisions"));
  }, []);

  async function handleGo() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      // Simulate API fetch delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const key = selected.toUpperCase();
      const matched = mockHQData[key] || [
        { hqCode: "HQ9999", hqName: `${selected} General HQ`, state: "Tamil Nadu", city: "Chennai", metroType: "Metro", zone: "South", region: `${selected} Region`, patchName: "General Patch" }
      ];
      setHqs(matched);
    } catch (err) {
      setError("Failed to load headquarters/territory details");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — Territory / Headquarters Master</p>
          <h2>Territory / Headquarters Master</h2>
          <p>Select a subdivision and click Go to view its territory and HQ configurations.</p>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <span style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "6px", color: "var(--ink)" }}>Sub Division Name</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div ref={dropdownRef} className="command-select" style={{ position: "relative" }}>
            <button
              className="command-select-button"
              style={{
                width: "220px",
                height: "38px",
                minHeight: "38px",
                paddingLeft: "16px",
                position: "relative"
              }}
              onClick={() => setOpenMenu(!openMenu)}
              type="button"
            >
              <span>{selected || "Select Sub Division"}</span>
              <ChevronDown size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
            </button>
            {openMenu && (
              <div className="command-select-menu" style={{ width: "220px", top: "calc(100% + 6px)" }}>
                {subdivisionOptions.length === 0 && (
                  <button className="command-select-option" disabled type="button">
                    <span>No sub-divisions</span>
                  </button>
                )}
                {subdivisionOptions.map(name => (
                  <button
                    key={name}
                    className={selected === name ? "command-select-option command-select-option-active" : "command-select-option"}
                    onClick={() => { setSelected(name); setOpenMenu(false); }}
                    type="button"
                  >
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="button" onClick={handleGo} type="button" disabled={!selected || loading} style={{ height: "38px" }}>
            {loading ? "Loading..." : "Go"}
          </button>
          {hqs.length > 0 && (
            <button className="button button-secondary" onClick={handlePrint} type="button" style={{ height: "38px" }}>
              Print
            </button>
          )}
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

      <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
        <article><span>Total Headquarters</span><strong>{hqs.length}</strong></article>
        <article><span>Sub-Division</span><strong>{selected || "—"}</strong></article>
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>HQ Code</th>
              <th>Headquarters Name</th>
              <th>State</th>
              <th>City</th>
              <th>Metro / Non-Metro</th>
              <th>Zone</th>
              <th>Region</th>
              <th>Patch Name</th>
            </tr>
          </thead>
          <tbody>
            {hqs.map((h, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{h.hqCode}</td>
                <td><strong style={{ color: "#111827" }}>{h.hqName}</strong></td>
                <td>{h.state}</td>
                <td>{h.city}</td>
                <td>
                  <span style={{ 
                    padding: "2px 8px", 
                    borderRadius: "6px", 
                    background: h.metroType === "Metro" ? "#3b82f615" : "#6b728015", 
                    fontSize: "12px", 
                    fontWeight: 600, 
                    color: h.metroType === "Metro" ? "#3b82f6" : "#6b7280" 
                  }}>
                    {h.metroType}
                  </span>
                </td>
                <td>{h.zone}</td>
                <td>{h.region}</td>
                <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{h.patchName}</span></td>
              </tr>
            ))}
            {hqs.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", color: "#9ca3af", padding: "32px" }}>No territories found</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
