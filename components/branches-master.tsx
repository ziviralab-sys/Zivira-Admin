import { StatusFilterDropdown } from "@/components/status-filter-dropdown";
"use client";
import type { CompanyBranch } from "@zivira/types";
import { Pencil, Star, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { downloadCsv } from "@/lib/download-csv";
const INDIAN_STATES = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra", "Delhi", "West Bengal", "Gujarat", "Punjab"];
const emptyForm = { branchName: "", gstNumber: "", address: "", city: "", state: INDIAN_STATES[0], pincode: "", isHeadquarters: false };
export function BranchesMaster() {
  const [branches, setBranches] = useState<CompanyBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<CompanyBranch | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  async function load() {
    setLoading(true); setError("");
    try { setBranches((await apiClient.branches()).data); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed to load branches"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  function openAdd() { setForm(emptyForm); setView("add"); }
  function openEdit(b: CompanyBranch) {
    setEditTarget(b);
    setForm({ branchName: b.branchName, gstNumber: b.gstNumber, address: b.address, city: b.city, state: b.state, pincode: b.pincode, isHeadquarters: b.isHeadquarters });
    setView("edit");
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (view === "add") await apiClient.createBranch(form);
      else if (editTarget) await apiClient.updateBranch(editTarget.id, form);
      setView("list");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save branch — this GST number may already be registered to another branch");
    } finally {
      setSaving(false);
    }
  }
  function exportCsv() {
    downloadCsv("branches-gst.csv", branches.map(b => ({
      BranchName: b.branchName, GSTNumber: b.gstNumber, City: b.city, State: b.state, Pincode: b.pincode,
      HeadOffice: b.isHeadquarters ? "Yes" : "No", Status: b.status
    })));
  }
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Options · Company Settings</p>
          <h2>Branches &amp; GST</h2>
          <p>Every branch's GST number, resolved automatically on Tour Plans, claims and distributor statements (PRD Section 12.5).</p>
        </div>
        <div className="subdivision-actions">
          <button className="button button-secondary" onClick={exportCsv} disabled={!branches.length} type="button">Export CSV</button>
          <button className="button" onClick={openAdd} type="button"> Add Branch</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      {view !== "list" ? (
        <form onSubmit={save} className="card form-grid">
          <div className="field">
            <label>Branch Name</label>
            <input required value={form.branchName} onChange={e => setForm({ ...form, branchName: e.target.value })} placeholder="Chennai Branch" />
          </div>
          <div className="field">
            <label>GST Number</label>
            <input required maxLength={15} value={form.gstNumber} onChange={e => setForm({ ...form, gstNumber: e.target.value.toUpperCase() })} placeholder="33AAACZ3085J1ZQ" />
          </div>
          <div className="field">
            <label>Address</label>
            <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="field">
            <label>City</label>
            <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="field">
            <label>State</label>
            <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Pincode</label>
            <input required value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} />
          </div>
          <div className="field">
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.isHeadquarters} onChange={e => setForm({ ...form, isHeadquarters: e.target.checked })} />
              This is the Head Office
            </label>
          </div>
          <div style={{ gridColumn: "span 2", display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="button button-secondary" type="button" onClick={() => setView("list")}>Cancel</button>
            <button className="button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Branch"}</button>
          </div>
        </form>
      ) : (
        <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Loading branches...</div>
          ) : (
            <table className="subdivision-table">
              <thead>
                <tr><th>Branch</th><th>GST Number</th><th>City</th><th>State</th><th>Pincode</th><th>HQ</th><th>Status</th><th>Edit</th></tr>
              </thead>
              <tbody>
                {branches.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.branchName}</strong></td>
                    <td style={{ fontFamily: "monospace" }}>{b.gstNumber}</td>
                    <td>{b.city}</td>
                    <td>{b.state}</td>
                    <td>{b.pincode}</td>
                    <td>{b.isHeadquarters ? <Star size={15} color="#f59e0b" fill="#f59e0b" /> : "—"}</td>
                    <td>
                      <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: b.status === "ACTIVE" ? "#10b98115" : "#ef444415", color: b.status === "ACTIVE" ? "#10b981" : "#ef4444" }}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button className="subdivision-icon-button" onClick={() => openEdit(b)} title="Edit" type="button">
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {branches.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>No branches yet</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
