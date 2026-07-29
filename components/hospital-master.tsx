"use client";

import { useEffect, useState } from "react";
import { apiClient, type PaginationInfo } from "@/lib/api-client";
import { PaginationControls } from "./pagination-controls";

const PAGE_SIZE = 100;

export function HospitalMaster() {
  const [clinicNames, setClinicNames] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });

  function load(page = 1) {
    apiClient.clinicNames({ page, limit: PAGE_SIZE })
      .then((res) => { setClinicNames(res.data); setPagination(res.pagination); })
      .catch(() => setClinicNames([]));
  }

  useEffect(() => {
    load(1);
  }, []);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Field Force Entries</p>
          <h2>Hospital</h2>
          <p>Distinct clinic/hospital names from the imported doctor records.</p>
        </div>
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Clinic Name</th>
            </tr>
          </thead>
          <tbody>
            {clinicNames.map((name, i) => (
              <tr key={name}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{(pagination.page - 1) * pagination.limit + i + 1}</td>
                <td><strong>{name}</strong></td>
              </tr>
            ))}
            {clinicNames.length === 0 && (
              <tr><td colSpan={2} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>No clinics found</td></tr>
            )}
          </tbody>
        </table>
        <PaginationControls pagination={pagination} onPrev={() => load(pagination.page - 1)} onNext={() => load(pagination.page + 1)} />
      </div>
    </section>
  );
}
