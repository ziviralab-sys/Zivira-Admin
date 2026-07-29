"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

export function ChemistMaster() {
  const [items, setItems] = useState<
    Array<{
      sNo: number;
      employeeName: string;
      employeeCode: string;
      patchName: string;
      dealerName: string;
      contactPerson: string;
      phone: string;
      email: string;
      country: string;
      state: string;
      city: string;
      location: string;
      pincode: string;
      address: string;
    }>
  >([]);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Field Force Entries</p>
          <h2>Chemist (Dealer) Details</h2>
          <p>Manage dealers and chemist registers mapped under field agents.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="button" type="button">
            <Plus size={16} /> Add Chemist
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Delear Name</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.sNo}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{row.sNo}</td>
                <td><strong>{row.dealerName}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
