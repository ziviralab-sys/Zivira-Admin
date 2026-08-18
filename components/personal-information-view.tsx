"use client";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
type PersonalViewRow = {
  id: string;
  code: string;
  name: string;
  contactNo: string;
  email: string;
  panNo: string;
  aadharNo: string;
  status: "Active" | "Inactive";
};
const initialPersonalViews: PersonalViewRow[] = [];
export function PersonalInformationView() {
  const [list] = useState<PersonalViewRow[]>(initialPersonalViews);
  const [search, setSearch] = useState("");
  const filtered = list.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Personal — View</h2>
          <p>View consolidated personal verification details for employees.</p>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by name or code..."
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
      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Employee Name</th>
              <th>Contact No</th>
              <th>Personal Email</th>
              <th>PAN No</th>
              <th>Aadhar No</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: 600 }}>{row.code}</td>
                <td><strong>{row.name}</strong></td>
                <td>{row.contactNo}</td>
                <td>{row.email}</td>
                <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{row.panNo}</td>
                <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{row.aadharNo}</td>
                <td>
                  <span style={{ 
                    padding: "2px 8px", 
                    borderRadius: "999px", 
                    fontSize: "11px", 
                    fontWeight: 600, 
                    background: row.status === "Active" ? "#10b98115" : "#ef444415", 
                    color: row.status === "Active" ? "#10b981" : "#ef4444",
                    border: row.status === "Active" ? "1px solid #10b98125" : "1px solid #ef444425"
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
