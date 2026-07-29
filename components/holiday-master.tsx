"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { apiClient, type Holiday } from "@/lib/api-client";
import { formatDate } from "@/lib/format-date";

export function HolidayMaster() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default states list to show in frontend when database records are empty
  const defaultStates = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat"];

  useEffect(() => {
    apiClient.holidays()
      .then((res) => setHolidays(res.data))
      .catch(() => setHolidays([]));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Extract unique state names from actual fetched holidays data
  const databaseStates = [...new Set(holidays.map(h => h.stateName))].filter(Boolean).sort();
  const stateOptions = databaseStates.length > 0 ? databaseStates : defaultStates;

  const filtered = holidays.filter(
    (h) => !selectedState || h.stateName.toLowerCase() === selectedState.toLowerCase()
  );

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Statewise - Holiday Fixation</h2>
          <p>Configure weekly days off and state holiday matrices.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="button" type="button">
            <Plus size={16} /> Add Holiday
          </button>
        </div>
      </div>

      {/* State Name Dropdown Filter (with text input combobox) */}
      <div style={{ marginBottom: "20px" }} ref={dropdownRef}>
        <div className="command-select" style={{ position: "relative", width: "fit-content", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            placeholder=""
            style={{
              width: "260px",
              height: "38px",
              padding: "0 40px 0 12px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--panel)",
              color: "var(--ink)",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
            style={{
              position: "absolute",
              right: "1px",
              top: "1px",
              bottom: "1px",
              width: "36px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px"
            }}
            aria-label="Toggle Dropdown"
          >
            <ChevronDown size={15} style={{ color: "var(--muted)" }} />
          </button>

          {dropdownOpen && (
            <div className="command-select-menu" style={{ width: "260px", top: "calc(100% + 6px)", left: 0, right: "auto" }}>
              <button
                className={selectedState === "" ? "command-select-option command-select-option-active" : "command-select-option"}
                onClick={() => {
                  setSelectedState("");
                  setDropdownOpen(false);
                }}
                type="button"
              >
                <span>All States</span>
                {selectedState === "" && <Check size={14} />}
              </button>
              {stateOptions.map((state) => (
                <button
                  key={state}
                  className={selectedState === state ? "command-select-option command-select-option-active" : "command-select-option"}
                  onClick={() => {
                    setSelectedState(state);
                    setDropdownOpen(false);
                  }}
                  type="button"
                >
                  <span>{state}</span>
                  {selectedState === state && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
        <article>
          <span>Total Holidays</span>
          <strong>{holidays.length}</strong>
        </article>
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>State Name</th>
              <th>Weekend Holiday</th>
              <th>Other Holiday Date</th>
              <th>Other Holiday Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map((row, i) => (
              <tr key={row.id}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{i + 1}</td>
                <td><strong>{row.stateName}</strong></td>
                <td>{row.weekendHoliday || "—"}</td>
                <td>{formatDate(row.otherHolidayDate)}</td>
                <td>{row.otherHolidayDescription || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
