"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon } from 'lucide-react';

export function CustomDatePicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Date states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  
  // Initialize from value if present
  useEffect(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        // value is YYYY-MM-DD
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(d.getTime())) {
          setCurrentDate(d);
          setViewDate(d);
        }
      }
    }
  }, [value]);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  // Adjust so Monday is 0
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function handlePrevYear() { setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1)); }
  function handleNextYear() { setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1)); }
  function handlePrevMonth() { setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); }
  function handleNextMonth() { setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); }

  // Days array construction
  const days = [];
  
  // Previous month trailing days
  const prevMonthDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
  for (let i = adjustedStartDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, prevMonthDays - i) });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, date: new Date(viewDate.getFullYear(), viewDate.getMonth(), i) });
  }

  // Next month leading days
  const remainingSlots = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({ day: i, isCurrentMonth: false, date: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, i) });
  }

  const [tempSelection, setTempSelection] = useState<Date | null>(null);

  // When calendar opens, set temp selection to currentDate
  useEffect(() => {
    if (isOpen) {
      setTempSelection(currentDate);
      setViewDate(currentDate);
    }
  }, [isOpen]);

  function handleApply() {
    if (tempSelection) {
      setCurrentDate(tempSelection);
      // Format to YYYY-MM-DD
      const yyyy = tempSelection.getFullYear();
      const mm = String(tempSelection.getMonth() + 1).padStart(2, '0');
      const dd = String(tempSelection.getDate()).padStart(2, '0');
      onChange(`${yyyy}-${mm}-${dd}`);
    }
    setIsOpen(false);
  }

  function handleCancel() {
    setIsOpen(false);
  }

  // Styles
  const popoverStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 9999,
    top: "100%",
    left: 0,
    marginTop: "8px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
    padding: "20px",
    width: "320px",
    display: isOpen ? "block" : "none"
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px"
  };

  const navButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280"
  };

  const dayHeaderStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    textAlign: "center",
    fontWeight: 600,
    fontSize: "13px",
    color: "#9ca3af",
    marginBottom: "12px"
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    rowGap: "8px"
  };

  const today = new Date();

  // Format value for display (dd-mm-yyyy)
  let displayValue = "dd-mm-yyyy";
  if (value) {
    const parts = value.split('-');
    if (parts.length === 3) {
      displayValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  
  return (
    <div style={{ position: "relative", width: "100%" }} ref={popoverRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
          background: "var(--panel)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          minHeight: "42px"
        }}
      >
        <span style={{ color: value ? "var(--ink)" : "#9ca3af", fontSize: "14px" }}>{displayValue}</span>
        <CalendarIcon size={16} color="#6b7280" />
      </div>

      <div style={popoverStyle}>
        <div style={headerStyle}>
          <button type="button" onClick={handlePrevYear} style={navButtonStyle}><ChevronsLeft size={16} /></button>
          <button type="button" onClick={handlePrevMonth} style={navButtonStyle}><ChevronLeft size={16} /></button>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)" }}>
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
          <button type="button" onClick={handleNextMonth} style={navButtonStyle}><ChevronRight size={16} /></button>
          <button type="button" onClick={handleNextYear} style={navButtonStyle}><ChevronsRight size={16} /></button>
        </div>

        <div style={dayHeaderStyle}>
          {dayNames.map(d => <div key={d}>{d}</div>)}
        </div>

        <div style={gridStyle}>
          {days.map((d, i) => {
            const isSelected = tempSelection && 
              tempSelection.getDate() === d.date.getDate() && 
              tempSelection.getMonth() === d.date.getMonth() && 
              tempSelection.getFullYear() === d.date.getFullYear();
              
            const isToday = today.getDate() === d.date.getDate() && 
              today.getMonth() === d.date.getMonth() && 
              today.getFullYear() === d.date.getFullYear();

            return (
              <div 
                key={i}
                onClick={() => setTempSelection(d.date)}
                style={{
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: isSelected ? 600 : 500,
                  cursor: "pointer",
                  borderRadius: "8px",
                  background: isSelected 
                    ? "var(--brand)" 
                    : isToday ? "color-mix(in srgb, var(--brand) 15%, transparent)" : "transparent",
                  color: isSelected 
                    ? "#fff" 
                    : !d.isCurrentMonth ? "#d1d5db" 
                    : isToday ? "var(--brand)" : "var(--ink)"
                }}
              >
                {d.day}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button 
            type="button" 
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontWeight: 600,
              color: "var(--ink)",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleApply}
            style={{
              flex: 1,
              padding: "10px",
              background: "var(--brand)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
