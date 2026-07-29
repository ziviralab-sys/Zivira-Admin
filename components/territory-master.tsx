"use client";

import type { Doctor } from "@zivira/types";
import { useEffect, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { apiClient, type PaginationInfo } from "@/lib/api-client";
import { PaginationControls } from "./pagination-controls";

const PAGE_SIZE = 100;

export function TerritoryMaster() {
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
            {items.map((row, i) => (
              <tr key={row.id}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{i + 1}</td>
                <td><strong>{row.mappedEmployeeName || "—"}</strong></td>
                <td>{row.mappedEmployeeCode || "—"}</td>
                <td>
                  <span style={{ background: "#f3f4f6", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", fontWeight: 600 }}>
                    {row.territory}
                  </span>
                </td>
                <td>{row.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls pagination={pagination} onPrev={() => load(pagination.page - 1)} onNext={() => load(pagination.page + 1)} />
      </div>
    </section>
  );
}
