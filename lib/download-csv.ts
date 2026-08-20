// lib/download-csv.ts
// NEW FILE — Task 2 & 3: reusable CSV download helper
// Import and call wherever you have an Export button.

/**
 * Download an array of objects as a CSV file.
 *
 * @param filename  e.g. "field-force-status.csv"
 * @param rows      array of plain objects — keys become column headers
 *
 * Usage:
 *   import { downloadCsv } from "@/lib/download-csv";
 *   <button onClick={() => downloadCsv("field-force.csv", fieldForceRows)} type="button">
 *     Export
 *   </button>
 */
export function downloadCsv(
  filename: string,
  rows: Record<string, unknown>[]
): void {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]!);
  const escape = (v: unknown) =>
    `"${String(v ?? "").replace(/"/g, '""')}"`;

  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
