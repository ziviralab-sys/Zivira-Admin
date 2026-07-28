"use client";

import { Check, Pencil, Plus, RefreshCw, RotateCcw, SlidersHorizontal, Trash2, X, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type ProductCatalogItem } from "@/lib/api-client";

type FormFields = { productCode: string; productName: string; description: string; saleUnit: string };

function ProductForm({ row, onSave, onBack, saving, error }: { row: Partial<ProductCatalogItem>; onSave: (f: FormFields) => void; onBack: () => void; saving: boolean; error: string | null }) {
  const [form, setForm] = useState<FormFields>({
    productCode: row.productCode ?? "",
    productName: row.productName ?? "",
    description: row.description ?? "",
    saleUnit: row.saleUnit ?? ""
  });
  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
          <p>Maintain the master product catalog.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
        <label className="field"><span>Product Code</span><input autoFocus value={form.productCode} onChange={e => setForm(f => ({ ...f, productCode: e.target.value }))} placeholder="e.g. ZL_PRD_01" /></label>
        <label className="field"><span>* Product Name</span><input value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value }))} placeholder="e.g. ZIVIFRESH" /></label>
        <label className="field"><span>Description</span><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. CARBOXYMETHYL CELLULOSE" /></label>
        <label className="field"><span>Sale Unit</span><input value={form.saleUnit} onChange={e => setForm(f => ({ ...f, saleUnit: e.target.value }))} placeholder="e.g. 10 ML" /></label>
        <button className="button" onClick={() => onSave(form)} type="button" disabled={saving || !form.productName.trim()}>
          <Check size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
}

function BulkEditView({ rows, onSave, onBack, saving }: { rows: ProductCatalogItem[]; onSave: (rows: { id: string; productName: string; description: string }[]) => void; onBack: () => void; saving: boolean }) {
  const [draft, setDraft] = useState(rows.map(r => ({ id: r.id, productName: r.productName, description: r.description ?? "" })));

  function update(id: string, field: "productName" | "description", val: string) {
    setDraft(d => d.map(r => r.id === id ? { ...r, [field]: val } : r));
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Bulk Operations</p>
          <h2>Edit All Products</h2>
          <p>Edit all product names and descriptions in one go.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>S.No</th><th>Product Name</th><th>Description</th></tr></thead>
          <tbody>
            {draft.map((row, i) => (
              <tr key={row.id}>
                <td style={{ color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                <td><input className="subdivision-inline-input" style={{ width:"100%" }} value={row.productName} onChange={e => update(row.id, "productName", e.target.value)} /></td>
                <td><input className="subdivision-inline-input" style={{ width:"100%" }} value={row.description} onChange={e => update(row.id, "description", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:"20px" }}>
        <button className="button" onClick={() => onSave(draft)} type="button" disabled={saving}><Check size={16} /> {saving ? "Saving..." : "Update"}</button>
      </div>
    </section>
  );
}

function SerialNoGenView({ rows, onSave, onBack, saving }: { rows: ProductCatalogItem[]; onSave: (order: { id: string; sortOrder: number }[]) => void; onBack: () => void; saving: boolean }) {
  const [newNos, setNewNos] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState(false);

  function generate() {
    const auto: Record<string, string> = {};
    rows.forEach((r, i) => { auto[r.id] = String(i + 1); });
    setNewNos(auto);
    setGenerated(true);
  }
  function clear() { setNewNos({}); setGenerated(false); }
  function save() {
    onSave(rows.map(r => ({ id: r.id, sortOrder: parseInt(newNos[r.id] ?? "0", 10) || 0 })));
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Product — Serial No Generation</h2>
          <p>Assign new serial numbers to reorder the product list.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>Product Name</th><th>Existing S.No</th><th>New S.No</th></tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <td style={{ fontWeight:600, color:"var(--ink)" }}>{row.productName}</td>
                <td style={{ color:"var(--muted)" }}>{i + 1}</td>
                <td><input className="subdivision-inline-input" style={{ width:"64px" }} value={newNos[row.id] ?? ""} onChange={e => setNewNos(n => ({ ...n, [row.id]: e.target.value }))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:"20px", display:"flex", gap:"10px" }}>
        {!generated
          ? <button className="button" onClick={generate} type="button"><RefreshCw size={16} /> Generate - Sl No</button>
          : <button className="button" onClick={save} type="button" disabled={saving}><Check size={16} /> {saving ? "Saving..." : "Save"}</button>
        }
        <button className="button button-secondary" onClick={clear} type="button"><X size={16} /> Clear</button>
      </div>
    </section>
  );
}

function ReactivationView({ inactive, onReactivate, onBack }: { inactive: ProductCatalogItem[]; onReactivate: (id: string) => void; onBack: () => void }) {
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Product Reactivation</h2>
          <p>Restore previously deactivated products.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      {inactive.length === 0 ? (
        <div className="subdivision-table-card" style={{ textAlign:"center", padding:"48px", color:"var(--muted)" }}>
          <Package size={32} style={{ margin:"0 auto 12px", opacity:0.4 }} />
          <p style={{ margin:0, fontWeight:600 }}>No Records Found</p>
          <p style={{ margin:"4px 0 0", fontSize:"13px" }}>All products are currently active.</p>
        </div>
      ) : (
        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead><tr><th>S.No</th><th>Product Name</th><th>Reactivate</th></tr></thead>
            <tbody>
              {inactive.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ color:"var(--muted)" }}>{i + 1}</td>
                  <td style={{ fontWeight:600 }}>{row.productName}</td>
                  <td>
                    <button className="button" onClick={() => onReactivate(row.id)} type="button" style={{ padding:"5px 14px", fontSize:"12px" }}>
                      <RefreshCw size={13} /> Reactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function DeactivateDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"var(--panel)", borderRadius:"16px", padding:"32px 28px", maxWidth:"400px", width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
          <span style={{ background:"#fef2f2", borderRadius:"50%", width:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Trash2 size={20} color="#ef4444" />
          </span>
          <div>
            <h3 style={{ margin:0, fontSize:"17px", fontWeight:700, color:"var(--ink)" }}>Deactivate Product?</h3>
            <p style={{ margin:"4px 0 0", fontSize:"13px", color:"var(--muted)" }}>This can be reversed via Reactivation.</p>
          </div>
        </div>
        <p style={{ fontSize:"14px", color:"var(--ink)", margin:"0 0 24px", lineHeight:1.6 }}>
          Are you sure you want to deactivate <strong>{name}</strong>?
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

type View = "list" | "add" | "edit" | "bulkEdit" | "serialNo" | "reactivation";

export function ProductDetailMaster() {
  const [all, setAll] = useState<ProductCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>("list");
  const [editTarget, setEditTarget] = useState<ProductCatalogItem | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<ProductCatalogItem | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<{ productName: string; description: string } | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.productCatalog();
      setAll(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const rows = all.filter(r => r.status === "ACTIVE");
  const inactive = all.filter(r => r.status === "INACTIVE");

  function beginInline(row: ProductCatalogItem) { setInlineEditId(row.id); setDraftRow({ productName: row.productName, description: row.description ?? "" }); }
  function cancelInline() { setInlineEditId(null); setDraftRow(null); }

  async function saveInline() {
    if (!inlineEditId || !draftRow) return;
    setSaving(true);
    try {
      await apiClient.updateProductCatalogItem(inlineEditId, draftRow);
      await load();
      cancelInline();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveForm(f: FormFields) {
    setSaving(true);
    setError(null);
    try {
      const payload = { productCode: f.productCode || null, productName: f.productName, description: f.description || null, saleUnit: f.saleUnit || null };
      if (editTarget) {
        await apiClient.updateProductCatalogItem(editTarget.id, payload);
      } else {
        await apiClient.createProductCatalogItem(payload);
      }
      await load();
      setView("list");
      setEditTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleBulkSave(draft: { id: string; productName: string; description: string }[]) {
    setSaving(true);
    setError(null);
    try {
      await Promise.all(draft.map(d => apiClient.updateProductCatalogItem(d.id, { productName: d.productName, description: d.description })));
      await load();
      setView("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleSerialNoSave(order: { id: string; sortOrder: number }[]) {
    setSaving(true);
    setError(null);
    try {
      await Promise.all(order.map(o => apiClient.updateProductCatalogItem(o.id, { sortOrder: o.sortOrder })));
      await load();
      setView("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save serial numbers");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!deactivateTarget) return;
    setSaving(true);
    try {
      await apiClient.deactivateProductCatalogItem(deactivateTarget.id);
      await load();
      setDeactivateTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate product");
    } finally {
      setSaving(false);
    }
  }

  async function handleReactivate(id: string) {
    setSaving(true);
    try {
      await apiClient.reactivateProductCatalogItem(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reactivate product");
    } finally {
      setSaving(false);
    }
  }

  if (view === "add") return <ProductForm row={{}} onSave={handleSaveForm} onBack={() => setView("list")} saving={saving} error={error} />;
  if (view === "edit" && editTarget) return <ProductForm row={editTarget} onSave={handleSaveForm} onBack={() => { setView("list"); setEditTarget(null); }} saving={saving} error={error} />;
  if (view === "bulkEdit") return <BulkEditView rows={rows} onSave={handleBulkSave} onBack={() => setView("list")} saving={saving} />;
  if (view === "serialNo") return <SerialNoGenView rows={rows} onSave={handleSerialNoSave} onBack={() => setView("list")} saving={saving} />;
  if (view === "reactivation") return <ReactivationView inactive={inactive} onReactivate={handleReactivate} onBack={() => setView("list")} />;

  return (
    <>
      {deactivateTarget && <DeactivateDialog name={deactivateTarget.productName} onConfirm={handleDeactivate} onCancel={() => setDeactivateTarget(null)} />}
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Master Setup</p>
            <h2>Product Detail</h2>
            <p>Create and manage the master product catalog.</p>
          </div>
          <div className="subdivision-actions">
            <button className="button button-secondary" onClick={() => setView("reactivation")} type="button"><RefreshCw size={16} /> Reactivation</button>
            <button className="button button-secondary" onClick={() => setView("serialNo")} type="button"><SlidersHorizontal size={16} /> S.No Gen</button>
            <button className="button button-secondary" onClick={() => setView("bulkEdit")} type="button"><Pencil size={16} /> Edit All Products</button>
            <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Product</button>
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

        <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
          <article><span>Total Products</span><strong>{rows.length}</strong></article>
          <article><span>Inactive</span><strong>{inactive.length}</strong></article>
        </div>

        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead>
              <tr>
                <th>Sl. No</th><th>Product Name</th><th>Brand Name</th><th>Molecule</th><th>Description</th><th>Sale Unit</th>
                <th>Inline Edit</th><th>Edit</th><th>Deactivate</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>Loading...</td></tr>}
              {!loading && rows.map((row, i) => {
                const editing = inlineEditId === row.id && draftRow;
                const productDetailsMap: Record<string, { brandName: string; molecule: string }> = {
                  "BEPREX": { brandName: "BEPREX", molecule: "BEPOTASTINE BESILATE" },
                  "BRINZIA": { brandName: "BRINZIA", molecule: "BRINZOLAMIDE AND BRIMONIDINE TARTRATE" },
                  "BRITIVIN": { brandName: "BRITIVIN", molecule: "BRIMONIDINE TARTRATE AND TIMOLOL MALEATE" },
                  "CIZIA": { brandName: "CIZIA", molecule: "CYCLOSPORINE IP" },
                  "DEXNOVA": { brandName: "DEXNOVA", molecule: "DEXAMETHASONE SODIUM PHOSPHATE IP" },
                  "DORVISA T": { brandName: "DORVISA T", molecule: "DORZOLAMIDE HYDROCHLORIDE IP AND TIMOLOL MALEATE IP" },
                  "DUCIDROP": { brandName: "DUCIDROP", molecule: "HYDROXYPROPYL METHYLCELLULOSE IP" },
                  "DECIRA GEL": { brandName: "DECIRA GEL", molecule: "HYDROXYPROPYL METHYLCELLULOSE IP" },
                  "ENVISA": { brandName: "ENVISA", molecule: "LUTEIN, ASTAXANTHIN AND L-GLUTATHIONE" },
                  "FOMIRA": { brandName: "FOMIRA", molecule: "POLYETHYLENE GLYCOL AND PROPYLENE GLYCOL IP" },
                  "LATOPROST": { brandName: "LATOPROST", molecule: "LATANOPROST" },
                  "LOTIVIZ": { brandName: "LOTIVIZ", molecule: "LOTEPREDNOL ETABONATE" },
                  "MACUMER": { brandName: "MACUMER", molecule: "LUTEIN, ZEAXANTHIN AND MESOZEAXANTHIN" },
                  "NEPAWEL": { brandName: "NEPAWEL", molecule: "NEPAFENAC" },
                  "PATVIRA": { brandName: "PATVIRA", molecule: "OLOPATADINE HYDROCHLORIDE IP" },
                  "PREDIRA": { brandName: "PREDIRA", molecule: "PREDNISOLONE ACETATE IP" },
                  "STRIOS": { brandName: "STRIOS", molecule: "PURIFIED WATER GAMMA STERILISED WIPES" },
                  "TIMOBEST": { brandName: "TIMOBEST", molecule: "TIMOLOL MALEATE IP" },
                  "TIZTA": { brandName: "TIZTA", molecule: "SODIUM HYALURONATE BP" },
                  "TIZTA LIQUIGEL": { brandName: "TIZTA LIQUIGEL", molecule: "SODIUM HYALURONATE BP, TREHALOSE AND CARBOMER" },
                  "TOBRAWIN": { brandName: "TOBRAWIN", molecule: "TOBRAMYCIN SULFATE USP" },
                  "TOBRAWIN LP": { brandName: "TOBRAWIN LP", molecule: "TOBRAMYCIN SULFATE USP AND LOTEPREDNOL ETABONATE" }
                };
                const display = productDetailsMap[row.productName.toUpperCase()] || { brandName: row.productName, molecule: "GENERIC MOLECULE" };
                return (
                  <tr key={row.id}>
                    <td style={{ color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                    <td>
                      {editing
                        ? <input className="subdivision-inline-input" value={draftRow.productName} onChange={e => setDraftRow({ ...draftRow, productName: e.target.value })} />
                        : <strong style={{ color:"var(--ink)" }}>{row.productName}</strong>
                      }
                    </td>
                    <td style={{ color:"var(--muted)" }}>{display.brandName}</td>
                    <td style={{ color:"var(--muted)", fontSize:"13px" }}>{display.molecule}</td>
                    <td>
                      {editing
                        ? <input className="subdivision-inline-input" value={draftRow.description} onChange={e => setDraftRow({ ...draftRow, description: e.target.value })} />
                        : <span style={{ color:"var(--muted)", fontSize:"13px" }}>{row.description ?? "—"}</span>
                      }
                    </td>
                    <td style={{ color:"var(--muted)" }}>{row.saleUnit ?? "—"}</td>
                    <td>
                      {editing ? (
                        <span className="subdivision-inline-actions">
                          <button aria-label="Update" onClick={saveInline} title="Update" type="button" disabled={saving}><Check size={15} /></button>
                          <button aria-label="Cancel" onClick={cancelInline} title="Cancel" type="button" disabled={saving}><X size={15} /></button>
                        </span>
                      ) : (
                        <button className="subdivision-icon-button" onClick={() => beginInline(row)} title="Inline Edit" type="button"><Pencil size={15} /></button>
                      )}
                    </td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} title="Edit" type="button"><Pencil size={15} /></button>
                    </td>
                    <td>
                      <button className="subdivision-danger-button" onClick={() => setDeactivateTarget(row)} title="Deactivate" type="button"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                );
              })}
              {!loading && rows.length === 0 && <tr><td colSpan={9} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No products yet</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
