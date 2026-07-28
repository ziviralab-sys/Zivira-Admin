"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

export function TerritoryListedDoctor() {
  const [items, setItems] = useState([
    { sNo: 1, customerName: "A JAYA CHANDRA REDDY", qualification: "MBBS, MD" },
    { sNo: 2, customerName: "ABRITHI DHAS", qualification: "MBBS" },
    { sNo: 3, customerName: "ALEKYA GANDU", qualification: "DLO, MS" }
  ]);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Field Force Entries</p>
          <h2>Territory - Listed Doctor</h2>
          <p>Verify doctor lists mapped under respective employee territories.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="button" type="button">
            <Plus size={16} /> Add Listed Doctor
          </button>
        </div>
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Customer Name</th>
              <th>Qualification</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.sNo}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{row.sNo}</td>
                <td><strong>{row.customerName}</strong></td>
                <td>{row.qualification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
