"use client";

import { useEffect, useState } from "react";
import { excelHolidays } from "@/lib/excel-mock-data";
import { Plus, SlidersHorizontal } from "lucide-react";

export function HolidayMaster() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setHolidays(excelHolidays);
  }, []);

  const filtered = holidays.filter(
    (h) =>
      h.stateName.toLowerCase().includes(search.toLowerCase()) ||
      h.otherHolidayDescription.toLowerCase().includes(search.toLowerCase())
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

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by state or holiday description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              <th>StateName</th>
              <th>Weekend holiday</th>
              <th>Other holiday date</th>
              <th>Other holiday Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map((row, i) => (
              <tr key={i}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{i + 1}</td>
                <td><strong>{row.stateName}</strong></td>
                <td>{row.weekendHoliday || "SUNDAY"}</td>
                <td>{row.otherHolidayDate || "01-Jan-2026"}</td>
                <td>{row.otherHolidayDescription || "New Year's Day"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
