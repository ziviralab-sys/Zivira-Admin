"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/back-button";

type ReportRow = {
  id: string;
  monthly: string;
  team: string;
  budget: number;
};

const initialReports: ReportRow[] = [];

function ExpenseReportsForm({ row, onSave, onBack }: { row: any; onSave: (r: ReportRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<ReportRow>({
    id: row.id ?? "",
    monthly: row.monthly ?? "",
    team: row.team ?? "",
    budget: row.budget ?? 0
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Expense</p>
          <h2>{isEdit ? "Edit Report" : "Add Report"}</h2>
          <p>Configure general profiles, mappings, and status settings.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button">
          <RotateCcw size={16} /> Back
        </button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Monthly</span>
          <input value={form.monthly} onChange={e => setForm({ ...form, monthly: e.target.value })} placeholder="e.g. January 2024" />
        </label>
        <label className="field">
          <span>* Team</span>
          <input value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} placeholder="e.g. Alpha Team" />
        </label>
        <label className="field">
          <span>* Budget</span>
          <input type="number" value={form.budget || ""} onChange={e => setForm({ ...form, budget: parseFloat(e.target.value) || 0 })} placeholder="e.g. 50000" />
        </label>
        
        <button
          className="button"
          style={{ marginTop: "12px" }}
          onClick={() => onSave(form)}
          type="button"
          disabled={!form.monthly.trim() || !form.team.trim() || form.budget <= 0}
        >
          <Check size={16} /> Save Report
        </button>
      </div>
    </section>
  );
}

export function ExpenseReportsMaster() {
  const [list, setList] = useState<ReportRow[]>(initialReports);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<ReportRow | null>(null);

  const filtered = list.filter(
    (item) =>
      item.monthly.toLowerCase().includes(search.toLowerCase()) ||
      item.team.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(form: ReportRow) {
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

  if (view === "add") return <ExpenseReportsForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <ExpenseReportsForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Expense</p>
          <h2>Reports</h2>
          <p>Configure general profiles, mappings, and status settings.</p>
        </div>
        <div className="subdivision-actions">
          <BackButton />
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Report</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by month or team..."
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

      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Monthly</th>
              <th>Team</th>
              <th>Budget</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><strong style={{ color: "var(--ink)" }}>{row.monthly}</strong></td>
                <td>{row.team}</td>
                <td>₹{row.budget}</td>
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
                <td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No reports configured
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
