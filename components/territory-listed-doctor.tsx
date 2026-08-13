"use client";

import { Check, Plus, RotateCcw, SlidersHorizontal, Trash2, Pencil, ChevronDown } from "lucide-react";
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
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const filtered = list.filter(x => {
    const s = search.toLowerCase();
    const isActive = x.status === "Active" || x.status === "ACTIVE";
    const statusMatch = statusFilter === "All" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);
      
    const nameStr = (x.name || x.doctorName || "").toLowerCase();
    const patchStr = (x.territory || x.patch || "").toLowerCase();
    const codeStr = (x.doctorCode || x.code || "").toLowerCase();

    const textMatch = nameStr.includes(s) || patchStr.includes(s) || codeStr.includes(s);
    return statusMatch && textMatch;
  });

  if (view !== "list") {
    return (
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Field Force Entries</p>
            <h2>{view === "add" ? "Map Doctor to Territory" : "Edit Territory Mapping"}</h2>
            <p>Create relationships between doctors and active sales patches.</p>
          </div>
          <button className="button button-secondary" onClick={() => setView("list")} type="button">
            <RotateCcw size={16} /> Back
          </button>
        </div>

        <form onSubmit={handleSave} className="card form-grid" style={{ animation: "popIn 0.3s ease-out forwards" }}>
          
          <div style={{ gridColumn: "span 2", borderBottom: "1px solid var(--border)", paddingBottom: "8px", fontWeight: 700, color: "#9d174d", fontSize: "14px" }}>
            Territory & Doctor Information
          </div>

          <div className="field">
            <label>Select Patch</label>
            <select value={form.patch} onChange={e => handlePatchChange(e.target.value)}>
              {patchesList.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Select Doctor</label>
            <select value={form.doctorCode} onChange={e => handleDoctorChange(e.target.value)}>
              {doctorsList.map(d => (
                <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Ophthalmology / Specialty</label>
            <input readOnly value={form.specialty} style={{ opacity: 0.7 }} />
          </div>

          <div className="field">
            <label>Category</label>
            <input readOnly value={form.category} style={{ opacity: 0.7 }} />
          </div>

          <div className="field">
            <label>Assigned Medical Representative</label>
            <input readOnly value={form.mr} style={{ opacity: 0.7 }} />
          </div>

          <div className="field">
            <label>Headquarters (HQ)</label>
            <input readOnly value={form.hq} style={{ opacity: 0.7 }} />
          </div>

          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
            <button className="button" type="submit">
              <Check size={16} /> Add Mapping
            </button>
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
          <h2>Territory - Listed Doctor</h2>
          <p>Map and manage doctors assigned under respective patch sales networks.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button"><SlidersHorizontal size={16} /> Filters</button>
          <button className="button" onClick={handleAdd} type="button"><Plus size={16} /> Map Doctor</button>
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
                <th>Specialty</th>
                <th>Category</th>
                <th>Medical Representative</th>
                <th>HQ</th>
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
                  <td>{row.hq || "-"}</td>
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
