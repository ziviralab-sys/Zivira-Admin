"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type DcrSummaryRow = {
  id: string;
  date: string;
  employeeCode: string;
  medicalRepresentative: string;
  division: string;
  hq: string;
  patch: string;
  plannedCalls: number;
  callsCompleted: number;
  doctorsVisited: number;
  chemistsVisited: number;
  hospitalsVisited: number;
  productsPromoted: string;
  samplesDistributed: string;
  giftsDistributed: string;
  workingHours: string;
};

const initialSummaries: DcrSummaryRow[] = [];

function SummaryForm({ row, onSave, onBack }: { row: any; onSave: (r: DcrSummaryRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<DcrSummaryRow>({
    id: row.id ?? "",
    date: row.date ?? new Date().toISOString().split("T")[0],
    employeeCode: row.employeeCode ?? "",
    medicalRepresentative: row.medicalRepresentative ?? "",
    division: row.division ?? "Zivira",
    hq: row.hq ?? "Chennai Central HQ",
    patch: row.patch ?? "",
    plannedCalls: row.plannedCalls ?? 0,
    callsCompleted: row.callsCompleted ?? 0,
    doctorsVisited: row.doctorsVisited ?? 0,
    chemistsVisited: row.chemistsVisited ?? 0,
    hospitalsVisited: row.hospitalsVisited ?? 0,
    productsPromoted: row.productsPromoted ?? "",
    samplesDistributed: row.samplesDistributed ?? "",
    giftsDistributed: row.giftsDistributed ?? "",
    workingHours: row.workingHours ?? "8.0 Hours"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>{row.id ? "Edit DCR Summary" : "Add DCR Summary"}</h2>
          <p>Create or update a summary of MR daily call activities.</p>
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
          <span>Planned Calls</span>
          <input type="number" value={form.plannedCalls || ""} onChange={e => setForm({ ...form, plannedCalls: parseInt(e.target.value) || 0 })} placeholder="12" />
        </label>
        <label className="field">
          <span>Calls Completed</span>
          <input type="number" value={form.callsCompleted || ""} onChange={e => setForm({ ...form, callsCompleted: parseInt(e.target.value) || 0 })} placeholder="10" />
        </label>
        <label className="field">
          <span>Doctors Visited</span>
          <input type="number" value={form.doctorsVisited || ""} onChange={e => setForm({ ...form, doctorsVisited: parseInt(e.target.value) || 0 })} placeholder="8" />
        </label>
        <label className="field">
          <span>Chemists Visited</span>
          <input type="number" value={form.chemistsVisited || ""} onChange={e => setForm({ ...form, chemistsVisited: parseInt(e.target.value) || 0 })} placeholder="2" />
        </label>
        <label className="field">
          <span>Hospitals Visited</span>
          <input type="number" value={form.hospitalsVisited || ""} onChange={e => setForm({ ...form, hospitalsVisited: parseInt(e.target.value) || 0 })} placeholder="1" />
        </label>
        <label className="field">
          <span>Products Promoted</span>
          <input value={form.productsPromoted} onChange={e => setForm({ ...form, productsPromoted: e.target.value })} placeholder="e.g. API Brands, Consumables" />
        </label>
        <label className="field">
          <span>Samples Distributed</span>
          <input value={form.samplesDistributed} onChange={e => setForm({ ...form, samplesDistributed: e.target.value })} placeholder="e.g. 5 boxes" />
        </label>
        <label className="field">
          <span>Gifts Distributed</span>
          <input value={form.giftsDistributed} onChange={e => setForm({ ...form, giftsDistributed: e.target.value })} placeholder="e.g. 3 diaries" />
        </label>
        <label className="field">
          <span>Working Hours</span>
          <input value={form.workingHours} onChange={e => setForm({ ...form, workingHours: e.target.value })} placeholder="e.g. 8.0 Hours" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.employeeCode.trim() || !form.medicalRepresentative.trim()}>
          <Check size={16} /> Save Summary
        </button>
      </div>
    </section>
  );
}

export function ManagerDcrSummary() {
  const [list, setList] = useState<DcrSummaryRow[]>(initialSummaries);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<DcrSummaryRow | null>(null);

  const [divisionFilter, setDivisionFilter] = useState<string>("All");
  const [divisionFilterOpen, setDivisionFilterOpen] = useState(false);
  const [hqFilter, setHqFilter] = useState<string>("All");
  const [hqFilterOpen, setHqFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (divisionFilter === "All" || item.division === divisionFilter) &&
      (hqFilter === "All" || item.hq === hqFilter) &&
      (item.medicalRepresentative.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
        item.patch.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: DcrSummaryRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `SUMM${String(list.length + 1).padStart(3, "0")}`
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

  if (view === "add") return <SummaryForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <SummaryForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>Daily Call Report Summary</h2>
          <p>Review comprehensive Daily Call Report (DCR) statistics and metrics.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Summary</button>
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
              <th>Date</th>
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
              <th>Planned Calls</th>
              <th>Calls Completed</th>
              <th>Doctors Visited</th>
              <th>Chemists Visited</th>
              <th>Hospitals Visited</th>
              <th>Products Promoted</th>
              <th>Samples Distributed</th>
              <th>Gifts Distributed</th>
              <th>Working Hours</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.date)}</td>
                <td>{row.employeeCode}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.medicalRepresentative}</strong></td>
                <td>{row.division}</td>
                <td>{row.hq}</td>
                <td>{row.patch}</td>
                <td style={{ fontWeight: 600 }}>{row.plannedCalls}</td>
                <td style={{ fontWeight: 600 }}>{row.callsCompleted}</td>
                <td style={{ fontWeight: 600 }}>{row.doctorsVisited}</td>
                <td style={{ fontWeight: 600 }}>{row.chemistsVisited}</td>
                <td style={{ fontWeight: 600 }}>{row.hospitalsVisited}</td>
                <td>{row.productsPromoted}</td>
                <td>{row.samplesDistributed}</td>
                <td>{row.giftsDistributed}</td>
                <td>{row.workingHours}</td>
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
                <td colSpan={17} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No DCR summaries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
