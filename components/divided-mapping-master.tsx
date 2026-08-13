"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/back-button";

type MappingRow = {
  id: string;
  bank: string;
  accountNo: string;
  ifsc: string;
  status: "Active" | "Inactive";
};

const initialMappings: MappingRow[] = [];

function MappingForm({ row, onSave, onBack }: { row: any; onSave: (r: MappingRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<MappingRow>({
    id: row.id ?? "",
    bank: row.bank ?? "",
    accountNo: row.accountNo ?? "",
    ifsc: row.ifsc ?? "",
    status: row.status ?? "Active"
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Account Mapping" : "Add Account Mapping"}</h2>
          <p>Maintain bank registration and account profiles.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button">
          <RotateCcw size={16} /> Back
        </button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Bank</span>
          <input value={form.bank} onChange={e => setForm({ ...form, bank: e.target.value })} placeholder="e.g. HDFC Bank" />
        </label>
        <label className="field">
          <span>* Account No</span>
          <input value={form.accountNo} onChange={e => setForm({ ...form, accountNo: e.target.value })} placeholder="e.g. 50100234567890" />
        </label>
        <label className="field">
          <span>* IFSC</span>
          <input value={form.ifsc} onChange={e => setForm({ ...form, ifsc: e.target.value.toUpperCase() })} placeholder="e.g. HDFC0000123" />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <button
          className="button"
          style={{ marginTop: "12px" }}
          onClick={() => onSave(form)}
          type="button"
          disabled={!form.bank.trim() || !form.accountNo.trim() || !form.ifsc.trim()}
        >
          <Check size={16} /> Save Mapping
        </button>
      </div>
    </section>
  );
}

export function DividedMappingMaster() {
  const [list, setList] = useState<MappingRow[]>(initialMappings);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<MappingRow | null>(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (statusFilter === "All" || item.status === statusFilter) &&
      (item.bank.toLowerCase().includes(search.toLowerCase()) ||
        item.accountNo.toLowerCase().includes(search.toLowerCase()) ||
        item.ifsc.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: MappingRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `MAP${String(list.length + 1).padStart(3, "0")}`
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

  if (view === "add") return <MappingForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <MappingForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Divided Mapping</h2>
          <p>Configure general profiles, mappings, and status settings.</p>
        </div>
        <div className="subdivision-actions">
          <BackButton />
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Mapping</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by bank, account or IFSC..."
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
              <th>Bank</th>
              <th>Account No</th>
              <th>IFSC</th>
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
                    {["Active", "Inactive"].map(st => (
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
                <td><strong style={{ color: "var(--ink)" }}>{row.bank}</strong></td>
                <td>{row.accountNo}</td>
                <td>{row.ifsc}</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.status === "Active" ? "#dcfce7" : "#fee2e2",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.status === "Active" ? "#15803d" : "#b91c1c"
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
                <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No mappings configured
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
