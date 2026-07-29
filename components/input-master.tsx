"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

export function InputMaster() {
  const headers = [
    "Superpremium",
    "Premium",
    "Campaigns",
    "Exclusive",
    "Reminders",
    "Input",
    "Table Top Input",
    "Reference Article",
    "OPD Cards",
    "LBL"
  ];
  const [activeHeader, setActiveHeader] = useState("Superpremium");
  const [inputs, setInputs] = useState<Array<{ id: number; brandName: string; quantity: number; duration: string }>>([]);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Input Master Configuration</h2>
          <p>Configure input materials, promotional visual aids, and sample allocations.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="button" type="button">
            <Plus size={16} /> Add Input
          </button>
        </div>
      </div>

      {/* Headers / Tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "8px 0", marginBottom: "20px", borderBottom: "1px solid var(--border)", WebkitOverflowScrolling: "touch" }}>
        {headers.map((h) => (
          <button
            key={h}
            className={`button ${activeHeader === h ? "" : "button-secondary"}`}
            onClick={() => setActiveHeader(h)}
            style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
            type="button"
          >
            {h}
          </button>
        ))}
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Input → Brand Name</th>
              <th>Input → Quantity</th>
              <th>Input → Duration</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((row, i) => (
              <tr key={row.id}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{i + 1}</td>
                <td>
                  <strong style={{ color: "var(--ink)" }}>{row.brandName} ({activeHeader})</strong>
                </td>
                <td>
                  <span style={{ background: "#e0f2fe", borderRadius: "999px", padding: "3px 12px", fontSize: "12px", fontWeight: 700, color: "#0369a1" }}>
                    {row.quantity} Units
                  </span>
                </td>
                <td style={{ color: "var(--muted)" }}>{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
