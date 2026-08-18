"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type TourPlanReportRow = {
  id: string;
  tourDate: string;
  employeeCode: string;
  medicalRepresentative: string;
  division: string;
  hq: string;
  patch: string;
  plannedDoctorVisits: number;
  actualDoctorVisits: number;
  achievementPercentage: number;
  tourStatus: "Completed" | "Pending" | "Cancelled";
  managerApproval: "Approved" | "Pending" | "Rejected";
};

const initialReports: TourPlanReportRow[] = [];

function ReportForm({ row, onSave, onBack }: { row: any; onSave: (r: TourPlanReportRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<TourPlanReportRow>({
    id: row.id ?? "",
    tourDate: row.tourDate ?? new Date().toISOString().split("T")[0],
    employeeCode: row.employeeCode ?? "",
    medicalRepresentative: row.medicalRepresentative ?? "",
    division: row.division ?? "Zivira",
    hq: row.hq ?? "Chennai Central HQ",
    patch: row.patch ?? "",
    plannedDoctorVisits: row.plannedDoctorVisits ?? 0,
    actualDoctorVisits: row.actualDoctorVisits ?? 0,
    achievementPercentage: row.achievementPercentage ?? 0,
    tourStatus: row.tourStatus ?? "Pending",
    managerApproval: row.managerApproval ?? "Pending"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>{row.id ? "Edit Tour Plan Log" : "Add Tour Plan Log"}</h2>
          <p>Record and update field force tour plan achievement statistics.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Tour Date</span>
          <input type="date" value={form.tourDate} onChange={e => setForm({ ...form, tourDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>* Employee Code</span>
          <input value={form.employeeCode} onChange={e => setForm({ ...form, employeeCode: e.target.value })} placeholder="EMP-MR-0001" />
        </label>
        <label className="field">
          <span>* Medical Representative</span>
          <input value={form.medicalRepresentative} onChange={e => setForm({ ...form, medicalRepresentative: e.target.value })} placeholder="Rahul Sharma" />
        </label>
        <label className="field">
          <span>Division</span>
          <select value={form.division} onChange={e => setForm({ ...form, division: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Zivira">Zivira</option>
            <option value="Astra">Astra</option>
            <option value="Ara">Ara</option>
          </select>
        </label>
        <label className="field">
          <span>HQ</span>
          <select value={form.hq} onChange={e => setForm({ ...form, hq: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Chennai Central HQ">Chennai Central HQ</option>
            <option value="Coimbatore HQ">Coimbatore HQ</option>
            <option value="Madurai HQ">Madurai HQ</option>
          </select>
        </label>
        <label className="field">
          <span>Patch</span>
          <input value={form.patch} onChange={e => setForm({ ...form, patch: e.target.value })} placeholder="e.g. T-Nagar" />
        </label>
        <label className="field">
          <span>Planned Doctor Visits</span>
          <input type="number" value={form.plannedDoctorVisits || ""} onChange={e => setForm({ ...form, plannedDoctorVisits: parseInt(e.target.value) || 0 })} placeholder="15" />
        </label>
        <label className="field">
          <span>Actual Doctor Visits</span>
          <input type="number" value={form.actualDoctorVisits || ""} onChange={e => setForm({ ...form, actualDoctorVisits: parseInt(e.target.value) || 0 })} placeholder="12" />
        </label>
        <label className="field">
          <span>Achievement %</span>
          <input type="number" value={form.achievementPercentage || ""} onChange={e => setForm({ ...form, achievementPercentage: parseFloat(e.target.value) || 0 })} placeholder="80" />
        </label>
        <label className="field">
          <span>Tour Status</span>
          <select value={form.tourStatus} onChange={e => setForm({ ...form, tourStatus: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <label className="field">
          <span>Manager Approval Status</span>
          <select value={form.managerApproval} onChange={e => setForm({ ...form, managerApproval: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.employeeCode.trim() || !form.medicalRepresentative.trim()}>
          <Check size={16} /> Save Tour Plan Report
        </button>
      </div>
    </section>
  );
}

export function ManagerTourPlanReport() {
  const [list, setList] = useState<TourPlanReportRow[]>(initialReports);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<TourPlanReportRow | null>(null);

  const [divisionFilter, setDivisionFilter] = useState<string>("All");
  const [divisionFilterOpen, setDivisionFilterOpen] = useState(false);
  const [hqFilter, setHqFilter] = useState<string>("All");
  const [hqFilterOpen, setHqFilterOpen] = useState(false);
  const [tourStatusFilter, setTourStatusFilter] = useState<string>("All");
  const [tourStatusFilterOpen, setTourStatusFilterOpen] = useState(false);
  const [approvalFilter, setApprovalFilter] = useState<string>("All");
  const [approvalFilterOpen, setApprovalFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (divisionFilter === "All" || item.division === divisionFilter) &&
      (hqFilter === "All" || item.hq === hqFilter) &&
      (tourStatusFilter === "All" || item.tourStatus === tourStatusFilter) &&
      (approvalFilter === "All" || item.managerApproval === approvalFilter) &&
      (item.medicalRepresentative.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
        item.patch.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: TourPlanReportRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `REP${String(list.length + 1).padStart(3, "0")}`
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
          <h2>Tour Plan Report</h2>
          <p>Review planned doctor visits, actual visits and coverage achievement ratios.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Report</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by MR, code or patch..."
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
              <th>Tour Date</th>
              <th>Employee Code</th>
              <th>Medical Representative</th>
              <th style={{ minWidth: "130px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Division</span>
                  <button
                    type="button"
                    onClick={() => setDivisionFilterOpen(!divisionFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {divisionFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "120px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Zivira", "Astra", "Ara"].map(div => (
                      <button key={div} type="button" onClick={() => { setDivisionFilter(div); setDivisionFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: divisionFilter === div ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: divisionFilter === div ? 600 : 400 }}>
                        {div}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setDivisionFilter("All"); setDivisionFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "160px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>HQ</span>
                  <button
                    type="button"
                    onClick={() => setHqFilterOpen(!hqFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {hqFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "160px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Chennai Central HQ", "Coimbatore HQ", "Madurai HQ"].map(hq => (
                      <button key={hq} type="button" onClick={() => { setHqFilter(hq); setHqFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: hqFilter === hq ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: hqFilter === hq ? 600 : 400 }}>
                        {hq}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setHqFilter("All"); setHqFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>Patch</th>
              <th>Planned Doctor Visits</th>
              <th>Actual Doctor Visits</th>
              <th>Achievement %</th>
              <th style={{ minWidth: "140px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Tour Status</span>
                  <button
                    type="button"
                    onClick={() => setTourStatusFilterOpen(!tourStatusFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {tourStatusFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "120px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Pending", "Completed", "Cancelled"].map(st => (
                      <button key={st} type="button" onClick={() => { setTourStatusFilter(st); setTourStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: tourStatusFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: tourStatusFilter === st ? 600 : 400 }}>
                        {st}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setTourStatusFilter("All"); setTourStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Manager Approval</span>
                  <button
                    type="button"
                    onClick={() => setApprovalFilterOpen(!approvalFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {approvalFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "120px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Pending", "Approved", "Rejected"].map(st => (
                      <button key={st} type="button" onClick={() => { setApprovalFilter(st); setApprovalFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: approvalFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: approvalFilter === st ? 600 : 400 }}>
                        {st}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setApprovalFilter("All"); setApprovalFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
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
                <td>{formatDate(row.tourDate)}</td>
                <td>{row.employeeCode}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.medicalRepresentative}</strong></td>
                <td>{row.division}</td>
                <td>{row.hq}</td>
                <td>{row.patch}</td>
                <td style={{ fontWeight: 600 }}>{row.plannedDoctorVisits}</td>
                <td style={{ fontWeight: 600 }}>{row.actualDoctorVisits}</td>
                <td style={{ fontWeight: 600 }}>{row.achievementPercentage.toFixed(1)}%</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.tourStatus === "Completed" ? "#dcfce7" : row.tourStatus === "Cancelled" ? "#fee2e2" : "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.tourStatus === "Completed" ? "#15803d" : row.tourStatus === "Cancelled" ? "#b91c1c" : "#374151"
                  }}>
                    {row.tourStatus}
                  </span>
                </td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.managerApproval === "Approved" ? "#dcfce7" : row.managerApproval === "Rejected" ? "#fee2e2" : "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.managerApproval === "Approved" ? "#15803d" : row.managerApproval === "Rejected" ? "#b91c1c" : "#374151"
                  }}>
                    {row.managerApproval}
                  </span>
                </td>
                <td>
                  <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} type="button">
                    <Pencil size={15} />
                  </button>
                </td>
                <td>
                  <button className="subdivision-danger-button" onClick={() => handleDelete(row.id)} type="button">
                    <Ban />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={13} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No tour plan reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
