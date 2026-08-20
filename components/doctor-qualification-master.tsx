"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, X, Ban } from "lucide-react";
import { useState } from "react";

type DealerMappingRow = {
  id: string;
  doctorName: string;
  mobile: string;
  specialty: string;
  stockistField: string;
  chemistField: string;
  distributorField: string;
};

const initialDealerMappings: DealerMappingRow[] = [];

function DealerMappingForm({ row, onSave, onBack }: { row: any; onSave: (r: DealerMappingRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<DealerMappingRow>({
    id: row.id ?? "",
    doctorName: row.doctorName ?? "",
    mobile: row.mobile ?? "",
    specialty: row.specialty ?? "",
    stockistField: row.stockistField ?? "",
    chemistField: row.chemistField ?? "",
    distributorField: row.distributorField ?? ""
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{row.id ? "Edit Dealer Mapping" : "Add Dealer Mapping"}</h2>
          <p>Map doctors to local stockists and retail chemists/dealers.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Doctor Name</span>
          <input value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} placeholder="Dr. Rajesh Kumar" />
        </label>
        <label className="field">
          <span>Mobile Number</span>
          <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="9876543210" />
        </label>
        <label className="field">
          <span>Specialty</span>
          <input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="General Physician" />
        </label>
        <label className="field">
          <span>Stocklist</span>
          <input value={form.stockistField} onChange={e => setForm({ ...form, stockistField: e.target.value })} placeholder="Enter Stocklist Name" />
        </label>
        <label className="field">
          <span>Chemist</span>
          <input value={form.chemistField} onChange={e => setForm({ ...form, chemistField: e.target.value })} placeholder="Enter Chemist Name" />
        </label>
        <label className="field">
          <span>Distributor</span>
          <input value={form.distributorField} onChange={e => setForm({ ...form, distributorField: e.target.value })} placeholder="Enter Distributor Name" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.doctorName.trim()}>
          <Check size={16} /> Add Dealer Mapping
        </button>
      </div>
    </section>
  );
}

export function DoctorQualificationMaster() {
  const [mappings, setMappings] = useState<DealerMappingRow[]>(initialDealerMappings);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<DealerMappingRow | null>(null);

  const filtered = mappings.filter(
    (m) =>
      m.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      m.stockistField.toLowerCase().includes(search.toLowerCase()) ||
      m.chemistField.toLowerCase().includes(search.toLowerCase()) ||
      m.distributorField.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(form: DealerMappingRow) {
    if (view === "add") {
      const newMap = {
        ...form,
        id: `DM${String(mappings.length + 1).padStart(3, "0")}`
      };
      setMappings([...mappings, newMap]);
    } else {
      setMappings(mappings.map(m => m.id === form.id ? { ...form } : m));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setMappings(mappings.filter(m => m.id !== id));
  }

  if (view === "add") return <DealerMappingForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <DealerMappingForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Dealer Mapping</h2>
          <p>Map doctors to local stockists and retail chemists/dealers.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Mapping</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by doctor, stockist or chemist..."
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
              <th>Doctor Name</th>
              <th>Mobile Number</th>
              <th>Speciality</th>
              <th>Stocklist</th>
              <th>Chemist</th>
              <th>Distributor</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                 <td><strong style={{ color: "var(--ink)" }}>{row.doctorName}</strong></td>
                 <td>{row.mobile}</td>
                 <td>{row.specialty}</td>
                 <td>{row.stockistField}</td>
                 <td><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{row.chemistField}</span></td>
                 <td>{row.distributorField}</td>
                <td>
                  <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} type="button">
                    <Pencil size={15} />
                  </button>
                </td>
                <td>
                  <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} type="button">
                    <Ban />
                  </button>
                </td>
              </tr>
            ))}
             {filtered.length === 0 && (
               <tr>
                 <td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                   No mappings found
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
