"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type CallReportRow = {
  id: string;
  date: string;
  employee: string;
  hq: string;
  patch: string;
  doctor: string;
  chemist: string;
  hospital: string;
  productsPromoted: string;
  samplesIssued: string;
  callType: string;
  visitTime: string;
  remarks: string;
  nextVisitDate: string;
};

const initialCallReports: CallReportRow[] = [];

function CallReportForm({ row, onSave, onBack }: { row: any; onSave: (r: CallReportRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<CallReportRow>({
    id: row.id ?? "",
    date: row.date ?? new Date().toISOString().split("T")[0],
    employee: row.employee ?? "",
    hq: row.hq ?? "Chennai Central HQ",
    patch: row.patch ?? "",
    doctor: row.doctor ?? "",
    chemist: row.chemist ?? "",
    hospital: row.hospital ?? "",
    productsPromoted: row.productsPromoted ?? "",
    samplesIssued: row.samplesIssued ?? "",
    callType: row.callType ?? "Physical Visit",
    visitTime: row.visitTime ?? "10:30 AM",
    remarks: row.remarks ?? "",
    nextVisitDate: row.nextVisitDate ?? ""
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Daily MR Work</p>
          <h2>{row.id ? "Edit Call Report" : "Add Call Report"}</h2>
          <p>Create new daily MR activity call report logs.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Date</span>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
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
          <span>Patch</span>
          <input value={form.patch} onChange={e => setForm({ ...form, patch: e.target.value })} placeholder="e.g. T-Nagar" />
        </label>
        <label className="field">
          <span>Doctor</span>
          <input value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} placeholder="Dr. John Doe" />
        </label>
        <label className="field">
          <span>Chemist</span>
          <input value={form.chemist} onChange={e => setForm({ ...form, chemist: e.target.value })} placeholder="Apollo Pharmacy" />
        </label>
        <label className="field">
          <span>Hospital</span>
          <input value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} placeholder="Apollo Hospital" />
        </label>
        <label className="field">
          <span>Products Promoted</span>
          <input value={form.productsPromoted} onChange={e => setForm({ ...form, productsPromoted: e.target.value })} placeholder="Paracetamol, Amoxicillin" />
        </label>
        <label className="field">
          <span>Samples Issued</span>
          <input value={form.samplesIssued} onChange={e => setForm({ ...form, samplesIssued: e.target.value })} placeholder="10 tabs, 5 bottles" />
        </label>
        <label className="field">
          <span>Call Type</span>
          <select value={form.callType} onChange={e => setForm({ ...form, callType: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Physical Visit">Physical Visit</option>
            <option value="Phone Call">Phone Call</option>
            <option value="CME">CME</option>
          </select>
        </label>
        <label className="field">
          <span>Visit Time</span>
          <input value={form.visitTime} onChange={e => setForm({ ...form, visitTime: e.target.value })} placeholder="10:30 AM" />
        </label>
        <label className="field">
          <span>Remarks</span>
          <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Doctor detailed on API products" />
        </label>
        <label className="field">
          <span>Next Visit Date</span>
          <input type="date" value={form.nextVisitDate} onChange={e => setForm({ ...form, nextVisitDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.employee.trim()}>
          <Check size={16} /> Save Call Report
        </button>
      </div>
    </section>
  );
}

export function DoctorCallReport() {
  const [list, setList] = useState<CallReportRow[]>(initialCallReports);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<CallReportRow | null>(null);

  const [hqFilter, setHqFilter] = useState<string>("All");
  const [hqFilterOpen, setHqFilterOpen] = useState(false);
  const [callTypeFilter, setCallTypeFilter] = useState<string>("All");
  const [callTypeFilterOpen, setCallTypeFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (hqFilter === "All" || item.hq === hqFilter) &&
      (callTypeFilter === "All" || item.callType === callTypeFilter) &&
      (item.employee.toLowerCase().includes(search.toLowerCase()) ||
        item.doctor.toLowerCase().includes(search.toLowerCase()) ||
        item.hq.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: CallReportRow) {
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

  if (view === "add") return <CallReportForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <CallReportForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Daily MR Work</p>
          <h2>Daily Call Report</h2>
          <p>Track doctor calls, chemist feedback, and product promotions.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Report</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by employee, doctor or HQ..."
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
              <th>Patch</th>
              <th>Doctor</th>
              <th>Chemist</th>
              <th>Hospital</th>
              <th>Products Promoted</th>
              <th>Samples Issued</th>
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Call Type</span>
                  <button
                    type="button"
                    onClick={() => setCallTypeFilterOpen(!callTypeFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {callTypeFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "140px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Physical Visit", "Phone Call", "CME"].map(type => (
                      <button key={type} type="button" onClick={() => { setCallTypeFilter(type); setCallTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: callTypeFilter === type ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: callTypeFilter === type ? 600 : 400 }}>
                        {type}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setCallTypeFilter("All"); setCallTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>Visit Time</th>
              <th>Remarks</th>
              <th>Next Visit Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.date)}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.employee}</strong></td>
                <td>{row.hq}</td>
                <td>{row.patch}</td>
                <td>{row.doctor}</td>
                <td>{row.chemist}</td>
                <td>{row.hospital}</td>
                <td>{row.productsPromoted}</td>
                <td>{row.samplesIssued}</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151"
                  }}>
                    {row.callType}
                  </span>
                </td>
                <td>{row.visitTime}</td>
                <td>{row.remarks}</td>
                <td>{row.nextVisitDate ? formatDate(row.nextVisitDate) : ""}</td>
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
                <td colSpan={15} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No call report records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
