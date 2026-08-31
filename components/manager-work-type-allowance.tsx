"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import { apiClient } from "@/lib/api-client";

// Same Designation-Level list used everywhere else in the app (Add Employee,
// Employee Manager) — the legacy sanpharma.info "Designation-Level" selector
// maps 1:1 onto this enum, so no new levels are invented here.
const LEVELS = ["NBH", "BH", "RBM", "ZBM", "ABM", "SR_MR", "MR", "OTHER"] as const;

// The 17 fixed Work Type rows from the sanpharma.info "Work Type Wise
// Allowance - Fare Fixation" reference screen, in the same order.
const WORK_TYPES = [
  "Meeting", "Leave", "Holiday", "Transit", "Weekly Off", "Field Work",
  "Super Stockist Work", "Camp Work", "Induction Work", "Cycle Meeting",
  "Stockist Work", "Training", "Admin Work", "Drs Survey", "Conference",
  "Work From Home", "Strike"
];

// The exact 12 "Allowance and Fare Type" dropdown values given for this
// screen — every row picks one of these, nothing else.
const ALLOWANCE_FARE_TYPES = [
  "NA",
  "HQ",
  "EX",
  "OS",
  "Allowance Selectable / Fare Enterable",
  "Allowance Auto / No Fare",
  "No Allowance / Fare Automatic",
  "Allowance Selectable / Fare Auto",
  "Allowance Enterable / Fare Auto",
  "Allowance Auto / Fare Enterable",
  "Allowance Enterable / Fare Enterable",
  "Fixed Allowance"
];

// Metro / Non Metro, each split by employment status, each split by pay
// type — matches the sanpharma.info grid's 3-level column header exactly
// (Metro/Non Metro -> Confirmed/Trainee/probation -> HQ/EX/OS).
const ZONES = ["Metro", "Non Metro"] as const;
const EMP_STATUSES = ["Confirmed", "Trainee", "Probation"] as const;
const PAY_TYPES = ["HQ", "EX", "OS"] as const;

function cellKey(zone: string, empStatus: string, payType: string) {
  return `${zone}__${empStatus}__${payType}`;
}

function configKeyForLevel(level: string) {
  return `WORK_TYPE_ALLOWANCE_${level}`;
}

type RowState = {
  allowanceFareType: string;
  cells: Record<string, string>;
};
type GridState = Record<string, RowState>; // keyed by work type

function blankGrid(): GridState {
  const g: GridState = {};
  for (const wt of WORK_TYPES) {
    const cells: Record<string, string> = {};
    for (const zone of ZONES) {
      for (const emp of EMP_STATUSES) {
        for (const pay of PAY_TYPES) {
          cells[cellKey(zone, emp, pay)] = "";
        }
      }
    }
    g[wt] = { allowanceFareType: "NA", cells };
  }
  return g;
}

export function ManagerWorkTypeAllowance() {
  const [inputText, setInputText] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // The level whose grid is actually shown/edited — only changes on Go.
  const [activeLevel, setActiveLevel] = useState("");
  const [grid, setGrid] = useState<GridState>(blankGrid());
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLevels = useMemo(() => {
    const q = inputText.trim().toLowerCase();
    return q ? LEVELS.filter((l) => l.toLowerCase().includes(q)) : [...LEVELS];
  }, [inputText]);

  async function handleGo() {
    if (!selectedLevel) return;
    setSaveError("");
    setSavedMessage(false);
    setActiveLevel(selectedLevel);
    setLoadingGrid(true);
    let next = blankGrid();
    try {
      const config = await apiClient.companyConfig();
      const raw = config.data[configKeyForLevel(selectedLevel)];
      if (typeof raw === "string" && raw.trim()) {
        const stored = JSON.parse(raw) as GridState;
        for (const wt of WORK_TYPES) {
          if (stored[wt]) {
            next[wt] = {
              allowanceFareType: stored[wt].allowanceFareType || "NA",
              cells: { ...next[wt].cells, ...stored[wt].cells }
            };
          }
        }
      }
    } catch {
      // No saved grid yet for this level, or it couldn't be parsed — the
      // freshly blanked grid already in `next` is the right fallback.
    }
    setGrid(next);
    setLoadingGrid(false);
  }

  function updateAllowanceFareType(workType: string, value: string) {
    setGrid((prev) => ({ ...prev, [workType]: { ...prev[workType], allowanceFareType: value } }));
  }

  function updateCell(workType: string, zone: string, empStatus: string, payType: string, value: string) {
    setGrid((prev) => ({
      ...prev,
      [workType]: {
        ...prev[workType],
        cells: { ...prev[workType].cells, [cellKey(zone, empStatus, payType)]: value }
      }
    }));
  }

  async function handleSave() {
    if (!activeLevel) return;
    setSaving(true);
    setSaveError("");
    setSavedMessage(false);
    try {
      await apiClient.setCompanyConfig(configKeyForLevel(activeLevel), JSON.stringify(grid));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 4000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save allowance grid");
    } finally {
      setSaving(false);
    }
  }

  const cellInputStyle = {
    width: "56px",
    height: "26px",
    borderRadius: "4px",
    border: "1px solid var(--line)",
    background: "var(--panel)",
    color: "var(--ink)",
    fontSize: "12px",
    padding: "0 4px",
    boxSizing: "border-box" as const,
    textAlign: "center" as const
  };
  const thStyle = {
    textAlign: "center" as const,
    padding: "6px 6px",
    color: "var(--muted)",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
    border: "1px solid var(--border)",
    fontSize: "12px"
  };

  return (
    <section className="subdivision-console">
      {/* Page Header */}
      <div className="subdivision-head" style={{ marginBottom: "24px" }}>
        <div>
          <p className="subdivision-eyebrow">Manager Expense</p>
          <h2>Work Type Wise - Allowance Fix</h2>
          <p>Pick a Designation-Level, click Go, and fix the allowance / fare type and Metro / Non-Metro amounts for each work type.</p>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="card" style={{ padding: "28px", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* Label */}
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
            Work Type Wise - Allowance Fix
          </span>
          {/* Box 1: Search box */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Search designation-level..."
            style={{
              width: "200px",
              height: "30px",
              padding: "0 12px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--panel)",
              color: "var(--ink)",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          {/* Box 2: Designation-Level dropdown */}
          <div className="command-select" style={{ position: "relative", width: "fit-content" }} ref={dropdownRef}>
            <button
              className="command-select-button"
              style={{
                width: "260px",
                height: "30px",
                minHeight: "30px",
                paddingLeft: "16px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              <span>{selectedLevel || "Select Designation-Level"}</span>
              <ChevronDown size={15} style={{ color: "var(--muted)" }} />
            </button>
            {dropdownOpen && (
              <div className="command-select-menu" style={{ width: "260px", top: "calc(100% + 6px)", left: 0, right: "auto" }}>
                {filteredLevels.map((opt) => (
                  <button
                    key={opt}
                    className={selectedLevel === opt ? "command-select-option command-select-option-active" : "command-select-option"}
                    onClick={() => {
                      setSelectedLevel(opt);
                      setInputText(opt);
                      setDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <span>{opt}</span>
                    {selectedLevel === opt && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Go button */}
          <button
            type="button"
            onClick={handleGo}
            disabled={!selectedLevel}
            style={{
              height: "30px",
              padding: "0 22px",
              borderRadius: "6px",
              border: "1px solid var(--brand)",
              background: selectedLevel ? "var(--brand)" : "var(--panel)",
              color: selectedLevel ? "#fff" : "var(--muted)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: selectedLevel ? "pointer" : "not-allowed"
            }}
          >
            Go
          </button>
        </div>
      </div>

      {/* Allowance grid — only after Go is clicked, matches the sanpharma.info
          "Work Type Wise Allowance - Fare Fixation" table exactly: S.No, Work
          Type, Allowance and Fare Type, then Metro / Non Metro each split by
          Confirmed / Trainee / Probation, each split by HQ / EX / OS. */}
      {activeLevel && (
        <div className="card" style={{ marginTop: "20px", padding: "24px", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)" }}>
              Work Type Wise Allowance - Fare Fixation — {activeLevel}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loadingGrid}
              style={{
                height: "32px",
                padding: "0 24px",
                borderRadius: "6px",
                border: "1px solid var(--brand)",
                background: "var(--brand)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          {savedMessage && (
            <div
              style={{
                marginBottom: "14px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                fontSize: "13px",
                fontWeight: 600
              }}
            >
              Saved successfully.
            </div>
          )}
          {saveError && <p style={{ marginBottom: "14px", fontSize: "13px", color: "#b91c1c" }}>{saveError}</p>}
          {loadingGrid && <p style={{ marginBottom: "14px", fontSize: "13px", color: "var(--muted)" }}>Loading saved grid...</p>}

          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", fontSize: "13px", minWidth: "1400px" }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle }} rowSpan={3}>S.No</th>
                  <th style={{ ...thStyle }} rowSpan={3}>Work Type</th>
                  <th style={{ ...thStyle }} rowSpan={3}>Allowance and Fare Type</th>
                  {ZONES.map((zone) => (
                    <th key={zone} style={{ ...thStyle, background: "var(--panel)" }} colSpan={EMP_STATUSES.length * PAY_TYPES.length}>
                      {zone}
                    </th>
                  ))}
                </tr>
                <tr>
                  {ZONES.map((zone) =>
                    EMP_STATUSES.map((emp) => (
                      <th key={`${zone}-${emp}`} style={thStyle} colSpan={PAY_TYPES.length}>
                        {emp}
                      </th>
                    ))
                  )}
                </tr>
                <tr>
                  {ZONES.map((zone) =>
                    EMP_STATUSES.map((emp) =>
                      PAY_TYPES.map((pay) => (
                        <th key={`${zone}-${emp}-${pay}`} style={thStyle}>
                          {pay}
                        </th>
                      ))
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {WORK_TYPES.map((wt, idx) => (
                  <tr key={wt}>
                    <td style={{ padding: "6px 8px", color: "var(--ink)", border: "1px solid var(--border)", textAlign: "center" }}>{idx + 1}</td>
                    <td style={{ padding: "6px 8px", color: "var(--ink)", fontWeight: 600, whiteSpace: "nowrap", border: "1px solid var(--border)" }}>{wt}</td>
                    <td style={{ padding: "4px 6px", border: "1px solid var(--border)" }}>
                      <select
                        value={grid[wt]?.allowanceFareType ?? "NA"}
                        onChange={(e) => updateAllowanceFareType(wt, e.target.value)}
                        style={{
                          width: "230px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "var(--panel)",
                          color: "var(--ink)",
                          fontSize: "12px",
                          padding: "0 6px"
                        }}
                      >
                        {ALLOWANCE_FARE_TYPES.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    {ZONES.map((zone) =>
                      EMP_STATUSES.map((emp) =>
                        PAY_TYPES.map((pay) => (
                          <td key={`${zone}-${emp}-${pay}`} style={{ padding: "4px", border: "1px solid var(--border)" }}>
                            <input
                              type="number"
                              value={grid[wt]?.cells[cellKey(zone, emp, pay)] ?? ""}
                              onChange={(e) => updateCell(wt, zone, emp, pay, e.target.value)}
                              placeholder="0"
                              style={cellInputStyle}
                            />
                          </td>
                        ))
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
