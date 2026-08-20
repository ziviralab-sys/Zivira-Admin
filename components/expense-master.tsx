"use client";
import { useEffect, useState } from "react";
import { apiClient, type Expense, type Sfc } from "@/lib/api-client";
export function ExpenseMaster({ defaultTab = "sfc", embed = false }: { defaultTab?: string; embed?: boolean }) {
  // Tabs state for the embedded view (tables mode)
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sfcRows, setSfcRows] = useState<Sfc[]>([]);
  const [expenseRows, setExpenseRows] = useState<Expense[]>([]);
  useEffect(() => {
    if (!embed) return;
    apiClient.sfc().then(res => setSfcRows(res.data)).catch(() => setSfcRows([]));
    apiClient.expenses().then(res => setExpenseRows(res.data)).catch(() => setExpenseRows([]));
  }, [embed]);
  // Left Column States (for policy form mode)
  const [remarksAvailable, setRemarksAvailable] = useState("");
  const [rowWiseChanges, setRowWiseChanges] = useState("");
  const [sameAsAdmin, setSameAsAdmin] = useState("");
  const [submissionBasedOn, setSubmissionBasedOn] = useState("");
  const [lastDayOsWork, setLastDayOsWork] = useState("");
  const [singleDayOsWork, setSingleDayOsWork] = useState("");
  const [mgrExpenses, setMgrExpenses] = useState([{ designation: "", mode: "" }]);
  // Right Column States (for policy form mode)
  const [rangeFrom, setRangeFrom] = useState("1");
  const [rangeTo, setRangeTo] = useState("10");
  const [sameDayPolicy, setSameDayPolicy] = useState("");
  const [osWorkConsider, setOsWorkConsider] = useState("");
  const [additionalExpenseNeeded, setAdditionalExpenseNeeded] = useState("");
  const rangeNumbers = Array.from({ length: 31 }, (_, i) => String(i + 1));
  // Helper function to deselect/clear radio button if clicked again
  const toggleRadio = (currentVal: string, clickedVal: string, setter: (val: string) => void) => {
    if (currentVal === clickedVal) {
      setter("");
    } else {
      setter(clickedVal);
    }
  };
  // If embedded, render the original tabbed tables
  if (embed) {
    return (
      <>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "8px 0", marginBottom: "20px", borderBottom: "1px solid var(--border)", WebkitOverflowScrolling: "touch" }}>
          {[
            { id: "sfc", label: "SFC Updation" },
            { id: "allowance", label: "Allowance Fixation" },
            { id: "worktype", label: "Work Type Wise - Allowance Fix" },
            { id: "fixedvar", label: "Fixed / Variable Expense Parameter" }
          ].map((t) => (
            <button
              key={t.id}
              className={`button ${activeTab === t.id ? "" : "button-secondary"}`}
              onClick={() => setActiveTab(t.id)}
              style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === "sfc" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>SFC Routes</h3>
              <button className="button button-compact"> Add Route</button>
            </div>
            <div className="subdivision-table-card">
              <table className="subdivision-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Station</th>
                    <th>Kilometer / Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {sfcRows.map(row => (
                    <tr key={row.id}>
                      <td>{row.employeeName ?? "—"}</td>
                      <td>{row.patchName ?? "—"}</td>
                      <td>{row.hq ?? "—"}</td>
                      <td>{row.oneWayKms ?? "—"}</td>
                    </tr>
                  ))}
                  {sfcRows.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No SFC records found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "allowance" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Allowance Matrix</h3>
              <button className="button button-compact"> Add Allowance</button>
            </div>
            <div className="subdivision-table-card">
              <table className="subdivision-table">
                <thead>
                  <tr>
                    <th>Headquarter</th>
                    <th>Station</th>
                    <th>Metro Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseRows.map(row => (
                    <tr key={row.id}>
                      <td>—</td>
                      <td>{row.station ?? "—"}</td>
                      <td>{row.metroType ?? "—"}</td>
                      <td>{row.amountNC ?? "—"}</td>
                    </tr>
                  ))}
                  {expenseRows.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No expense records found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "worktype" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Work Type Allowance Details (Attendance Basis)</h3>
            </div>
            <div className="subdivision-table-card">
              <table className="subdivision-table">
                <thead>
                  <tr>
                    <th>Attendance Status</th>
                    <th>HQ Allowance Type</th>
                    <th>EX Allowance Type</th>
                    <th>OS Allowance Type</th>
                  </tr>
                </thead>
                <tbody>
                  {/* No source for attendance-status-keyed allowance types anywhere in the
                      imported data (Attendance/Expense collections don't carry this
                      breakdown) - left empty rather than fabricated. */}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "fixedvar" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Fixed / Variable Parameters</h3>
            </div>
            <div className="subdivision-table-card">
              <table className="subdivision-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>List of Expense</th>
                    <th>Daily/Work</th>
                    <th>Station Type</th>
                    <th>Metro Type</th>
                    <th>Amount (NC)</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseRows.map(row => (
                    <tr key={row.id}>
                      <td>{row.role}</td>
                      <td>{row.listOfExpenseTypes ?? "—"}</td>
                      <td>{row.dailyWork ?? "—"}</td>
                      <td>{row.station ?? "—"}</td>
                      <td>{row.metroType ?? "—"}</td>
                      <td>{row.amountNC ?? "—"}</td>
                      <td>{row.frequency ?? "—"}</td>
                    </tr>
                  ))}
                  {expenseRows.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>No expense records found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
  // If not embedded, render the Policy Configuration Form (Lines removed, click to deselect enabled)
  return (
    <section className="subdivision-console">
      {/* Header Container */}
      <div className="subdivision-head" style={{ marginBottom: "24px" }}>
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Expense Configurations</h2>
          <p>Configure SFC routes, allowance categories, and parameters.</p>
        </div>
      </div>
      {/* Main Settings Form Panel */}
      <div className="card" style={{ padding: "28px", background: "var(--panel)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* 1. Manager Approval (Only Remarks Available) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                Manager Approval (Only Remarks Available)
              </label>
              <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="remarksAvailable"
                    checked={remarksAvailable === "Yes"}
                    onClick={() => toggleRadio(remarksAvailable, "Yes", setRemarksAvailable)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Yes
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="remarksAvailable"
                    checked={remarksAvailable === "No"}
                    onClick={() => toggleRadio(remarksAvailable, "No", setRemarksAvailable)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  No
                </label>
              </div>
            </div>
            {/* 2. Manager Approval (Row Wise Changes) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                Manager Approval (Row Wise Changes)
              </label>
              <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="rowWiseChanges"
                    checked={rowWiseChanges === "Yes"}
                    onClick={() => toggleRadio(rowWiseChanges, "Yes", setRowWiseChanges)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Yes
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="rowWiseChanges"
                    checked={rowWiseChanges === "No"}
                    onClick={() => toggleRadio(rowWiseChanges, "No", setRowWiseChanges)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  No
                </label>
              </div>
            </div>
            {/* 3. Manager Approval (Same as Admin) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                Manager Approval (Same as Admin)
              </label>
              <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="sameAsAdmin"
                    checked={sameAsAdmin === "Yes"}
                    onClick={() => toggleRadio(sameAsAdmin, "Yes", setSameAsAdmin)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Yes
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="sameAsAdmin"
                    checked={sameAsAdmin === "No"}
                    onClick={() => toggleRadio(sameAsAdmin, "No", setSameAsAdmin)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  No
                </label>
              </div>
            </div>
            {/* 4. Expense Submission Based on */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                Expense Submission Based on
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="submissionBasedOn"
                    checked={submissionBasedOn === "Monthly"}
                    onClick={() => toggleRadio(submissionBasedOn, "Monthly", setSubmissionBasedOn)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Monthly
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="submissionBasedOn"
                    checked={submissionBasedOn === "Fortnight"}
                    onClick={() => toggleRadio(submissionBasedOn, "Fortnight", setSubmissionBasedOn)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Fortnight
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="submissionBasedOn"
                    checked={submissionBasedOn === "Periodically"}
                    onClick={() => toggleRadio(submissionBasedOn, "Periodically", setSubmissionBasedOn)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Periodically
                </label>
              </div>
            </div>
            {/* 5. Last Day 'OS' Work Consider as */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                Last Day 'OS' Work Consider as
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="lastDayOsWork"
                    checked={lastDayOsWork === "OS Allowance"}
                    onClick={() => toggleRadio(lastDayOsWork, "OS Allowance", setLastDayOsWork)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  OS Allowance
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="lastDayOsWork"
                    checked={lastDayOsWork === "EX Allowance"}
                    onClick={() => toggleRadio(lastDayOsWork, "EX Allowance", setLastDayOsWork)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  EX Allowance
                </label>
              </div>
            </div>
            {/* 6. Single Day 'OS' Work Consider as */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                Single Day 'OS' Work Consider as
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="singleDayOsWork"
                    checked={singleDayOsWork === "OS Allowance"}
                    onClick={() => toggleRadio(singleDayOsWork, "OS Allowance", setSingleDayOsWork)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  OS Allowance
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="singleDayOsWork"
                    checked={singleDayOsWork === "EX Allowance"}
                    onClick={() => toggleRadio(singleDayOsWork, "EX Allowance", setSingleDayOsWork)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  EX Allowance
                </label>
              </div>
            </div>
            {/* Mgr Expense Setup */}
            {/* Mgr Expense Setup */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", borderBottom: "2px solid #9d174d", width: "fit-content", paddingBottom: "2px" }}>
                Mgr Expense Setup
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "180px 140px 100px", gap: "12px", fontSize: "13px", fontWeight: 700, color: "var(--ink)", marginTop: "4px" }}>
                <div>Designation</div>
                <div>Mode</div>
                <div style={{ textAlign: "center" }}>Add/Del</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  "BH", "RBM", "ABM", "ZBM", "BRM", "NBM", "Sr ABM", "MH", "SM"
                ].map((designation) => (
                  <div key={designation} style={{ display: "grid", gridTemplateColumns: "180px 140px 100px", gap: "12px", alignItems: "center" }}>
                    <select style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--line)", background: "var(--panel)", fontSize: "13px", color: "var(--ink)", outline: "none" }}>
                      <option>{designation}</option>
                    </select>
                    <select style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--line)", background: "var(--panel)", fontSize: "13px", color: "var(--ink)", outline: "none" }}>
                      <option>Manual</option>
                      <option>Automatic</option>
                    </select>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button type="button" style={{ width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--line)", background: "var(--panel)", borderRadius: "4px", cursor: "pointer", fontSize: "14px", color: "var(--ink)" }}>+</button>
                      <button type="button" style={{ width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--line)", background: "var(--panel)", borderRadius: "4px", cursor: "pointer", fontSize: "14px", color: "var(--ink)" }}>-</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* 1. Expense Submission Range */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                Expense Submission Range
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>From</span>
                <select
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--line)",
                    background: "var(--panel)",
                    color: "var(--ink)",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  {rangeNumbers.map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>To</span>
                <select
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--line)",
                    background: "var(--panel)",
                    color: "var(--ink)",
                    fontSize: "13px",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  {rangeNumbers.map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* 2. If Fieldforce Covers HQ & EX on the Same Day */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                If Fieldforce Covers HQ & EX on the Same Day, Can We take the Allowance & Fare as Below:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px", paddingLeft: "10px" }}>
                {/* Policy I */}
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="sameDayPolicy"
                    checked={sameDayPolicy === "HQ (No Fare)"}
                    onClick={() => toggleRadio(sameDayPolicy, "HQ (No Fare)", setSameDayPolicy)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  I. HQ (No Fare)
                </label>
                {/* Policy II */}
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="sameDayPolicy"
                    checked={sameDayPolicy === "EX & Actual Fare"}
                    onClick={() => toggleRadio(sameDayPolicy, "EX & Actual Fare", setSameDayPolicy)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  II. EX & Actual Fare
                </label>
                {/* Policy III Section */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "24px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>III. Maximum Calls</span>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--muted)", cursor: "pointer", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="sameDayPolicy"
                      checked={sameDayPolicy === "HQ Allowance / No Fare"}
                      onClick={() => toggleRadio(sameDayPolicy, "HQ Allowance / No Fare", setSameDayPolicy)}
                      onChange={() => {}}
                      style={{ accentColor: "#0284c7", width: "14px", height: "14px" }}
                    />
                    HQ Allowance / No Fare
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--muted)", cursor: "pointer", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="sameDayPolicy"
                      checked={sameDayPolicy === "HQ Allowance / With Fare"}
                      onClick={() => toggleRadio(sameDayPolicy, "HQ Allowance / With Fare", setSameDayPolicy)}
                      onChange={() => {}}
                      style={{ accentColor: "#0284c7", width: "14px", height: "14px" }}
                    />
                    HQ Allowance / With Fare
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--muted)", cursor: "pointer", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="sameDayPolicy"
                      checked={sameDayPolicy === "EX Allowance / With Fare"}
                      onClick={() => toggleRadio(sameDayPolicy, "EX Allowance / With Fare", setSameDayPolicy)}
                      onChange={() => {}}
                      style={{ accentColor: "#0284c7", width: "14px", height: "14px" }}
                    />
                    EX Allowance / With Fare
                  </label>
                </div>
                {/* Policy IV */}
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="sameDayPolicy"
                    checked={sameDayPolicy === "Ex Calls will have Minimum"}
                    onClick={() => toggleRadio(sameDayPolicy, "Ex Calls will have Minimum", setSameDayPolicy)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  IV. Ex Calls will have Minimum
                </label>
              </div>
            </div>
            {/* 3. 'OS' Work Consider as */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                'OS' Work Consider as
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="osWorkConsider"
                    checked={osWorkConsider === "Package Calculation(OS Only)"}
                    onClick={() => toggleRadio(osWorkConsider, "Package Calculation(OS Only)", setOsWorkConsider)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Package Calculation(OS Only)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="osWorkConsider"
                    checked={osWorkConsider === "Row Wise Calculation(OS Only)"}
                    onClick={() => toggleRadio(osWorkConsider, "Row Wise Calculation(OS Only)", setOsWorkConsider)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Row Wise Calculation(OS Only)
                </label>
              </div>
            </div>
            {/* 4. Row wise Additional Expense 'Text box' */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#9d174d", paddingBottom: "2px" }}>
                Row wise Additional Expense 'Text box'
              </label>
              <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="additionalExpenseNeeded"
                    checked={additionalExpenseNeeded === "Needed"}
                    onClick={() => toggleRadio(additionalExpenseNeeded, "Needed", setAdditionalExpenseNeeded)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Needed
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--ink)", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="additionalExpenseNeeded"
                    checked={additionalExpenseNeeded === "Not Needed"}
                    onClick={() => toggleRadio(additionalExpenseNeeded, "Not Needed", setAdditionalExpenseNeeded)}
                    onChange={() => {}}
                    style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                  />
                  Not Needed
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
