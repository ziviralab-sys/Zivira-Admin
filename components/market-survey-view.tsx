"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type SurveyRow = {
  id: string;
  surveyDate: string;
  employee: string;
  hq: string;
  patch: string;
  chemist: string;
  competitorCompany: string;
  competitorBrand: string;
  competitorProduct: string;
  competitorMrp: number;
  availability: "Available" | "Out of Stock" | "Short Supply";
  feedback: string;
  remarks: string;
};

const initialSurveys: SurveyRow[] = [];

function SurveyForm({ row, onSave, onBack }: { row: any; onSave: (r: SurveyRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<SurveyRow>({
    id: row.id ?? "",
    surveyDate: row.surveyDate ?? new Date().toISOString().split("T")[0],
    employee: row.employee ?? "",
    hq: row.hq ?? "Chennai Central HQ",
    patch: row.patch ?? "",
    chemist: row.chemist ?? "",
    competitorCompany: row.competitorCompany ?? "",
    competitorBrand: row.competitorBrand ?? "",
    competitorProduct: row.competitorProduct ?? "",
    competitorMrp: row.competitorMrp ?? 0,
    availability: row.availability ?? "Available",
    feedback: row.feedback ?? "",
    remarks: row.remarks ?? ""
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Daily MR Work</p>
          <h2>{row.id ? "Edit Market Survey" : "Add Market Survey"}</h2>
          <p>Record competitor products pricing, stock levels and retailer feedback.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Survey Date</span>
          <input type="date" value={form.surveyDate} onChange={e => setForm({ ...form, surveyDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
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
          <span>Chemist</span>
          <input value={form.chemist} onChange={e => setForm({ ...form, chemist: e.target.value })} placeholder="e.g. Apollo Pharmacy" />
        </label>
        <label className="field">
          <span>Competitor Company</span>
          <input value={form.competitorCompany} onChange={e => setForm({ ...form, competitorCompany: e.target.value })} placeholder="e.g. Abbott Labs" />
        </label>
        <label className="field">
          <span>Competitor Brand</span>
          <input value={form.competitorBrand} onChange={e => setForm({ ...form, competitorBrand: e.target.value })} placeholder="e.g. Thyronorm" />
        </label>
        <label className="field">
          <span>Competitor Product</span>
          <input value={form.competitorProduct} onChange={e => setForm({ ...form, competitorProduct: e.target.value })} placeholder="e.g. Levothyroxine 50mcg" />
        </label>
        <label className="field">
          <span>Competitor MRP (INR)</span>
          <input type="number" value={form.competitorMrp || ""} onChange={e => setForm({ ...form, competitorMrp: parseFloat(e.target.value) || 0 })} placeholder="120" />
        </label>
        <label className="field">
          <span>Availability</span>
          <select value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Short Supply">Short Supply</option>
          </select>
        </label>
        <label className="field">
          <span>Chemist/Retailer Feedback</span>
          <input value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} placeholder="High demand during winter season" />
        </label>
        <label className="field">
          <span>Remarks</span>
          <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Stock issues reported by local distributors" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.employee.trim()}>
          <Check size={16} /> Save Survey Details
        </button>
      </div>
    </section>
  );
}

export function MarketSurveyView() {
  const [list, setList] = useState<SurveyRow[]>(initialSurveys);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<SurveyRow | null>(null);

  const [hqFilter, setHqFilter] = useState<string>("All");
  const [hqFilterOpen, setHqFilterOpen] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("All");
  const [availabilityFilterOpen, setAvailabilityFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (hqFilter === "All" || item.hq === hqFilter) &&
      (availabilityFilter === "All" || item.availability === availabilityFilter) &&
      (item.employee.toLowerCase().includes(search.toLowerCase()) ||
        item.chemist.toLowerCase().includes(search.toLowerCase()) ||
        item.competitorBrand.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: SurveyRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `SURV${String(list.length + 1).padStart(3, "0")}`
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

  if (view === "add") return <SurveyForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <SurveyForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Daily MR Work</p>
          <h2>Market Survey</h2>
          <p>Collect and review drug availability and competitor price logs.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Survey</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by employee, chemist or brand..."
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
              <th>Survey Date</th>
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
              <th>Chemist</th>
              <th>Competitor Company</th>
              <th>Competitor Brand</th>
              <th>Competitor Product</th>
              <th>Competitor MRP</th>
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Availability</span>
                  <button
                    type="button"
                    onClick={() => setAvailabilityFilterOpen(!availabilityFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {availabilityFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "140px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Available", "Out of Stock", "Short Supply"].map(av => (
                      <button key={av} type="button" onClick={() => { setAvailabilityFilter(av); setAvailabilityFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: availabilityFilter === av ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: availabilityFilter === av ? 600 : 400 }}>
                        {av}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setAvailabilityFilter("All"); setAvailabilityFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>Feedback</th>
              <th>Remarks</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.surveyDate)}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.employee}</strong></td>
                <td>{row.hq}</td>
                <td>{row.patch}</td>
                <td>{row.chemist}</td>
                <td>{row.competitorCompany}</td>
                <td>{row.competitorBrand}</td>
                <td>{row.competitorProduct}</td>
                <td style={{ fontWeight: 600 }}>₹{row.competitorMrp.toFixed(2)}</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.availability === "Available" ? "#dcfce7" : row.availability === "Out of Stock" ? "#fee2e2" : "#fef9c3",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.availability === "Available" ? "#15803d" : row.availability === "Out of Stock" ? "#b91c1c" : "#a16207"
                  }}>
                    {row.availability}
                  </span>
                </td>
                <td>{row.feedback}</td>
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
                <td colSpan={14} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No survey records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
