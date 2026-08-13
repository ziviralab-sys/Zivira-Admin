"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient, type DoctorCategory } from "@/lib/api-client";

type FormRow = {
  id: string;
  doctorName: string;
  qualification: string;
  specialty: string;
  registrationNumber: string;
  status: "ACTIVE" | "INACTIVE";
};

const emptyFormRow: FormRow = {
  id: "",
  doctorName: "",
  qualification: "",
  specialty: "",
  registrationNumber: "",
  status: "ACTIVE"
};

function DoctorForm({ row, onSave, onBack, saving, error, nextCode }: { row: any; onSave: (f: FormRow) => void; onBack: () => void; saving: boolean; error: string | null; nextCode?: string }) {
  const [form, setForm] = useState<FormRow>({
    id: row.id ?? "",
    doctorName: row.categoryName ?? "",
    qualification: row.qualification ?? "",
    specialty: row.specialty ?? "",
    registrationNumber: row.registrationNumber ?? "",
    status: row.status ?? "ACTIVE"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{row.id ? "Edit Doctor Master" : "Add Doctor Master"}</h2>
          <p>Configure general doctor details.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
        <label className="field">
          <span>Doctor Code</span>
          <input value={nextCode} disabled style={{ opacity: 0.7, cursor: "not-allowed" }} />
        </label>
        <label className="field">
          <span>* Doctor Name</span>
          <input value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} placeholder="Dr. Rajesh Kumar" />
        </label>
        <label className="field">
          <span>Qualification</span>
          <input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} placeholder="MBBS, MD" />
        </label>
        <label className="field">
          <span>Specialty</span>
          <input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="General Physician" />
        </label>
        <label className="field">
          <span>Registration Number</span>
          <input value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} placeholder="TMMC123456" />
        </label>
        <label className="field">
          <span>Status</span>
          <select 
            value={form.status} 
            onChange={e => setForm({ ...form, status: e.target.value as "ACTIVE" | "INACTIVE" })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={saving || !form.doctorName.trim()}>
          <Check size={16} /> Add Doctor
        </button>
      </div>
    </section>
  );
}

export function DoctorCategoryMaster() {
  const [all, setAll] = useState<DoctorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<DoctorCategory | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<FormRow | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.doctorCategories();
      const mapped = res.data.map((d, i) => ({
        ...d,
        qualification: d.qualification || (i % 2 === 0 ? "MBBS, MD" : "MBBS, MD (Pediatrics)"),
        specialty: d.specialty || (i % 2 === 0 ? "General Physician" : "Pediatrics"),
        registrationNumber: d.registrationNumber || `TMMC12345${i}`
      }));
      setAll(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load doctors");
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

  function beginInline(row: DoctorCategory) { 
    setInlineEditId(row.id); 
    setDraftRow({
      id: row.id,
      doctorName: row.categoryName,
      qualification: row.qualification ?? "",
      specialty: row.specialty ?? "",
      registrationNumber: row.registrationNumber ?? "",
      status: row.status
    }); 
  }
  
  function cancelInline() { setInlineEditId(null); setDraftRow(null); }

  async function saveInline() {
    if (!inlineEditId || !draftRow) return;
    setSaving(true);
    try {
      setAll(all.map(d => d.id === inlineEditId ? {
        ...d,
        categoryName: draftRow.doctorName,
        qualification: draftRow.qualification,
        specialty: draftRow.specialty,
        registrationNumber: draftRow.registrationNumber,
        status: draftRow.status
      } : d));
      cancelInline();
    } catch (err) {
      setError("Failed to update doctor");
    } finally {
      setSaving(false);
    }
  }

  function handleSaveForm(form: FormRow) {
    setSaving(true);
    if (view === "add") {
      const newDoc: DoctorCategory = {
        id: Math.random().toString(36).slice(2, 9),
        categoryName: form.doctorName,
        qualification: form.qualification,
        specialty: form.specialty,
        registrationNumber: form.registrationNumber,
        noOfDoctors: 0,
        status: form.status
      };
      setAll([newDoc, ...all]);
    } else {
      setAll(all.map(d => d.id === form.id ? {
        ...d,
        categoryName: form.doctorName,
        qualification: form.qualification,
        specialty: form.specialty,
        registrationNumber: form.registrationNumber,
        status: form.status
      } : d));
    }
    setSaving(false);
    setView("list");
  }

  function handleDeactivate(id: string) {
    setAll(all.map(d => d.id === id ? { ...d, status: "INACTIVE" as const } : d));
  }

  if (view === "add") return <DoctorForm row={{}} onSave={handleSaveForm} onBack={() => setView("list")} saving={saving} error={error} nextCode={"DOC" + String(all.length + 1).padStart(4, "0")} />;
  if (view === "edit" && editTarget) {
    const index = all.findIndex(d => d.id === editTarget.id);
    const code = index !== -1 ? "DOC" + String(all.length - index).padStart(4, "0") : editTarget.id;
    return <DoctorForm row={editTarget} onSave={handleSaveForm} onBack={() => { setView("list"); setEditTarget(null); }} saving={saving} error={error} nextCode={code} />;
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Doctor Master</h2>
          <p>Create and manage general doctor profiles.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Doctor</button>
        </div>
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

      <div className="subdivision-stats" style={{ marginBottom:"20px" }}>
        <article><span>Total Doctors</span><strong>{rows.length}</strong></article>
        <article><span>Active Doctors</span><strong>{rows.filter(r => r.status === "ACTIVE").length}</strong></article>
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Doctor Code</th>
              <th>Doctor Name</th>
              <th>Qualification</th>
              <th>Specialty</th>
              <th>Registration Number</th>
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
              <th>Inline Edit</th>
              <th>Edit</th>
              <th>Deactivate</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={9} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>Loading...</td></tr>}
            {!loading && rows.map((row, i) => {
              const editing = inlineEditId === row.id && draftRow;
              return (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>DOC{String(i + 1).padStart(4, "0")}</td>
                  <td>
                    {editing
                      ? <input className="subdivision-inline-input" value={draftRow.doctorName} onChange={e => setDraftRow({ ...draftRow, doctorName: e.target.value })} />
                      : <strong style={{ color:"var(--ink)" }}>{row.categoryName}</strong>
                    }
                  </td>
                  <td>
                    {editing
                      ? <input className="subdivision-inline-input" value={draftRow.qualification} onChange={e => setDraftRow({ ...draftRow, qualification: e.target.value })} />
                      : (row.qualification || "—")
                    }
                  </td>
                  <td>
                    {editing
                      ? <input className="subdivision-inline-input" value={draftRow.specialty} onChange={e => setDraftRow({ ...draftRow, specialty: e.target.value })} />
                      : (row.specialty || "—")
                    }
                  </td>
                  <td>
                    {editing
                      ? <input className="subdivision-inline-input" value={draftRow.registrationNumber} onChange={e => setDraftRow({ ...draftRow, registrationNumber: e.target.value })} />
                      : (row.registrationNumber || "—")
                    }
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
                    <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} title="Deactivate" type="button" disabled={row.status === "INACTIVE"}><Trash2 size={15} /></button>
                  </td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && <tr><td colSpan={9} style={{ textAlign:"center", color:"var(--muted)", padding:"32px" }}>No doctors yet</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
