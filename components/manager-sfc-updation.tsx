"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, Check } from "lucide-react";
import { apiClient, type Employee, type Sfc } from "@/lib/api-client";

// Role -> badge color, per the legacy sanpharma.info Fieldforce dropdown:
// "for the BE person it should be in rose color, ABM in yellow, RBM in
// orange, BH should be in blue. no changes in the colors." This codebase's
// employee role enum has no literal "BE" value — the field-rep roles
// (MR / SR_MR) are the equivalent of the legacy "BE" (Business Executive)
// designation, so they get the rose color the legacy portal used for BE.
const ROLE_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  BH: { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
  RBM: { bg: "#ffedd5", text: "#9a3412", border: "#fed7aa" },
  ABM: { bg: "#fef9c3", text: "#854d0e", border: "#fde68a" },
  MR: { bg: "#ffe4e6", text: "#9f1239", border: "#fecdd3" },
  SR_MR: { bg: "#ffe4e6", text: "#9f1239", border: "#fecdd3" }
};
const DEFAULT_ROLE_COLOR = { bg: "var(--panel)", text: "var(--muted)", border: "var(--border)" };

function roleColor(role?: string | null) {
  return ROLE_COLOR[String(role ?? "").toUpperCase()] ?? DEFAULT_ROLE_COLOR;
}

export function ManagerSfcUpdation() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sfcRows, setSfcRows] = useState<Sfc[]>([]);
  const [patchOptions, setPatchOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [inputText, setInputText] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // The employee whose route table is actually shown — only updates when
  // "Go" is pressed, so picking a different name in the dropdown doesn't
  // change the table until the user explicitly confirms.
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);

  const [newToTerritory, setNewToTerritory] = useState("");
  const [newDistance, setNewDistance] = useState("");
  const [savingAdd, setSavingAdd] = useState(false);
  const [rowBusyId, setRowBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  function loadAll() {
    setLoading(true);
    setLoadError("");
    Promise.all([
      apiClient.employees(),
      apiClient.sfc(),
      apiClient.masterRecords("patchNameMaster")
    ])
      .then(([empRes, sfcRes, patchRes]) => {
        setEmployees(empRes.data.filter((e) => e.status !== "INACTIVE"));
        setSfcRows(sfcRes.data);
        const names = patchRes
          .filter((r) => String((r as any).status ?? "ACTIVE") !== "INACTIVE")
          .map((r) => String((r as any).patchName ?? "").trim())
          .filter(Boolean);
        setPatchOptions([...new Set(names)].sort());
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load fieldforce data"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAll();
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

  // Only ever the fieldforce we already have — no fabricated names.
  const filteredEmployees = useMemo(() => {
    const q = inputText.trim().toLowerCase();
    const base = q
      ? employees.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.employeeCode.toLowerCase().includes(q) ||
            String(e.territory ?? "").toLowerCase().includes(q)
        )
      : employees;
    return base.slice(0, 200);
  }, [employees, inputText]);

  const rowsForActive = useMemo(() => {
    if (!activeEmployee) return [];
    return sfcRows.filter(
      (r) => r.employeeCode === activeEmployee.employeeCode && r.status !== "INACTIVE"
    );
  }, [sfcRows, activeEmployee]);

  function handleGo() {
    setActionError("");
    setActiveEmployee(selectedEmployee);
  }

  async function handleAddRoute() {
    if (!activeEmployee) return;
    if (!newToTerritory) {
      setActionError("Choose a To Territory before adding.");
      return;
    }
    setActionError("");
    setSavingAdd(true);
    try {
      await apiClient.createMasterRecord("sfc", {
        employeeName: activeEmployee.name,
        hq: activeEmployee.territory ?? "",
        patchName: newToTerritory,
        oneWayKms: newDistance.trim() ? Number(newDistance) : undefined,
        typeRaw: "Tour",
        status: "ACTIVE"
      });
      const sfcRes = await apiClient.sfc();
      setSfcRows(sfcRes.data);
      setNewToTerritory("");
      setNewDistance("");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to add route");
    } finally {
      setSavingAdd(false);
    }
  }

  async function handleDeleteRoute(row: Sfc) {
    setActionError("");
    setRowBusyId(row.id);
    try {
      await apiClient.deactivateMasterRecord("sfc", row.id);
      const sfcRes = await apiClient.sfc();
      setSfcRows(sfcRes.data);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to remove route");
    } finally {
      setRowBusyId(null);
    }
  }

  const inputBoxStyle: CSSProperties = {
    width: "220px",
    height: "30px",
    padding: "0 12px",
    borderRadius: "6px",
    border: "1px solid var(--line)",
    background: "var(--panel)",
    color: "var(--ink)",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box"
  };

  return (
    <section className="subdivision-console">
      {/* Page Header */}
      <div className="subdivision-head" style={{ marginBottom: "24px" }}>
        <div>
          <p className="subdivision-eyebrow">Manager Expense</p>
          <h2>SFC Updation</h2>
          <p>Pick a fieldforce person, click Go, and manage their route coverage (From Territory / To Territory / Distance).</p>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="card" style={{ padding: "28px", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* Label */}
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
            Fieldforce
          </span>

          {/* Box 1: Fieldforce name search box */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Search fieldforce name..."
            style={inputBoxStyle}
          />

          {/* Box 2: Color-coded fieldforce dropdown */}
          <div className="command-select" style={{ position: "relative", width: "fit-content" }} ref={dropdownRef}>
            <button
              className="command-select-button"
              style={{
                width: "280px",
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
              <span
                style={
                  selectedEmployee
                    ? {
                        color: roleColor(selectedEmployee.role).text,
                        fontWeight: 600
                      }
                    : { color: "var(--muted)" }
                }
              >
                {selectedEmployee
                  ? `${selectedEmployee.name} — ${selectedEmployee.role} — ${selectedEmployee.territory ?? ""}`
                  : "Select fieldforce"}
              </span>
              <ChevronDown size={15} style={{ color: "var(--muted)" }} />
            </button>
            {dropdownOpen && (
              <div className="command-select-menu" style={{ width: "320px", top: "calc(100% + 6px)", left: 0, right: "auto", maxHeight: "320px", overflowY: "auto" }}>
                {filteredEmployees.length === 0 && (
                  <div style={{ padding: "10px 14px", fontSize: "13px", color: "var(--muted)" }}>No fieldforce found.</div>
                )}
                {filteredEmployees.map((emp) => {
                  const c = roleColor(emp.role);
                  const active = selectedEmployee?.employeeCode === emp.employeeCode;
                  return (
                    <button
                      key={emp.employeeCode}
                      className={active ? "command-select-option command-select-option-active" : "command-select-option"}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setInputText(emp.name);
                        setDropdownOpen(false);
                      }}
                      type="button"
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: c.bg,
                          color: c.text,
                          border: `1px solid ${c.border}`,
                          fontSize: "12px",
                          fontWeight: 600
                        }}
                      >
                        {emp.name} · {emp.role}
                      </span>
                      {active && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Go button */}
          <button
            type="button"
            onClick={handleGo}
            disabled={!selectedEmployee}
            style={{
              height: "30px",
              padding: "0 22px",
              borderRadius: "6px",
              border: "1px solid var(--brand)",
              background: selectedEmployee ? "var(--brand)" : "var(--panel)",
              color: selectedEmployee ? "#fff" : "var(--muted)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: selectedEmployee ? "pointer" : "not-allowed"
            }}
          >
            Go
          </button>
        </div>

        {loading && <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--muted)" }}>Loading fieldforce data...</p>}
        {loadError && <p style={{ marginTop: "16px", fontSize: "13px", color: "#b91c1c" }}>{loadError}</p>}
      </div>

      {/* Results table — only after Go is clicked */}
      {activeEmployee && (
        <div className="card" style={{ marginTop: "20px", padding: "24px", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 10px",
                borderRadius: "999px",
                background: roleColor(activeEmployee.role).bg,
                color: roleColor(activeEmployee.role).text,
                border: `1px solid ${roleColor(activeEmployee.role).border}`,
                fontSize: "12px",
                fontWeight: 700
              }}
            >
              {activeEmployee.role}
            </span>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)" }}>
              {activeEmployee.name} ({activeEmployee.employeeCode})
            </span>
          </div>

          {actionError && <p style={{ marginBottom: "12px", fontSize: "13px", color: "#b91c1c" }}>{actionError}</p>}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>From Territory</th>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>To Territory</th>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Distance (KMs)</th>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Add/Del</th>
                </tr>
              </thead>
              <tbody>
                {rowsForActive.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "8px 10px", color: "var(--ink)" }}>{row.hq ?? "—"}</td>
                    <td style={{ padding: "8px 10px", color: "var(--ink)" }}>{row.patchName ?? "—"}</td>
                    <td style={{ padding: "8px 10px", color: "var(--ink)" }}>{row.oneWayKms ?? "—"}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteRoute(row)}
                        disabled={rowBusyId === row.id}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "6px",
                          border: "1px solid #fecaca",
                          background: "#fef2f2",
                          color: "#b91c1c",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: rowBusyId === row.id ? "not-allowed" : "pointer"
                        }}
                      >
                        {rowBusyId === row.id ? "Removing..." : "Del"}
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Add-new-route row */}
                <tr>
                  <td style={{ padding: "8px 10px", color: "var(--muted)" }}>{activeEmployee.territory ?? "—"}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <select
                      value={newToTerritory}
                      onChange={(e) => setNewToTerritory(e.target.value)}
                      style={{
                        width: "100%",
                        height: "30px",
                        borderRadius: "6px",
                        border: "1px solid var(--line)",
                        background: "var(--panel)",
                        color: "var(--ink)",
                        fontSize: "13px",
                        padding: "0 8px"
                      }}
                    >
                      <option value="">Select To Territory</option>
                      {patchOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <input
                      type="number"
                      value={newDistance}
                      onChange={(e) => setNewDistance(e.target.value)}
                      placeholder="e.g. 25"
                      style={{
                        width: "110px",
                        height: "30px",
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
                  <td style={{ padding: "8px 10px" }}>
                    <button
                      type="button"
                      onClick={handleAddRoute}
                      disabled={savingAdd || !newToTerritory}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--brand)",
                        background: "var(--brand)",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: savingAdd || !newToTerritory ? "not-allowed" : "pointer",
                        opacity: savingAdd || !newToTerritory ? 0.6 : 1
                      }}
                    >
                      {savingAdd ? "Adding..." : "Add"}
                    </button>
                  </td>
                </tr>

                {rowsForActive.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: "14px 10px", color: "var(--muted)", fontSize: "13px" }}>
                      No routes recorded yet for this fieldforce person — use the row above to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
