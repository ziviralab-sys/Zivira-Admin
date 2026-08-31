"use client";
// components/export-menu-button.tsx
// Shared "Export" control for the Analytics & BI pages — Zivira_Project_Basic.docx
// item 9 ("remove the text CSV from the export button, clicking Export should
// download excel and pdf with proper alignment without errors").
//
// Mirrors the Export button/menu already shipped in
// components/generic-master-table.tsx (same button classes, same dropdown
// styling, same xlsx/jspdf-autotable libraries already in package.json) so
// this doesn't introduce any new dependency or visual pattern — it just
// reuses the one that's already proven on the Masters pages. Supports
// multiple table "sections" so pages with more than one table (KPI Engine,
// Sample Distribution) export every table into one workbook / one PDF
// instead of only the first.
//
// New file — purely additive, does not touch any existing component.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Download, FileText, Sheet } from "lucide-react";

export type ExportSection = { title: string; headers: string[]; rows: (string | number)[][] };

const exportMenuOptionStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  padding: "10px 14px",
  textAlign: "left",
  background: "transparent",
  border: "none",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--ink)",
  cursor: "pointer"
};

export function ExportMenuButton({ filename, sections, disabled }: { filename: string; sections: ExportSection[]; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const hasData = sections.some((s) => s.rows.length > 0);

  async function exportExcel() {
    if (!hasData) return;
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    sections.forEach((s, idx) => {
      const body = s.rows.map((r) => r.map((v) => String(v)));
      const worksheet = XLSX.utils.aoa_to_sheet([s.headers, ...body]);
      worksheet["!cols"] = s.headers.map((h, colIdx) => {
        const longest = body.reduce((max, r) => Math.max(max, (r[colIdx] ?? "").length), h.length);
        return { wch: Math.min(Math.max(longest + 2, 10), 60) };
      });
      worksheet["!rows"] = [{ hpt: 20 }];
      const safeName = (s.title || `Sheet${idx + 1}`).replace(/[\\/*?:[\]]/g, " ").slice(0, 31) || `Sheet${idx + 1}`;
      XLSX.utils.book_append_sheet(workbook, worksheet, safeName);
    });
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  async function exportPdf() {
    if (!hasData) return;
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const isWide = sections.some((s) => s.headers.length > 6);
    const doc = new jsPDF({ orientation: isWide ? "landscape" : "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 28;
    const usableWidth = pageWidth - margin * 2;
    let cursorY = margin + 10;

    sections.forEach((s, idx) => {
      const body = s.rows.map((r) => r.map((v) => String(v)));
      const rawWidths = s.headers.map((h, colIdx) => Math.max(h.length, ...body.map((r) => (r[colIdx] ?? "").length), 3));
      const totalRaw = rawWidths.reduce((a, b) => a + b, 0) || 1;
      const columnStyles: Record<number, { cellWidth: number }> = {};
      s.headers.forEach((_, colIdx) => { columnStyles[colIdx] = { cellWidth: (rawWidths[colIdx] / totalRaw) * usableWidth }; });
      const fontSize = s.headers.length > 12 ? 6.5 : s.headers.length > 8 ? 7.5 : 8.5;

      const lastFinalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY;
      if (idx > 0) cursorY = (lastFinalY ?? cursorY) + 26;
      if (cursorY > pageHeight - 100) { doc.addPage(); cursorY = margin + 10; }

      doc.setFontSize(13);
      doc.text(s.title, margin, cursorY);
      autoTable(doc, {
        head: [s.headers],
        body,
        startY: cursorY + 8,
        margin: { left: margin, right: margin },
        tableWidth: usableWidth,
        styles: { fontSize, cellPadding: 4, overflow: "linebreak", valign: "middle" },
        headStyles: { fillColor: [230, 81, 0], textColor: [255, 255, 255], fontStyle: "bold", halign: "left" },
        bodyStyles: { halign: "left" },
        columnStyles
      });
    });
    doc.save(`${filename}.pdf`);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="button"
        onClick={() => setOpen((v) => !v)}
        type="button"
        disabled={disabled || !hasData}
      >
        <Download size={15} /> Export
      </button>
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 30,
            background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "8px",
            boxShadow: "0 12px 28px rgba(0,0,0,0.18)", minWidth: "160px", overflow: "hidden"
          }}
        >
          <button type="button" onClick={() => { void exportExcel(); setOpen(false); }} style={exportMenuOptionStyle}>
            <Sheet size={15} /> Excel
          </button>
          <button type="button" onClick={() => { void exportPdf(); setOpen(false); }} style={exportMenuOptionStyle}>
            <FileText size={15} /> PDF
          </button>
        </div>
      )}
    </div>
  );
}
