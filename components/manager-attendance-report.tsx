"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type AttendanceReportRow = {
  id: string;
  date: string;
  employeeCode: string;
  employeeName: string;
  division: string;
  hq: string;
  patch: string;
  attendanceType: string;
  checkIn: string;
  checkOut: string;
  totalWorkingHours: string;
  gpsCheckIn: string;
  gpsCheckOut: string;
  managerApproval: "Approved" | "Pending" | "Rejected";
  remarks: string;
};

const initialReports: AttendanceReportRow[] = [];

function ReportForm({ row, onSave, onBack }: { row: any; onSave: (r: AttendanceReportRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<AttendanceReportRow>({
    id: row.id ?? "",
    date: row.date ?? new Date().toISOString().split("T")[0],
    employeeCode: row.employeeCode ?? "",
    employeeName: row.employeeName ?? "",
    division: row.division ?? "Zivira",
    hq: row.hq ?? "Chennai Central HQ",
    patch: row.patch ?? "",
    attendanceType: row.attendanceType ?? "Field Work",
    checkIn: row.checkIn ?? "09:00 AM",
    checkOut: row.checkOut ?? "05:30 PM",
    totalWorkingHours: row.totalWorkingHours ?? "8.5 Hours",
    gpsCheckIn: row.gpsCheckIn ?? "",
    gpsCheckOut: row.gpsCheckOut ?? "",
    managerApproval: row.managerApproval ?? "Pending",
    remarks: row.remarks ?? ""
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>{row.id ? "Edit Attendance Log" : "Add Attendance Log"}</h2>
          <p>Record manager or MR daily field force attendance logs.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Date</span>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>* Employee Code</span>
          <input value={form.employeeCode} onChange={e => setForm({ ...form, employeeCode: e.target.value })} placeholder="EMP-MR-0001" />
        </label>
        <label className="field">
          <span>* Employee Name</span>
          <input value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })} placeholder="Rahul Sharma" />
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
          <span>Attendance Type</span>
          <select value={form.attendanceType} onChange={e => setForm({ ...form, attendanceType: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Field Work">Field Work</option>
            <option value="Meeting">Meeting</option>
            <option value="Holiday">Holiday</option>
            <option value="Leave">Leave</option>
          </select>
        </label>
        <label className="field">
          <span>Check In</span>
          <input value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} placeholder="09:00 AM" />
        </label>
        <label className="field">
          <span>Check Out</span>
          <input value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} placeholder="05:30 PM" />
        </label>
        <label className="field">
          <span>Total Working Hours</span>
          <input value={form.totalWorkingHours} onChange={e => setForm({ ...form, totalWorkingHours: e.target.value })} placeholder="e.g. 8.5 Hours" />
        </label>
        <label className="field">
          <span>GPS Check-In</span>
          <input value={form.gpsCheckIn} onChange={e => setForm({ ...form, gpsCheckIn: e.target.value })} placeholder="13.0827, 80.2707" />
        </label>
        <label className="field">
          <span>GPS Check-Out</span>
          <input value={form.gpsCheckOut} onChange={e => setForm({ ...form, gpsCheckOut: e.target.value })} placeholder="13.0830, 80.2710" />
        </label>
        <label className="field">
          <span>Manager Approval Status</span>
          <select value={form.managerApproval} onChange={e => setForm({ ...form, managerApproval: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <label className="field">
          <span>Remarks</span>
          <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Completed joint field visits" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.employeeCode.trim() || !form.employeeName.trim()}>
          <Check size={16} /> Save Attendance Record
        </button>
      </div>
    </section>
  );
}

export function ManagerAttendanceReport() {
  const [list, setList] = useState<AttendanceReportRow[]>(initialReports);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<AttendanceReportRow | null>(null);

  const [divisionFilter, setDivisionFilter] = useState<string>("All");
  const [divisionFilterOpen, setDivisionFilterOpen] = useState(false);
  const [hqFilter, setHqFilter] = useState<string>("All");
  const [hqFilterOpen, setHqFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [approvalFilter, setApprovalFilter] = useState<string>("All");
  const [approvalFilterOpen, setApprovalFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (divisionFilter === "All" || item.division === divisionFilter) &&
      (hqFilter === "All" || item.hq === hqFilter) &&
      (typeFilter === "All" || item.attendanceType === typeFilter) &&
      (approvalFilter === "All" || item.managerApproval === approvalFilter) &&
      (item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
        item.patch.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: AttendanceReportRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `LOG${String(list.length + 1).padStart(3, "0")}`
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
          <h2>Attendance Report</h2>
          <p>Review comprehensive field force daily attendance check logs.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Log</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by employee, code or patch..."
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
              <th>Date</th>
              <th>Employee Code</th>
              <th>Employee Name</th>
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
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Attendance Type</span>
                  <button
                    type="button"
                    onClick={() => setTypeFilterOpen(!typeFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {typeFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "140px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Field Work", "Meeting", "Holiday", "Leave"].map(type => (
                      <button key={type} type="button" onClick={() => { setTypeFilter(type); setTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: typeFilter === type ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: typeFilter === type ? 600 : 400 }}>
                        {type}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setTypeFilter("All"); setTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total Working Hours</th>
              <th>GPS Check-In</th>
              <th>GPS Check-Out</th>
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
              <th>Remarks</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.date)}</td>
                <td>{row.employeeCode}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.employeeName}</strong></td>
                <td>{row.division}</td>
                <td>{row.hq}</td>
                <td>{row.patch}</td>
                <td>{row.attendanceType}</td>
                <td style={{ color: "#15803d", fontWeight: 600 }}>{row.checkIn}</td>
                <td style={{ color: "#b91c1c", fontWeight: 600 }}>{row.checkOut}</td>
                <td style={{ fontWeight: 600 }}>{row.totalWorkingHours}</td>
                <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{row.gpsCheckIn}</td>
                <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{row.gpsCheckOut}</td>
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
                <td>{row.remarks}</td>
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
                <td colSpan={16} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No attendance reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
