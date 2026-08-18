"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, Ban } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/back-button";

type ProductivityRow = {
  id: string;
  rank: number;
  employee: string;
  hq: string;
  doctorCalls: number;
  tourCompliance: number;
  productivityScore: number;
};

const initialData: ProductivityRow[] = [];

function ProductivityDashboardForm({ row, onSave, onBack }: { row: any; onSave: (r: ProductivityRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<ProductivityRow>({
    id: row.id ?? "",
    rank: row.rank ?? 1,
    employee: row.employee ?? "",
    hq: row.hq ?? "",
    doctorCalls: row.doctorCalls ?? 0,
    tourCompliance: row.tourCompliance ?? 0,
    productivityScore: row.productivityScore ?? 0,
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>{isEdit ? "Edit Productivity Data" : "Add Productivity Data"}</h2>
          <p>Configure general profiles, mappings, and status settings.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button">
          <RotateCcw size={16} /> Back
        </button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Rank</span>
          <input type="number" value={form.rank || ""} onChange={e => setForm({ ...form, rank: parseInt(e.target.value) || 0 })} placeholder="e.g. 1" />
        </label>
        <label className="field">
          <span>* Employee</span>
          <input value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })} placeholder="e.g. Rahul Sharma" />
        </label>
        <label className="field">
          <span>* HQ</span>
          <input value={form.hq} onChange={e => setForm({ ...form, hq: e.target.value })} placeholder="e.g. Mumbai" />
        </label>
        <label className="field">
          <span>Doctor Calls</span>
          <input type="number" value={form.doctorCalls || ""} onChange={e => setForm({ ...form, doctorCalls: parseInt(e.target.value) || 0 })} placeholder="e.g. 120" />
        </label>
        <label className="field">
          <span>Tour Compliance (%)</span>
          <input type="number" value={form.tourCompliance || ""} onChange={e => setForm({ ...form, tourCompliance: parseFloat(e.target.value) || 0 })} placeholder="e.g. 95" />
        </label>
        <label className="field">
          <span>Productivity Score</span>
          <input type="number" value={form.productivityScore || ""} onChange={e => setForm({ ...form, productivityScore: parseFloat(e.target.value) || 0 })} placeholder="e.g. 88.5" />
        </label>

        <button
          className="button"
          style={{ marginTop: "12px" }}
          onClick={() => onSave(form)}
          type="button"
          disabled={!form.employee.trim() || !form.hq.trim()}
        >
          <Check size={16} /> Save Data
        </button>
      </div>
    </section>
  );
}

export function ProductivityDashboardMaster() {
  const [list, setList] = useState<ProductivityRow[]>(initialData);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<ProductivityRow | null>(null);

  const filtered = list.filter(
    (item) =>
      item.employee.toLowerCase().includes(search.toLowerCase()) ||
      item.hq.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(form: ProductivityRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `PROD${String(list.length + 1).padStart(3, "0")}`
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

  if (view === "add") return <ProductivityDashboardForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <ProductivityDashboardForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Manager Activity Report</p>
          <h2>Productivity Dashboard</h2>
          <p>Configure general profiles, mappings, and status settings.</p>
        </div>
        <div className="subdivision-actions">
          <BackButton />
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Data</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by employee or HQ..."
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
              <th>Rank</th>
              <th>Employee</th>
              <th>HQ</th>
              <th>Doctor Calls</th>
              <th>Tour Compliance</th>
              <th>Productivity Score</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.rank}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.employee}</strong></td>
                <td>{row.hq}</td>
                <td>{row.doctorCalls}</td>
                <td>{row.tourCompliance}%</td>
                <td>{row.productivityScore}</td>
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
                <td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No productivity data configured
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
