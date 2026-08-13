"use client";

import { Check, Pencil, Plus, RefreshCw, RotateCcw, SlidersHorizontal, Trash2, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type ProductBrand } from "@/lib/api-client";

// Mock database mappings to initialize the additional fields for existing brands
const initialBrandDetails: Record<string, { division: string; molecule: string; therapy: string }> = {
  "BEPREX": { division: "Astra", molecule: "BEPOTASTINE BESILATE", therapy: "ANTI-ALLERGIC" },
  "BRINZIA": { division: "Astra", molecule: "BRINZOLAMIDE AND BRIMONIDINE TARTRATE", therapy: "ANTI-GLAUCOMA" },
  "BRITIVIN": { division: "Astra", molecule: "BRIMONIDINE TARTRATE AND TIMOLOL MALEATE", therapy: "ANTI-GLAUCOMA" },
  "CIZIA": { division: "Astra", molecule: "CYCLOSPORINE IP", therapy: "TEAR SUBSTITUTE" },
  "DEXNOVA": { division: "Astra", molecule: "DEXAMETHASONE SODIUM PHOSPHATE IP", therapy: "CORTICOSTEROID" },
  "DORVISA T": { division: "Astra", molecule: "DORZOLAMIDE HYDROCHLORIDE IP AND TIMOLOL MALEATE IP", therapy: "ANTI-GLAUCOMA" },
  "DUCIDROP": { division: "Astra", molecule: "HYDROXYPROPYL METHYLCELLULOSE IP", therapy: "TEAR SUBSTITUTE" },
  "DECIRA GEL": { division: "Astra", molecule: "HYDROXYPROPYL METHYLCELLULOSE IP", therapy: "TEAR SUBSTITUTE" },
  "ENVISA": { division: "Astra", molecule: "LUTEIN, ASTAXANTHIN AND L-GLUTATHIONE", therapy: "ANTI-OXIDANT" },
  "FOMIRA": { division: "Astra", molecule: "POLYETHYLENE GLYCOL AND PROPYLENE GLYCOL IP", therapy: "TEAR SUBSTITUTE" },
  "LATOPROST": { division: "Astra", molecule: "LATANOPROST", therapy: "ANTI-GLAUCOMA" },
  "LOTIVIZ": { division: "Astra", molecule: "LOTEPREDNOL ETABONATE", therapy: "CORTICOSTEROID" },
  "MACUMER": { division: "Ara", molecule: "LUTEIN, ZEAXANTHIN AND MESOZEAXANTHIN", therapy: "ANTI-OXIDANT" },
  "NEPAWEL": { division: "Ara", molecule: "NEPAFENAC", therapy: "NSAID" },
  "PATVIRA": { division: "Astra", molecule: "OLOPATADINE HYDROCHLORIDE IP", therapy: "ANTI-ALLERGIC" },
  "PREDIRA": { division: "Astra", molecule: "PREDNISOLONE ACETATE IP", therapy: "CORTICOSTEROID" },
  "STRIOS": { division: "Astra", molecule: "PURIFIED WATER GAMMA STERILISED WIPES", therapy: "STERILE WIPES" },
  "TIMOBEST": { division: "Astra", molecule: "TIMOLOL MALEATE IP", therapy: "ANTI-GLAUCOMA" },
  "TIZTA": { division: "Astra", molecule: "SODIUM HYALURONATE BP", therapy: "TEAR SUBSTITUTE" },
  "TIZTA LIQUIGEL": { division: "Astra", molecule: "SODIUM HYALURONATE BP, TREHALOSE AND CARBOMER", therapy: "TEAR SUBSTITUTE" },
  "TOBRAWIN": { division: "Astra", molecule: "TOBRAMYCIN SULFATE USP", therapy: "ANTI-INFECTIVE" },
  "TOBRAWIN LP": { division: "Astra", molecule: "TOBRAMYCIN SULFATE USP AND LOTEPREDNOL ETABONATE", therapy: "ANTI-INFECTIVE+STEROID COMB" }
};

type FormRow = {
  id: string;
  brandName: string;
  molecule: string;
  therapy: string;
  division: string;
  status: "ACTIVE" | "INACTIVE";
};

const emptyFormRow: FormRow = {
  id: "",
  brandName: "",
  molecule: "",
  therapy: "",
  division: "Astra",
  status: "ACTIVE"
};

function BrandForm({ row, onSave, onBack, saving, error }: { row: any; onSave: (row: FormRow) => void; onBack: () => void; saving: boolean; error: string | null }) {
  const [form, setForm] = useState<FormRow>({
    id: row.id ?? "",
    brandName: row.brandName ?? "",
    molecule: row.molecule ?? "",
    therapy: row.therapy ?? "",
    division: row.division ?? "Astra",
    status: row.status ?? "ACTIVE"
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Brand Master" : "Add Brand Master"}</h2>
          <p>Configure product brand mapping details.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
        <label className="field">
          <span>* Brand Name</span>
          <input value={form.brandName} onChange={e => setForm({ ...form, brandName: e.target.value })} placeholder="e.g. Zivifresh" />
        </label>
        <label className="field">
          <span>* Molecule</span>
          <input value={form.molecule} onChange={e => setForm({ ...form, molecule: e.target.value })} placeholder="e.g. Paracetamol" />
        </label>
        <label className="field">
          <span>* Therapy</span>
          <input value={form.therapy} onChange={e => setForm({ ...form, therapy: e.target.value })} placeholder="e.g. Pain Management" />
        </label>
        <label className="field">
          <span>* Division</span>
          <select 
            value={form.division} 
            onChange={e => setForm({ ...form, division: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Astra">Astra</option>
            <option value="Ara">Ara</option>
            <option value="Zivira">Zivira</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={saving || !form.brandName.trim() || !form.molecule.trim()}>
          <Check size={16} /> {saving ? "Saving..." : "Add Brand"}
        </button>
      </div>
    </section>
  );
}

export function ProductBrandMaster() {
  const [all, setAll] = useState<ProductBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<ProductBrand | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<FormRow | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.productBrands();
      // Map mock data properties onto the fetched brands
      const mapped = res.data.map(b => {
        const key = b.brandName.toUpperCase();
        const details = initialBrandDetails[key] || { division: "Astra", molecule: "Generic Molecule", therapy: "General" };
        return {
          ...b,
          molecule: b.molecule || details.molecule,
          therapy: b.therapy || details.therapy,
          division: b.division || details.division
        };
      });
      setAll(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product brands");
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

  function beginInline(row: ProductBrand) { 
    setInlineEditId(row.id); 
    setDraftRow({ 
      id: row.id,
      brandName: row.brandName, 
      molecule: row.molecule ?? "", 
      therapy: row.therapy ?? "", 
      division: row.division ?? "Astra", 
      status: row.status 
    }); 
  }
  
  function cancelInline() { setInlineEditId(null); setDraftRow(null); }

  async function saveInline() {
    if (!inlineEditId || !draftRow) return;
    setSaving(true);
    try {
      setAll(all.map(b => b.id === inlineEditId ? {
        ...b,
        brandName: draftRow.brandName,
        molecule: draftRow.molecule,
        therapy: draftRow.therapy,
        division: draftRow.division,
        status: draftRow.status
      } : b));
      cancelInline();
    } catch (err) {
      setError("Failed to update brand");
    } finally {
      setSaving(false);
    }
  }

  function handleSaveForm(form: FormRow) {
    setSaving(true);
    if (view === "add") {
      const newBrand: ProductBrand = {
        id: Math.random().toString(36).slice(2, 9),
        brandName: form.brandName,
        molecule: form.molecule,
        therapy: form.therapy,
        division: form.division,
        noOfProducts: 0,
        status: form.status
      };
      setAll([newBrand, ...all]);
    } else {
      setAll(all.map(b => b.id === form.id ? {
        ...b,
        brandName: form.brandName,
        molecule: form.molecule,
        therapy: form.therapy,
        division: form.division,
        status: form.status
      } : b));
    }
    setSaving(false);
    setView("list");
  }

  function handleDeactivate(id: string) {
    setAll(all.map(b => b.id === id ? { ...b, status: "INACTIVE" as const } : b));
  }

  if (view === "add") return <BrandForm row={{}} onSave={handleSaveForm} onBack={() => setView("list")} saving={saving} error={error} />;
  if (view === "edit" && editTarget) return <BrandForm row={editTarget} onSave={handleSaveForm} onBack={() => { setView("list"); setEditTarget(null); }} saving={saving} error={error} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Brand Master</h2>
          <p>Create and manage product brands used across the platform.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Brand</button>
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

      <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
        <article><span>Total Brands</span><strong>{rows.length}</strong></article>
        <article><span>Active Brands</span><strong>{rows.filter(r => r.status === "ACTIVE").length}</strong></article>
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Brand Code</th>
              <th>Brand Name</th>
              <th>Molecule</th>
              <th>Therapy</th>
              <th>Division</th>
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
              <th>Deactivate</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>Loading...</td></tr>}
            {!loading && rows.map((row, i) => {
              return (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>ZIV-BR-{String(i + 1).padStart(3, "0")}</td>
                  <td>
                    <strong style={{ color:"var(--ink)" }}>{row.brandName}</strong>
                  </td>
                  <td>
                    {row.molecule || "—"}
                  </td>
                  <td>
                    {row.therapy || "—"}
                  </td>
                  <td>
                    {row.division}
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
                    <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} title="Edit" type="button"><Pencil size={15} /></button>
                  </td>
                  <td>
                    <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} title="Deactivate" type="button" disabled={row.status === "INACTIVE"}><Trash2 size={15} /></button>
                  </td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && <tr><td colSpan={8} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No product brands yet</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
