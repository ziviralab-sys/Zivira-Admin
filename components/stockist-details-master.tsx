"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { ExpenseMaster } from "./expense-master";

export function StockistDetailsMaster({ isSuperStockist = false }: { isSuperStockist?: boolean }) {
  const [dealers, setDealers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("create_map");

  const filtered = dealers.filter(
    (d) =>
      d.dealerName.toLowerCase().includes(search.toLowerCase()) ||
      d.dealerCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="subdivision-console">
      {/* Page Header */}
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>
            {isSuperStockist
              ? activeSubTab === "expense"
                ? "Super Stockist - Expense"
                : "Super Stockist - Create & Map"
              : "Stockist Details — Add / Edit / Deactivate"}
          </h2>
          <p>
            {isSuperStockist
              ? activeSubTab === "expense"
                ? "Configure super stockist travel routes, allowance policies, and parameters."
                : "Manage super stockist distributions, mappings, GST, and DL configurations."
              : "Manage default stockist code registers and contact channels."}
          </p>
        </div>

        {/* Hide header action buttons when viewing embedded expense configurations */}
        {(!isSuperStockist || activeSubTab === "create_map") && (
          <div className="subdivision-actions">
            <button className="button button-secondary" type="button">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <button className="button" type="button">
              <Plus size={16} /> Add {isSuperStockist ? "Super Stockist" : "Stockist"}
            </button>
          </div>
        )}
      </div>

      {/* Super Stockist sub-tabs (Create & Map / Expense) */}
      {isSuperStockist && (
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "8px 0", marginBottom: "20px", borderBottom: "1px solid var(--border)", WebkitOverflowScrolling: "touch" }}>
          <button
            className={`button ${activeSubTab === "create_map" ? "" : "button-secondary"}`}
            onClick={() => setActiveSubTab("create_map")}
            style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
            type="button"
          >
            Create & Map
          </button>
          <button
            className={`button ${activeSubTab === "expense" ? "" : "button-secondary"}`}
            onClick={() => setActiveSubTab("expense")}
            style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
            type="button"
          >
            Expense
          </button>
        </div>
      )}

      {/* Embedded Expense Configurations */}
      {isSuperStockist && activeSubTab === "expense" ? (
        <ExpenseMaster embed={true} />
      ) : (
        <>
          {/* Search Box */}
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

          {/* Stats Bar */}
          <div className="subdivision-stats" style={{ marginBottom: "20px" }}>
            <article>
              <span>Total Records</span>
              <strong>{dealers.length}</strong>
            </article>
          </div>

          {/* Super Stockist / Stockist Details Table */}
          <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
            <table className="subdivision-table" style={{ width: "100%", minWidth: "1200px" }}>
              <thead>
                {isSuperStockist ? (
                  <tr>
                    <th>Stockist Code</th>
                    <th>Stockist Name</th>
                    <th>Contact Person 1</th>
                    <th>Contact Person 2</th>
                    <th>Contact Person 3</th>
                    <th>Email 1</th>
                    <th>Email 2</th>
                    <th>Address</th>
                    <th>Location</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Pincode</th>
                    <th>GST</th>
                    <th>DL</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Stockist Code</th>
                    <th>Stockist Name</th>
                    <th>Contact Person 1</th>
                    <th>Contact Person 2</th>
                    <th>Contact Person 3</th>
                    <th>Email 1</th>
                    <th>Email 2</th>
                    <th>Address</th>
                    <th>Territory</th>
                    <th>Headquarters</th>
                    <th>State</th>
                    <th>Pincode</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((row, i) => (
                  <tr key={i}>
                    <td><strong style={{ color: "var(--ink)" }}>{row.dealerCode}</strong></td>
                    <td>{row.dealerName}</td>
                    <td>{row.contactPerson}</td>
                    <td>--</td>
                    <td>--</td>
                    <td>{row.email || "--"}</td>
                    <td>--</td>
                    <td style={{ fontSize: "12px", color: "var(--muted)", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.address || "--"}
                    </td>
                    <td>{row.territory}</td>
                    <td>{row.headquarters}</td>
                    <td>{row.state}</td>
                    <td>{row.pincode || "--"}</td>
                    {isSuperStockist && (
                      <>
                        <td style={{ fontFamily: "monospace", fontSize: "11px" }}>GST29AAAAA1111A</td>
                        <td style={{ fontFamily: "monospace", fontSize: "11px" }}>DL-20-123456</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
