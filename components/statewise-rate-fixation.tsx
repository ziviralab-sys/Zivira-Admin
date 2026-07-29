"use client";

import { Coins, Layers, Calendar, Package, DollarSign, Percent } from "lucide-react";

export function StatewiseRateFixation() {
  const buttonConfig = [
    { key: "rate-master", label: "Rate Master", icon: <Coins size={16} /> },
    { key: "product-name", label: "Product Name", icon: <Layers size={16} /> },
    { key: "mfg-date", label: "Manufacture Date", icon: <Calendar size={16} /> },
    { key: "expiry-date", label: "Expiry Date", icon: <Calendar size={16} /> },
    { key: "pack", label: "Pack", icon: <Package size={16} /> },
    { key: "pts", label: "PTS (Distributor)", icon: <DollarSign size={16} /> },
    { key: "ptr", label: "PTR (Retailer)", icon: <DollarSign size={16} /> },
    { key: "mrp", label: "MRP (Max Retail)", icon: <Percent size={16} /> }
  ];

  return (
    <section className="subdivision-console" style={{ animation: "popIn 0.3s ease-out forwards" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
        {buttonConfig.map((btn) => (
          <button
            key={btn.key}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 20px",
              borderRadius: "10px",
              border: "1px solid var(--line)",
              background: "var(--panel)",
              color: "var(--ink)",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              fontWeight: 600
            }}
            className="search-item-hover"
          >
            <span style={{ color: "var(--brand)", display: "flex", alignItems: "center" }}>{btn.icon}</span>
            <span style={{ fontSize: "14px" }}>{btn.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
