"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, X, ChevronDown } from "lucide-react";
import { useState } from "react";

type InputRow = {
  id: string;
  inputName: string;
  category: string;
  unit: string;
  status: "Active" | "Inactive";
};

const initialInputs: InputRow[] = [];

function InputForm({ row, onSave, onBack }: { row: any; onSave: (r: InputRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<InputRow>({
    id: row.id ?? "",
    inputName: row.inputName ?? "",
    category: row.category ?? "Active Pharmaceutical Ingredient (API)",
    unit: row.unit ?? "Kg",
    status: row.status ?? "Active"
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Input" : "Add Input"}</h2>
          <p>Configure input materials distributed to the field force.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Input Name</span>
          <input value={form.inputName} onChange={e => setForm({ ...form, inputName: e.target.value })} placeholder="e.g. Visual Aid" />
        </label>
        <label className="field">
          <span>Category</span>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Active Pharmaceutical Ingredient (API)">Active Pharmaceutical Ingredient (API)</option>
            <option value="Excipient">Excipient</option>
            <option value="Solvent">Solvent</option>
            <option value="Packaging Material">Packaging Material</option>
            <option value="Printing Material">Printing Material</option>
            <option value="Cleaning Material">Cleaning Material</option>
            <option value="Laboratory Reagent">Laboratory Reagent</option>
            <option value="Consumable">Consumable</option>
          </select>
        </label>
        <label className="field">
          <span>Unit</span>
          <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Kg">Kg</option>
            <option value="Gram (g)">Gram (g)</option>
            <option value="mg">mg</option>
            <option value="Litre">Litre</option>
            <option value="mL">mL</option>
            <option value="Nos">Nos</option>
            <option value="Box">Box</option>
            <option value="Roll">Roll</option>
            <option value="Tube">Tube</option>
            <option value="Bottle">Bottle</option>
            <option value="Sachet">Sachet</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.inputName.trim()}>
          <Check size={16} /> Add Input
        </button>
      </div>
    </section>
  );
}

export function InputMaster() {
  const [inputs, setInputs] = useState<InputRow[]>(initialInputs);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<InputRow | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [unitFilter, setUnitFilter] = useState<string>("All");
  const [unitFilterOpen, setUnitFilterOpen] = useState(false);

  const filtered = inputs.filter(
    (i) =>
      (statusFilter === "All" ||
        (statusFilter === "Active" && i.status === "Active") ||
        (statusFilter === "Inactive" && i.status === "Inactive")) &&
      (categoryFilter === "All" || i.category === categoryFilter) &&
      (unitFilter === "All" || i.unit === unitFilter) &&
      (i.inputName.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: InputRow) {
    if (view === "add") {
      const newInput = {
        ...form,
        id: `INP${String(inputs.length + 1).padStart(3, "0")}`
      };
      setInputs([...inputs, newInput]);
    } else {
      setInputs(inputs.map(i => i.id === form.id ? { ...form } : i));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setInputs(inputs.map(i => i.id === id ? { ...i, status: "Inactive" as const } : i));
  }

  if (view === "add") return <InputForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <InputForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Input Master</h2>
          <p>Create and manage promotional inputs and gifts for the field force.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Input</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by input name or type..."
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
              <th>Input Code</th>
              <th>Input Name</th>
              <th style={{ minWidth: "180px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Category</span>
                  <button
                    type="button"
                    onClick={() => setCategoryFilterOpen(!categoryFilterOpen)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {categoryFilterOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      minWidth: "220px",
                      display: "flex",
                      flexDirection: "column",
                      padding: "4px 0",
                      maxHeight: "200px",
                      overflowY: "auto"
                    }}
                  >
                    {[
                      "Active Pharmaceutical Ingredient (API)",
                      "Excipient",
                      "Solvent",
                      "Packaging Material",
                      "Printing Material",
                      "Cleaning Material",
                      "Laboratory Reagent",
                      "Consumable"
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { setCategoryFilter(cat); setCategoryFilterOpen(false); }}
                        style={{
                          padding: "6px 12px",
                          textAlign: "left",
                          background: categoryFilter === cat ? "var(--line)" : "none",
                          border: "none",
                          color: "var(--ink)",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: categoryFilter === cat ? 600 : 400
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setCategoryFilter("All"); setCategoryFilterOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        borderTop: "1px solid var(--border)",
                        background: "none",
                        color: "var(--muted)",
                        fontSize: "11px",
                        cursor: "pointer"
                      }}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "120px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Unit</span>
                  <button
                    type="button"
                    onClick={() => setUnitFilterOpen(!unitFilterOpen)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {unitFilterOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      minWidth: "120px",
                      display: "flex",
                      flexDirection: "column",
                      padding: "4px 0",
                      maxHeight: "200px",
                      overflowY: "auto"
                    }}
                  >
                    {[
                      "Kg",
                      "Gram (g)",
                      "mg",
                      "Litre",
                      "mL",
                      "Nos",
                      "Box",
                      "Roll",
                      "Tube",
                      "Bottle",
                      "Sachet"
                    ].map((ut) => (
                      <button
                        key={ut}
                        type="button"
                        onClick={() => { setUnitFilter(ut); setUnitFilterOpen(false); }}
                        style={{
                          padding: "6px 12px",
                          textAlign: "left",
                          background: unitFilter === ut ? "var(--line)" : "none",
                          border: "none",
                          color: "var(--ink)",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: unitFilter === ut ? 600 : 400
                        }}
                      >
                        {ut}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setUnitFilter("All"); setUnitFilterOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        borderTop: "1px solid var(--border)",
                        background: "none",
                        color: "var(--muted)",
                        fontSize: "11px",
                        cursor: "pointer"
                      }}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "130px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Status</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilterOpen(!statusFilterOpen)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {statusFilterOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      minWidth: "110px",
                      display: "flex",
                      flexDirection: "column",
                      padding: "4px 0"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => { setStatusFilter("Active"); setStatusFilterOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        background: statusFilter === "Active" ? "var(--line)" : "none",
                        border: "none",
                        color: "var(--ink)",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: statusFilter === "Active" ? 600 : 400
                      }}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter("Inactive"); setStatusFilterOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        background: statusFilter === "Inactive" ? "var(--line)" : "none",
                        border: "none",
                        color: "var(--ink)",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: statusFilter === "Inactive" ? 600 : 400
                      }}
                    >
                      Inactive
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter("All"); setStatusFilterOpen(false); }}
                      style={{
                        padding: "6px 12px",
                        textAlign: "left",
                        borderTop: "1px solid var(--border)",
                        background: "none",
                        color: "var(--muted)",
                        fontSize: "11px",
                        cursor: "pointer"
                      }}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </th>
              <th>Edit</th>
              <th>Deactivate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: 600 }}>{row.id}</td>
                <td><strong style={{ color: "var(--ink)" }}>{row.inputName}</strong></td>
                <td>{row.category}</td>
                <td>{row.unit}</td>
                <td>
                  <span style={{ 
                    padding: "2px 8px", 
                    borderRadius: "999px", 
                    fontSize: "11px", 
                    fontWeight: 600, 
                    background: row.status === "Active" ? "#10b98115" : "#ef444415", 
                    color: row.status === "Active" ? "#10b981" : "#ef4444",
                    border: row.status === "Active" ? "1px solid #10b98125" : "1px solid #ef444425"
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
                  <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} type="button" disabled={row.status === "Inactive"}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No inputs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
