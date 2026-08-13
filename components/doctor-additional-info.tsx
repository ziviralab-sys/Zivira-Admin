"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type AdditionalInfoRow = {
  id: string;
  doctorName: string;
  dob: string;
  anniversaryDate: string;
  remarks: string;
  latitude: string;
  longitude: string;
};

const initialInfos: AdditionalInfoRow[] = [];

function InfoForm({ row, onSave, onBack }: { row: any; onSave: (r: AdditionalInfoRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<AdditionalInfoRow>({
    id: row.id ?? "",
    doctorName: row.doctorName ?? "",
    dob: row.dob ?? "",
    anniversaryDate: row.anniversaryDate ?? "",
    remarks: row.remarks ?? "",
    latitude: row.latitude ?? "",
    longitude: row.longitude ?? ""
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{row.id ? "Edit Additional Information" : "Add Additional Information"}</h2>
          <p>Maintain personal event logs and statuses for doctors.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Doctor Name</span>
          <input value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} placeholder="Dr. Rajesh Kumar" />
        </label>
        <label className="field">
          <span>Date of Birth</span>
          <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>Anniversary Date</span>
          <input type="date" value={form.anniversaryDate} onChange={e => setForm({ ...form, anniversaryDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>Remarks</span>
          <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Enter remarks" />
        </label>
        <label className="field">
          <span>Latitude</span>
          <input value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="e.g. 13.0827" />
        </label>
        <label className="field">
          <span>Longitude</span>
          <input value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="e.g. 80.2707" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.doctorName.trim()}>
          <Check size={16} /> Add Information
        </button>
      </div>
    </section>
  );
}

export function DoctorAdditionalInfo() {
  const [infos, setInfos] = useState<AdditionalInfoRow[]>(initialInfos);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<AdditionalInfoRow | null>(null);

  const filtered = infos.filter(
    (i) =>
      i.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      i.remarks.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(form: AdditionalInfoRow) {
    if (view === "add") {
      const newInfo = {
        ...form,
        id: `ADD${String(infos.length + 1).padStart(3, "0")}`
      };
      setInfos([...infos, newInfo]);
    } else {
      setInfos(infos.map(i => i.id === form.id ? { ...form } : i));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setInfos(infos.filter(i => i.id !== id));
  }

  if (view === "add") return <InfoForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <InfoForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Additional Information</h2>
          <p>Create and manage doctor personal detail milestones.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Information</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by doctor name..."
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
              <th>DOB</th>
              <th>Anniversary Date</th>
              <th>Remarks</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                 <td><strong style={{ color: "var(--ink)" }}>{row.doctorName}</strong></td>
                 <td>{formatDate(row.dob)}</td>
                 <td>{formatDate(row.anniversaryDate)}</td>
                 <td>{row.remarks}</td>
                 <td>{row.latitude}</td>
                 <td>{row.longitude}</td>
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
                 <td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                   No records found
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
