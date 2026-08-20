"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { apiClient } from "@/lib/api-client";
export function ManagerWorkTypeAllowance() {
  const [inputText, setInputText] = useState("");
  const [selectedDropdownVal, setSelectedDropdownVal] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dummyOptions, setDummyOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // "Work type" here is the Expense sheet's Daily/Monthly work-basis column.
    apiClient.expenses()
      .then(res => setDummyOptions([...new Set(res.data.map(e => e.dailyWork).filter((v): v is string => !!v))].sort()))
      .catch(() => setDummyOptions([]));
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
  return (
    <section className="subdivision-console">
      {/* Page Header */}
      <div className="subdivision-head" style={{ marginBottom: "24px" }}>
        <div>
          <p className="subdivision-eyebrow">Manager Expense</p>
          <h2>Work Type Wise - Allowance Fix</h2>
          <p>Configure work type wise allowance fixation parameters for managers.</p>
        </div>
      </div>
      {/* Main Settings Panel */}
      <div className="card" style={{ padding: "28px", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* Label */}
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
            Work Type Wise - Allowance Fix
          </span>
          {/* Box 1: Empty text box */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder=""
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
          {/* Box 2: Dropdown box */}
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
              <span>{selectedDropdownVal || ""}</span>
              <ChevronDown size={15} style={{ color: "var(--muted)" }} />
            </button>
            {dropdownOpen && (
              <div className="command-select-menu" style={{ width: "260px", top: "calc(100% + 6px)", left: 0, right: "auto" }}>
                {dummyOptions.map((opt) => (
                  <button
                    key={opt}
                    className={selectedDropdownVal === opt ? "command-select-option command-select-option-active" : "command-select-option"}
                    onClick={() => {
                      setSelectedDropdownVal(opt);
                      setDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <span>{opt}</span>
                    {selectedDropdownVal === opt && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
