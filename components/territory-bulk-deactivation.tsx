"use client";
import { ColumnFilterDropdown } from "@/components/column-filter-dropdown";
import { StatusFilterDropdown } from "@/components/status-filter-dropdown";
import { RotateCcw, SlidersHorizontal, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
type DeactivationRow = {
  id: string;
  division: string;
  hq: string;
  patch: string;
  totalDoctors: number;
  activeDoctors: number;
  selectedForDeactivation: boolean;
  effectiveDate: string;
  status: "Active" | "Inactive";
};
const initialRows: DeactivationRow[] = [];
export function TerritoryBulkDeactivation() {
  const [list, setList] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "add">("list");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try {
      setLoading(true);
      const res = await apiClient.territoryDoctorCounts();
      setList(res.data.map((r: any) => ({
        id: r.patch,
        division: r.division,
        hq: r.hq,
        patch: r.patch,
        totalDoctors: r.totalDoctors,
        activeDoctors: r.activeDoctors,
        selectedForDeactivation: false,
        effectiveDate: new Date().toISOString().split("T")[0],
        status: r.activeDoctors > 0 ? "Active" : "Inactive"
      })));
    } catch (err: any) {
      setError(err.message || "Failed to load territory counts");
    } finally {
      setLoading(false);
    }
  }
  const [form, setForm] = useState({
    division: "Zivira",
    hq: "Chennai Central HQ",
    patch: "T. Nagar",
    totalDoctors: 12,
    activeDoctors: 10,
    effectiveDate: new Date().toISOString().split("T")[0],
    status: "Active" as "Active" | "Inactive"
  });
  const patchesList = [
    { name: "T. Nagar", hq: "Chennai Central HQ", total: 12, active: 10 },
    { name: "Mylapore", hq: "Chennai South HQ", total: 8, active: 8 },
    { name: "Adyar", hq: "Chennai South HQ", total: 5, active: 4 }
  ];
  function handlePatchChange(patchName: string) {
    const p = list.find(x => x.patch === patchName);
    if (p) {
      setForm(prev => ({
        ...prev,
        patch: patchName,
        hq: p.hq,
        totalDoctors: p.totalDoctors,
        activeDoctors: p.activeDoctors
      }));
    }
  }
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiClient.bulkDeactivateTerritory(form.patch);
      await fetchData();
      setView("list");
      alert("Successfully deactivated doctors for patch " + form.patch);
    } catch (err: any) {
      alert(err.message || "Failed to bulk deactivate");
    }
  }
  function toggleCheckbox(id: string) {
    setList(list.map(x => x.id === id ? { ...x, selectedForDeactivation: !x.selectedForDeactivation } : x));
  }
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const filtered = list.filter(x => {
    let isMatch = true;

    // Status Filter
    const isActive = x.status === "Active" || x.status === "ACTIVE";
    const statusMatch = statusFilter === "All" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);
      
    if (!statusMatch) isMatch = false;

    // Search Box
    const s = search.toLowerCase();
    const patchStr = (x.patch || "").toLowerCase();
    const hqStr = (x.hq || "").toLowerCase();
    if (s && !(patchStr.includes(s) || hqStr.includes(s))) {
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
  if (view !== "list") {
    return (
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Field Force Entries</p>
            <h2>Add Bulk Deactivation</h2>
            <p>Deactivate doctor assignments across a whole patch in bulk.</p>
          </div>
          <button className="button button-secondary" onClick={() => setView("list")} type="button">
            <RotateCcw size={16} /> Back
          </button>
        </div>
        <form onSubmit={handleSave} className="card form-grid" style={{ animation: "popIn 0.3s ease-out forwards" }}>
          <div className="field">
            <label>Select Division</label>
            <select value={form.division} onChange={e => setForm({ ...form, division: e.target.value })}>
              <option value="Zivira">Zivira</option>
              <option value="Astra">Astra</option>
              <option value="Aura">Aura</option>
            </select>
          </div>
          <div className="field">
            <label>Select Patch</label>
            <select value={form.patch} onChange={e => handlePatchChange(e.target.value)}>
              {list.map(p => (
                <option key={p.patch} value={p.patch}>{p.patch}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Headquarters (HQ)</label>
            <input readOnly value={form.hq} style={{ opacity: 0.7 }} />
          </div>
          <div className="field">
            <label>Total Doctors</label>
            <input readOnly value={form.totalDoctors} style={{ opacity: 0.7 }} />
          </div>
          <div className="field">
            <label>Active Doctors</label>
            <input readOnly value={form.activeDoctors} style={{ opacity: 0.7 }} />
          </div>
          <div className="field">
            <label>Effective Date</label>
            <input type="date" value={form.effectiveDate} onChange={e => setForm({ ...form, effectiveDate: e.target.value })} />
          </div>
          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
            <button className="button" type="submit">
              Bulk Deactivate Mappings
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
          <h2>Territory Bulk Deactivation</h2>
          <p>Disable entire patch sales mapping networks simultaneously.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"> Add Bulk Deactivation</button>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by patch or HQ..."
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
                <th>
                  <div style={{ minWidth: "140px" }}>
                    <ColumnFilterDropdown 
                      title="Division" 
                      value={columnFilters['division'] || "All"} 
                      options={Array.from(new Set(list.map(r => String(r.division || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))} 
                      onChange={(val) => setColumnFilters(prev => ({ ...prev, division: val }))} 
                    />
                  </div>
                </th>
                <th>
                  <div style={{ minWidth: "140px" }}>
                    <ColumnFilterDropdown 
                      title="HQ" 
                      value={columnFilters['hq'] || "All"} 
                      options={Array.from(new Set(list.map(r => String(r.hq || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))} 
                      onChange={(val) => setColumnFilters(prev => ({ ...prev, hq: val }))} 
                    />
                  </div>
                </th>
                <th>
                  <div style={{ minWidth: "140px" }}>
                    <ColumnFilterDropdown 
                      title="Patch" 
                      value={columnFilters['patch'] || "All"} 
                      options={Array.from(new Set(list.map(r => String(r.patch || "")))).filter(Boolean).sort().map(v => ({label: v, value: v}))} 
                      onChange={(val) => setColumnFilters(prev => ({ ...prev, patch: val }))} 
                    />
                  </div>
                </th>
                <th>Total Doctors</th>
                <th>Active Doctor</th>
                <th>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
                    <span>Selected For Deactivation</span>
                    <select 
                      onChange={(e) => {
                        if (e.target.value === "Select All") {
                          setList(list.map(x => ({ ...x, selectedForDeactivation: true })));
                        } else if (e.target.value === "Deselect All") {
                          setList(list.map(x => ({ ...x, selectedForDeactivation: false })));
                        }
                        e.target.value = ""; // Reset dropdown after action
                      }}
                      style={{ fontSize: "11px", padding: "2px 4px", borderRadius: "4px", border: "1px solid #e5e7eb", outline: "none", cursor: "pointer", background: "white" }}
                    >
                      <option value="">Options</option>
                      <option value="Select All">Select All</option>
                      <option value="Deselect All">Deselect All</option>
                    </select>
                  </div>
                </th>
                <th>Effective Date</th>
                <th>
                  <div style={{ minWidth: "140px" }}>
                    <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={row.id}>
                  <td style={{ color: "var(--muted)", fontWeight: 500 }}>{idx + 1}</td>
                  <td>{row.division}</td>
                  <td>{row.hq}</td>
                  <td><strong>{row.patch}</strong></td>
                  <td>{row.totalDoctors}</td>
                  <td>{row.activeDoctors}</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={row.selectedForDeactivation}
                      onChange={() => toggleCheckbox(row.id)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ fontFamily: "monospace" }}>{row.effectiveDate}</td>
                  <td>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: row.status === "Active" ? "#10b98115" : "#ef444415",
                      color: row.status === "Active" ? "#10b981" : "#ef4444",
                      border: row.status === "Active" ? "1px solid #10b98125" : "1px solid #ef444425"
                    }}>
                      {row.status}
                    </span>
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
