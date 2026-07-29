"use client";

import type { Doctor } from "@zivira/types";
import { useEffect, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { apiClient, type PaginationInfo } from "@/lib/api-client";
import { PaginationControls } from "./pagination-controls";

const PAGE_SIZE = 100;

export function TerritoryListedDoctor() {
  const [items, setItems] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });

  function load(page = 1) {
    apiClient.doctors({ page, limit: PAGE_SIZE })
      .then((res) => { setItems(res.data); setPagination(res.pagination); })
      .catch(() => setItems([]));
  }

  useEffect(() => {
    load(1);
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
        <PaginationControls pagination={pagination} onPrev={() => load(pagination.page - 1)} onNext={() => load(pagination.page + 1)} />
      </div>
    </section>
  );
}
