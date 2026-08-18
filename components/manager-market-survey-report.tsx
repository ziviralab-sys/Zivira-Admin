"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type MarketSurveyReportRow = {
  id: string;
  surveyDate: string;
  mr: string;
  hq: string;
  competitorCompany: string;
  competitorBrand: string;
  competitorProduct: string;
  mrp: number;
  availability: "Available" | "Out of Stock" | "Short Supply";
  marketDemand: "High" | "Medium" | "Low";
  approval: "Approved" | "Pending" | "Rejected";
};

const initialReports: MarketSurveyReportRow[] = [];

function ReportForm({ row, onSave, onBack }: { row: any; onSave: (r: MarketSurveyReportRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<MarketSurveyReportRow>({
    id: row.id ?? "",
    surveyDate: row.surveyDate ?? new Date().toISOString().split("T")[0],
    mr: row.mr ?? "",
    hq: row.hq ?? "Chennai Central HQ",
    competitorCompany: row.competitorCompany ?? "",
    competitorBrand: row.competitorBrand ?? "",
    competitorProduct: row.competitorProduct ?? "",
    mrp: row.mrp ?? 0,
    availability: row.availability ?? "Available",
    marketDemand: row.marketDemand ?? "Medium",
    approval: row.approval ?? "Pending"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>{row.id ? "Edit Market Survey Report" : "Add Market Survey Report"}</h2>
          <p>Record competitor products, pricing, stock levels and demand trends.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Survey Date</span>
          <input type="date" value={form.surveyDate} onChange={e => setForm({ ...form, surveyDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>* MR Name</span>
          <input value={form.mr} onChange={e => setForm({ ...form, mr: e.target.value })} placeholder="Rahul Sharma" />
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
          <span>MRP (INR)</span>
          <input type="number" value={form.mrp || ""} onChange={e => setForm({ ...form, mrp: parseFloat(e.target.value) || 0 })} placeholder="120" />
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
          <span>Market Demand</span>
          <select value={form.marketDemand} onChange={e => setForm({ ...form, marketDemand: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label className="field">
          <span>Approval</span>
          <select value={form.approval} onChange={e => setForm({ ...form, approval: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.mr.trim()}>
          <Check size={16} /> Save Survey Report
        </button>
      </div>
    </section>
  );
}

export function ManagerMarketSurveyReport() {
  const [list, setList] = useState<MarketSurveyReportRow[]>(initialReports);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<MarketSurveyReportRow | null>(null);

  const [hqFilter, setHqFilter] = useState<string>("All");
  const [hqFilterOpen, setHqFilterOpen] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("All");
  const [availabilityFilterOpen, setAvailabilityFilterOpen] = useState(false);
  const [demandFilter, setDemandFilter] = useState<string>("All");
  const [demandFilterOpen, setDemandFilterOpen] = useState(false);
  const [approvalFilter, setApprovalFilter] = useState<string>("All");
  const [approvalFilterOpen, setApprovalFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (hqFilter === "All" || item.hq === hqFilter) &&
      (availabilityFilter === "All" || item.availability === availabilityFilter) &&
      (demandFilter === "All" || item.marketDemand === demandFilter) &&
      (approvalFilter === "All" || item.approval === approvalFilter) &&
      (item.mr.toLowerCase().includes(search.toLowerCase()) ||
        item.competitorBrand.toLowerCase().includes(search.toLowerCase()) ||
        item.competitorCompany.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: MarketSurveyReportRow) {
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
          <h2>Market Survey Report</h2>
          <p>Review comprehensive drug brand pricing, stock lists and market demand ratios.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Report</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by MR, company or brand..."
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
              <th>MR</th>
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
              <th>Competitor Company</th>
              <th>Competitor Brand</th>
              <th>Competitor Product</th>
              <th>MRP</th>
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
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Market Demand</span>
                  <button
                    type="button"
                    onClick={() => setDemandFilterOpen(!demandFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {demandFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "130px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["High", "Medium", "Low"].map(dm => (
                      <button key={dm} type="button" onClick={() => { setDemandFilter(dm); setDemandFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: demandFilter === dm ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: demandFilter === dm ? 600 : 400 }}>
                        {dm}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setDemandFilter("All"); setDemandFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "140px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Approval</span>
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
                <td>{formatDate(row.surveyDate)}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.mr}</strong></td>
                <td>{row.hq}</td>
                <td>{row.competitorCompany}</td>
                <td>{row.competitorBrand}</td>
                <td>{row.competitorProduct}</td>
                <td style={{ fontWeight: 600 }}>₹{row.mrp.toFixed(2)}</td>
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
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.marketDemand === "High" ? "#dcfce7" : row.marketDemand === "Low" ? "#fee2e2" : "#fef9c3",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.marketDemand === "High" ? "#15803d" : row.marketDemand === "Low" ? "#b91c1c" : "#a16207"
                  }}>
                    {row.marketDemand}
                  </span>
                </td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.approval === "Approved" ? "#dcfce7" : row.approval === "Rejected" ? "#fee2e2" : "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.approval === "Approved" ? "#15803d" : row.approval === "Rejected" ? "#b91c1c" : "#374151"
                  }}>
                    {row.approval}
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
                <td colSpan={12} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No survey reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
