"use client";
import { RotateCcw, SlidersHorizontal, Trash2, Pencil, ChevronDown, Ban, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnFilterDropdown } from "@/components/column-filter-dropdown";
import { apiClient } from "@/lib/api-client";
type ChemistRow = {
  id: string;
  code: string;
  name: string;
  type: string;
  city: string;
  mr: string;
  status: "Active" | "Inactive";
};
const initialChemists: ChemistRow[] = [];
export function ChemistMaster() {
  const [list, setList] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [activeFormTab, setActiveFormTab] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [selectedChemist, setSelectedChemist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try {
      setLoading(true);
      const res = await apiClient.dealers();
      setList(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load chemists");
    } finally {
      setLoading(false);
    }
  }
  // Form State
  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "Retailer",
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
    // Distributor Mapping
    stockist: "Zivira Stockist Chennai",
    // Contact Details
    contactPerson: "",
    mobile: "",
    email: "",
    // Business Info
    gstin: "",
    dlNo: "",
    panNo: "",
    // Additional Info
    remarks: ""
  });
  function handleAdd() {
    // Base the next code on the highest existing sourceSNo, not just the
    // current list length, so a deactivated/edited middle record can't cause
    // a duplicate suggestion.
    const maxSNo = list.reduce((max, r) => {
      const n = Number(r.sourceSNo);
      return Number.isFinite(n) && n > max ? n : max;
    }, 0);
    const nextCode = `CHM${String(maxSNo + 1).padStart(3, "0")}`;
    setForm({
      code: nextCode,
      name: "",
      type: "Retailer",
      city: "Chennai",
      mr: "Rahul Sharma",
      status: "Active",
      address: "",
      area: "",
      state: "Tamil Nadu",
      pinCode: "",
      patch: "T. Nagar",
      hq: "Chennai Central HQ",
      stockist: "Zivira Stockist Chennai",
      contactPerson: "",
      mobile: "",
      email: "",
      gstin: "",
      dlNo: "",
      panNo: "",
      remarks: ""
    });
    setActiveFormTab(1);
    setView("add");
  }
  function handleEdit(row: any) {
    setSelectedChemist(row);
    setForm({
      code: row.sourceSNo ? String(row.sourceSNo) : "",
      name: row.dealerName || "",
      type: "Retailer", // Defaulting as dealer doesn't have type
      city: row.city || "Chennai",
      mr: row.employeeName || row.employeeCode || "",
      // Backend stores "ACTIVE"/"INACTIVE" but the <select> options below
      // are value="Active"/"Inactive" — without normalizing case here, an
      // edited record's dropdown matched neither option and rendered blank
      // instead of showing the record's real status.
      status: String(row.status || "ACTIVE").toUpperCase() === "INACTIVE" ? "Inactive" : "Active",
      address: row.address || "",
      area: row.location || "",
      state: row.state || "Tamil Nadu",
      pinCode: row.pincode || "",
      patch: row.patchName || "",
      hq: "Chennai Central HQ",
      stockist: "Zivira Stockist Chennai",
      contactPerson: row.contactPersonName || "",
      mobile: row.dealerPhone || "",
      email: row.dealerEmail || "",
      gstin: "",
      dlNo: "",
      panNo: "",
      remarks: ""
    });
    setActiveFormTab(1);
    setView("edit");
  }
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const sourceSNo = Number(form.code.replace(/\D/g, "")) || undefined;
      if (view === "add") {
        const dealerPayload = {
          dealerName: form.name,
          city: form.city,
          employeeName: form.mr,
          address: form.address,
          location: form.area,
          state: form.state,
          pincode: form.pinCode,
          patchName: form.patch,
          contactPersonName: form.contactPerson,
          dealerPhone: form.mobile,
          dealerEmail: form.email,
          status: form.status.toUpperCase() as "ACTIVE" | "INACTIVE"
        };
        try {
          await apiClient.createDealer({ sourceSNo, ...dealerPayload });
        } catch (err: any) {
          // Same staleness class of bug as elsewhere: recompute the next
          // code against the live list and retry once instead of surfacing
          // "already exists" for a code the user never typed themselves.
          if (err?.message && /already exists/i.test(err.message)) {
            const fresh = await apiClient.dealers();
            const maxSNo = fresh.data.reduce((max: number, r: any) => {
              const n = Number(r.sourceSNo);
              return Number.isFinite(n) && n > max ? n : max;
            }, 0);
            await apiClient.createDealer({ sourceSNo: maxSNo + 1, ...dealerPayload });
          } else {
            throw err;
          }
        }
        await fetchData();
      } else if (view === "edit" && selectedChemist) {
        await apiClient.updateDealer(selectedChemist.id, {
          dealerName: form.name,
          city: form.city,
          employeeName: form.mr,
          address: form.address,
          location: form.area,
          state: form.state,
          pincode: form.pinCode,
          patchName: form.patch,
          contactPersonName: form.contactPerson,
          dealerPhone: form.mobile,
          dealerEmail: form.email,
          status: form.status.toUpperCase() as "ACTIVE" | "INACTIVE"
        });
        await fetchData();
      }
      setView("list");
    } catch (err: any) {
      setError(err.message || "Failed to save chemist");
    }
  }
  async function handleDelete(id: string) {
    try {
      await apiClient.updateDealer(id, { status: "INACTIVE" });
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to deactivate chemist");
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
    const nameStr = (x.dealerName || "").toLowerCase();
    const mrStr = (x.employeeName || x.employeeCode || "").toLowerCase();
    const codeStr = (x.sourceSNo ? String(x.sourceSNo) : "").toLowerCase();
    const searchMatch = nameStr.includes(s) || mrStr.includes(s) || codeStr.includes(s);
    let colMatch = true;
    for (const [key, val] of Object.entries(columnFilters)) {
      if (val !== "All" && String((x as any)[key] || "").toUpperCase() !== val.toUpperCase()) colMatch = false;
    }
    return statusMatch && searchMatch && colMatch;
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
          <h2>Chemist - Dealer - Details</h2>
          <p>Maintain pharmacy networks and retail distributor mappings.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={handleAdd} type="button"> Add Chemist</button>
        </div>
      </div>
      <div className="subdivision-stats" style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
        <article style={{ background: "var(--panel)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", minWidth: "160px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Total Records</span>
          <strong style={{ display: "block", fontSize: "28px", marginTop: "4px" }}>{filtered.length}</strong>
        </article>
        <Link className="card module-card" href="/admin/workspace/division-dashboard/division-navigation-tabs/division-master/doctor/category" style={{ borderLeft: "4px solid var(--brand-strong)", width: "300px", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 16px" }}>
          <h3 className="section-title">Doctor</h3>
        </Link>
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
              { id: 1, label: "Chemist Master" },
              { id: 2, label: "Address" },
              { id: 3, label: "Territory Mapping" },
              { id: 4, label: "Distributor / Stockist Mapping" },
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
                  <label>Chemist Code</label>
                  <input readOnly value={form.code} style={{ opacity: 0.7 }} />
                </div>
                <div className="field">
                  <label>Chemist Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Apollo Pharmacy" />
                </div>
                <div className="field">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="Retailer">Retailer</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Hospital Pharmacy">Hospital Pharmacy</option>
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
                  <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="14, GN Chetty Road" />
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
                  <label>PIN Code</label>
                  <input value={form.pinCode} onChange={e => setForm({ ...form, pinCode: e.target.value })} placeholder="600017" />
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
                  <label>Preferred Stockist</label>
                  <input value={form.stockist} onChange={e => setForm({ ...form, stockist: e.target.value })} />
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
                  <label>Drug License (DL) Number</label>
                  <input value={form.dlNo} onChange={e => setForm({ ...form, dlNo: e.target.value })} />
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
                  Add Chemist
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>Loading chemists...</div>
          ) : (
            <table className="subdivision-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Chemist Code</th>
                  <th>Chemist Name</th>
                  {[
                    { key: "type", label: "Type" },
                    { key: "city", label: "City" },
                  ].map(f => {
                    const uniqueValues = Array.from(new Set(list.map(r => String((r as any)[f.key] || "")))).filter(Boolean).sort();
                    const options = uniqueValues.map(v => ({ label: v, value: v }));
                    return (
                      <th key={f.key}>
                        <div style={{ minWidth: "120px" }}>
                          <ColumnFilterDropdown 
                            title={f.label} 
                            value={columnFilters[f.key] || "All"} 
                            options={options} 
                            onChange={(val) => setColumnFilters(prev => ({ ...prev, [f.key]: val }))} 
                          />
                        </div>
                      </th>
                    );
                  })}
                  <th>Medical Representative</th>
                  <th>Pin Code</th>
                  <th>Contact</th>
                  <th key="area">
                    <div style={{ minWidth: "120px" }}>
                      <ColumnFilterDropdown 
                        title="Area" 
                        value={columnFilters["area"] || "All"} 
                        options={Array.from(new Set(list.map(r => String((r as any)["area"] || "")))).filter(Boolean).sort().map(v => ({ label: v, value: v }))} 
                        onChange={(val) => setColumnFilters(prev => ({ ...prev, area: val }))} 
                      />
                    </div>
                  </th>
                  <th style={{ minWidth: "130px" }}>
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
                  <th>Inactive</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id}>
                    <td style={{ color: "var(--muted)", fontWeight: 500 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{row.sourceSNo || "-"}</td>
                    <td><strong>{row.dealerName}</strong></td>
                    <td>{row.type || "Retailer"}</td>
                    <td>{row.city || "-"}</td>
                    <td>{row.employeeName || row.employeeCode || "-"}</td>
                    <td>{row.pincode || "-"}</td>
                    <td>{row.dealerPhone || "-"}</td>
                    <td>{row.location || "-"}</td>
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
                    <td colSpan={12} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
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
