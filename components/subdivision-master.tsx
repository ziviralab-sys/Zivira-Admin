"use client";

import type { Employee } from "@zivira/types";
import { Check, ChevronRight, ChevronDown, Package, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, Users, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { apiClient, type ProductCatalogItem } from "@/lib/api-client";
import { formatDate } from "@/lib/format-date";

type SubdivisionRow = { id: string; division: string; subdivisionName: string; productwiseCount: number; fieldforcewiseCount: number; status: "ACTIVE" | "INACTIVE"; };

const emptyFormRow: SubdivisionRow = { id: "", division: "", subdivisionName: "", productwiseCount: 0, fieldforcewiseCount: 0, status: "ACTIVE" };

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
            <Trash2 size={20} color="#ef4444" />
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
            <Trash2 size={14} /> Yes, Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

function toRow(s: { id: string; division: string; subdivisionName: string; productwiseCount: number; fieldforcewiseCount: number; status: "ACTIVE" | "INACTIVE" }): SubdivisionRow {
  const mapName = (val: string) => {
    if (!val) return val;
    if (val.toUpperCase() === "ZIVIRA LABS") return "Zivira";
    return val.replace(/Zivira Labs/gi, "Zivira");
  };
  return {
    id: s.id,
    division: mapName(s.division),
    subdivisionName: mapName(s.subdivisionName),
    productwiseCount: s.productwiseCount,
    fieldforcewiseCount: s.fieldforcewiseCount,
    status: s.status
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

  async function loadSubdivisions() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.subdivisions();
      setRows(res.data.filter(s => s.status === "ACTIVE").map(toRow));
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
      await apiClient.updateSubdivision(draftRow.id, { division: draftRow.division, subdivisionName: draftRow.subdivisionName });
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
        await apiClient.updateSubdivision(formRow.id, { division: formRow.division, subdivisionName: formRow.subdivisionName });
      } else {
        await apiClient.createSubdivision({ division: formRow.division, subdivisionName: formRow.subdivisionName });
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
          <div><p className="subdivision-eyebrow">Master Setup</p><h2>{formRow.id ? "Edit Sub-Division" : "Add Sub-Division"}</h2><p>Maintain short names and display names used across product and fieldforce mappings.</p></div>
          <button className="button button-secondary" onClick={() => setFormRow(null)} type="button"><RotateCcw size={16} /> Back</button>
        </div>
        <div className="subdivision-form-card">
          {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
          <label className="field"><span>Division</span><input autoFocus value={formRow.division} onChange={e => setFormRow({ ...formRow, division: e.target.value })} /></label>
          <label className="field"><span>Sub-Division Name</span><input value={formRow.subdivisionName} onChange={e => setFormRow({ ...formRow, subdivisionName: e.target.value })} /></label>
          <button className="button" onClick={saveForm} type="button" disabled={saving}><Check size={16} /> {saving ? "Saving..." : "Save"}</button>
        </div>
      </section>
    );
  }

  return (
    <>
      {deleteTarget && <DeleteConfirmDialog name={deleteTarget.subdivisionName} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div><p className="subdivision-eyebrow">Master Setup</p><h2>Sub-Division</h2><p>Create and manage business subdivisions used for product and fieldforce mapping.</p></div>
          <div className="subdivision-actions">
            <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
            <button className="button" onClick={openAddForm} type="button"><Plus size={16} /> Add</button>
          </div>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
        <div className="subdivision-stats">
          <article><span>Total Sub-Divisions</span><strong>{rows.length}</strong></article>
          <article><span>Productwise Count</span><strong>{rows.reduce((s,r) => s+r.productwiseCount, 0)}</strong></article>
          <article><span>Fieldforcewise Count</span><strong>{rows.reduce((s,r) => s+r.fieldforcewiseCount, 0)}</strong></article>
        </div>
        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead>
              <tr><th>S.No</th><th>Division</th><th>Sub Division Name</th><th>Productwise Count</th><th>Fieldforcewise Count</th><th>Inline Edit</th><th>Edit</th><th>Products</th><th>Field Force</th><th>Deactivate</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={10} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>Loading...</td></tr>}
              {!loading && rows.map((row, index) => {
                const editing = inlineEditId === row.id && draftRow;
                return (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{editing ? <input className="subdivision-inline-input" value={draftRow.division} onChange={e => setDraftRow({ ...draftRow, division: e.target.value })} /> : row.division}</td>
                    <td>{editing ? <input className="subdivision-inline-input" value={draftRow.subdivisionName} onChange={e => setDraftRow({ ...draftRow, subdivisionName: e.target.value })} /> : row.subdivisionName}</td>
                    <td>{row.productwiseCount}</td>
                    <td>{row.fieldforcewiseCount}</td>
                    <td>
                      {editing ? (
                        <span className="subdivision-inline-actions">
                           <button aria-label="Update" onClick={updateInlineEdit} title="Update" type="button" disabled={saving}><Check size={15} /></button>
                           <button aria-label="Cancel" onClick={cancelInlineEdit} title="Cancel" type="button" disabled={saving}><X size={15} /></button>
                        </span>
                      ) : (
                        <button className="subdivision-icon-button" onClick={() => beginInlineEdit(row)} title="Inline Edit" type="button"><Pencil size={15} /></button>
                      )}
                    </td>
                    <td><button className="subdivision-icon-button" onClick={() => openEditForm(row)} title="Edit" type="button"><Pencil size={15} /></button></td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => setProductwiseTarget(row.subdivisionName)} title="View Products" type="button" style={{ color:"#2563eb", display:"flex", alignItems:"center", gap:"2px" }}>
                        <Package size={15} /><ChevronRight size={13} />
                      </button>
                    </td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => setFieldforcewiseTarget(row.subdivisionName)} title="View Field Force" type="button" style={{ color:"#7c3aed", display:"flex", alignItems:"center", gap:"2px" }}>
                        <Users size={15} /><ChevronRight size={13} />
                      </button>
                    </td>
                    <td><button className="subdivision-danger-button" onClick={() => setDeleteTarget(row)} title="Deactivate" type="button"><Trash2 size={15} /></button></td>
                  </tr>
                );
              })}
              {!loading && rows.length === 0 && <tr><td colSpan={10} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No sub-divisions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// ─── Standalone Productwise View (for direct tab routing) ───────────────────

export function SubdivisionProductwise() {
  const [subdivisionOptions, setSubdivisionOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [products, setProducts] = useState<ProductCatalogItem[] | null>(null);
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
      const res = await apiClient.productCatalogByDivision(selected);
      setProducts(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  // Category = the product's therapy (ProductCatalogModel has no separate "group" concept —
  // the Excel workbook has no Group/Product Group sheet or column anywhere, so Group stays "—").
  const categories = [...new Set((products ?? []).map(p => p.therapy).filter((t): t is string => !!t))];

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — Productwise View</p>
          <h2>View - Productwise</h2>
          <p>Select a sub-division and click Go to view its product listing.</p>
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
          {products !== null && (
            <button className="button button-secondary" onClick={handlePrint} type="button" style={{ height: "38px" }}>
              Print
            </button>
          )}
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

      {products !== null && (
        <>
          <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
            <article><span>Total Products</span><strong>{products.length}</strong></article>
            <article><span>Categories</span><strong>{categories.length}</strong></article>
            <article><span>Sub-Division</span><strong>{selected}</strong></article>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {categories.map(cat => <CategoryBadge key={cat} category={cat} />)}
          </div>

          <div className="subdivision-table-card">
            <table className="subdivision-table">
              <thead>
                <tr><th>S.No</th><th>Product Name</th><th>Description</th><th>Sale Unit</th><th>Category</th><th>Group</th></tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.id}>
                    <td style={{ color: "#9ca3af", fontWeight: 500 }}>{index + 1}</td>
                    <td><strong style={{ color: "#111827" }}>{p.productName}</strong></td>
                    <td style={{ color: "#6b7280", fontSize: "13px" }}>{p.molecule ?? "—"}</td>
                    <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{p.saleUnit ?? "—"}</span></td>
                    <td>{p.therapy ? <CategoryBadge category={p.therapy} /> : "—"}</td>
                    <td>—</td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: "32px" }}>No products found</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

// ─── Standalone Fieldforcewise View (for direct tab routing) ─────────────────

export function SubdivisionFieldforcewise() {
  const [subdivisionOptions, setSubdivisionOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [rows, setRows] = useState<Employee[] | null>(null);
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
      const res = await apiClient.employeesByDivision(selected);
      setRows(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load field force");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const designations = [...new Set((rows ?? []).map(r => r.designation))];

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Subdivision — FieldForce View</p>
          <h2>View - Field Forcewise</h2>
          <p>Select a sub-division and click Go to view its field force members.</p>
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
          {rows !== null && (
            <button className="button button-secondary" onClick={handlePrint} type="button" style={{ height: "38px" }}>
              Print
            </button>
          )}
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

      {rows !== null && (
        <>
          <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
            <article><span>Total Field Force</span><strong>{rows.length}</strong></article>
            <article><span>Designation Types</span><strong>{designations.length}</strong></article>
            <article><span>Sub-Division</span><strong>{selected}</strong></article>
          </div>

          <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
            <table className="subdivision-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Employee Name</th>
                  <th>Date of Birth</th>
                  <th>Email ID</th>
                  <th>Mobile Contact Number</th>
                  <th>Division</th>
                  <th>Role Name</th>
                  <th>Employee Code</th>
                  <th>Join Date</th>
                  <th>Address 1</th>
                  <th>Landmark</th>
                  <th>Location</th>
                  <th>City</th>
                  <th>State Name</th>
                  <th>Country</th>
                  <th>Postal Code</th>
                  <th>HQ / Territory</th>
                  <th>L1 Reporting Manager Code</th>
                  <th>L1 Division</th>
                  <th>L1 Role</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, index) => (
                  <tr key={r.id}>
                    <td style={{ color: "#9ca3af", fontWeight: 500 }}>{index + 1}</td>
                    <td><strong style={{ color: "#111827" }}>{r.name}</strong></td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{formatDate(r.dob)}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.email ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.phone ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.division ?? "—"}</td>
                    <td><DesignationBadge designation={r.designation} /></td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.employeeCode ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{formatDate(r.joinDate)}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.address1 ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.landmark ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.location ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.city ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.state ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.country ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.postalCode ?? "—"}</td>
                    <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>{r.territory ?? "—"}</span></td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.reportingManager ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.l1Division ?? "—"}</td>
                    <td style={{ fontSize: "13px", color: "#6b7280" }}>{r.l1Role ?? "—"}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={20} style={{ textAlign: "center", color: "#9ca3af", padding: "32px" }}>No field force found</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
