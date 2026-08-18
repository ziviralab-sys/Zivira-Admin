"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

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
    { label: "Clear filter", value: "All" },
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
            width: "160px",
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            zIndex: 50,
            padding: "6px 0",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value || (value === "Active" && opt.value === "ACTIVE") || (value === "Inactive" && opt.value === "INACTIVE");
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  padding: "8px 16px",
                  textAlign: "left",
                  background: isSelected ? "rgba(249, 115, 22, 0.1)" : "transparent",
                  color: isSelected ? "#f97316" : "var(--ink)",
                  fontSize: "13px",
                  cursor: "pointer",
                  border: "none",
                  borderLeft: isSelected ? "3px solid #f97316" : "3px solid transparent",
                  fontWeight: isSelected ? 600 : 400
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "var(--line)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
