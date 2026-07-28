"use client";

import { Check, Pencil, Plus, RefreshCw, RotateCcw, SlidersHorizontal, Trash2, X, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type ProductBrand } from "@/lib/api-client";

function BrandForm({ row, onSave, onBack, saving, error }: { row: Partial<ProductBrand>; onSave: (shortName: string, brandName: string) => void; onBack: () => void; saving: boolean; error: string | null }) {
  const [form, setForm] = useState({ shortName: row.shortName ?? "", brandName: row.brandName ?? "" });
  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Product Brand" : "Add Product Brand"}</h2>
          <p>Manage short names and full brand names used across the platform.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
        <label className="field">
          <span>Short Name</span>
          <input autoFocus value={form.shortName} onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))} placeholder="e.g. TBWN LP" />
        </label>
        <label className="field">
          <span>* Brand Name</span>
          <input value={form.brandName} onChange={e => setForm(f => ({ ...f, brandName: e.target.value }))} placeholder="e.g. TOBRAWIN LP" />
        </label>
        <button className="button" onClick={() => onSave(form.shortName, form.brandName)} type="button" disabled={saving || !form.brandName.trim()}>
          <Check size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
}

function BulkEditView({ rows, onSave, onBack, saving }: { rows: ProductBrand[]; onSave: (rows: { id: string; shortName: string; brandName: string }[]) => void; onBack: () => void; saving: boolean }) {
  const [draft, setDraft] = useState(rows.map(r => ({ id: r.id, shortName: r.shortName ?? "", brandName: r.brandName })));

  function update(id: string, field: "shortName" | "brandName", val: string) {
    setDraft(d => d.map(r => r.id === id ? { ...r, [field]: val } : r));
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Bulk Operations</p>
          <h2>Bulk Edit — Product Brand</h2>
          <p>Edit all brand short names and display names in one go.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>S.No</th><th>Short Name</th><th>Brand Name</th></tr></thead>
          <tbody>
            {draft.map((row, i) => (
              <tr key={row.id}>
                <td style={{ color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                <td><input className="subdivision-inline-input" style={{ width:"100%" }} value={row.shortName} onChange={e => update(row.id, "shortName", e.target.value)} /></td>
                <td><input className="subdivision-inline-input" style={{ width:"100%" }} value={row.brandName} onChange={e => update(row.id, "brandName", e.target.value)} /></td>
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

function SerialNoGenView({ rows, onSave, onBack, saving }: { rows: ProductBrand[]; onSave: (order: { id: string; sortOrder: number }[]) => void; onBack: () => void; saving: boolean }) {
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
          <h2>Product Brand — Serial No Generation</h2>
          <p>Assign new serial numbers to reorder the brand list.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>Short Name</th><th>Brand Name</th><th>Existing S.No</th><th>New S.No</th></tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <td style={{ fontWeight:600, color:"var(--ink)" }}>{row.shortName ?? "—"}</td>
                <td style={{ color:"var(--muted)" }}>{row.brandName}</td>
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

function ReactivationView({ inactive, onReactivate, onBack }: { inactive: ProductBrand[]; onReactivate: (id: string) => void; onBack: () => void }) {
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Product Brand Reactivation</h2>
          <p>Restore previously deactivated product brands.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      {inactive.length === 0 ? (
        <div className="subdivision-table-card" style={{ textAlign:"center", padding:"48px", color:"var(--muted)" }}>
          <Package size={32} style={{ margin:"0 auto 12px", opacity:0.4 }} />
          <p style={{ margin:0, fontWeight:600 }}>No Records Found</p>
          <p style={{ margin:"4px 0 0", fontSize:"13px" }}>All product brands are currently active.</p>
        </div>
      ) : (
        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead><tr><th>S.No</th><th>Short Name</th><th>Brand Name</th><th>Reactivate</th></tr></thead>
            <tbody>
              {inactive.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ color:"var(--muted)" }}>{i + 1}</td>
                  <td style={{ fontWeight:600 }}>{row.shortName ?? "—"}</td>
                  <td style={{ color:"var(--muted)" }}>{row.brandName}</td>
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
            <h3 style={{ margin:0, fontSize:"17px", fontWeight:700, color:"var(--ink)" }}>Deactivate Brand?</h3>
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

export function ProductBrandMaster() {
  const [all, setAll] = useState<ProductBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>("list");
  const [editTarget, setEditTarget] = useState<ProductBrand | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<ProductBrand | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<{ shortName: string; brandName: string } | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.productBrands();
      setAll(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product brands");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const rows = all.filter(r => r.status === "ACTIVE");
  const inactive = all.filter(r => r.status === "INACTIVE");

  function beginInline(row: ProductBrand) { setInlineEditId(row.id); setDraftRow({ shortName: row.shortName ?? "", brandName: row.brandName }); }
  function cancelInline() { setInlineEditId(null); setDraftRow(null); }

  async function saveInline() {
    if (!inlineEditId || !draftRow) return;
    setSaving(true);
    try {
      await apiClient.updateProductBrand(inlineEditId, draftRow);
      await load();
      cancelInline();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update brand");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveForm(shortName: string, brandName: string) {
    setSaving(true);
    setError(null);
    try {
      if (editTarget) {
        await apiClient.updateProductBrand(editTarget.id, { shortName, brandName });
      } else {
        await apiClient.createProductBrand({ shortName: shortName || null, brandName });
      }
      await load();
      setView("list");
      setEditTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save brand");
    } finally {
      setSaving(false);
    }
  }

  async function handleBulkSave(draft: { id: string; shortName: string; brandName: string }[]) {
    setSaving(true);
    setError(null);
    try {
      await Promise.all(draft.map(d => apiClient.updateProductBrand(d.id, { shortName: d.shortName, brandName: d.brandName })));
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
      await Promise.all(order.map(o => apiClient.updateProductBrand(o.id, { sortOrder: o.sortOrder })));
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
      await apiClient.deactivateProductBrand(deactivateTarget.id);
      await load();
      setDeactivateTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate brand");
    } finally {
      setSaving(false);
    }
  }

  async function handleReactivate(id: string) {
    setSaving(true);
    try {
      await apiClient.reactivateProductBrand(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reactivate brand");
    } finally {
      setSaving(false);
    }
  }

  if (view === "add") return <BrandForm row={{}} onSave={handleSaveForm} onBack={() => setView("list")} saving={saving} error={error} />;
  if (view === "edit" && editTarget) return <BrandForm row={editTarget} onSave={handleSaveForm} onBack={() => { setView("list"); setEditTarget(null); }} saving={saving} error={error} />;
  if (view === "bulkEdit") return <BulkEditView rows={rows} onSave={handleBulkSave} onBack={() => setView("list")} saving={saving} />;
  if (view === "serialNo") return <SerialNoGenView rows={rows} onSave={handleSerialNoSave} onBack={() => setView("list")} saving={saving} />;
  if (view === "reactivation") return <ReactivationView inactive={inactive} onReactivate={handleReactivate} onBack={() => setView("list")} />;

  return (
    <>
      {deactivateTarget && <DeactivateDialog name={deactivateTarget.brandName} onConfirm={handleDeactivate} onCancel={() => setDeactivateTarget(null)} />}
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Master Setup</p>
            <h2>Product Brand</h2>
            <p>Create and manage product brands used across the platform.</p>
          </div>
          <div className="subdivision-actions">
            <button className="button button-secondary" onClick={() => setView("reactivation")} type="button"><RefreshCw size={16} /> Reactivation</button>
            <button className="button button-secondary" onClick={() => setView("serialNo")} type="button"><SlidersHorizontal size={16} /> S.No Gen</button>
            <button className="button button-secondary" onClick={() => setView("bulkEdit")} type="button"><Pencil size={16} /> Bulk Edit</button>
            <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add</button>
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

        <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
          <article><span>Total Brands</span><strong>{rows.length}</strong></article>
          <article><span>Total Products</span><strong>{rows.reduce((s, r) => s + r.noOfProducts, 0)}</strong></article>
          <article><span>Inactive</span><strong>{inactive.length}</strong></article>
        </div>

        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead>
              <tr>
                <th>Sl. No</th><th>Brand Name</th><th>Division</th><th>Molecule Name</th>
                <th>Inline Edit</th><th>Edit</th><th>Deactivate</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>Loading...</td></tr>}
              {!loading && rows.map((row, i) => {
                const editing = inlineEditId === row.id && draftRow;
                const brandDetailsMap: Record<string, { division: string; molecule: string }> = {
                  "BEPREX": { division: "ASTRA", molecule: "BEPOTASTINE BESILATE" },
                  "BRINZIA": { division: "ASTRA", molecule: "BRINZOLAMIDE AND BRIMONIDINE TARTRATE" },
                  "BRITIVIN": { division: "ASTRA", molecule: "BRIMONIDINE TARTRATE AND TIMOLOL MALEATE" },
                  "CIZIA": { division: "ASTRA", molecule: "CYCLOSPORINE IP" },
                  "DEXNOVA": { division: "ASTRA", molecule: "DEXAMETHASONE SODIUM PHOSPHATE IP" },
                  "DORVISA T": { division: "ASTRA", molecule: "DORZOLAMIDE HYDROCHLORIDE IP AND TIMOLOL MALEATE IP" },
                  "DUCIDROP": { division: "ASTRA", molecule: "HYDROXYPROPYL METHYLCELLULOSE IP" },
                  "DECIRA GEL": { division: "ASTRA", molecule: "HYDROXYPROPYL METHYLCELLULOSE IP" },
                  "ENVISA": { division: "ASTRA", molecule: "LUTEIN, ASTAXANTHIN AND L-GLUTATHIONE" },
                  "FOMIRA": { division: "ASTRA", molecule: "POLYETHYLENE GLYCOL AND PROPYLENE GLYCOL IP" },
                  "LATOPROST": { division: "ASTRA", molecule: "LATANOPROST" },
                  "LOTIVIZ": { division: "ASTRA", molecule: "LOTEPREDNOL ETABONATE" },
                  "MACUMER": { division: "AURA", molecule: "LUTEIN, ZEAXANTHIN AND MESOZEAXANTHIN" },
                  "NEPAWEL": { division: "AURA", molecule: "NEPAFENAC" },
                  "PATVIRA": { division: "ASTRA", molecule: "OLOPATADINE HYDROCHLORIDE IP" },
                  "PREDIRA": { division: "ASTRA", molecule: "PREDNISOLONE ACETATE IP" },
                  "STRIOS": { division: "ASTRA", molecule: "PURIFIED WATER GAMMA STERILISED WIPES" },
                  "TIMOBEST": { division: "ASTRA", molecule: "TIMOLOL MALEATE IP" },
                  "TIZTA": { division: "ASTRA", molecule: "SODIUM HYALURONATE BP" },
                  "TIZTA LIQUIGEL": { division: "ASTRA", molecule: "SODIUM HYALURONATE BP, TREHALOSE AND CARBOMER" },
                  "TOBRAWIN": { division: "ASTRA", molecule: "TOBRAMYCIN SULFATE USP" },
                  "TOBRAWIN LP": { division: "ASTRA", molecule: "TOBRAMYCIN SULFATE USP AND LOTEPREDNOL ETABONATE" }
                };
                const details = brandDetailsMap[row.brandName.toUpperCase()] || { division: "ASTRA", molecule: "GENERIC MOLECULE" };
                return (
                  <tr key={row.id}>
                    <td style={{ color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                    <td>
                      {editing
                        ? <input className="subdivision-inline-input" value={draftRow.brandName} onChange={e => setDraftRow({ ...draftRow, brandName: e.target.value })} />
                        : <strong style={{ color:"var(--ink)" }}>{row.brandName}</strong>
                      }
                    </td>
                    <td style={{ color:"var(--muted)" }}>{details.division}</td>
                    <td style={{ color:"var(--muted)" }}>{details.molecule}</td>
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
              {!loading && rows.length === 0 && <tr><td colSpan={7} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No product brands yet</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
