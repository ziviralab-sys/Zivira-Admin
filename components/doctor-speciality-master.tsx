"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useState } from "react";

type AddressRow = {
  id: string;
  clinicName: string;
  address: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

const initialAddresses: AddressRow[] = [];

function AddressForm({ row, onSave, onBack }: { row: any; onSave: (r: AddressRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<AddressRow>({
    id: row.id ?? "",
    clinicName: row.clinicName ?? "",
    address: row.address ?? "",
    area: row.area ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    country: row.country ?? "India",
    pinCode: row.pinCode ?? ""
  });

  const isEdit = !!row.id;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{isEdit ? "Edit Address" : "Add Address"}</h2>
          <p>Maintain clinic or hospital address listings.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>Clinic / Hospital Name</span>
          <input value={form.clinicName} onChange={e => setForm({ ...form, clinicName: e.target.value })} placeholder="e.g. City Care Clinic" />
        </label>
        <label className="field">
          <span>Address</span>
          <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="e.g. No. 24, Anna Salai" />
        </label>
        <label className="field">
          <span>Area</span>
          <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g. T. Nagar" />
        </label>
        <label className="field">
          <span>City</span>
          <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="e.g. Chennai" />
        </label>
        <label className="field">
          <span>State</span>
          <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="e.g. Tamil Nadu" />
        </label>
        <label className="field">
          <span>Country</span>
          <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="e.g. India" />
        </label>
        <label className="field">
          <span>PIN Code</span>
          <input value={form.pinCode} onChange={e => setForm({ ...form, pinCode: e.target.value })} placeholder="e.g. 600017" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.clinicName.trim()}>
          <Check size={16} /> Add Address
        </button>
      </div>
    </section>
  );
}

export function DoctorSpecialityMaster() {
  const [addresses, setAddresses] = useState<AddressRow[]>(initialAddresses);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<AddressRow | null>(null);

  const filtered = addresses.filter(
    (a) =>
      a.clinicName.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(form: AddressRow) {
    if (view === "add") {
      const newAddr = {
        ...form,
        id: `ADDR${String(addresses.length + 1).padStart(3, "0")}`
      };
      setAddresses([...addresses, newAddr]);
    } else {
      setAddresses(addresses.map(a => a.id === form.id ? { ...form } : a));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setAddresses(addresses.filter(a => a.id !== id));
  }

  if (view === "add") return <AddressForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <AddressForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Address Master</h2>
          <p>Create and manage doctor clinic and hospital locations.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Address</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by clinic name or city..."
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

      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Clinic Name</th>
              <th>Address</th>
              <th>Area</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>PIN Code</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><strong style={{ color: "var(--ink)" }}>{row.clinicName}</strong></td>
                <td>{row.address}</td>
                <td>{row.area}</td>
                <td>{row.city}</td>
                <td>{row.state}</td>
                <td>{row.country}</td>
                <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{row.pinCode}</span></td>
                <td>
                  <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} type="button">
                    <Pencil size={15} />
                  </button>
                </td>
                <td>
                  <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} type="button">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No addresses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
