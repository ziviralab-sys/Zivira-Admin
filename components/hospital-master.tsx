"use client";
import { ColumnFilterDropdown } from "@/components/column-filter-dropdown";
import { StatusFilterDropdown } from "@/components/status-filter-dropdown";
import { RotateCcw, SlidersHorizontal, Trash2, Pencil, ChevronDown, Ban, X, AlertTriangle } from "lucide-react";
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
    // Base the next code on the highest existing numeric suffix, not just
    // the current list length, so it stays unique after edits/deactivations.
    const maxNum = list.reduce((max, r) => {
      const match = String(r.hospitalCode || "").match(/(\d+)$/);
      const n = match ? parseInt(match[1], 10) : 0;
      return n > max ? n : max;
    }, 0);
    const nextCode = `HOS${String(maxNum + 1).padStart(3, "0")}`;
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
      status: String(row.status || "ACTIVE").toUpperCase() === "INACTIVE" ? "Inactive" : "Active",
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
    // The backend only accepts "ACTIVE"/"INACTIVE" — the form's Active/
    // Inactive labels were being sent as-is and rejected by validation on
    // every single save, which is what made Hospital Master's Add always
    // fail.
    const statusUpper = form.status.toUpperCase() as "ACTIVE" | "INACTIVE";
    try {
      if (view === "add") {
        try {
          await apiClient.createHospital({
            hospitalCode: form.code,
            hospitalName: form.name,
            type: form.type as any,
            city: form.city,
            medicalRepresentative: form.mr,
            status: statusUpper
          });
        } catch (err: any) {
          // Same staleness class of bug as elsewhere: if the suggested code
          // collided because another hospital was added since this list was
          // last fetched, recompute against the live count and retry once.
          if (err?.message && /already exists/i.test(err.message)) {
            const fresh = await apiClient.hospitals();
            const maxNum = fresh.data.reduce((max: number, r: any) => {
              const match = String(r.hospitalCode || "").match(/(\d+)$/);
              const n = match ? parseInt(match[1], 10) : 0;
              return n > max ? n : max;
            }, 0);
            await apiClient.createHospital({
              hospitalCode: `HOS${String(maxNum + 1).padStart(3, "0")}`,
              hospitalName: form.name,
              type: form.type as any,
              city: form.city,
              medicalRepresentative: form.mr,
              status: statusUpper
            });
          } else {
            throw err;
          }
        }
      } else if (view === "edit" && selectedHospital) {
        await apiClient.updateHospital(selectedHospital.id, {
          hospitalName: form.name,
          type: form.type as any,
          city: form.city,
          medicalRepresentative: form.mr,
          status: statusUpper
        });
      }
      await fetchData();
      setView("list");
    } catch (err: any) {
      setError(err.message || "Failed to save hospital");
    }
  }
  async function handleDelete(id: string) {
    try {
      await apiClient.updateHospital(id, { status: "INACTIVE" });
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to deactivate");
    }
  }
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const filtered = list.filter(x => {
    let isMatch = true;

    // Status Filter
    const isActive = x.status === "ACTIVE" || x.status === "Active";
    const statusMatch = statusFilter === "All" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);
      
    if (!statusMatch) isMatch = false;

    // Search Box
    const s = search.toLowerCase();
    const nameStr = (x.hospitalName || "").toLowerCase();
    const codeStr = (x.hospitalCode || "").toLowerCase();
    const mrStr = (x.medicalRepresentative || "").toLowerCase();
    if (s && !(nameStr.includes(s) || codeStr.includes(s) || mrStr.includes(s))) {
        isMatch = false;
    }

    // Column Filters
    for (const [key, val] of Object.entries(columnFilters)) {
      if (val !== "All") {
        const rowVal = String((x as any)[key] || "").toUpperCase();
        if (rowVal !== val.toUpperCase()) isMatch = false;
      }
    }

    return isMatch;
  });
  return (
    <section className="subdivision-console">
      {error && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70
          }}
        >
          <div style={{ background: "var(--panel)", borderRadius: "10px", padding: "24px", minWidth: "320px", maxWidth: "440px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={18} color="#ef4444" />
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#ef4444" }}>Something went wrong</h3>
              </div>
              <button className="subdivision-icon-button" onClick={() => setError(null)} type="button" title="Close" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--ink)" }}>{error}</p>
            <button className="button button-secondary" style={{ marginTop: "16px", width: "100%" }} onClick={() => setError(null)} type="button">
              Close
            </button>
          </div>
        </div>
      )}
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Field Force Entries</p>
          <h2>Hospital Master</h2>
          <p>Maintain hospital institutions and departments mapped under agent routes.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={handleAdd} type="button"> Add Hospital</button>
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
                  Add Hospital
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>Loading hospitals...</div>
          ) : (
            <table className="subdivision-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Hospital Code</th>
                  <th>
                    <div style={{ minWidth: "140px" }}>
                      <ColumnFilterDropdown 
                        title="Hospital Name" 
                        value={columnFilters['hospitalName'] || "All"} 
                        options={Array.from(new Set(list.map(r => String(r.hospitalName || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))} 
                        onChange={(val) => setColumnFilters(prev => ({ ...prev, hospitalName: val }))} 
                      />
                    </div>
                  </th>
                  <th>
                    <div style={{ minWidth: "140px" }}>
                      <ColumnFilterDropdown 
                        title="Type" 
                        value={columnFilters['type'] || "All"} 
                        options={Array.from(new Set(list.map(r => String(r.type || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))} 
                        onChange={(val) => setColumnFilters(prev => ({ ...prev, type: val }))} 
                      />
                    </div>
                  </th>
                  <th>
                    <div style={{ minWidth: "140px" }}>
                      <ColumnFilterDropdown 
                        title="City" 
                        value={columnFilters['city'] || "All"} 
                        options={Array.from(new Set(list.map(r => String(r.city || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))} 
                        onChange={(val) => setColumnFilters(prev => ({ ...prev, city: val }))} 
                      />
                    </div>
                  </th>
                  <th>Medical Representative</th>
                  <th>
                    <div style={{ minWidth: "140px" }}>
                      <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
                    </div>
                  </th>
                  <th>Edit</th>
                  <th>Inactive</th>
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
                        <Ban />
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
