"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationInfo } from "@/lib/api-client";
export function PaginationControls({ pagination, onPrev, onNext }: { pagination: PaginationInfo; onPrev: () => void; onNext: () => void }) {
  const { page, limit, total, totalPages } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", padding: "12px 16px", borderTop: "1px solid var(--line)" }}>
      <span style={{ fontSize: "13px", color: "var(--muted)" }}>
        {total === 0 ? "No records" : `Showing ${start}–${end} of ${total}`}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button className="button button-secondary" type="button" onClick={onPrev} disabled={page <= 1} style={{ height: "34px", padding: "0 12px" }}>
          <ChevronLeft size={15} /> Previous
        </button>
        <span style={{ fontSize: "13px", color: "var(--muted)" }}>Page {page} of {Math.max(totalPages, 1)}</span>
        <button className="button button-secondary" type="button" onClick={onNext} disabled={page >= totalPages} style={{ height: "34px", padding: "0 12px" }}>
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
