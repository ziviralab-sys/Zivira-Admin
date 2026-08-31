"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function ColumnFilterDropdown({
  value,
  title,
  options,
  onChange
}: {
  value: string;
  title: string;
  options: {label: string; value: string}[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  // Screen position of the menu, recomputed from the trigger button
  // whenever it opens. The menu renders with position:fixed (below) instead
  // of being an absolutely-positioned child of this header cell — inside a
  // scrollable table wrapper (overflow:auto), an absolutely-positioned
  // dropdown gets clipped the instant that wrapper is short (e.g. right
  // after filtering down to zero rows), which is exactly what made the
  // column filter menus unreachable/invisible.
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (ref.current && ref.current.contains(target)) return;
      if (target.closest("[data-column-filter-menu]")) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    function reposition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) setMenuPos({ top: rect.bottom + 4, left: rect.left });
    }
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", fontWeight: "normal", textTransform: "none" }}>
      <button
        ref={buttonRef}
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
        <span style={{ fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</span>
        <ChevronDown size={14} style={{ color: "var(--muted)", marginLeft: "4px" }} />
      </button>

      {open && menuPos && (
        <div
          data-column-filter-menu
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            width: "max-content",
            minWidth: "160px",
            maxHeight: "min(320px, calc(100vh - 24px))",
            overflowY: "auto",
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            zIndex: 200,
            padding: "6px 0",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <button
            type="button"
            onClick={() => {
              onChange("All");
              setOpen(false);
            }}
            style={{
              padding: "8px 16px",
              textAlign: "left",
              background: value === "All" ? "rgba(249, 115, 22, 0.1)" : "transparent",
              color: value === "All" ? "#f97316" : "var(--ink)",
              fontSize: "13px",
              cursor: "pointer",
              border: "none",
              borderLeft: value === "All" ? "3px solid #f97316" : "3px solid transparent",
              fontWeight: value === "All" ? 600 : 400
            }}
            onMouseEnter={(e) => { if (value !== "All") e.currentTarget.style.background = "var(--line)"; }}
            onMouseLeave={(e) => { if (value !== "All") e.currentTarget.style.background = "transparent"; }}
          >
            Clear filter
          </button>

          {options.map((opt) => {
            const isSelected = opt.value === value;
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
