"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, X, ChevronDown } from "lucide-react";
import { useState } from "react";

type ClassRow = {
  id: string;
  category: "A" | "B" | "C";
  potential: "High" | "Medium" | "Low";
  frequency: "Weekly" | "Twice a Month" | "Fortnightly" | "Monthly" | "Once in Two Months" | "Quarterly";
  status: "Active" | "Inactive";
};

const initialClassifications: ClassRow[] = [];

function ClassForm({ row, onSave, onBack }: { row: any; onSave: (r: ClassRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<ClassRow>({
    id: row.id ?? "",
    category: row.category ?? "A",
    potential: row.potential ?? "High",
    frequency: row.frequency ?? "Weekly",
    status: row.status ?? "Active"
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Classification" : "Add Classification"}</h2>
          <p>Configure doctor category, business potential, and visit frequency rules.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>Doctor Category</span>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="A">A (High-value doctor)</option>
            <option value="B">B (Moderate-value doctor)</option>
            <option value="C">C (Low-value doctor)</option>
          </select>
        </label>
        <label className="field">
          <span>Potential</span>
          <select value={form.potential} onChange={e => setForm({ ...form, potential: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label className="field">
          <span>Visit Frequency</span>
          <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Weekly">Weekly (4 visits/month)</option>
            <option value="Twice a Month">Twice a Month (2 visits/month)</option>
            <option value="Fortnightly">Fortnightly (Every 15 days)</option>
            <option value="Monthly">Monthly (1 visit/month)</option>
            <option value="Once in Two Months">Once in Two Months (Every 60 days)</option>
            <option value="Quarterly">Quarterly (Once every 3 months)</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button">
          <Check size={16} /> Add Classification
        </button>
      </div>
    </section>
  );
}

export function DoctorManager() {
  const [classifications, setClassifications] = useState<ClassRow[]>(initialClassifications);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<ClassRow | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = classifications.filter(
    (c) =>
      (statusFilter === "All" ||
        (statusFilter === "Active" && c.status === "Active") ||
        (statusFilter === "Inactive" && c.status === "Inactive")) &&
      (c.category.toLowerCase().includes(search.toLowerCase()) ||
        c.potential.toLowerCase().includes(search.toLowerCase()) ||
        c.frequency.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: ClassRow) {
    if (view === "add") {
      const newClass = {
        ...form,
        id: `CL${String(classifications.length + 1).padStart(3, "0")}`
      };
      setClassifications([...classifications, newClass]);
    } else {
      setClassifications(classifications.map(c => c.id === form.id ? { ...form } : c));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setClassifications(classifications.map(c => c.id === id ? { ...c, status: "Inactive" as const } : c));
  }

  if (view === "add") return <ClassForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <ClassForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Doctor Classification</h2>
          <p>Create and manage doctor visit classifications based on sales potential.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Classification</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by category, potential or frequency..."
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

      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Doctor Category</th>
              <th>Potential</th>
              <th>Visit Frequency</th>
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
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    background: row.category === "A" ? "#ef444415" : row.category === "B" ? "#f9731615" : "#3b82f615", 
                    color: row.category === "A" ? "#ef4444" : row.category === "B" ? "#f97316" : "#3b82f6", 
                    fontWeight: 700 
                  }}>
                    Category {row.category}
                  </span>
                </td>
                <td><strong>{row.potential}</strong></td>
                <td>{row.frequency}</td>
                <td>
                  <span style={{ 
                    padding: "2px 8px", 
                    borderRadius: "999px", 
                    fontSize: "11px", 
                    fontWeight: 600, 
                    background: row.status === "Active" ? "#10b98115" : "#ef444415", 
                    color: row.status === "Active" ? "#10b981" : "#ef4444",
                    border: row.status === "Active" ? "1px solid #10b98125" : "1px solid #ef444425"
                  }}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} type="button">
                    <Pencil size={15} />
                  </button>
                </td>
                <td>
                  <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} type="button" disabled={row.status === "Inactive"}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No classifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
