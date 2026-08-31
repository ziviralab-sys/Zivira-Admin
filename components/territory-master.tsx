"use client";

import { Check, Plus, RotateCcw, SlidersHorizontal, Trash2, Pencil, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";

type PatchRow = {
  id: string;
  code: string;
  name: string;
  hq: string;
  region: string;
  division: string;
  mr: string;
  am: string;
  noOfDoctors: number;
  status: "Active" | "Inactive";
};

const initialPatches: PatchRow[] = [];

export function TerritoryMaster() {
  const [list, setList] = useState<PatchRow[]>(initialPatches);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [search, setSearch] = useState("");
  const [selectedPatch, setSelectedPatch] = useState<PatchRow | null>(null);

  // Form State
  const [patchForm, setPatchForm] = useState({
    code: "",
    name: "",
    division: "Zivira",
    zone: "South",
    region: "Tamil Nadu Region",
    state: "Tamil Nadu",
    city: "Chennai",
    hq: "Chennai Central HQ",
    mr: "Rahul Sharma",
    am: "Priya Nair",
    status: "Active" as "Active" | "Inactive"
  });

  function handleAdd() {
    const nextCode = `PAT${String(list.length + 1).padStart(3, "0")}`;
    setPatchForm({
      code: nextCode,
      name: "",
      division: "Zivira",
      zone: "South",
      region: "Tamil Nadu Region",
      state: "Tamil Nadu",
      city: "Chennai",
      hq: "Chennai Central HQ",
      mr: "Rahul Sharma",
      am: "Priya Nair",
      status: "Active"
    });
    setView("add");
  }

  function handleEdit(row: PatchRow) {
    setSelectedPatch(row);
    setPatchForm({
      code: row.code,
      name: row.name,
      division: row.division,
      zone: "South",
      region: row.region,
      state: "Tamil Nadu",
      city: "Chennai",
      hq: row.hq,
      mr: row.mr,
      am: row.am,
      status: row.status
    });
    setView("edit");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (view === "add") {
      const newRow: PatchRow = {
        id: patchForm.code,
        code: patchForm.code,
        name: patchForm.name,
        hq: patchForm.hq,
        region: patchForm.region,
        division: patchForm.division,
        mr: patchForm.mr,
        am: patchForm.am,
        noOfDoctors: 0,
        status: patchForm.status
      };
      setList([...list, newRow]);
    } else if (view === "edit" && selectedPatch) {
      setList(list.map(p => p.id === selectedPatch.id ? {
        ...p,
        name: patchForm.name,
        hq: patchForm.hq,
        region: patchForm.region,
        division: patchForm.division,
        mr: patchForm.mr,
        am: patchForm.am,
        status: patchForm.status
      } : p));
    }
    setView("list");
  }

  function handleDelete(id: string) {
    setList(list.map(p => p.id === id ? { ...p, status: "Inactive" as const } : p));
  }

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [hqFilter, setHqFilter] = useState<string>("All");
  const [hqFilterOpen, setHqFilterOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState<string>("All");
  const [regionFilterOpen, setRegionFilterOpen] = useState(false);
  const [divisionFilter, setDivisionFilter] = useState<string>("All");
  const [divisionFilterOpen, setDivisionFilterOpen] = useState(false);
  const [mrFilter, setMrFilter] = useState<string>("All");
  const [mrFilterOpen, setMrFilterOpen] = useState(false);
  const [amFilter, setAmFilter] = useState<string>("All");
  const [amFilterOpen, setAmFilterOpen] = useState(false);

  const filtered = list.filter(p =>
    (statusFilter === "All" ||
      (statusFilter === "Active" && p.status === "Active") ||
      (statusFilter === "Inactive" && p.status === "Inactive")) &&
    (hqFilter === "All" || p.hq === hqFilter) &&
    (regionFilter === "All" || p.region === regionFilter) &&
    (divisionFilter === "All" || p.division === divisionFilter) &&
    (mrFilter === "All" || p.mr === mrFilter) &&
    (amFilter === "All" || p.am === amFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.mr.toLowerCase().includes(search.toLowerCase()))
  );

  if (view !== "list") {
    return (
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Field Force Entries</p>
            <h2>{view === "add" ? "Add Patch Form" : "Edit Patch Form"}</h2>
            <p>Define new sale territory details and agent assignments.</p>
          </div>
          <button className="button button-secondary" onClick={() => setView("list")} type="button">
            <RotateCcw size={16} /> Back
          </button>
        </div>

        <form onSubmit={handleSave} className="card form-grid" style={{ animation: "popIn 0.3s ease-out forwards" }}>
          
          <div style={{ gridColumn: "span 2", borderBottom: "1px solid var(--border)", paddingBottom: "8px", fontWeight: 700, color: "#9d174d", fontSize: "14px" }}>
            Basic Information
          </div>
          <div className="field">
            <label>Patch Code (Auto-generated)</label>
            <input readOnly value={patchForm.code} style={{ opacity: 0.7 }} />
          </div>
          <div className="field">
            <label>Patch Name</label>
            <input required value={patchForm.name} onChange={e => setPatchForm({ ...patchForm, name: e.target.value })} placeholder="e.g. T. Nagar" />
          </div>

          <div style={{ gridColumn: "span 2", borderBottom: "1px solid var(--border)", paddingBottom: "8px", paddingTop: "12px", fontWeight: 700, color: "#9d174d", fontSize: "14px" }}>
            Location Information
          </div>
          <div className="field">
            <label>Division</label>
            <select value={patchForm.division} onChange={e => setPatchForm({ ...patchForm, division: e.target.value })}>
              <option value="Zivira">Zivira</option>
              <option value="Astra">Astra</option>
              <option value="Aura">Aura</option>
            </select>
          </div>
          <div className="field">
            <label>Zone</label>
            <select value={patchForm.zone} onChange={e => setPatchForm({ ...patchForm, zone: e.target.value })}>
              <option value="South">South Zone</option>
              <option value="North">North Zone</option>
              <option value="East">East Zone</option>
              <option value="West">West Zone</option>
            </select>
          </div>
          <div className="field">
            <label>Region</label>
            <input value={patchForm.region} onChange={e => setPatchForm({ ...patchForm, region: e.target.value })} />
          </div>
          <div className="field">
            <label>State</label>
            <input value={patchForm.state} onChange={e => setPatchForm({ ...patchForm, state: e.target.value })} />
          </div>
          <div className="field">
            <label>City</label>
            <input value={patchForm.city} onChange={e => setPatchForm({ ...patchForm, city: e.target.value })} />
          </div>
          <div className="field">
            <label>HQ</label>
            <input value={patchForm.hq} onChange={e => setPatchForm({ ...patchForm, hq: e.target.value })} />
          </div>

          <div style={{ gridColumn: "span 2", borderBottom: "1px solid var(--border)", paddingBottom: "8px", paddingTop: "12px", fontWeight: 700, color: "#9d174d", fontSize: "14px" }}>
            Employee Mapping
          </div>
          <div className="field">
            <label>Medical Representative (MR)</label>
            <select value={patchForm.mr} onChange={e => setPatchForm({ ...patchForm, mr: e.target.value })}>
              <option value="Rahul Sharma">Rahul Sharma</option>
              <option value="Karthik Iyer">Karthik Iyer</option>
              <option value="Priya Nair">Priya Nair</option>
            </select>
          </div>
          <div className="field">
            <label>Area Manager (AM)</label>
            <select value={patchForm.am} onChange={e => setPatchForm({ ...patchForm, am: e.target.value })}>
              <option value="Priya Nair">Priya Nair</option>
              <option value="Rahul Sharma">Rahul Sharma</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select value={patchForm.status} onChange={e => setPatchForm({ ...patchForm, status: e.target.value as any })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
            <button className="button" type="submit">
              <Check size={16} /> Add Patch
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
          <h2>Patch Name</h2>
          <p>Maintain territories and map Medical Representatives (MR) and Area Managers.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={handleAdd} type="button"><Plus size={16} /> Add Patch</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by patch code, name or MR..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: "360px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
        />
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "120px" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Patch Code</th>
              <th>Patch Name</th>
              <th style={{ minWidth: "160px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>HQ</span>
                  <button
                    type="button"
                    onClick={() => setHqFilterOpen(!hqFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {hqFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "160px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Chennai Central HQ", "Coimbatore HQ", "Madurai HQ"].map(hq => (
                      <button key={hq} type="button" onClick={() => { setHqFilter(hq); setHqFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: hqFilter === hq ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: hqFilter === hq ? 600 : 400 }}>
                        {hq}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setHqFilter("All"); setHqFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "140px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Region</span>
                  <button
                    type="button"
                    onClick={() => setRegionFilterOpen(!regionFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {regionFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "140px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Tamil Nadu Region", "Karnataka Region"].map(reg => (
                      <button key={reg} type="button" onClick={() => { setRegionFilter(reg); setRegionFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: regionFilter === reg ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: regionFilter === reg ? 600 : 400 }}>
                        {reg}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setRegionFilter("All"); setRegionFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "120px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Division</span>
                  <button
                    type="button"
                    onClick={() => setDivisionFilterOpen(!divisionFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {divisionFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "120px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Zivira", "Astra", "Aura"].map(div => (
                      <button key={div} type="button" onClick={() => { setDivisionFilter(div); setDivisionFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: divisionFilter === div ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: divisionFilter === div ? 600 : 400 }}>
                        {div}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setDivisionFilter("All"); setDivisionFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "180px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Medical Representative</span>
                  <button
                    type="button"
                    onClick={() => setMrFilterOpen(!mrFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {mrFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "160px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Rahul Sharma", "Karthik Iyer", "Vignesh Raj"].map(mr => (
                      <button key={mr} type="button" onClick={() => { setMrFilter(mr); setMrFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: mrFilter === mr ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: mrFilter === mr ? 600 : 400 }}>
                        {mr}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setMrFilter("All"); setMrFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th style={{ minWidth: "160px", position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Area Manager</span>
                  <button
                    type="button"
                    onClick={() => setAmFilterOpen(!amFilterOpen)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                {amFilterOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "140px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                    {["Priya Nair", "Meena Patel", "Arvind Kumar"].map(am => (
                      <button key={am} type="button" onClick={() => { setAmFilter(am); setAmFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: amFilter === am ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: amFilter === am ? 600 : 400 }}>
                        {am}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setAmFilter("All"); setAmFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                  </div>
                )}
              </th>
              <th>No of Doctors</th>
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
              <th>Inactive</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                <td style={{ fontWeight: 600 }}>{row.code}</td>
                <td><strong>{row.name}</strong></td>
                <td>{row.hq}</td>
                <td>{row.region}</td>
                <td>{row.division}</td>
                <td>{row.mr}</td>
                <td>{row.am}</td>
                <td>
                  <span style={{ padding: "2px 8px", background: "#f3f4f6", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                    {row.noOfDoctors}
                  </span>
                </td>
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
                <td colSpan={11} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
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
