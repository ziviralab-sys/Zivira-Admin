"use client";

import { Check, Pencil, Plus, RefreshCw, RotateCcw, SlidersHorizontal, Trash2, X, Repeat, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type DoctorQualification } from "@/lib/api-client";

// ─── Add / Edit Form ─────────────────────────────────────────────────────────
function QualificationForm({ row, onSave, onBack, saving, error }: { row: Partial<DoctorQualification>; onSave: (qualificationName: string) => void; onBack: () => void; saving: boolean; error: string | null }) {
  const [form, setForm] = useState({ qualificationName: row.qualificationName ?? "" });
  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Doctor Qualification" : "Add Doctor Qualification"}</h2>
          <p>Manage the qualification names used to classify doctors.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
        <label className="field">
          <span>* Qualification Name</span>
          <input autoFocus value={form.qualificationName} onChange={e => setForm({ qualificationName: e.target.value })} placeholder="e.g. MBBS MS" />
        </label>
        <button className="button" onClick={() => onSave(form.qualificationName)} type="button" disabled={saving || !form.qualificationName.trim()}>
          <Check size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
}

// ─── Bulk Edit View ───────────────────────────────────────────────────────────
function BulkEditView({ rows, onSave, onBack, saving }: { rows: DoctorQualification[]; onSave: (rows: { id: string; qualificationName: string }[]) => void; onBack: () => void; saving: boolean }) {
  const [draft, setDraft] = useState(rows.map(r => ({ id: r.id, qualificationName: r.qualificationName })));

  function update(id: string, val: string) {
    setDraft(d => d.map(r => r.id === id ? { ...r, qualificationName: val } : r));
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Bulk Operations</p>
          <h2>Bulk Edit — Doctor Qualification</h2>
          <p>Edit all qualification names in one go.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>S.No</th><th>Qualification Name</th></tr>
          </thead>
          <tbody>
            {draft.map((row, i) => (
              <tr key={row.id}>
                <td style={{ color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                <td><input className="subdivision-inline-input" style={{ width:"100%" }} value={row.qualificationName} onChange={e => update(row.id, e.target.value)} /></td>
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

// ─── Serial Number Generation View ───────────────────────────────────────────
function SerialNoGenView({ rows, onSave, onBack, saving }: { rows: DoctorQualification[]; onSave: (order: { id: string; sortOrder: number }[]) => void; onBack: () => void; saving: boolean }) {
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
    const order = rows.map(r => ({ id: r.id, sortOrder: parseInt(newNos[r.id] ?? "0", 10) || 0 }));
    onSave(order);
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Doctor Qualification — Serial No Generation</h2>
          <p>Assign new serial numbers to reorder the qualification list.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>Qualification Name</th><th>Existing S.No</th><th>New S.No</th></tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <td style={{ fontWeight:600, color:"var(--ink)" }}>{row.qualificationName}</td>
                <td style={{ color:"var(--muted)" }}>{i + 1}</td>
                <td>
                  <input
                    className="subdivision-inline-input"
                    style={{ width:"64px" }}
                    value={newNos[row.id] ?? ""}
                    onChange={e => setNewNos(n => ({ ...n, [row.id]: e.target.value }))}
                  />
                </td>
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

// ─── Transfer Qualification View (placeholder — no reference screenshot for this flow) ──
function TransferQualificationView({ onBack }: { onBack: () => void }) {
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Transfer Qualification</h2>
          <p>Move doctors in bulk from one qualification to another.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-table-card" style={{ textAlign:"center", padding:"48px", color:"var(--muted)" }}>
        <Repeat size={32} style={{ margin:"0 auto 12px", opacity:0.4 }} />
        <p style={{ margin:0, fontWeight:600 }}>Not yet available</p>
        <p style={{ margin:"4px 0 0", fontSize:"13px" }}>This legacy screen's exact form fields weren&apos;t captured in a reference screenshot, so this flow hasn&apos;t been built out yet.</p>
      </div>
    </section>
  );
}

// ─── Reactivation View ────────────────────────────────────────────────────────
function ReactivationView({ inactive, onReactivate, onBack }: { inactive: DoctorQualification[]; onReactivate: (id: string) => void; onBack: () => void }) {
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Doctor Qualification Reactivation</h2>
          <p>Restore previously deactivated doctor qualifications.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      {inactive.length === 0 ? (
        <div className="subdivision-table-card" style={{ textAlign:"center", padding:"48px", color:"var(--muted)" }}>
          <Stethoscope size={32} style={{ margin:"0 auto 12px", opacity:0.4 }} />
          <p style={{ margin:0, fontWeight:600 }}>No Records Found</p>
          <p style={{ margin:"4px 0 0", fontSize:"13px" }}>All doctor qualifications are currently active.</p>
        </div>
      ) : (
        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead>
              <tr><th>S.No</th><th>Qualification Name</th><th>Reactivate</th></tr>
            </thead>
            <tbody>
              {inactive.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ color:"var(--muted)" }}>{i + 1}</td>
                  <td style={{ fontWeight:600 }}>{row.qualificationName}</td>
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

// ─── Deactivate Confirm Dialog ────────────────────────────────────────────────
function DeactivateDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"var(--panel)", borderRadius:"16px", padding:"32px 28px", maxWidth:"400px", width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
          <span style={{ background:"#fef2f2", borderRadius:"50%", width:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Trash2 size={20} color="#ef4444" />
          </span>
          <div>
            <h3 style={{ margin:0, fontSize:"17px", fontWeight:700, color:"var(--ink)" }}>Deactivate Qualification?</h3>
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

// ─── Main Component ───────────────────────────────────────────────────────────
type View = "list" | "add" | "edit" | "bulkEdit" | "serialNo" | "transfer" | "reactivation";

export function DoctorQualificationMaster() {
  const [all, setAll] = useState<DoctorQualification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>("list");
  const [editTarget, setEditTarget] = useState<DoctorQualification | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<DoctorQualification | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<{ qualificationName: string } | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.doctorQualifications();
      setAll(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load doctor qualifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const rows = all.filter(r => r.status === "ACTIVE");
  const inactive = all.filter(r => r.status === "INACTIVE");

  function beginInline(row: DoctorQualification) { setInlineEditId(row.id); setDraftRow({ qualificationName: row.qualificationName }); }
  function cancelInline() { setInlineEditId(null); setDraftRow(null); }

  async function saveInline() {
    if (!inlineEditId || !draftRow) return;
    setSaving(true);
    try {
      await apiClient.updateDoctorQualification(inlineEditId, draftRow);
      await load();
      cancelInline();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update qualification");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveForm(qualificationName: string) {
    setSaving(true);
    setError(null);
    try {
      if (editTarget) {
        await apiClient.updateDoctorQualification(editTarget.id, { qualificationName });
      } else {
        await apiClient.createDoctorQualification({ qualificationName });
      }
      await load();
      setView("list");
      setEditTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save qualification");
    } finally {
      setSaving(false);
    }
  }

  async function handleBulkSave(draft: { id: string; qualificationName: string }[]) {
    setSaving(true);
    setError(null);
    try {
      await Promise.all(draft.map(d => apiClient.updateDoctorQualification(d.id, { qualificationName: d.qualificationName })));
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
      await Promise.all(order.map(o => apiClient.updateDoctorQualification(o.id, { sortOrder: o.sortOrder })));
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
      await apiClient.deactivateDoctorQualification(deactivateTarget.id);
      await load();
      setDeactivateTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate qualification");
    } finally {
      setSaving(false);
    }
  }

  async function handleReactivate(id: string) {
    setSaving(true);
    try {
      await apiClient.reactivateDoctorQualification(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reactivate qualification");
    } finally {
      setSaving(false);
    }
  }

  if (view === "add") return <QualificationForm row={{}} onSave={handleSaveForm} onBack={() => setView("list")} saving={saving} error={error} />;
  if (view === "edit" && editTarget) return <QualificationForm row={editTarget} onSave={handleSaveForm} onBack={() => { setView("list"); setEditTarget(null); }} saving={saving} error={error} />;
  if (view === "bulkEdit") return <BulkEditView rows={rows} onSave={handleBulkSave} onBack={() => setView("list")} saving={saving} />;
  if (view === "serialNo") return <SerialNoGenView rows={rows} onSave={handleSerialNoSave} onBack={() => setView("list")} saving={saving} />;
  if (view === "transfer") return <TransferQualificationView onBack={() => setView("list")} />;
  if (view === "reactivation") return <ReactivationView inactive={inactive} onReactivate={handleReactivate} onBack={() => setView("list")} />;

  return (
    <>
      {deactivateTarget && <DeactivateDialog name={deactivateTarget.qualificationName} onConfirm={handleDeactivate} onCancel={() => setDeactivateTarget(null)} />}

      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Master Setup</p>
            <h2>Doctor-Qualification</h2>
            <p>Create and manage the qualifications used to classify doctors.</p>
          </div>
          <div className="subdivision-actions">
            <button className="button button-secondary" onClick={() => setView("reactivation")} type="button"><RefreshCw size={16} /> Reactivation</button>
            <button className="button button-secondary" onClick={() => setView("transfer")} type="button"><Repeat size={16} /> Transfer Qualification</button>
            <button className="button button-secondary" onClick={() => setView("serialNo")} type="button"><SlidersHorizontal size={16} /> S.No Gen</button>
            <button className="button button-secondary" onClick={() => setView("bulkEdit")} type="button"><Pencil size={16} /> Bulk Edit</button>
            <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add</button>
          </div>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

        <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
          <article><span>Total Qualifications</span><strong>{rows.length}</strong></article>
          <article><span>Total Doctors</span><strong>{rows.reduce((s, r) => s + r.noOfDoctors, 0).toLocaleString()}</strong></article>
          <article><span>Inactive</span><strong>{inactive.length}</strong></article>
        </div>

        <div className="subdivision-table-card">
          <table className="subdivision-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Qualification Name</th>
                <th>No of Doctors</th>
                <th>Inline Edit</th>
                <th>Edit</th>
                <th>Deactivate</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>Loading...</td></tr>}
              {!loading && rows.map((row, i) => {
                const editing = inlineEditId === row.id && draftRow;
                return (
                  <tr key={row.id}>
                    <td style={{ color:"var(--muted)", fontWeight:500 }}>{i + 1}</td>
                    <td>
                      {editing
                        ? <input className="subdivision-inline-input" value={draftRow.qualificationName} onChange={e => setDraftRow({ qualificationName: e.target.value })} />
                        : <strong style={{ color:"var(--ink)" }}>{row.qualificationName}</strong>
                      }
                    </td>
                    <td>
                      <span style={{ background:"#eff6ff", borderRadius:"999px", padding:"3px 12px", fontSize:"12px", fontWeight:700, color:"#2563eb" }}>
                        {row.noOfDoctors.toLocaleString()}
                      </span>
                    </td>
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
              {!loading && rows.length === 0 && <tr><td colSpan={6} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No doctor qualifications yet</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
