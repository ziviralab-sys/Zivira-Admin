"use client";

// Previously this rendered a large hand-built calendar popover (Cancel/Apply
// buttons, custom month/day grid, prev/next-year steppers). It was oversized
// on screen, and being reimplemented from scratch it had its own class of
// bugs independent of the browser's own date picker. The browser's native
// date input is the same compact, reliable calendar already used elsewhere
// in the app (e.g. the HR portal's Add Employee "Date of Joining" field) —
// this keeps the exact same `value`/`onChange` contract (YYYY-MM-DD string)
// so every existing call site (Add/Edit forms across all masters) keeps
// working unchanged, while fixing both the size and the reliability
// complaints in one place.
export function CustomDatePicker({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
        background: "var(--panel)",
        color: "var(--ink)",
        fontSize: "14px",
        minHeight: "42px",
        boxSizing: "border-box",
        colorScheme: "light dark"
      }}
    />
  );
}
