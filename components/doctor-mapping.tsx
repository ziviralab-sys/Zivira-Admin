"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";

type MappingRow = {
  id: string;
  doctorName: string;
  division: string;
  hq: string;
  patch: string;
  mr: string;
  am: string;
  status: "Active" | "Inactive";
};

const initialMappings: MappingRow[] = [];

function MappingForm({ row, onSave, onBack }: { row: any; onSave: (r: MappingRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<MappingRow>({
    id: row.id ?? "",
    doctorName: row.doctorName ?? "",
    division: row.division ?? "Zivira",
    hq: row.hq ?? "Chennai Central HQ",
    patch: row.patch ?? "T. Nagar",
    mr: row.mr ?? "Rahul Sharma",
    am: row.am ?? "Priya Nair",
    status: row.status ?? "Active"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{row.id ? "Edit Doctor Mapping" : "Add Doctor Mapping"}</h2>
          <p>Assign doctors to divisions, headquarters, patches, and field force supervisors.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Doctor Name</span>
          <input value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} placeholder="Dr. Rajesh Kumar" />
        </label>
        <label className="field">
          <span>Division</span>
          <select value={form.division} onChange={e => setForm({ ...form, division: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Zivira">Zivira</option>
            <option value="Astra">Astra</option>
            <option value="Aura">Aura</option>
          </select>
        </label>
        <label className="field">
          <span>HQ (Assigned Headquarters)</span>
          <select value={form.hq} onChange={e => setForm({ ...form, hq: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Chennai Central HQ">Chennai Central HQ</option>
            <option value="Coimbatore HQ">Coimbatore HQ</option>
            <option value="Madurai HQ">Madurai HQ</option>
          </select>
        </label>
        <label className="field">
          <span>Patch (Territory)</span>
          <select value={form.patch} onChange={e => setForm({ ...form, patch: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="T. Nagar">T. Nagar</option>
            <option value="Mylapore">Mylapore</option>
            <option value="Anna Nagar">Anna Nagar</option>
          </select>
        </label>
        <label className="field">
          <span>Medical Representative</span>
          <select value={form.mr} onChange={e => setForm({ ...form, mr: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Karthik Iyer">Karthik Iyer</option>
            <option value="Vignesh Raj">Vignesh Raj</option>
          </select>
        </label>
        <label className="field">
          <span>Area Manager</span>
          <select value={form.am} onChange={e => setForm({ ...form, am: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Priya Nair">Priya Nair</option>
            <option value="Meena Patel">Meena Patel</option>
            <option value="Arvind Kumar">Arvind Kumar</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.doctorName.trim()}>
          <Check size={16} /> Add Mapping
        </button>
      </div>
    </section>
  );
}

export function DoctorMapping() {
  const [mappings, setMappings] = useState<MappingRow[]>(initialMappings);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<MappingRow | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = mappings.filter(
    (m) =>
      (statusFilter === "All" ||
        (statusFilter === "Active" && m.status === "Active") ||
        (statusFilter === "Inactive" && m.status === "Inactive")) &&
      (m.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        m.hq.toLowerCase().includes(search.toLowerCase()) ||
        m.patch.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: MappingRow) {
    if (view === "add") {
      const newMap = {
        ...form,
        id: `MAP${String(mappings.length + 1).padStart(3, "0")}`
      };
      setMappings([...mappings, newMap]);
    } else {
      setMappings(mappings.map(m => m.id === form.id ? { ...form } : m));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setMappings(mappings.filter(m => m.id !== id));
  }

  if (view === "add") return <MappingForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <MappingForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Doctor Mapping</h2>
          <p>Map doctors to divisions, headquarters, patches, and field force supervisors.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Mapping</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by doctor or territory..."
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
              <th>S.No</th>
              <th>Doctor Name</th>
              <th>Division</th>
              <th>HQ</th>
              <th>Patch</th>
              <th>Medical Representative</th>
              <th>Area Manager</th>
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
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={row.id}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{idx + 1}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.doctorName}</strong></td>
                <td>{row.division}</td>
                <td>{row.hq}</td>
                <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{row.patch}</span></td>
                <td>{row.mr}</td>
                <td>{row.am}</td>
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
                  <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} type="button">
                    <Ban />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No mappings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
