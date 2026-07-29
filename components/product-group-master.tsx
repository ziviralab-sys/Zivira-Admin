"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

export function ProductGroupMaster() {
  const [molecules, setMolecules] = useState<Array<{ moleculeName: string; therapyName: string }>>([]);
  const [search, setSearch] = useState("");

  const filtered = molecules.filter(
    (m) =>
      m.moleculeName.toLowerCase().includes(search.toLowerCase()) ||
      m.therapyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Product Group (Molecule)</h2>
          <p>Manage and map molecules to corresponding therapy classifications.</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" type="button">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="button" type="button">
            <Plus size={16} /> Add Group
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by molecule name or therapy..."
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
          <span>Total Molecules</span>
          <strong>{molecules.length}</strong>
        </article>
        <article>
          <span>Filtered Matches</span>
          <strong>{filtered.length}</strong>
        </article>
      </div>

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Molecule Name</th>
              <th>Therapy Name</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td style={{ color: "var(--muted)", fontWeight: 500 }}>{i + 1}</td>
                <td>
                  <strong style={{ color: "var(--ink)" }}>{row.moleculeName}</strong>
                </td>
                <td style={{ color: "var(--muted)", fontSize: "13px" }}>
                  {row.therapyName}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No product groups found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
