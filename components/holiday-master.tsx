"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, ChevronDown, Ban } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";
import { BackButton } from "@/components/back-button";

type StateHolidayRow = {
  id: string;
  state: string;
  holidayName: string;
  holidayDate: string;
  holidayType: "Public Holiday" | "Restricted Holiday" | "Regional Holiday";
  status: "Active" | "Inactive";
};

type CalendarHolidayRow = {
  id: string;
  year: number;
  state: string;
  holiday: string;
  holidayDate: string;
  holidayType: "Public Holiday" | "Restricted Holiday" | "Regional Holiday";
  status: "Active" | "Inactive";
};

const initialStateHolidays: StateHolidayRow[] = [];
const initialCalendarHolidays: CalendarHolidayRow[] = [];

// Form for State Master (State Holiday)
function StateHolidayForm({ row, onSave, onBack }: { row: any; onSave: (r: StateHolidayRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<StateHolidayRow>({
    id: row.id ?? "",
    state: row.state ?? "Tamil Nadu",
    holidayName: row.holidayName ?? "",
    holidayDate: row.holidayDate ?? new Date().toISOString().split("T")[0],
    holidayType: row.holidayType ?? "Public Holiday",
    status: row.status ?? "Active"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Division Setup</p>
          <h2>{row.id ? "Edit Holiday (State Master)" : "Add Holiday (State Master)"}</h2>
          <p>Configure state-wise holiday lists and specific region work policies.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button">
          <RotateCcw size={16} /> Back
        </button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>State</span>
          <select
            value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
          </select>
        </label>
        <label className="field">
          <span>* Holiday Name</span>
          <input value={form.holidayName} onChange={e => setForm({ ...form, holidayName: e.target.value })} placeholder="e.g. Pongal / Diwali" />
        </label>
        <label className="field">
          <span>* Holiday Date</span>
          <input
            type="date"
            value={form.holidayDate}
            onChange={e => setForm({ ...form, holidayDate: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          />
        </label>
        <label className="field">
          <span>Holiday Type</span>
          <select
            value={form.holidayType}
            onChange={e => setForm({ ...form, holidayType: e.target.value as any })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Public Holiday">Public Holiday</option>
            <option value="Restricted Holiday">Restricted Holiday</option>
            <option value="Regional Holiday">Regional Holiday</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value as any })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <button
          className="button"
          style={{ marginTop: "12px" }}
          onClick={() => onSave(form)}
          type="button"
          disabled={!form.holidayName.trim()}
        >
          <Check size={16} /> Save Holiday Fixation
        </button>
      </div>
    </section>
  );
}

// Form for Holiday Calendar tab
function CalendarHolidayForm({ row, onSave, onBack }: { row: any; onSave: (r: CalendarHolidayRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<CalendarHolidayRow>({
    id: row.id ?? "",
    year: row.year ?? new Date().getFullYear(),
    state: row.state ?? "Tamil Nadu",
    holiday: row.holiday ?? "",
    holidayDate: row.holidayDate ?? new Date().toISOString().split("T")[0],
    holidayType: row.holidayType ?? "Public Holiday",
    status: row.status ?? "Active"
  });

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Division Setup</p>
          <h2>{row.id ? "Edit Holiday (Calendar)" : "Add Holiday (Calendar)"}</h2>
          <p>Configure yearly state-wise holiday schedules.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button">
          <RotateCcw size={16} /> Back
        </button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>Year</span>
          <input
            type="number"
            value={form.year || ""}
            onChange={e => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })}
            placeholder="e.g. 2026"
          />
        </label>
        <label className="field">
          <span>State</span>
          <select
            value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
          </select>
        </label>
        <label className="field">
          <span>* Holiday Name</span>
          <input value={form.holiday} onChange={e => setForm({ ...form, holiday: e.target.value })} placeholder="e.g. New Year's Day" />
        </label>
        <label className="field">
          <span>* Holiday Date</span>
          <input
            type="date"
            value={form.holidayDate}
            onChange={e => setForm({ ...form, holidayDate: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          />
        </label>
        <label className="field">
          <span>Holiday Type</span>
          <select
            value={form.holidayType}
            onChange={e => setForm({ ...form, holidayType: e.target.value as any })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Public Holiday">Public Holiday</option>
            <option value="Restricted Holiday">Restricted Holiday</option>
            <option value="Regional Holiday">Regional Holiday</option>
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value as any })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <button
          className="button"
          style={{ marginTop: "12px" }}
          onClick={() => onSave(form)}
          type="button"
          disabled={!form.holiday.trim()}
        >
          <Check size={16} /> Save Holiday Fixation
        </button>
      </div>
    </section>
  );
}

export function HolidayMaster({ initialTab = "state" }: { initialTab?: "state" | "holiday" }) {
  const isStateTab = initialTab === "state";

  // State Tab lists
  const [stateList, setStateList] = useState<StateHolidayRow[]>(initialStateHolidays);
  const [stateSearch, setStateSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [stateFilterOpen, setStateFilterOpen] = useState(false);
  const [stateTypeFilter, setStateTypeFilter] = useState("All");
  const [stateTypeFilterOpen, setStateTypeFilterOpen] = useState(false);
  const [stateStatusFilter, setStateStatusFilter] = useState("All");
  const [stateStatusFilterOpen, setStateStatusFilterOpen] = useState(false);
  const [editStateTarget, setEditStateTarget] = useState<StateHolidayRow | null>(null);

  // Holiday Tab lists
  const [calendarList, setCalendarList] = useState<CalendarHolidayRow[]>(initialCalendarHolidays);
  const [calSearch, setCalSearch] = useState("");
  const [calYearFilter, setCalYearFilter] = useState("All");
  const [calYearFilterOpen, setCalYearFilterOpen] = useState(false);
  const [calStateFilter, setCalStateFilter] = useState("All");
  const [calStateFilterOpen, setCalStateFilterOpen] = useState(false);
  const [calTypeFilter, setCalTypeFilter] = useState("All");
  const [calTypeFilterOpen, setCalTypeFilterOpen] = useState(false);
  const [calStatusFilter, setCalStatusFilter] = useState("All");
  const [calStatusFilterOpen, setCalStatusFilterOpen] = useState(false);
  const [editCalTarget, setEditCalTarget] = useState<CalendarHolidayRow | null>(null);

  const [view, setView] = useState<"list" | "add" | "edit">("list");

  // Filtering for state list (State Master)
  const filteredStateHolidays = stateList.filter(
    (item) =>
      (stateFilter === "All" || item.state === stateFilter) &&
      (stateTypeFilter === "All" || item.holidayType === stateTypeFilter) &&
      (stateStatusFilter === "All" || item.status === stateStatusFilter) &&
      (item.holidayName.toLowerCase().includes(stateSearch.toLowerCase()) ||
        item.state.toLowerCase().includes(stateSearch.toLowerCase()))
  );

  // Filtering for calendar list (Holiday Calendar)
  const filteredCalHolidays = calendarList.filter(
    (item) =>
      (calYearFilter === "All" || String(item.year) === calYearFilter) &&
      (calStateFilter === "All" || item.state === calStateFilter) &&
      (calTypeFilter === "All" || item.holidayType === calTypeFilter) &&
      (calStatusFilter === "All" || item.status === calStatusFilter) &&
      (item.holiday.toLowerCase().includes(calSearch.toLowerCase()) ||
        item.state.toLowerCase().includes(calSearch.toLowerCase()))
  );

  function handleStateSave(form: StateHolidayRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `HOL${String(stateList.length + 1).padStart(3, "0")}`
      };
      setStateList([...stateList, newRow]);
    } else {
      setStateList(stateList.map(item => item.id === form.id ? { ...form } : item));
    }
    setView("list");
  }

  function handleStateDelete(id: string) {
    setStateList(stateList.filter(item => item.id !== id));
  }

  function handleCalSave(form: CalendarHolidayRow) {
    if (view === "add") {
      const newRow = {
        ...form,
        id: `CAL${String(calendarList.length + 1).padStart(3, "0")}`
      };
      setCalendarList([...calendarList, newRow]);
    } else {
      setCalendarList(calendarList.map(item => item.id === form.id ? { ...form } : item));
    }
    setView("list");
  }

  function handleCalDelete(id: string) {
    setCalendarList(calendarList.filter(item => item.id !== id));
  }

  if (isStateTab) {
    if (view === "add") return <StateHolidayForm row={{}} onSave={handleStateSave} onBack={() => setView("list")} />;
    if (view === "edit" && editStateTarget) return <StateHolidayForm row={editStateTarget} onSave={handleStateSave} onBack={() => setView("list")} />;
  } else {
    if (view === "add") return <CalendarHolidayForm row={{}} onSave={handleCalSave} onBack={() => setView("list")} />;
    if (view === "edit" && editCalTarget) return <CalendarHolidayForm row={editCalTarget} onSave={handleCalSave} onBack={() => setView("list")} />;
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Division Setup</p>
          <h2>{isStateTab ? "State Master" : "Holiday Calendar"}</h2>
          <p>Review comprehensive list of declared regional holidays and policy rules.</p>
        </div>
        <div className="subdivision-actions">
          <BackButton />
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Holiday</button>
        </div>
      </div>

      {isStateTab ? (
        <>
          <div style={{ marginBottom: "16px" }}>
            <input
              placeholder="Search by holiday name or state..."
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "360px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "180px" }}>
            <table className="subdivision-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "150px", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>State</span>
                      <button
                        type="button"
                        onClick={() => setStateFilterOpen(!stateFilterOpen)}
                        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    {stateFilterOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "130px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                        {["Tamil Nadu", "Karnataka", "Kerala", "Maharashtra", "Delhi"].map(st => (
                          <button key={st} type="button" onClick={() => { setStateFilter(st); setStateFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: stateFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: stateFilter === st ? 600 : 400 }}>
                            {st}
                          </button>
                        ))}
                        <button type="button" onClick={() => { setStateFilter("All"); setStateFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                      </div>
                    )}
                  </th>
                  <th>Holiday Name</th>
                  <th>Holiday Date</th>
                  <th style={{ minWidth: "160px", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>Holiday Type</span>
                      <button
                        type="button"
                        onClick={() => setStateTypeFilterOpen(!stateTypeFilterOpen)}
                        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    {stateTypeFilterOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "160px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                        {["Public Holiday", "Restricted Holiday", "Regional Holiday"].map(th => (
                          <button key={th} type="button" onClick={() => { setStateTypeFilter(th); setStateTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: stateTypeFilter === th ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: stateTypeFilter === th ? 600 : 400 }}>
                            {th}
                          </button>
                        ))}
                        <button type="button" onClick={() => { setStateTypeFilter("All"); setStateTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                      </div>
                    )}
                  </th>
                  <th style={{ minWidth: "140px", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>Status</span>
                      <button
                        type="button"
                        onClick={() => setStateStatusFilterOpen(!stateStatusFilterOpen)}
                        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    {stateStatusFilterOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "120px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                        {["Active", "Inactive"].map(st => (
                          <button key={st} type="button" onClick={() => { setStateStatusFilter(st); setStateStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: stateStatusFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: stateStatusFilter === st ? 600 : 400 }}>
                            {st}
                          </button>
                        ))}
                        <button type="button" onClick={() => { setStateStatusFilter("All"); setStateStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                      </div>
                    )}
                  </th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredStateHolidays.map((row) => (
                  <tr key={row.id}>
                    <td>{row.state}</td>
                    <td><strong style={{ color: "var(--ink)" }}>{row.holidayName}</strong></td>
                    <td>{formatDate(row.holidayDate)}</td>
                    <td>{row.holidayType}</td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        background: row.status === "Active" ? "#dcfce7" : "#fee2e2",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: row.status === "Active" ? "#15803d" : "#b91c1c"
                      }}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => { setEditStateTarget(row); setView("edit"); }} type="button">
                        <Pencil size={15} />
                      </button>
                    </td>
                    <td>
                      <button className="subdivision-danger-button" onClick={() => handleStateDelete(row.id)} type="button">
                        <Ban />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStateHolidays.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                      No holiday fixations configured
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: "16px" }}>
            <input
              placeholder="Search by holiday name or state..."
              value={calSearch}
              onChange={(e) => setCalSearch(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "360px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div className="subdivision-table-card" style={{ overflowX: "auto", paddingBottom: "180px" }}>
            <table className="subdivision-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "120px", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>Year</span>
                      <button
                        type="button"
                        onClick={() => setCalYearFilterOpen(!calYearFilterOpen)}
                        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    {calYearFilterOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "110px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                        {["2025", "2026", "2027"].map(yr => (
                          <button key={yr} type="button" onClick={() => { setCalYearFilter(yr); setCalYearFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: calYearFilter === yr ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: calYearFilter === yr ? 600 : 400 }}>
                            {yr}
                          </button>
                        ))}
                        <button type="button" onClick={() => { setCalYearFilter("All"); setCalYearFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                      </div>
                    )}
                  </th>
                  <th style={{ minWidth: "150px", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>State</span>
                      <button
                        type="button"
                        onClick={() => setCalStateFilterOpen(!calStateFilterOpen)}
                        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    {calStateFilterOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "130px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                        {["Tamil Nadu", "Karnataka", "Kerala", "Maharashtra", "Delhi"].map(st => (
                          <button key={st} type="button" onClick={() => { setCalStateFilter(st); setCalStateFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: calStateFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: calStateFilter === st ? 600 : 400 }}>
                            {st}
                          </button>
                        ))}
                        <button type="button" onClick={() => { setCalStateFilter("All"); setCalStateFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                      </div>
                    )}
                  </th>
                  <th>Holiday</th>
                  <th>Holiday Date</th>
                  <th style={{ minWidth: "160px", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>Holiday Type</span>
                      <button
                        type="button"
                        onClick={() => setCalTypeFilterOpen(!calTypeFilterOpen)}
                        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    {calTypeFilterOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "160px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                        {["Public Holiday", "Restricted Holiday", "Regional Holiday"].map(th => (
                          <button key={th} type="button" onClick={() => { setCalTypeFilter(th); setCalTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: calTypeFilter === th ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: calTypeFilter === th ? 600 : 400 }}>
                            {th}
                          </button>
                        ))}
                        <button type="button" onClick={() => { setCalTypeFilter("All"); setCalTypeFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                      </div>
                    )}
                  </th>
                  <th style={{ minWidth: "140px", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>Status</span>
                      <button
                        type="button"
                        onClick={() => setCalStatusFilterOpen(!calStatusFilterOpen)}
                        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    {calStatusFilterOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "120px", display: "flex", flexDirection: "column", padding: "4px 0" }}>
                        {["Active", "Inactive"].map(st => (
                          <button key={st} type="button" onClick={() => { setCalStatusFilter(st); setCalStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", background: calStatusFilter === st ? "var(--line)" : "none", border: "none", color: "var(--ink)", fontSize: "12px", cursor: "pointer", fontWeight: calStatusFilter === st ? 600 : 400 }}>
                            {st}
                          </button>
                        ))}
                        <button type="button" onClick={() => { setCalStatusFilter("All"); setCalStatusFilterOpen(false); }} style={{ padding: "6px 12px", textAlign: "left", borderTop: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}>Clear Filter</button>
                      </div>
                    )}
                  </th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalHolidays.map((row) => (
                  <tr key={row.id}>
                    <td>{row.year}</td>
                    <td>{row.state}</td>
                    <td><strong style={{ color: "var(--ink)" }}>{row.holiday}</strong></td>
                    <td>{formatDate(row.holidayDate)}</td>
                    <td>{row.holidayType}</td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        background: row.status === "Active" ? "#dcfce7" : "#fee2e2",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: row.status === "Active" ? "#15803d" : "#b91c1c"
                      }}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => { setEditCalTarget(row); setView("edit"); }} type="button">
                        <Pencil size={15} />
                      </button>
                    </td>
                    <td>
                      <button className="subdivision-danger-button" onClick={() => handleCalDelete(row.id)} type="button">
                        <Ban />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCalHolidays.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                      No calendar holidays configured
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
