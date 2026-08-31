"use client";
import { RotateCcw, SlidersHorizontal, Trash2, Pencil, ChevronDown, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
type UnlistedDoctorRow = {
  id: string;
  tempCode: string;
  name: string;
  specialty: string;
  city: string;
  mr: string;
  status: "Pending" | "Approved" | "Rejected";
};
const initialDoctors: UnlistedDoctorRow[] = [];
export function UnlistedDoctorMaster() {
  const [list, setList] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [activeFormTab, setActiveFormTab] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try {
      setLoading(true);
      const res = await apiClient.unlistedDoctors();
      setList(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load unlisted doctors");
    } finally {
      setLoading(false);
    }
  }
  // Form inputs for 7 tabs
  const [form, setForm] = useState({
    tempCode: "",
    name: "",
    specialty: "Dermatology",
    city: "Chennai",
    mr: "Rahul Sharma",
    status: "Pending" as "Pending" | "Approved" | "Rejected",
    // Address
    clinicName: "",
    address: "",
    area: "",
    state: "Tamil Nadu",
    pinCode: "",
    // Territory Info
    patch: "T. Nagar",
    hq: "Chennai Central HQ",
    // Contact
    mobile: "",
    email: "",
    // Visit Info
    visitFrequency: "Monthly",
    potential: "Medium",
    // Approval details
    remarks: "",
    approvedBy: "Priya Nair",
    // Additional Info
    dob: "",
    anniversaryDate: ""
  });
  function handleAdd() {
    const nextCode = `TMP-DOC${String(list.length + 1).padStart(2, "0")}`;
    setForm({
      tempCode: nextCode,
      name: "",
      specialty: "Dermatology",
      city: "Chennai",
      mr: "Rahul Sharma",
      status: "Pending",
      clinicName: "",
      address: "",
      area: "",
      state: "Tamil Nadu",
      pinCode: "",
      patch: "T. Nagar",
      hq: "Chennai Central HQ",
      mobile: "",
      email: "",
      visitFrequency: "Monthly",
      potential: "Medium",
      remarks: "",
      approvedBy: "Priya Nair",
      dob: "",
      anniversaryDate: ""
    });
    setActiveFormTab(1);
    setView("add");
  }
  function handleEdit(row: any) {
    setSelectedDoc(row);
    setForm({
      tempCode: row.tempCode || "",
      name: row.name || "",
      specialty: row.specialty || "Dermatology",
      city: row.city || "Chennai",
      mr: row.mr || "",
      status: row.status || "Pending",
      clinicName: row.clinicName || "",
      address: row.address || "",
      area: row.area || "",
      state: row.state || "Tamil Nadu",
      pinCode: row.pinCode || "",
      patch: row.patch || "",
      hq: row.hq || "",
      mobile: row.mobile || "",
      email: row.email || "",
      visitFrequency: row.visitFrequency || "Monthly",
      potential: row.potential || "Medium",
      remarks: row.remarks || "",
      approvedBy: row.approvedBy || "Priya Nair",
      dob: row.dob || "",
      anniversaryDate: row.anniversaryDate || ""
    });
    setActiveFormTab(1);
    setView("edit");
  }
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (view === "add") {
        await apiClient.createUnlistedDoctor({
          tempCode: form.tempCode,
          name: form.name,
          specialty: form.specialty,
          city: form.city,
          mr: form.mr,
          status: form.status as any,
          clinicName: form.clinicName,
          address: form.address,
          area: form.area,
          state: form.state,
          pinCode: form.pinCode,
          patch: form.patch,
          hq: form.hq,
          mobile: form.mobile,
          email: form.email,
          visitFrequency: form.visitFrequency,
          potential: form.potential,
          remarks: form.remarks,
          approvedBy: form.approvedBy,
          dob: form.dob,
          anniversaryDate: form.anniversaryDate
        });
      } else if (view === "edit" && selectedDoc) {
        await apiClient.updateUnlistedDoctor(selectedDoc.id, {
          name: form.name,
          specialty: form.specialty,
          city: form.city,
          mr: form.mr,
          status: form.status as any,
          clinicName: form.clinicName,
          address: form.address,
          area: form.area,
          state: form.state,
          pinCode: form.pinCode,
          patch: form.patch,
          hq: form.hq,
          mobile: form.mobile,
          email: form.email,
          visitFrequency: form.visitFrequency,
          potential: form.potential,
          remarks: form.remarks,
          approvedBy: form.approvedBy,
          dob: form.dob,
          anniversaryDate: form.anniversaryDate
        });
      }
      await fetchData();
      setView("list");
    } catch (err: any) {
      alert(err.message || "Failed to save unlisted doctor");
    }
  }
  async function handleDelete(id: string) {
    try {
      await apiClient.updateUnlistedDoctor(id, { status: "Rejected" });
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to reject");
    }
  }
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const filtered = list.filter(x => {
    const s = search.toLowerCase();
    const statusMatch = statusFilter === "All" ||
      (statusFilter === "Active" && x.status === "Approved") ||
      (statusFilter === "Inactive" && x.status === "Rejected") ||
      (statusFilter === "Pending" && x.status === "Pending");
    const nameStr = (x.name || "").toLowerCase();
    const codeStr = (x.tempCode || "").toLowerCase();
    const mrStr = (x.mr || "").toLowerCase();
    return statusMatch && (nameStr.includes(s) || codeStr.includes(s) || mrStr.includes(s));
  });
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Field Force Entries</p>
          <h2>Unlisted Doctors</h2>
          <p>Verify temporary doctor profiles registered during field visits before official listing.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={handleAdd} type="button"> Add Unlisted Doctor</button>
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
      {view !== "list" && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 20px", overflowY: "auto" }}>
          <div style={{ background: "var(--panel)", borderRadius: "12px", width: "100%", maxWidth: "500px", padding: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2>{view === "add" ? "Add Unlisted Doctor" : "Edit Unlisted Doctor"}</h2>
              <button className="button button-secondary" onClick={() => setView("list")} type="button">Close</button>
            </div>
            <div style={{ marginTop: "16px" }}>
          {/* Tabs header row */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "6px 0", marginBottom: "16px", borderBottom: "1px solid var(--border)" }}>
            {[
              { id: 1, label: "Doctor Details" },
              { id: 2, label: "Clinic Address" },
              { id: 3, label: "Territory Information" },
              { id: 4, label: "Contact Details" },
              { id: 5, label: "Visit Information" },
              { id: 6, label: "Approval Details" },
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
                  <label>Temporary Doctor Code</label>
                  <input readOnly value={form.tempCode} style={{ opacity: 0.7 }} />
                </div>
                <div className="field">
                  <label>Doctor Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. Kavita Nair" />
                </div>
                <div className="field">
                  <label>Specialty</label>
                  <input required value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="Dermatology" />
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
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </>
            )}
            {activeFormTab === 2 && (
              <>
                <div className="field">
                  <label>Clinic Name</label>
                  <input value={form.clinicName} onChange={e => setForm({ ...form, clinicName: e.target.value })} />
                </div>
                <div className="field">
                  <label>Address</label>
                  <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="field">
                  <label>Area</label>
                  <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
                </div>
                <div className="field">
                  <label>State</label>
                  <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                </div>
                <div className="field">
                  <label>PIN Code</label>
                  <input value={form.pinCode} onChange={e => setForm({ ...form, pinCode: e.target.value })} />
                </div>
              </>
            )}
            {activeFormTab === 3 && (
              <>
                <div className="field">
                  <label>Patch Name</label>
                  <input value={form.patch} onChange={e => setForm({ ...form, patch: e.target.value })} />
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
                  <label>Mobile Number</label>
                  <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </>
            )}
            {activeFormTab === 5 && (
              <>
                <div className="field">
                  <label>Visit Frequency</label>
                  <select value={form.visitFrequency} onChange={e => setForm({ ...form, visitFrequency: e.target.value })}>
                    <option value="Weekly">Weekly</option>
                    <option value="Fortnight">Fortnight</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="field">
                  <label>Potential</label>
                  <select value={form.potential} onChange={e => setForm({ ...form, potential: e.target.value })}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </>
            )}
            {activeFormTab === 6 && (
              <>
                <div className="field">
                  <label>Approval Remarks</label>
                  <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
                </div>
                <div className="field">
                  <label>Assigned Approver</label>
                  <input value={form.approvedBy} onChange={e => setForm({ ...form, approvedBy: e.target.value })} />
                </div>
              </>
            )}
            {activeFormTab === 7 && (
              <>
                <div className="field">
                  <label>Date of Birth</label>
                  <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                </div>
                <div className="field">
                  <label>Anniversary Date</label>
                  <input type="date" value={form.anniversaryDate} onChange={e => setForm({ ...form, anniversaryDate: e.target.value })} />
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
                  Add Doctor Request
                </button>
              )}
            </div>
          </form>
            </div>
          </div>
        </div>
      )}
      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>Loading doctors...</div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "red" }}>{error}</div>
          ) : (
            <table className="subdivision-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Temporary Doctor Code</th>
                  <th>Doctor Name</th>
                  <th>Specialty</th>
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
                          Active (Approved)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setStatusFilter("Pending"); setStatusFilterOpen(false); }}
                          style={{
                            padding: "6px 12px",
                            textAlign: "left",
                            background: statusFilter === "Pending" ? "var(--line)" : "none",
                            border: "none",
                            color: "var(--ink)",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontWeight: statusFilter === "Pending" ? 600 : 400
                          }}
                        >
                          Pending
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
                          Inactive (Rejected)
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
                  <th>Reject</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id}>
                    <td style={{ color: "var(--muted)", fontWeight: 500 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{row.tempCode}</td>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.specialty || "-"}</td>
                    <td>{row.city || "-"}</td>
                    <td>{row.mr || "-"}</td>
                    <td>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: row.status === "Approved" ? "#10b98115" : row.status === "Pending" ? "#f59e0b15" : "#ef444415",
                        color: row.status === "Approved" ? "#10b981" : row.status === "Pending" ? "#f59e0b" : "#ef4444",
                        border: row.status === "Approved" ? "1px solid #10b98125" : row.status === "Pending" ? "1px solid #f59e0b25" : "1px solid #ef444425"
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
                      <button className="subdivision-danger-button" onClick={() => handleDelete(row.id)} title="Reject" type="button">
                        <Ban size={15} />
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
    </section>
  );
}
