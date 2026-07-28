"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

export function ChemistMaster() {
  const [items, setItems] = useState([
    {
      sNo: 13918,
      employeeName: "THANDLAM JASWANTH REDDY",
      employeeCode: "E0340",
      patchName: "MADANAPALLY",
      dealerName: "AGARWAL PHARMACY",
      contactPerson: "Agarwal Ji",
      phone: "9876543210",
      email: "agarwal@pharmacy.com",
      country: "India",
      state: "ANDHRA PRADESH",
      city: "MADANAPALLY",
      location: "Main Road",
      pincode: "517325",
      address: "MADANAPALLY"
    },
    {
      sNo: 13919,
      employeeName: "THANDLAM JASWANTH REDDY",
      employeeCode: "E0340",
      patchName: "NELLORE",
      dealerName: "NELLORE MEDICO",
      contactPerson: "Satish Kumar",
      phone: "9876543211",
      email: "satish@nelloremedico.com",
      country: "India",
      state: "ANDHRA PRADESH",
      city: "NELLORE",
      location: "Gandhi Nagar",
      pincode: "524001",
      address: "NELLORE"
    }
  ]);

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
