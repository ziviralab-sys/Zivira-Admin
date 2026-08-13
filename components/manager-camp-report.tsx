"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type CampReportRow = {
  id: string;
  campDate: string;
  campName: string;
  hospital: string;
  doctor: string;
  mr: string;
  patients: number;
  productsPromoted: string;
  samples: string;
  status: "Completed" | "Pending" | "Cancelled";
};

const initialReports: CampReportRow[] = [];

function ReportForm({ row, onSave, onBack }: { row: any; onSave: (r: CampReportRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<CampReportRow>({
    id: row.id ?? "",
    campDate: row.campDate ?? new Date().toISOString().split("T")[0],
    campName: row.campName ?? "",
    hospital: row.hospital ?? "",
    doctor: row.doctor ?? "",
    mr: row.mr ?? "",
    patients: row.patients ?? 0,
    productsPromoted: row.productsPromoted ?? "",
    samples: row.samples ?? "",
    status: row.status ?? "Pending"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>{row.id ? "Edit Camp Report" : "Add Camp Report"}</h2>
          <p>Record medical camp patient visits and sample distributions.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Camp Date</span>
          <input type="date" value={form.campDate} onChange={e => setForm({ ...form, campDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>* Camp Name</span>
          <input value={form.campName} onChange={e => setForm({ ...form, campName: e.target.value })} placeholder="e.g. Free Cardiac Camp" />
        </label>
        <label className="field">
          <span>Hospital</span>
          <input value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} placeholder="e.g. Apollo Hospital" />
        </label>
        <label className="field">
          <span>Doctor</span>
          <input value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} placeholder="e.g. Dr. Ramesh Kumar" />
        </label>
        <label className="field">
          <span>* MR Name</span>
          <input value={form.mr} onChange={e => setForm({ ...form, mr: e.target.value })} placeholder="Rahul Sharma" />
        </label>
        <label className="field">
          <span>No. of Patients</span>
          <input type="number" value={form.patients || ""} onChange={e => setForm({ ...form, patients: parseInt(e.target.value) || 0 })} placeholder="50" />
        </label>
        <label className="field">
          <span>Products Promoted</span>
          <input value={form.productsPromoted} onChange={e => setForm({ ...form, productsPromoted: e.target.value })} placeholder="e.g. Cardivas 12.5mg, Telma 40" />
        </label>
        <label className="field">
          <span>Samples Distributed</span>
          <input value={form.samples} onChange={e => setForm({ ...form, samples: e.target.value })} placeholder="e.g. 10 strips" />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.campName.trim() || !form.mr.trim()}>
          <Check size={16} /> Save Camp Report
        </button>
      </div>
    </section>
  );
}

export function ManagerCampReport() {
  const [list, setList] = useState<CampReportRow[]>(initialReports);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<CampReportRow | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (statusFilter === "All" || item.status === statusFilter) &&
      (item.campName.toLowerCase().includes(search.toLowerCase()) ||
        item.hospital.toLowerCase().includes(search.toLowerCase()) ||
        item.doctor.toLowerCase().includes(search.toLowerCase()) ||
        item.mr.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: CampReportRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `CAMP${String(list.length + 1).padStart(3, "0")}`
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
          <h2>Camp Report</h2>
          <p>Review comprehensive field force daily medical camp reports.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Report</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by camp, hospital, doctor or MR..."
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
              <th>Camp Date</th>
              <th>Camp Name</th>
              <th>Hospital</th>
              <th>Doctor</th>
              <th>MR</th>
              <th>Patients</th>
              <th>Products Promoted</th>
              <th>Samples</th>
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
                    {["Pending", "Completed", "Cancelled"].map(st => (
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
                <td>{formatDate(row.campDate)}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.campName}</strong></td>
                <td>{row.hospital}</td>
                <td>{row.doctor}</td>
                <td>{row.mr}</td>
                <td style={{ fontWeight: 600 }}>{row.patients}</td>
                <td>{row.productsPromoted}</td>
                <td>{row.samples}</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.status === "Completed" ? "#dcfce7" : row.status === "Cancelled" ? "#fee2e2" : "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.status === "Completed" ? "#15803d" : row.status === "Cancelled" ? "#b91c1c" : "#374151"
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
                  No camp reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
