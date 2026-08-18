"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type LeaveReportRow = {
  id: string;
  employee: string;
  hq: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  approvedBy: string;
};

const initialReports: LeaveReportRow[] = [];

function ReportForm({ row, onSave, onBack }: { row: any; onSave: (r: LeaveReportRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<LeaveReportRow>({
    id: row.id ?? "",
    employee: row.employee ?? "",
    hq: row.hq ?? "Chennai Central HQ",
    leaveType: row.leaveType ?? "Casual Leave",
    fromDate: row.fromDate ?? new Date().toISOString().split("T")[0],
    toDate: row.toDate ?? new Date().toISOString().split("T")[0],
    totalDays: row.totalDays ?? 1,
    reason: row.reason ?? "",
    status: row.status ?? "Pending",
    approvedBy: row.approvedBy ?? ""
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>{row.id ? "Edit Leave Request" : "Add Leave Request"}</h2>
          <p>Record daily manager or MR team leave applications.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Employee Name</span>
          <input value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })} placeholder="Rahul Sharma" />
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
          <span>Leave Type</span>
          <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Earned Leave">Earned Leave</option>
            <option value="Loss of Pay">Loss of Pay</option>
          </select>
        </label>
        <label className="field">
          <span>* From Date</span>
          <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>* To Date</span>
          <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>* Total Days</span>
          <input type="number" value={form.totalDays || ""} onChange={e => setForm({ ...form, totalDays: parseInt(e.target.value) || 0 })} placeholder="3" />
        </label>
        <label className="field">
          <span>Reason</span>
          <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Family event or medical reasons" />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <label className="field">
          <span>Approved By</span>
          <input value={form.approvedBy} onChange={e => setForm({ ...form, approvedBy: e.target.value })} placeholder="Priya Nair (Manager)" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.employee.trim() || form.totalDays <= 0}>
          <Check size={16} /> Save Leave Claim
        </button>
      </div>
    </section>
  );
}

export function ManagerLeaveReport() {
  const [list, setList] = useState<LeaveReportRow[]>(initialReports);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<LeaveReportRow | null>(null);

  const [hqFilter, setHqFilter] = useState<string>("All");
  const [hqFilterOpen, setHqFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (hqFilter === "All" || item.hq === hqFilter) &&
      (typeFilter === "All" || item.leaveType === typeFilter) &&
      (statusFilter === "All" || item.status === statusFilter) &&
      (item.employee.toLowerCase().includes(search.toLowerCase()) ||
        item.reason.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: LeaveReportRow) {
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
          <h2>Leave Report</h2>
          <p>Review comprehensive field force daily leave logs and status logs.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Leave</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by employee or reason..."
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
              <th>Employee</th>
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
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Leave Type</span>
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
                    {["Casual Leave", "Sick Leave", "Earned Leave", "Loss of Pay"].map(t => (
                      <button key={t} type="button" onClick={() => { setTypeFilter(t); setTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: typeFilter === t ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: typeFilter === t ? 600 : 400 }}>
                        {t}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setTypeFilter("All"); setTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Total Days</th>
              <th>Reason</th>
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
                    {["Pending", "Approved", "Rejected"].map(st => (
                      <button key={st} type="button" onClick={() => { setStatusFilter(st); setStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: statusFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: statusFilter === st ? 600 : 400 }}>
                        {st}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setStatusFilter("All"); setStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>Approved By</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><strong style={{ color: "var(--ink)" }}>{row.employee}</strong></td>
                <td>{row.hq}</td>
                <td>{row.leaveType}</td>
                <td>{formatDate(row.fromDate)}</td>
                <td>{formatDate(row.toDate)}</td>
                <td style={{ fontWeight: 600 }}>{row.totalDays}</td>
                <td>{row.reason}</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.status === "Approved" ? "#dcfce7" : row.status === "Rejected" ? "#fee2e2" : "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.status === "Approved" ? "#15803d" : row.status === "Rejected" ? "#b91c1c" : "#374151"
                  }}>
                    {row.status}
                  </span>
                </td>
                <td>{row.approvedBy}</td>
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
                <td colSpan={11} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No leave reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
