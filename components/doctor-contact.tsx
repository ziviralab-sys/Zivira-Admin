"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, Ban } from "lucide-react";
import { useState } from "react";

type ContactRow = {
  id: string;
  doctorName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  specialty: string;
};

const initialContacts: ContactRow[] = [];

function ContactForm({ row, onSave, onBack }: { row: any; onSave: (r: ContactRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<ContactRow>({
    id: row.id ?? "",
    doctorName: row.doctorName ?? "",
    mobile: row.mobile ?? "",
    whatsapp: row.whatsapp ?? "",
    email: row.email ?? "",
    specialty: row.specialty ?? ""
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{row.id ? "Edit Contact Details" : "Add Contact Details"}</h2>
          <p>Maintain doctor contact information.</p>
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
          <span>WhatsApp Number</span>
          <input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="9876543210" />
        </label>
        <label className="field">
          <span>Email Address</span>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="rajesh@example.com" />
        </label>
        <label className="field">
          <span>Specialty</span>
          <input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="General Physician" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.doctorName.trim()}>
          <Check size={16} /> {row.id ? "Save Contact" : "Add Contact"}
        </button>
      </div>
    </section>
  );
}

export function DoctorContact() {
  const [contacts, setContacts] = useState<ContactRow[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<ContactRow | null>(null);

  const filtered = contacts.filter(
    (c) =>
      c.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      c.whatsapp.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(form: ContactRow) {
    if (view === "add") {
      const newCon = {
        ...form,
        id: `CON${String(contacts.length + 1).padStart(3, "0")}`
      };
      setContacts([...contacts, newCon]);
    } else {
      setContacts(contacts.map(c => c.id === form.id ? { ...form } : c));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setContacts(contacts.filter(c => c.id !== id));
  }

  if (view === "add") return <ContactForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <ContactForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Contact Details</h2>
          <p>Create and manage doctor phone numbers and email addresses.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Contact</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by doctor or email..."
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
              <th>WhatsApp</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><strong style={{ color: "var(--ink)" }}>{row.doctorName}</strong></td>
                <td>{row.mobile}</td>
                <td>{row.whatsapp}</td>
                <td>{row.email}</td>
                <td>{row.specialty}</td>
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
                <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No contact details found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
