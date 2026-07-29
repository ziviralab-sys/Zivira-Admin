"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export function HospitalMaster() {
  const [clinicNames, setClinicNames] = useState<string[]>([]);

  useEffect(() => {
    apiClient.doctors()
      .then((res) => {
        const seen = new Set<string>();
        for (const doctor of res.data) {
          const name = doctor.clinicName?.trim();
          if (name) seen.add(name);
        }
        setClinicNames([...seen]);
      })
      .catch(() => setClinicNames([]));
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
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{i + 1}</td>
                <td><strong>{name}</strong></td>
              </tr>
            ))}
            {clinicNames.length === 0 && (
              <tr><td colSpan={2} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>No clinics found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
