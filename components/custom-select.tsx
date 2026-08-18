"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function CustomSelect({
  value,
  options,
  onChange,
  placeholder,
  style
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
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

  return (
    <div ref={ref} style={{ position: "relative", display: "block", ...style }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--panel)",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "8px 12px",
          color: value ? "inherit" : "var(--muted)",
          cursor: "pointer",
          fontSize: "14px",
          outline: "none",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder || "Select an option"}
        </span>
        <ChevronDown size={16} style={{ color: "var(--muted)", flexShrink: 0, marginLeft: "8px" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "100%",
            maxHeight: "240px",
            overflowY: "auto",
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            zIndex: 60,
            padding: "4px 0",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{
                  padding: "8px 16px",
                  textAlign: "left",
                  background: isSelected ? "var(--brand)" : "transparent",
                  color: isSelected ? "white" : "inherit",
                  fontSize: "14px",
                  cursor: "pointer",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(249, 115, 22, 0.1)"; // Faint orange hover
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
