"use client";

import { useEffect, useState } from "react";
import { excelExpenses, excelSfc } from "@/lib/excel-mock-data";
import { Plus, SlidersHorizontal } from "lucide-react";

export function ExpenseMaster({ defaultTab = "sfc" }: { defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sfcData, setSfcData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);

  useEffect(() => {
    setSfcData(excelSfc);
    setExpenseData(excelExpenses);
  }, []);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Expense Configurations</h2>
          <p>Configure SFC routes, allowance categories, and parameters.</p>
        </div>
      </div>

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
            <button className="button button-compact"><Plus size={14} /> Add Route</button>
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
                {sfcData.slice(0, 15).map((row, i) => (
                  <tr key={i}>
                    <td>{row.hq}</td>
                    <td>{row.patchName}</td>
                    <td>{row.hq} STATION</td>
                    <td><strong>{row.oneWayKms || "45"} KM</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "allowance" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Allowance Matrix</h3>
            <button className="button button-compact"><Plus size={14} /> Add Allowance</button>
          </div>
          <div className="subdivision-table-card">
            <table className="subdivision-table">
              <thead>
                <tr>
                  <th>Station</th>
                  <th>Metro Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenseData.filter(e => e.station).slice(0, 15).map((row, i) => (
                  <tr key={i}>
                    <td>{row.station}</td>
                    <td>{row.metroType || "METRO"}</td>
                    <td><strong style={{ color: "var(--brand-strong)" }}>₹{row.amount || "180"}</strong></td>
                  </tr>
                ))}
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
                <tr><td><strong>PRESENT</strong></td><td>Full Allowance</td><td>Full Allowance</td><td>Full Allowance</td></tr>
                <tr><td><strong>CASUAL LEAVE</strong></td><td>No Allowance</td><td>No Allowance</td><td>No Allowance</td></tr>
                <tr><td><strong>SICK LEAVE</strong></td><td>No Allowance</td><td>No Allowance</td><td>No Allowance</td></tr>
                <tr><td><strong>ABSENT</strong></td><td>No Allowance</td><td>No Allowance</td><td>No Allowance</td></tr>
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
                {expenseData.slice(0, 15).map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.role}</strong></td>
                    <td>{row.expenseType || "DA"}</td>
                    <td>{row.frequency === "Daily" ? "Daily" : "Weekly"}</td>
                    <td>{row.station}</td>
                    <td>{row.metroType}</td>
                    <td>₹{row.amount}</td>
                    <td>{row.frequency}</td>
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
