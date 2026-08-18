"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type ExpenseRow = {
  id: string;
  expenseDate: string;
  employee: string;
  expenseType: string;
  amount: number;
  billNumber: string;
  attachment: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  remarks: string;
};

const initialExpenses: ExpenseRow[] = [];

function ExpenseForm({ row, onSave, onBack }: { row: any; onSave: (r: ExpenseRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<ExpenseRow>({
    id: row.id ?? "",
    expenseDate: row.expenseDate ?? new Date().toISOString().split("T")[0],
    employee: row.employee ?? "",
    expenseType: row.expenseType ?? "Travel",
    amount: row.amount ?? 0,
    billNumber: row.billNumber ?? "",
    attachment: row.attachment ?? "",
    approvalStatus: row.approvalStatus ?? "Pending",
    remarks: row.remarks ?? ""
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Daily MR Work</p>
          <h2>{row.id ? "Edit Expense Claim" : "Add Expense Claim"}</h2>
          <p>Submit a new daily business travel expense claim.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Expense Date</span>
          <input type="date" value={form.expenseDate} onChange={e => setForm({ ...form, expenseDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>* Employee Name</span>
          <input value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })} placeholder="Rahul Sharma" />
        </label>
        <label className="field">
          <span>Expense Type</span>
          <select value={form.expenseType} onChange={e => setForm({ ...form, expenseType: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Lodging">Lodging</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </label>
        <label className="field">
          <span>* Amount (INR)</span>
          <input type="number" value={form.amount || ""} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} placeholder="500" />
        </label>
        <label className="field">
          <span>Bill Number</span>
          <input value={form.billNumber} onChange={e => setForm({ ...form, billNumber: e.target.value })} placeholder="e.g. BILL-9821" />
        </label>
        <label className="field">
          <span>Attachment URL/File</span>
          <input value={form.attachment} onChange={e => setForm({ ...form, attachment: e.target.value })} placeholder="e.g. bill_image.jpg" />
        </label>
        <label className="field">
          <span>Approval Status</span>
          <select value={form.approvalStatus} onChange={e => setForm({ ...form, approvalStatus: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <label className="field">
          <span>Remarks</span>
          <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Cab fare for hospital visits" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.employee.trim() || form.amount <= 0}>
          <Check size={16} /> Save Expense Claim
        </button>
      </div>
    </section>
  );
}

export function ExpenseView() {
  const [list, setList] = useState<ExpenseRow[]>(initialExpenses);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<ExpenseRow | null>(null);

  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (typeFilter === "All" || item.expenseType === typeFilter) &&
      (statusFilter === "All" || item.approvalStatus === statusFilter) &&
      (item.employee.toLowerCase().includes(search.toLowerCase()) ||
        item.billNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.remarks.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: ExpenseRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `EXP${String(list.length + 1).padStart(3, "0")}`
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

  if (view === "add") return <ExpenseForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <ExpenseForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Daily MR Work</p>
          <h2>Expense</h2>
          <p>Create and track field forces business trip expenses.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Expense</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by employee, bill no or remarks..."
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
              <th>Expense Date</th>
              <th>Employee</th>
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Expense Type</span>
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
                    {["Travel", "Food", "Lodging", "Miscellaneous"].map(t => (
                      <button key={t} type="button" onClick={() => { setTypeFilter(t); setTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: typeFilter === t ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: typeFilter === t ? 600 : 400 }}>
                        {t}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setTypeFilter("All"); setTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>Amount</th>
              <th>Bill Number</th>
              <th>Attachment</th>
              <th style={{ minWidth: "140px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Approval Status</span>
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
              <th>Remarks</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.expenseDate)}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.employee}</strong></td>
                <td>{row.expenseType}</td>
                <td style={{ fontWeight: 600 }}>₹{row.amount.toFixed(2)}</td>
                <td>{row.billNumber}</td>
                <td style={{ color: "var(--ink)", textDecoration: "underline", fontSize: "13px" }}>{row.attachment}</td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: row.approvalStatus === "Approved" ? "#dcfce7" : row.approvalStatus === "Rejected" ? "#fee2e2" : "#f3f4f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: row.approvalStatus === "Approved" ? "#15803d" : row.approvalStatus === "Rejected" ? "#b91c1c" : "#374151"
                  }}>
                    {row.approvalStatus}
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
                    <Ban />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No expense records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
