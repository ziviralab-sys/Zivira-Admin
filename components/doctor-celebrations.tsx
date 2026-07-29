"use client";

import { Cake, Download, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";

type DobRow = {
  sno: number;
  fieldForceName: string;
  designation: string;
  hq: string;
  lineManager1: string;
  lineManager2: string;
  doctorName: string;
  address: string;
  territory: string;
  dob?: string;
  dow?: string;
  phone: string;
};

const dobData: DobRow[] = [];

const dowData: DobRow[] = [];

const bothData: DobRow[] = [];


type TabKey = "dob" | "dow" | "both";

function CelebTable({ rows, type }: { rows: DobRow[]; type: TabKey }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(r =>
      !q || r.fieldForceName.toLowerCase().includes(q) ||
      r.doctorName.toLowerCase().includes(q) ||
      r.territory.toLowerCase().includes(q) ||
      r.hq.toLowerCase().includes(q) ||
      (r.dob ?? "").toLowerCase().includes(q) ||
      (r.dow ?? "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <div style={{ position:"relative", flex:1, maxWidth:320 }}>
          <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--muted)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, territory, date…" style={{ paddingLeft:32, width:"100%" }} />
        </div>
        <span style={{ fontSize:12, color:"var(--muted)", marginLeft:"auto" }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="subdivision-table-card" style={{ overflowX:"auto" }}>
        <table className="subdivision-table" style={{ minWidth: type === "both" ? 1100 : 980 }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>FieldForce Name</th>
              <th>Desig.</th>
              <th>HQ</th>
              <th>Line Manager 1</th>
              <th>Line Manager 2</th>
              <th>Listed Doctor Name</th>
              <th>Address</th>
              <th>Territory</th>
              {(type === "dob" || type === "both") && <th style={{ color:"#be185d" }}>DOB 🎂</th>}
              {(type === "dow" || type === "both") && <th style={{ color:"#7c3aed" }}>DOW 💍</th>}
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td style={{ color:"var(--muted)", fontWeight:500 }}>{row.sno}</td>
                <td><strong style={{ color:"var(--ink)", fontSize:12 }}>{row.fieldForceName}</strong></td>
                <td><span style={{ background:"#eff6ff", borderRadius:6, padding:"2px 6px", fontSize:11, fontWeight:700, color:"#2563eb" }}>{row.designation}</span></td>
                <td style={{ fontSize:12, color:"var(--muted)", whiteSpace:"nowrap" }}>{row.hq}</td>
                <td style={{ fontSize:11, color:"var(--muted)" }}>{row.lineManager1}</td>
                <td style={{ fontSize:11, color:"var(--muted)" }}>{row.lineManager2}</td>
                <td><strong style={{ color:"var(--brand)", fontSize:12 }}>{row.doctorName}</strong></td>
                <td style={{ fontSize:11, color:"var(--muted)", maxWidth:200, whiteSpace:"normal", lineHeight:1.4 }}>{row.address}</td>
                <td style={{ fontSize:12, whiteSpace:"nowrap" }}><span style={{ background:"var(--panel-strong)", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600, color:"var(--ink)" }}>{row.territory}</span></td>
                {(type === "dob" || type === "both") && (
                  <td><span style={{ background:"#fdf2f8", border:"1px solid #fbcfe8", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700, color:"#be185d", whiteSpace:"nowrap" }}>🎂 {row.dob}</span></td>
                )}
                {(type === "dow" || type === "both") && (
                  <td><span style={{ background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700, color:"#7c3aed", whiteSpace:"nowrap" }}>💍 {row.dow}</span></td>
                )}
                <td style={{ fontSize:12, fontFamily:"monospace", color: row.phone ? "var(--brand)" : "var(--muted)" }}>{row.phone || "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={12} style={{ textAlign:"center", color:"var(--muted)", padding:40 }}>No records match your search</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const TABS: { key: TabKey; label: string; icon: string; count: number }[] = [
  { key:"dob",  label:"Date of Birth",            icon:"🎂", count: dobData.length },
  { key:"dow",  label:"Date of Wedding",           icon:"💍", count: dowData.length },
  { key:"both", label:"DOB + DOW (Same Month)",    icon:"🎉", count: bothData.length },
];

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function DoctorCelebrations() {
  const [activeTab, setActiveTab] = useState<TabKey>("dob");
  const [selectedMonth, setSelectedMonth] = useState("May");

  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeData = useMemo(() => {
    const src = activeTab === "dob" ? dobData : activeTab === "dow" ? dowData : bothData;
    return src.filter(r => {
      const date = r.dob ?? r.dow ?? "";
      return date.includes(selectedMonth);
    });
  }, [activeTab, selectedMonth]);

  return (
    <section className="subdivision-console">
      {/* Header */}
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">MIS Reports</p>
          <h2 style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Cake size={22} style={{ color:"var(--brand)" }} />
            Doctor Celebrations
          </h2>
          <p>Listed doctor date of birth and wedding anniversary details by field force and month.</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div ref={dropdownRef} className="command-select" style={{ position:"relative" }}>
            <button
              className="command-select-button"
              style={{
                width: "115px",
                height: "36px",
                minHeight: "36px",
                paddingLeft: "32px",
                position: "relative"
              }}
              onClick={() => setOpenMenu(!openMenu)}
              type="button"
            >
              <span>{selectedMonth}</span>
              <SlidersHorizontal size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--muted)", pointerEvents:"none" }} />
            </button>
            {openMenu && (
              <div className="command-select-menu" style={{ width: "130px", top: "calc(100% + 6px)" }}>
                {months.map(m => (
                  <button
                    key={m}
                    className={selectedMonth === m ? "command-select-option command-select-option-active" : "command-select-option"}
                    onClick={() => { setSelectedMonth(m); setOpenMenu(false); }}
                    type="button"
                  >
                    <span>{m}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="button button-secondary" type="button" style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="subdivision-stats" style={{ marginBottom:20 }}>
        <article><span>DOB This Month</span><strong style={{ color:"var(--brand)" }}>{dobData.filter(r => (r.dob ?? "").includes(selectedMonth)).length}</strong></article>
        <article><span>DOW This Month</span><strong style={{ color:"var(--blue)" }}>{dowData.filter(r => (r.dow ?? "").includes(selectedMonth)).length}</strong></article>
        <article><span>Both Events</span><strong style={{ color:"var(--amber)" }}>{bothData.filter(r => (r.dob ?? r.dow ?? "").includes(selectedMonth)).length}</strong></article>
        <article><span>Total Records</span><strong>{dobData.length + dowData.length}</strong></article>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20, borderBottom:"1px solid var(--line)", paddingBottom:0 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            type="button"
            style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"8px 16px",
              borderRadius:"8px 8px 0 0",
              border:"1px solid var(--line)",
              borderBottom: activeTab === tab.key ? "2px solid var(--brand)" : "1px solid var(--line)",
              background: activeTab === tab.key ? "var(--panel)" : "transparent",
              color: activeTab === tab.key ? "var(--brand)" : "var(--muted)",
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize:13, cursor:"pointer",
              marginBottom: activeTab === tab.key ? -1 : 0,
              transition:"all 0.15s"
            }}
          >
            {tab.icon} {tab.label}
            <span style={{ background: activeTab === tab.key ? "var(--brand)" : "var(--panel-strong)", color: activeTab === tab.key ? "#fff" : "var(--muted)", borderRadius:99, padding:"1px 7px", fontSize:11, fontWeight:700 }}>
              {activeTab === tab.key
                ? activeData.length
                : (tab.key === "dob" ? dobData : tab.key === "dow" ? dowData : bothData).filter(r => (r.dob ?? r.dow ?? "").includes(selectedMonth)).length
              }
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <CelebTable rows={activeData} type={activeTab} />
    </section>
  );
}
