"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";

type DoctorCoverageReportRow = {
  id: string;
  doctor: string;
  category: "Super Core" | "Core" | "Non Core";
  specialty: string;
  mr: string;
  plannedVisits: number;
  actualVisits: number;
  missedVisits: number;
  coveragePercentage: number;
  status: "Visited" | "Pending" | "Missed";
};

const initialReports: DoctorCoverageReportRow[] = [];

function ReportForm({ row, onSave, onBack }: { row: any; onSave: (r: DoctorCoverageReportRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<DoctorCoverageReportRow>({
    id: row.id ?? "",
    doctor: row.doctor ?? "",
    category: row.category ?? "Core",
    specialty: row.specialty ?? "General Physician",
    mr: row.mr ?? "",
    plannedVisits: row.plannedVisits ?? 0,
    actualVisits: row.actualVisits ?? 0,
    missedVisits: row.missedVisits ?? 0,
    coveragePercentage: row.coveragePercentage ?? 0,
    status: row.status ?? "Pending"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>{row.id ? "Edit Doctor Coverage Log" : "Add Doctor Coverage Log"}</h2>
          <p>Record and update MR team visit coverage statistics for medical practitioners.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Doctor Name</span>
          <input value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} placeholder="Dr. Ramesh Kumar" />
        </label>
        <label className="field">
          <span>Category</span>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Super Core">Super Core</option>
            <option value="Core">Core</option>
            <option value="Non Core">Non Core</option>
          </select>
        </label>
        <label className="field">
          <span>Specialty</span>
          <select value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="General Physician">General Physician</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
          </select>
        </label>
        <label className="field">
          <span>* MR Name</span>
          <input value={form.mr} onChange={e => setForm({ ...form, mr: e.target.value })} placeholder="Rahul Sharma" />
        </label>
        <label className="field">
          <span>Planned Visits</span>
          <input type="number" value={form.plannedVisits || ""} onChange={e => setForm({ ...form, plannedVisits: parseInt(e.target.value) || 0 })} placeholder="4" />
        </label>
        <label className="field">
          <span>Actual Visits</span>
          <input type="number" value={form.actualVisits || ""} onChange={e => setForm({ ...form, actualVisits: parseInt(e.target.value) || 0 })} placeholder="3" />
        </label>
        <label className="field">
          <span>Missed Visits</span>
          <input type="number" value={form.missedVisits || ""} onChange={e => setForm({ ...form, missedVisits: parseInt(e.target.value) || 0 })} placeholder="1" />
        </label>
        <label className="field">
          <span>Coverage %</span>
          <input type="number" value={form.coveragePercentage || ""} onChange={e => setForm({ ...form, coveragePercentage: parseFloat(e.target.value) || 0 })} placeholder="75" />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Pending">Pending</option>
            <option value="Visited">Visited</option>
            <option value="Missed">Missed</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.doctor.trim() || !form.mr.trim()}>
          <Check size={16} /> Save Coverage Record
        </button>
      </div>
    </section>
  );
}

export function ManagerDoctorCoverageReport() {
  const [list, setList] = useState<DoctorCoverageReportRow[]>(initialReports);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<DoctorCoverageReportRow | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("All");
  const [specialtyFilterOpen, setSpecialtyFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (categoryFilter === "All" || item.category === categoryFilter) &&
      (specialtyFilter === "All" || item.specialty === specialtyFilter) &&
      (statusFilter === "All" || item.status === statusFilter) &&
      (item.doctor.toLowerCase().includes(search.toLowerCase()) ||
        item.mr.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: DoctorCoverageReportRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `COV${String(list.length + 1).padStart(3, "0")}`
      };
      setList([...list, newRow]);
    } else {
      setList(list.map((item) => (item.id === form.id ? { ...form } : item)));
    }
    setView("list");
  }

  function handleDelete(id: string) {
    setList(list.filter((item) => item.id !== id));
  }

  if (view === "add") return <ReportForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <ReportForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>Doctor Coverage Report</h2>
          <p>Review comprehensive physician coverage metrics, targets and visitation logs.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Log</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by doctor or MR..."
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

      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "180px" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Category</span>
                  <button
                    type="button"
                    onClick={() => setCategoryFilterOpen(!categoryFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {categoryFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "130px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Super Core", "Core", "Non Core"].map(cat => (
                      <button key={cat} type="button" onClick={() => { setCategoryFilter(cat); setCategoryFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: categoryFilter === cat ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: categoryFilter === cat ? 600 : 400 }}>
                        {cat}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setCategoryFilter("All"); setCategoryFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "160px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Specialty</span>
                  <button
                    type="button"
                    onClick={() => setSpecialtyFilterOpen(!specialtyFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {specialtyFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "160px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["General Physician", "Cardiologist", "Dermatologist", "Pediatrician"].map(spec => (
                      <button key={spec} type="button" onClick={() => { setSpecialtyFilter(spec); setSpecialtyFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: specialtyFilter === spec ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: specialtyFilter === spec ? 600 : 400 }}>
                        {spec}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setSpecialtyFilter("All"); setSpecialtyFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>MR</th>
              <th>Planned Visits</th>
              <th>Actual Visits</th>
              <th>Missed Visits</th>
              <th>Coverage %</th>
              <th style={{ minWidth: "140px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Status</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilterOpen(!statusFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {statusFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "120px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Pending", "Visited", "Missed"].map(st => (
                      <button key={st} type="button" onClick={() => { setStatusFilter(st); setStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: statusFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: statusFilter === st ? 600 : 400 }}>
                        {st}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setStatusFilter("All"); setStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><strong style={{ color: "var(--ink)" }}>{row.doctor}</strong></td>
                <td>{row.category}</td>
                <td>{row.specialty}</td>
                <td>{row.mr}</td>
                <td style={{ fontWeight: 600 }}>{row.plannedVisits}</td>
                <td style={{ fontWeight: 600 }}>{row.actualVisits}</td>
                <td style={{ fontWeight: 600 }}>{row.missedVisits}</td>
                <td style={{ fontWeight: 600 }}>{row.coveragePercentage.toFixed(1)}%</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.status === "Visited" ? "#dcfce7" : row.status === "Missed" ? "#fee2e2" : "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.status === "Visited" ? "#15803d" : row.status === "Missed" ? "#b91c1c" : "#374151"
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
                  <button className="subdivision-danger-button" onClick={() => handleDelete(row.id)} type="button">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No doctor coverage logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
