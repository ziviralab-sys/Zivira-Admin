"use client";

import { Check, Plus, RotateCcw, SlidersHorizontal, Trash2, Pencil, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

type HospitalRow = {
  id: string;
  code: string;
  name: string;
  type: string;
  city: string;
  mr: string;
  status: "Active" | "Inactive";
};

const initialHospitals: HospitalRow[] = [];

export function HospitalMaster() {
  const [list, setList] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [activeFormTab, setActiveFormTab] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await apiClient.hospitals();
      setList(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load hospitals");
    } finally {
      setLoading(false);
    }
  }

  // Form State
  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "Multi-Specialty",
    city: "Chennai",
    mr: "Rahul Sharma",
    status: "Active" as "Active" | "Inactive",

    // Address
    address: "",
    area: "",
    state: "Tamil Nadu",
    pinCode: "",

    // Territory Mapping
    patch: "T. Nagar",
    hq: "Chennai Central HQ",

    // Department & Doctor Mapping
    departments: "Ophthalmology, Cardiology",
    mappedDoctors: "Dr. Rajesh Kumar, Dr. Sandeep Sen",

    // Contact Details
    contactPerson: "",
    mobile: "",
    email: "",

    // Business Info
    gstin: "",
    panNo: "",

    // Additional Info
    remarks: ""
  });

  function handleAdd() {
    const nextCode = `HOS${String(list.length + 1).padStart(3, "0")}`;
    setForm({
      code: nextCode,
      name: "",
      type: "Multi-Specialty",
      city: "Chennai",
      mr: "Rahul Sharma",
      status: "Active",
      address: "",
      area: "",
      state: "Tamil Nadu",
      pinCode: "",
      patch: "T. Nagar",
      hq: "Chennai Central HQ",
      departments: "Ophthalmology, Cardiology",
      mappedDoctors: "Dr. Rajesh Kumar, Dr. Sandeep Sen",
      contactPerson: "",
      mobile: "",
      email: "",
      gstin: "",
      panNo: "",
      remarks: ""
    });
    setActiveFormTab(1);
    setView("add");
  }

  function handleEdit(row: any) {
    setSelectedHospital(row);
    setForm({
      code: row.hospitalCode || "",
      name: row.hospitalName || "",
      type: row.type || "Multi-Specialty",
      city: row.city || "Chennai",
      mr: row.medicalRepresentative || "",
      status: row.status || "ACTIVE",
      address: "21, Greams Road",
      area: "Thousand Lights",
      state: "Tamil Nadu",
      pinCode: "600006",
      patch: "T. Nagar",
      hq: "Chennai Central HQ",
      departments: "Ophthalmology, Cardiology, Pediatrics",
      mappedDoctors: "Dr. Rajesh Kumar, Dr. Sandeep Sen, Dr. Amit Verma",
      contactPerson: "Dr. Subramanian",
      mobile: "9876543215",
      email: "greams.apollo@hospital.com",
      gstin: "33AABCZ7766K1Z1",
      panNo: "AABCZ7766K",
      remarks: "Primary target hospital"
    });
    setActiveFormTab(1);
    setView("edit");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (view === "add") {
        await apiClient.createHospital({
          hospitalCode: form.code,
          hospitalName: form.name,
          type: form.type as any,
          city: form.city,
          medicalRepresentative: form.mr,
          status: form.status as any
        });
      } else if (view === "edit" && selectedHospital) {
        await apiClient.updateHospital(selectedHospital.id, {
          hospitalName: form.name,
          type: form.type as any,
          city: form.city,
          medicalRepresentative: form.mr,
          status: form.status as any
        });
      }
      await fetchData();
      setView("list");
    } catch (err: any) {
      alert(err.message || "Failed to save hospital");
    }
  }

  async function handleDelete(id: string) {
    // mock delete for now, updating status to INACTIVE
    try {
      await apiClient.updateHospital(id, { status: "INACTIVE" });
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to deactivate");
    }
  }

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(x => {
    const s = search.toLowerCase();
    const isActive = x.status === "ACTIVE" || x.status === "Active";
    const statusMatch = statusFilter === "All" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);
      
    const nameStr = (x.hospitalName || "").toLowerCase();
    const codeStr = (x.hospitalCode || "").toLowerCase();
    const mrStr = (x.medicalRepresentative || "").toLowerCase();

    return statusMatch && (nameStr.includes(s) || codeStr.includes(s) || mrStr.includes(s));
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Field Force Entries</p>
          <h2>Hospital Master</h2>
          <p>Maintain hospital institutions and departments mapped under agent routes.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={handleAdd} type="button"><Plus size={16} /> Add Hospital</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by name, code or MR..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: "360px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
        />
      </div>

      {view !== "list" ? (
        <div style={{ marginTop: "16px" }}>
          {/* Tabs row */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "6px 0", marginBottom: "16px", borderBottom: "1px solid var(--border)" }}>
            {[
              { id: 1, label: "Hospital Master" },
              { id: 2, label: "Address" },
              { id: 3, label: "Territory Mapping" },
              { id: 4, label: "Department & Doctor Mapping" },
              { id: 5, label: "Contact Details" },
              { id: 6, label: "Business Information" },
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
                  <label>Hospital Code</label>
                  <input readOnly value={form.code} style={{ opacity: 0.7 }} />
                </div>
                <div className="field">
                  <label>Hospital Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Apollo Hospital" />
                </div>
                <div className="field">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="Multi-Specialty">Multi-Specialty</option>
                    <option value="Super-Specialty">Super-Specialty</option>
                    <option value="General Clinic">General Clinic</option>
                  </select>
                </div>
                <div className="field">
                  <label>City</label>
                  <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Chennai" />
                </div>
                <div className="field">
                  <label>Medical Representative</label>
                  <input required value={form.mr} onChange={e => setForm({ ...form, mr: e.target.value })} />
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
                  <label>Address</label>
                  <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="21, Greams Road" />
                </div>
                <div className="field">
                  <label>Area</label>
                  <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="Thousand Lights" />
                </div>
                <div className="field">
                  <label>State</label>
                  <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                </div>
                <div className="field">
                  <label>PIN Code</label>
                  <input value={form.pinCode} onChange={e => setForm({ ...form, pinCode: e.target.value })} placeholder="600006" />
                </div>
              </>
            )}

            {activeFormTab === 3 && (
              <>
                <div className="field">
                  <label>Sales Territory (Patch)</label>
                  <select value={form.patch} onChange={e => setForm({ ...form, patch: e.target.value })}>
                    <option value="T. Nagar">T. Nagar</option>
                    <option value="Mylapore">Mylapore</option>
                    <option value="Adyar">Adyar</option>
                  </select>
                </div>
                <div className="field">
                  <label>Headquarters (HQ)</label>
                  <input value={form.hq} onChange={e => setForm({ ...form, hq: e.target.value })} />
                </div>
              </>
            )}

            {activeFormTab === 4 && (
              <>
                <div className="field">
                  <label>Mapped Departments</label>
                  <input value={form.departments} onChange={e => setForm({ ...form, departments: e.target.value })} placeholder="Ophthalmology, Cardiology" />
                </div>
                <div className="field">
                  <label>Mapped Listed Doctors</label>
                  <input value={form.mappedDoctors} onChange={e => setForm({ ...form, mappedDoctors: e.target.value })} placeholder="Dr. Rajesh Kumar, Dr. Sandeep Sen" />
                </div>
              </>
            )}

            {activeFormTab === 5 && (
              <>
                <div className="field">
                  <label>Contact Person</label>
                  <input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
                </div>
                <div className="field">
                  <label>Mobile Number</label>
                  <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </>
            )}

            {activeFormTab === 6 && (
              <>
                <div className="field">
                  <label>GSTIN</label>
                  <input value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
                </div>
                <div className="field">
                  <label>PAN Number</label>
                  <input value={form.panNo} onChange={e => setForm({ ...form, panNo: e.target.value })} />
                </div>
              </>
            )}

            {activeFormTab === 7 && (
              <>
                <div className="field">
                  <label>Remarks</label>
                  <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
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
                  <Check size={16} /> Add Hospital
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>Loading hospitals...</div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "red" }}>{error}</div>
          ) : (
            <table className="subdivision-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Hospital Code</th>
                  <th>Hospital Name</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Medical Representative</th>
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
                {filtered.map((row, idx) => (
                  <tr key={row.id}>
                    <td style={{ color: "var(--muted)", fontWeight: 500 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{row.hospitalCode}</td>
                    <td><strong>{row.hospitalName}</strong></td>
                    <td>{row.type}</td>
                    <td>{row.city || "-"}</td>
                    <td>{row.medicalRepresentative || "-"}</td>
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
                    <td colSpan={9} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
