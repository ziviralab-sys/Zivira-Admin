"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, CheckCircle2, XCircle, ListFilter } from "lucide-react";

export function StatusFilterDropdown({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", fontWeight: "normal", textTransform: "none" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          color: "var(--muted)",
          cursor: "pointer",
          padding: "2px",
          fontFamily: "inherit",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>STATUS</span>
        <ChevronDown size={14} style={{ color: "var(--muted)", marginLeft: "4px" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "170px",
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            zIndex: 50,
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          <button
            type="button"
            onClick={() => {
              onChange("All");
              setOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 10px",
              textAlign: "left",
              background: value === "All" ? "var(--line)" : "transparent",
              color: "var(--muted)",
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--line)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = value === "All" ? "var(--line)" : "transparent")}
          >
            <ListFilter size={16} />
            Clear Filter
          </button>
          <div style={{ height: "1px", background: "var(--border)", margin: "2px 6px" }} />
          {options.map((opt) => {
            const isSelected = opt.value === value || (value === "Active" && opt.value === "ACTIVE") || (value === "Inactive" && opt.value === "INACTIVE");
            const isActive = opt.value === "ACTIVE";
            const tint = isActive ? "#10b981" : "#ef4444";
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  textAlign: "left",
                  background: isSelected ? `${tint}15` : "transparent",
                  color: isSelected ? tint : "var(--ink)",
                  fontSize: "13px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: isSelected ? 600 : 500
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "var(--line)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                {isActive ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
