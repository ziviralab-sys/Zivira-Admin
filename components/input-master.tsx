"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

export function InputMaster() {
  const categories = [
    "Superpremium",
    "Premium",
    "Campaigns",
    "Exclusive",
    "Reminders",
    "Input",
    "Table Top Input",
    "Reference Article",
    "OPD Cards",
    "LBL"
  ];
  const [activeCategory, setActiveCategory] = useState("Superpremium");
  const [showCategories, setShowCategories] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedDropdownVal, setSelectedDropdownVal] = useState("");
  const [descDropdownOpen, setDescDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [duration, setDuration] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const descriptions = [
    "Brand Name"
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDescDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="subdivision-console">
      {/* Action Row, Category Toggle, & Inputs (nowrap style) */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "nowrap", width: "100%" }}>
        <button
          className={`button ${showCategories ? "" : "button-secondary"}`}
          onClick={() => setShowCategories(!showCategories)}
          style={{ padding: "8px 16px", fontSize: "13px", fontWeight: 600, flexShrink: 0 }}
          type="button"
        >
          Category
        </button>

        {/* Input Description Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
            Input Description
          </span>
          
          {/* Box 1: One empty box alone (Text Input, compact) */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder=""
            style={{
              width: "120px",
              height: "36px",
              padding: "0 10px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--panel)",
              color: "var(--ink)",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />

          {/* Box 2: Dropdown box next to it (compact) */}
          <div className="command-select" style={{ position: "relative" }} ref={dropdownRef}>
            <button
              className="command-select-button"
              style={{
                width: "150px",
                height: "36px",
                minHeight: "36px",
                paddingLeft: "12px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              onClick={() => setDescDropdownOpen(!descDropdownOpen)}
              type="button"
            >
              <span>{selectedDropdownVal || ""}</span>
              <ChevronDown size={14} style={{ color: "var(--muted)" }} />
            </button>

            {descDropdownOpen && (
              <div className="command-select-menu" style={{ width: "150px", top: "calc(100% + 6px)" }}>
                {descriptions.map((desc) => (
                  <button
                    key={desc}
                    className={selectedDropdownVal === desc ? "command-select-option command-select-option-active" : "command-select-option"}
                    onClick={() => {
                      setSelectedDropdownVal(desc);
                      setDescDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <span>{desc}</span>
                    {selectedDropdownVal === desc && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quantity (Only shown when "Brand Name" is selected, compact) */}
        {selectedDropdownVal === "Brand Name" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, animation: "fadeIn 0.2s ease-out forwards" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
              Quantity
            </span>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder=""
              style={{
                width: "80px",
                height: "36px",
                padding: "0 10px",
                borderRadius: "6px",
                border: "1px solid var(--line)",
                background: "var(--panel)",
                color: "var(--ink)",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        )}

        {/* Duration (Only shown when "Brand Name" is selected, compact) */}
        {selectedDropdownVal === "Brand Name" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, animation: "fadeIn 0.2s ease-out forwards" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
              Duration
            </span>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder=""
              style={{
                width: "80px",
                height: "36px",
                padding: "0 10px",
                borderRadius: "6px",
                border: "1px solid var(--line)",
                background: "var(--panel)",
                color: "var(--ink)",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        )}

        {/* Filters / Add Input Actions */}
        <div style={{ display: "flex", gap: "10px", marginLeft: "auto", flexShrink: 0 }}>
          <button className="button button-secondary" type="button" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          <button className="button" type="button" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <Plus size={15} /> Add Input
          </button>
        </div>
      </div>

      {/* Categories Buttons Row (Toggled by Category Button) */}
      {showCategories && (
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "8px 0", marginBottom: "20px", borderBottom: "1px solid var(--border)", WebkitOverflowScrolling: "touch" }}>
          {categories.map((c) => (
            <button
              key={c}
              className={`button ${activeCategory === c ? "" : "button-secondary"}`}
              onClick={() => setActiveCategory(c)}
              style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
              type="button"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
