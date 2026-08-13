"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type CampRow = {
  id: string;
  campCode: string;
  campName: string;
  campDate: string;
  hospital: string;
  doctor: string;
  organizer: string;
  noOfPatients: number;
  productsDisplayed: string;
  remarks: string;
  status: "Active" | "Inactive";
};

const initialCamps: CampRow[] = [];

function CampForm({ row, onSave, onBack }: { row: any; onSave: (r: CampRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<CampRow>({
    id: row.id ?? "",
    campCode: row.campCode ?? "",
    campName: row.campName ?? "",
    campDate: row.campDate ?? new Date().toISOString().split("T")[0],
    hospital: row.hospital ?? "",
    doctor: row.doctor ?? "",
    organizer: row.organizer ?? "",
    noOfPatients: row.noOfPatients ?? 0,
    productsDisplayed: row.productsDisplayed ?? "",
    remarks: row.remarks ?? "",
    status: row.status ?? "Active"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Daily MR Work</p>
          <h2>{row.id ? "Edit Medical Camp" : "Add Medical Camp"}</h2>
          <p>Organize and schedule community healthcare and awareness camps.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Camp Code</span>
          <input value={form.campCode} onChange={e => setForm({ ...form, campCode: e.target.value })} placeholder="CAMP-001" />
        </label>
        <label className="field">
          <span>* Camp Name</span>
          <input value={form.campName} onChange={e => setForm({ ...form, campName: e.target.value })} placeholder="Free Cardiac Screening Camp" />
        </label>
        <label className="field">
          <span>* Camp Date</span>
          <input type="date" value={form.campDate} onChange={e => setForm({ ...form, campDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>Hospital</span>
          <input value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} placeholder="Metro General Hospital" />
        </label>
        <label className="field">
          <span>Doctor</span>
          <input value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} placeholder="Dr. John Watson" />
        </label>
        <label className="field">
          <span>Organizer</span>
          <input value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} placeholder="Rahul Sharma" />
        </label>
        <label className="field">
          <span>No. of Patients Attended</span>
          <input type="number" value={form.noOfPatients || ""} onChange={e => setForm({ ...form, noOfPatients: parseInt(e.target.value) || 0 })} placeholder="50" />
        </label>
        <label className="field">
          <span>Products Displayed</span>
          <input value={form.productsDisplayed} onChange={e => setForm({ ...form, productsDisplayed: e.target.value })} placeholder="Zivira API Brands, Consumables" />
        </label>
        <label className="field">
          <span>Remarks</span>
          <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="High visitor response, positive doctor feedback" />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.campCode.trim() || !form.campName.trim()}>
          <Check size={16} /> Save Camp Details
        </button>
      </div>
    </section>
  );
}

export function CampView() {
  const [list, setList] = useState<CampRow[]>(initialCamps);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<CampRow | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (statusFilter === "All" || item.status === statusFilter) &&
      (item.campName.toLowerCase().includes(search.toLowerCase()) ||
        item.campCode.toLowerCase().includes(search.toLowerCase()) ||
        item.organizer.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: CampRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `CMP${String(list.length + 1).padStart(3, "0")}`
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

  if (view === "add") return <CampForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <CampForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Daily MR Work</p>
          <h2>Camp</h2>
          <p>Organize and review medical camps details.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Camp</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by camp name, code or organizer..."
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
              <th>Camp Code</th>
              <th>Camp Name</th>
              <th>Camp Date</th>
              <th>Hospital</th>
              <th>Doctor</th>
              <th>Organizer</th>
              <th>No. of Patients</th>
              <th>Products Displayed</th>
              <th>Remarks</th>
              <th style={{ minWidth: "130px", position: "relative" }}>
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
                    {["Active", "Inactive"].map(st => (
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
                <td>{row.campCode}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.campName}</strong></td>
                <td>{formatDate(row.campDate)}</td>
                <td>{row.hospital}</td>
                <td>{row.doctor}</td>
                <td>{row.organizer}</td>
                <td style={{ fontWeight: 600 }}>{row.noOfPatients}</td>
                <td>{row.productsDisplayed}</td>
                <td>{row.remarks}</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.status === "Active" ? "#dcfce7" : "#fee2e2",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.status === "Active" ? "#15803d" : "#b91c1c"
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
                <td colSpan={12} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No medical camp records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
