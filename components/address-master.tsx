"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/back-button";

type AddressRow = {
  id: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  status: "Active" | "Inactive";
};

const initialAddresses: AddressRow[] = [];

function AddressForm({ row, onSave, onBack }: { row: any; onSave: (r: AddressRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<AddressRow>({
    id: row.id ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "Tamil Nadu",
    pin: row.pin ?? "",
    status: row.status ?? "Active"
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Address" : "Add Address"}</h2>
          <p>Maintain contact and location details.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button">
          <RotateCcw size={16} /> Back
        </button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Address</span>
          <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="e.g. Plot No 42, Metro Avenue" />
        </label>
        <label className="field">
          <span>* City</span>
          <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="e.g. Chennai" />
        </label>
        <label className="field">
          <span>State</span>
          <select
            value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
          </select>
        </label>
        <label className="field">
          <span>* PIN Code</span>
          <input value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value })} placeholder="e.g. 600001" />
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
          disabled={!form.address.trim() || !form.city.trim() || !form.pin.trim()}
        >
          <Check size={16} /> Save Address
        </button>
      </div>
    </section>
  );
}

export function AddressMaster() {
  const [list, setList] = useState<AddressRow[]>(initialAddresses);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<AddressRow | null>(null);

  const [stateFilter, setStateFilter] = useState("All");
  const [stateFilterOpen, setStateFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(
    (item) =>
      (stateFilter === "All" || item.state === stateFilter) &&
      (statusFilter === "All" || item.status === statusFilter) &&
      (item.address.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase()) ||
        item.pin.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSave(form: AddressRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `ADD${String(list.length + 1).padStart(3, "0")}`
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

  if (view === "add") return <AddressForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <AddressForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Address</h2>
          <p>Configure general profiles, mappings, and status settings.</p>
        </div>
        <div className="subdivision-actions">
          <BackButton />
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Address</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by address, city or pin..."
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
              <th>Address</th>
              <th>City</th>
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>State</span>
                  <button
                    type="button"
                    onClick={() => setStateFilterOpen(!stateFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {stateFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "130px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Tamil Nadu", "Karnataka", "Kerala", "Maharashtra", "Delhi"].map(st => (
                      <button key={st} type="button" onClick={() => { setStateFilter(st); setStateFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: stateFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: stateFilter === st ? 600 : 400 }}>
                        {st}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setStateFilter("All"); setStateFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>PIN</th>
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
                <td><strong style={{ color: "var(--ink)" }}>{row.address}</strong></td>
                <td>{row.city}</td>
                <td>{row.state}</td>
                <td>{row.pin}</td>
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
                    <Ban />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No addresses configured
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
