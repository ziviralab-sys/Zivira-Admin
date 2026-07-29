"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

export function TerritoryMaster() {
  const [items, setItems] = useState<
    Array<{
      sNo: number;
      employeeName: string;
      employeeCode: string;
      patchName: string;
      customerName: string;
    }>
  >([]);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Field Force Entries</p>
          <h2>Territory (Patch Name) Mapping</h2>
          <p>Configure mapping between field agents, employee codes, patches, and customers.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="button" type="button">
            <Plus size={16} /> Add Patch
          </button>
        </div>
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Employee Name</th>
              <th>Employee Code</th>
              <th>Patch name</th>
              <th>Customer Name</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.sNo}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{row.sNo}</td>
                <td><strong>{row.employeeName}</strong></td>
                <td>{row.employeeCode}</td>
                <td>
                  <span style={{ background: "#f3f4f6", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", fontWeight: 600 }}>
                    {row.patchName}
                  </span>
                </td>
                <td>{row.customerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
