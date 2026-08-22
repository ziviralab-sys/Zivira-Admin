"use client";
// components/visit-frequency-report.tsx
// BI Reports > Territory Reports > "Visit Frequency" — Zivira_Project_Basic.docx
// item 6 (every BI Reports link opens a page with the report's own detail).
//
// No dedicated backend endpoint exists for this slice either, so — same as
// Products Discussed — it's derived client-side from field DCR records
// (apiClient.dcrs()), counted per doctor for the current data window.
// Purely additive — reads existing data only.
import { MapPin, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BackButton } from "@/components/back-button";
import { apiClient, type DcrRecord } from "@/lib/api-client";

export function VisitFrequencyReport() {
  const [dcrs, setDcrs] = useState<DcrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.dcrs();
      setDcrs(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => {
    const byDoctor = new Map<string, { doctor: string; visits: number; reps: Set<string>; lastVisit: string }>();
    for (const d of dcrs) {
      const doctorLabel = typeof d.doctorId === "object" ? d.doctorId?.name : undefined;
      if (!doctorLabel) continue;
      const entry = byDoctor.get(doctorLabel) ?? { doctor: doctorLabel, visits: 0, reps: new Set<string>(), lastVisit: d.visitDate };
      entry.visits += 1;
      if (d.employeeCode) entry.reps.add(d.employeeCode);
      if (new Date(d.visitDate) > new Date(entry.lastVisit)) entry.lastVisit = d.visitDate;
      byDoctor.set(doctorLabel, entry);
    }
    return [...byDoctor.values()].sort((a, b) => b.visits - a.visits);
  }, [dcrs]);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Territory Reports</p>
          <h2>Visit Frequency</h2>
          <p>How often each doctor is being visited, and by how many reps — derived from field DCR records.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BackButton fallback="/admin/analytics" />
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>Doctor</th><th>Total Visits</th><th>Distinct Reps</th><th>Last Visit</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.doctor}>
                <td><strong style={{ color: "var(--ink)" }}>{r.doctor}</strong></td>
                <td>{r.visits}</td>
                <td>{r.reps.size}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{new Date(r.lastVisit).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
                <MapPin size={28} style={{ margin: "0 auto 8px", display: "block", opacity: 0.3 }} />
                No DCR visit records yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
