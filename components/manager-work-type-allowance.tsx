"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import { apiClient, type Expense } from "@/lib/api-client";

// Same Designation-Level list used everywhere else in the app (Add Employee,
// Employee Manager) — the legacy sanpharma.info "Designation-Level" selector
// maps 1:1 onto this enum, so no new levels are invented here.
const LEVELS = ["NBH", "BH", "RBM", "ZBM", "ABM", "SR_MR", "MR", "OTHER"] as const;

function configKeyForLevel(level: string) {
  return `WORK_TYPE_ALLOWANCE_${level}`;
}

type Grid = Record<string, Record<string, string>>; // grid[workType][allowanceType] = amount (string, editable)

export function ManagerWorkTypeAllowance() {
  const [inputText, setInputText] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [levelOptions, setLevelOptions] = useState<string[]>([...LEVELS]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // The level whose grid is actually shown/edited — only changes on Go.
  const [activeLevel, setActiveLevel] = useState("");
  const [grid, setGrid] = useState<Grid>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    apiClient
      .expenses()
      .then((res) => {
        setExpenses(res.data);
        const roles = [...new Set(res.data.map((e) => e.role).filter((v): v is string => !!v))];
        setLevelOptions([...new Set([...LEVELS, ...roles])]);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load work-type data"))
      .finally(() => setLoading(false));
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

  const filteredLevels = useMemo(() => {
    const q = inputText.trim().toLowerCase();
    return q ? levelOptions.filter((l) => l.toLowerCase().includes(q)) : levelOptions;
  }, [levelOptions, inputText]);

  // Work types (rows) and allowance types (columns) — both drawn only from
  // the real, already-imported Expense sheet data, never fabricated.
  const workTypes = useMemo(
    () => [...new Set(expenses.map((e) => e.dailyWork).filter((v): v is string => !!v))].sort(),
    [expenses]
  );
  const allowanceTypes = useMemo(
    () => [...new Set(expenses.map((e) => e.listOfExpenseTypes).filter((v): v is string => !!v))].sort(),
    [expenses]
  );

  function defaultGridForLevel(level: string): Grid {
    const g: Grid = {};
    for (const wt of workTypes) {
      g[wt] = {};
      for (const at of allowanceTypes) {
        const match = expenses.find((e) => e.role === level && e.dailyWork === wt && e.listOfExpenseTypes === at);
        g[wt][at] = match?.amountNC != null ? String(match.amountNC) : "";
      }
    }
    return g;
  }

  async function handleGo() {
    if (!selectedLevel) return;
    setSaveError("");
    setSavedMessage(false);
    setActiveLevel(selectedLevel);
    const base = defaultGridForLevel(selectedLevel);
    try {
      const config = await apiClient.companyConfig();
      const raw = config[configKeyForLevel(selectedLevel)];
      if (typeof raw === "string" && raw.trim()) {
        const stored = JSON.parse(raw) as Grid;
        for (const wt of Object.keys(stored)) {
          base[wt] = { ...base[wt], ...stored[wt] };
        }
      }
    } catch {
      // No saved grid yet for this level, or it couldn't be parsed — fall
      // back to the Expense-sheet-derived defaults already in `base`.
    }
    setGrid(base);
  }

  function updateCell(workType: string, allowanceType: string, value: string) {
    setGrid((prev) => ({
      ...prev,
      [workType]: { ...prev[workType], [allowanceType]: value }
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

  return (
    <section className="subdivision-console">
      {/* Page Header */}
      <div className="subdivision-head" style={{ marginBottom: "24px" }}>
        <div>
          <p className="subdivision-eyebrow">Manager Expense</p>
          <h2>Work Type Wise - Allowance Fix</h2>
          <p>Pick a Designation-Level, click Go, and fix the allowance amount for each work type / allowance type combination.</p>
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

        {loading && <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--muted)" }}>Loading work-type / allowance data...</p>}
        {loadError && <p style={{ marginTop: "16px", fontSize: "13px", color: "#b91c1c" }}>{loadError}</p>}
      </div>

      {/* Allowance grid — only after Go is clicked */}
      {activeLevel && (
        <div className="card" style={{ marginTop: "20px", padding: "24px", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)" }}>
              Allowance grid — {activeLevel}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
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

          {workTypes.length === 0 || allowanceTypes.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--muted)" }}>
              No work types / allowance types found in the imported Expense data yet — add Expense records first.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>Work Type</th>
                    {allowanceTypes.map((at) => (
                      <th key={at} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>{at}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workTypes.map((wt) => (
                    <tr key={wt} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "8px 10px", color: "var(--ink)", fontWeight: 600, whiteSpace: "nowrap" }}>{wt}</td>
                      {allowanceTypes.map((at) => (
                        <td key={at} style={{ padding: "6px 8px" }}>
                          <input
                            type="number"
                            value={grid[wt]?.[at] ?? ""}
                            onChange={(e) => updateCell(wt, at, e.target.value)}
                            placeholder="0"
                            style={{
                              width: "100px",
                              height: "28px",
                              borderRadius: "6px",
                              border: "1px solid var(--line)",
                              background: "var(--panel)",
                              color: "var(--ink)",
                              fontSize: "13px",
                              padding: "0 8px",
                              boxSizing: "border-box"
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
