"use client";

import { Check, Plus, RotateCcw, SlidersHorizontal, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient, type PaginationInfo } from "@/lib/api-client";
import { PaginationControls } from "./pagination-controls";

type ListedDoctorRow = {
  id: string;
  code: string;
  name: string;
  specialty: string;
  qualification: string;
  category: string;
  mobile: string;
  city: string;
  status: "Active" | "Inactive";
};

const initialDoctors: ListedDoctorRow[] = [];

export function ListedDoctorMaster() {
  const [list, setList] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [activeFormTab, setActiveFormTab] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchData(pagination.page);
  }, []);

  async function fetchData(page: number) {
    try {
      setLoading(true);
      const res = await apiClient.doctors({ page, limit: pagination.limit });
      setList(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }

  // Form inputs for 7 tabs
  const [form, setForm] = useState({
    code: "",
    name: "",
    specialty: "Ophthalmology",
    qualification: "MBBS, MD",
    category: "General",
    mobile: "9876543210",
    city: "Chennai",
    status: "Active" as "Active" | "Inactive",

    // Address
    clinicName: "",
    address: "",
    area: "",
    state: "Tamil Nadu",
    country: "India",
    pinCode: "",

    // Classification
    potential: "High",
    visitFrequency: "Fortnight",

    // Territory Mapping
    patch: "T. Nagar",

    // Dealer Mapping
    stockist: "Zivira Stockist Chennai",
    chemist: "Apollo Pharmacy",

    // Contact details
    email: "",

    // Additional Info
    dob: "",
    anniversaryDate: "",
    maritalStatus: "Single"
  });

  function handleAdd() {
    const nextCode = `DOC${String(list.length + 1).padStart(4, "0")}`;
    setForm({
      code: nextCode,
      name: "",
      specialty: "Ophthalmology",
      qualification: "MBBS, MD",
      category: "General",
      mobile: "",
      city: "Chennai",
      status: "Active",
      clinicName: "",
      address: "",
      area: "",
      state: "Tamil Nadu",
      country: "India",
      pinCode: "",
      potential: "High",
      visitFrequency: "Fortnight",
      patch: "T. Nagar",
      stockist: "Zivira Stockist Chennai",
      chemist: "Apollo Pharmacy",
      email: "",
      dob: "",
      anniversaryDate: "",
      maritalStatus: "Single"
    });
    setActiveFormTab(1);
    setView("add");
  }

  function handleEdit(row: any) {
    setSelectedDoc(row);
    setForm({
      code: row.doctorCode || row.code || "",
      name: row.name || "",
      specialty: row.specialty || "Ophthalmology",
      qualification: row.qualification || "MBBS, MD",
      category: row.category || "General",
      mobile: row.phone || row.mobile || "",
      city: row.city || "Chennai",
      status: row.status || "Active",
      clinicName: row.clinicName || "",
      address: row.address || "",
      area: row.area || "",
      state: row.state || "Tamil Nadu",
      country: row.country || "India",
      pinCode: row.pinCode || "",
      potential: row.potential || "High",
      visitFrequency: row.visitFrequency || "Fortnight",
      patch: row.territory || row.patch || "T. Nagar",
      stockist: row.stockist || "Zivira Stockist Chennai",
      chemist: row.chemist || "Apollo Pharmacy",
      email: row.email || "doc@gmail.com",
      dob: row.dob ? String(row.dob).split("T")[0] : "",
      anniversaryDate: row.anniversaryDate ? String(row.anniversaryDate).split("T")[0] : "",
      maritalStatus: row.maritalStatus || "Single"
    });
    setActiveFormTab(1);
    setView("edit");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (view === "add") {
        await apiClient.createDoctor({
          name: form.name,
          specialty: form.specialty,
          category: form.category as any,
          state: form.state,
          city: form.city,
          territory: form.patch,
          status: form.status as "ACTIVE" | "INACTIVE"
        });
        await fetchData(pagination.page);
      } else if (view === "edit" && selectedDoc) {
        // Mock update for now
        setList(list.map(x => x.id === selectedDoc.id ? { ...x, ...form } : x));
      }
      setView("list");
    } catch (err: any) {
      alert(err.message || "Failed to save doctor");
    }
  }

  function handleDelete(id: string) {
    setList(list.map(x => x.id === id ? { ...x, status: "INACTIVE" } : x));
  }

  const filtered = list.filter(x => {
    const s = search.toLowerCase();
    return (
      (x.name && x.name.toLowerCase().includes(s)) ||
      (x.doctorCode && x.doctorCode.toLowerCase().includes(s)) ||
      (x.specialty && x.specialty.toLowerCase().includes(s))
    );
  });

  if (view !== "list") {
    return (
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Field Force Entries</p>
            <h2>{view === "add" ? "Add Listed Doctor" : "Edit Listed Doctor"}</h2>
            <p>Maintain profile, address, classifications and territory mappings.</p>
          </div>
          <button className="button button-secondary" onClick={() => setView("list")} type="button">
            <RotateCcw size={16} /> Back
          </button>
        </div>

        {/* Tab Selection Row for Add/Edit Form */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "6px 0", marginBottom: "16px", borderBottom: "1px solid var(--border)" }}>
          {[
            { id: 1, label: "Doctor Master" },
            { id: 2, label: "Address" },
            { id: 3, label: "Doctor Classification" },
            { id: 4, label: "Territory Mapping" },
            { id: 5, label: "Dealer Mapping" },
            { id: 6, label: "Contact Details" },
            { id: 7, label: "Additional Information" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveFormTab(t.id)}
              className={`button ${activeFormTab === t.id ? "" : "button-secondary"}`}
              style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="card form-grid" style={{ animation: "popIn 0.3s ease-out forwards" }}>
          {activeFormTab === 1 && (
            <>
              <div className="field">
                <label>Doctor Code</label>
                <input readOnly value={form.code} style={{ opacity: 0.7 }} />
              </div>
              <div className="field">
                <label>Doctor Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. Rajesh Kumar" />
              </div>
              <div className="field">
                <label>Specialty</label>
                <input required value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="Ophthalmology" />
              </div>
              <div className="field">
                <label>Qualification</label>
                <input required value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} placeholder="MBBS, MD" />
              </div>
              <div className="field">
                <label>Category</label>
                <input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="General" />
              </div>
              <div className="field">
                <label>Mobile Number</label>
                <input required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="9876543210" />
              </div>
              <div className="field">
                <label>City</label>
                <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Chennai" />
              </div>
              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </>
          )}

          {activeFormTab === 2 && (
            <>
              <div className="field">
                <label>Clinic Name</label>
                <input value={form.clinicName} onChange={e => setForm({ ...form, clinicName: e.target.value })} placeholder="Apollo Clinic" />
              </div>
              <div className="field">
                <label>Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="T. Nagar Main Road" />
              </div>
              <div className="field">
                <label>Area</label>
                <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="T. Nagar" />
              </div>
              <div className="field">
                <label>State</label>
                <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="field">
                <label>Country</label>
                <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              </div>
              <div className="field">
                <label>PIN Code</label>
                <input value={form.pinCode} onChange={e => setForm({ ...form, pinCode: e.target.value })} placeholder="600017" />
              </div>
            </>
          )}

          {activeFormTab === 3 && (
            <>
              <div className="field">
                <label>Doctor Category</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="General" />
              </div>
              <div className="field">
                <label>Potential</label>
                <select value={form.potential} onChange={e => setForm({ ...form, potential: e.target.value })}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="field">
                <label>Visit Frequency</label>
                <select value={form.visitFrequency} onChange={e => setForm({ ...form, visitFrequency: e.target.value })}>
                  <option value="Fortnight">Fortnight</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            </>
          )}

          {activeFormTab === 4 && (
            <>
              <div className="field">
                <label>Select Sales Territory (Patch)</label>
                <select value={form.patch} onChange={e => setForm({ ...form, patch: e.target.value })}>
                  <option value="T. Nagar">T. Nagar</option>
                  <option value="Mylapore">Mylapore</option>
                  <option value="Adyar">Adyar</option>
                </select>
              </div>
            </>
          )}

          {activeFormTab === 5 && (
            <>
              <div className="field">
                <label>Select Stockist</label>
                <input value={form.stockist} onChange={e => setForm({ ...form, stockist: e.target.value })} />
              </div>
              <div className="field">
                <label>Select Chemist</label>
                <input value={form.chemist} onChange={e => setForm({ ...form, chemist: e.target.value })} />
              </div>
            </>
          )}

          {activeFormTab === 6 && (
            <>
              <div className="field">
                <label>Personal Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="doc@gmail.com" />
              </div>
              <div className="field">
                <label>Mobile Number</label>
                <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="9876543210" />
              </div>
            </>
          )}

          {activeFormTab === 7 && (
            <>
              <div className="field">
                <label>Date of Birth (DOB)</label>
                <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
              </div>
              <div className="field">
                <label>Anniversary Date</label>
                <input type="date" value={form.anniversaryDate} onChange={e => setForm({ ...form, anniversaryDate: e.target.value })} />
              </div>
              <div className="field">
                <label>Marital Status</label>
                <select value={form.maritalStatus} onChange={e => setForm({ ...form, maritalStatus: e.target.value })}>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Unmarried">Unmarried</option>
                </select>
              </div>
            </>
          )}

          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
            {activeFormTab < 7 ? (
              <button className="button button-secondary" type="button" onClick={() => setActiveFormTab(prev => prev + 1)}>
                Next Section
              </button>
            ) : (
              <button className="button" type="submit">
                <Check size={16} /> Add Doctor
              </button>
            )}
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Field Force Entries</p>
          <h2>Listed Doctors</h2>
          <p>Maintain general registries of approved practicing doctors.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={handleAdd} type="button"><Plus size={16} /> Add Listed Doctor</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by doctor code, name or specialty..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: "360px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
        />
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>Loading doctors...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "red" }}>{error}</div>
        ) : (
          <table className="subdivision-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Doctor Code</th>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Qualification</th>
                <th>Category</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Deactivate</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={row.id}>
                  <td style={{ color: "var(--muted)", fontWeight: 500 }}>{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{row.doctorCode || row.code || "-"}</td>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.specialty || "-"}</td>
                  <td>{row.qualification || "-"}</td>
                  <td>{row.category || "-"}</td>
                  <td>{row.phone || row.mobile || "-"}</td>
                  <td>{row.city || "-"}</td>
                  <td>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: (row.status === "ACTIVE" || row.status === "Active") ? "#10b98115" : "#ef444415",
                      color: (row.status === "ACTIVE" || row.status === "Active") ? "#10b981" : "#ef4444",
                      border: (row.status === "ACTIVE" || row.status === "Active") ? "1px solid #10b98125" : "1px solid #ef444425"
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button className="subdivision-icon-button" onClick={() => handleEdit(row)} title="Edit" type="button">
                      <Pencil size={15} />
                    </button>
                  </td>
                  <td>
                    <button className="subdivision-danger-button" onClick={() => handleDelete(row.id)} title="Deactivate" type="button">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {view === "list" && !loading && !error && (
        <PaginationControls
          pagination={pagination}
          onPrev={() => fetchData(pagination.page - 1)}
          onNext={() => fetchData(pagination.page + 1)}
        />
      )}
    </section>
  );
}
