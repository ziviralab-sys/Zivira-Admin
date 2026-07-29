"use client";

import type { Doctor } from "@zivira/types";
import { useEffect, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export function TerritoryListedDoctor() {
  const [items, setItems] = useState<Doctor[]>([]);

  useEffect(() => {
    apiClient.doctors().then((res) => setItems(res.data)).catch(() => setItems([]));
  }, []);

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
            {items.map((row, i) => (
              <tr key={row.id}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{i + 1}</td>
                <td><strong>{row.name}</strong></td>
                <td>{row.qualification || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
