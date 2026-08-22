"use client";
import { ColumnFilterDropdown } from "@/components/column-filter-dropdown";
import { StatusFilterDropdown } from "@/components/status-filter-dropdown";

import { Check, Plus, SlidersHorizontal, Trash2, Pencil, ChevronDown, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient, type PaginationInfo } from "@/lib/api-client";
import { PaginationControls } from "./pagination-controls";

type MappedDoctorRow = {
  id: string;
  patch: string;
  doctorCode: string;
  doctorName: string;
  specialty: string;
  category: string;
  mr: string;
  hq: string;
  status: "Active" | "Inactive";
};

const initialMappings: MappedDoctorRow[] = [];

export function TerritoryListedDoctor() {
  const [list, setList] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [search, setSearch] = useState("");
  const [selectedMap, setSelectedMap] = useState<any | null>(null);

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

  // Form state
  const [form, setForm] = useState({
    patch: "T. Nagar",
    doctorCode: "DOC0001",
    doctorName: "Dr. Rajesh Kumar",
    specialty: "Ophthalmology",
    category: "General",
    mr: "Rahul Sharma",
    hq: "Chennai Central HQ",
    status: "Active" as "Active" | "Inactive"
  });

  const doctorsList = [
    { code: "DOC0001", name: "Dr. Rajesh Kumar", specialty: "Ophthalmology", category: "General" },
    { code: "DOC0002", name: "Dr. Sandeep Sen", specialty: "General Medicine", category: "Specialist" },
    { code: "DOC0003", name: "Dr. Amit Verma", specialty: "Cardiology", category: "Super Specialist" }
  ];

  const patchesList = [
    { name: "T. Nagar", mr: "Rahul Sharma", hq: "Chennai Central HQ" },
    { name: "Mylapore", mr: "Karthik Iyer", hq: "Chennai South HQ" },
    { name: "Adyar", mr: "Vignesh Raj", hq: "Chennai South HQ" }
  ];

  function handleAdd() {
    setForm({
      patch: "T. Nagar",
      doctorCode: "DOC0001",
      doctorName: "Dr. Rajesh Kumar",
      specialty: "Ophthalmology",
      category: "General",
      mr: "Rahul Sharma",
      hq: "Chennai Central HQ",
      status: "Active"
    });
    setView("add");
  }

  function handleEdit(row: any) {
    setSelectedMap(row);
    setForm({
      patch: row.territory || row.patch || "",
      doctorCode: row.doctorCode || row.code || "",
      doctorName: row.name || row.doctorName || "",
      specialty: row.specialty || "",
      category: row.category || "",
      mr: row.mappedEmployeeCode || row.mr || "",
      hq: row.hq || "",
      status: row.status || "Active"
    });
    setView("edit");
  }

  function handlePatchChange(patchName: string) {
    const p = patchesList.find(x => x.name === patchName);
    if (p) {
      setForm(prev => ({
        ...prev,
        patch: patchName,
        mr: p.mr,
        hq: p.hq
      }));
    }
  }

  function handleDoctorChange(docCode: string) {
    const d = doctorsList.find(x => x.code === docCode);
    if (d) {
      setForm(prev => ({
        ...prev,
        doctorCode: docCode,
        doctorName: d.name,
        specialty: d.specialty,
        category: d.category
      }));
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (view === "add") {
      const newRow: MappedDoctorRow = {
        id: `MAP${String(list.length + 1).padStart(3, "0")}`,
        patch: form.patch,
        doctorCode: form.doctorCode,
        doctorName: form.doctorName,
        specialty: form.specialty,
        category: form.category,
        mr: form.mr,
        hq: form.hq,
        status: form.status
      };
      setList([...list, newRow]);
    } else if (view === "edit" && selectedMap) {
      setList(list.map(x => x.id === selectedMap.id ? {
        ...x,
        patch: form.patch,
        doctorCode: form.doctorCode,
        doctorName: form.doctorName,
        specialty: form.specialty,
        category: form.category,
        mr: form.mr,
        hq: form.hq,
        status: form.status
      } : x));
    }
    setView("list");
  }

  function handleDelete(id: string) {
    setList(list.map(x => x.id === id ? { ...x, status: "Inactive" as const } : x));
  }

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const filtered = list.filter(x => {
    const s = search.toLowerCase();
    let isMatch = true;

    // Status Filter
    const isActive = x.status === "Active" || x.status === "ACTIVE";
    const statusMatch = statusFilter === "All" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);
      
    if (!statusMatch) isMatch = false;

    // Search Box
    const nameStr = (x.name || x.doctorName || "").toLowerCase();
    const patchStr = (x.territory || x.patch || "").toLowerCase();
    const codeStr = (x.doctorCode || x.code || "").toLowerCase();
    if (s && !(nameStr.includes(s) || patchStr.includes(s) || codeStr.includes(s))) {
        isMatch = false;
    }

    // Column Filters
    for (const [key, val] of Object.entries(columnFilters)) {
      if (val !== "All") {
        // The doctor records this screen lists don't carry a separate "hq"
        // field — Doctor.territory already stores the HQ name (the same
        // value the seed data assigns from TERRITORIES[...].hq), so fall
        // back to it here the same way the HQ column and its filter options
        // already do.
        const raw = key === "hq" ? ((x as any).hq ?? (x as any).territory) : (x as any)[key];
        const rowVal = String(raw || "").toUpperCase();
        if (rowVal !== val.toUpperCase()) isMatch = false;
      }
    }

    return isMatch;
  });

  return (
    <>
      {view !== "list" && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
            display: "flex", justifyContent: "center", alignItems: "center",
            backdropFilter: "blur(4px)"
          }}
        >
          <div style={{ background: "var(--panel)", borderRadius: "10px", padding: "24px", minWidth: "500px", maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{view === "add" ? "Map Doctor to Territory" : "Edit Territory Mapping"}</h2>
              <button className="button button-secondary" onClick={() => setView("list")} type="button">
                Close
              </button>
            </div>
            
            <form onSubmit={handleSave} className="subdivision-form-card" style={{ boxShadow: "none", padding: 0 }}>
              {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
              <div style={{ gridColumn: "span 1", borderBottom: "1px solid var(--border)", paddingBottom: "8px", fontWeight: 700, color: "#9d174d", fontSize: "14px", marginBottom: "16px" }}>
                Territory & Doctor Information
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>Select Patch</label>
                <select value={form.patch} onChange={e => handlePatchChange(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
                  {patchesList.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>Select Doctor</label>
                <select value={form.doctorCode} onChange={e => handleDoctorChange(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
                  {doctorsList.map(d => (
                    <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>Ophthalmology / Specialty</label>
                <input readOnly value={form.specialty} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "#f3f4f6", color: "var(--muted)", cursor: "not-allowed" }} />
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>Category</label>
                <input readOnly value={form.category} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "#f3f4f6", color: "var(--muted)", cursor: "not-allowed" }} />
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>Assigned Medical Representative</label>
                <input readOnly value={form.mr} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "#f3f4f6", color: "var(--muted)", cursor: "not-allowed" }} />
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>Headquarters (HQ)</label>
                <input readOnly value={form.hq} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "#f3f4f6", color: "var(--muted)", cursor: "not-allowed" }} />
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button className="button" style={{ marginTop: "16px", width: "100%" }} type="submit">
                Add Mapping
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Field Force Entries</p>
            <h2>Territory - Listed Doctor</h2>
            <p>Map and manage doctors assigned under respective patch sales networks.</p>
          </div>
          <div className="subdivision-actions">
            
            <button className="button" onClick={handleAdd} type="button"> Map Doctor</button>
          </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by doctor code, name or patch..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: "360px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
        />
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>Loading mappings...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "red" }}>{error}</div>
        ) : (
          <table className="subdivision-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Patch</th>
                <th>Doctor Code</th>
                <th>Doctor Name</th>
                <th>
                  <div style={{ minWidth: "140px" }}>
                    <ColumnFilterDropdown 
                      title="Specialty" 
                      value={columnFilters['specialty'] || "All"} 
                      options={Array.from(new Set(list.map(r => String(r.specialty || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))} 
                      onChange={(val) => setColumnFilters(prev => ({ ...prev, specialty: val }))} 
                    />
                  </div>
                </th>
                <th>
                  <div style={{ minWidth: "140px" }}>
                    <ColumnFilterDropdown 
                      title="Category" 
                      value={columnFilters['category'] || "All"} 
                      options={Array.from(new Set(list.map(r => String(r.category || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))} 
                      onChange={(val) => setColumnFilters(prev => ({ ...prev, category: val }))} 
                    />
                  </div>
                </th>
                <th>Medical Representative</th>
                <th>
                  <div style={{ minWidth: "140px" }}>
                    <ColumnFilterDropdown 
                      title="HQ"
                      value={columnFilters['hq'] || "All"}
                      options={Array.from(new Set(list.map(r => String(r.hq || r.territory || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))}
                      onChange={(val) => setColumnFilters(prev => ({ ...prev, hq: val }))}
                    />
                  </div>
                </th>
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
                  <td style={{ color: "var(--muted)", fontWeight: 500 }}>{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                  <td>
                    <span style={{ background: "#f3f4f6", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", fontWeight: 600 }}>
                      {row.territory || row.patch || "-"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{row.doctorCode || row.code || "-"}</td>
                  <td><strong>{row.name || row.doctorName}</strong></td>
                  <td>{row.specialty || "-"}</td>
                  <td>{row.category || "-"}</td>
                  <td>{row.mappedEmployeeCode || row.mr || "-"}</td>
                  <td>{row.hq || row.territory || "-"}</td>
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
                      <Ban size={15} />
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
    </>
  );
}
