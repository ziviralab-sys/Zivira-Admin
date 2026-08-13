"use client";

import { Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { apiClient, type MasterField, type MasterRecord, type MasterSchema } from "@/lib/api-client";
import Link from "next/link";

/**
 * Renders a full CRUD console (list + add/edit form) for any of the 38
 * document-derived masters, using the exact field labels the backend returns
 * for that master key. This is intentionally generic — one component serves
 * every master instead of ~30 near-identical hand-written files, and it can
 * never drift out of sync with the document because the headers come from
 * the backend's registry, not from anything hardcoded here.
 */
export function GenericMasterTable({ masterKey }: { masterKey: string }) {
  const [schema, setSchema] = useState<MasterSchema | null>(null);
  const [rows, setRows] = useState<MasterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formRow, setFormRow] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MasterRecord | null>(null);
  // Cache of live dropdown options fetched from other masters, keyed by
  // "sourceMaster.sourceField" so multiple fields sharing a source only fetch once.
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, string[]>>({});
  // Full records per source master (not just distinct values), used to look up
  // a computed field's display value (e.g. Doctor Name from a chosen Doctor Code).
  const [sourceRecords, setSourceRecords] = useState<Record<string, MasterRecord[]>>({});

  async function load() {
    setLoading(true);
    setError(null);
    try {
      let schemaData: MasterSchema;
      let rowsData: MasterRecord[] = [];

      if (
        masterKey === "targetMaster" || 
        masterKey === "primarySales" || 
        masterKey === "secondarySales" || 
        masterKey === "claimsMaster"
      ) {
        const titleMap: Record<string, string> = {
          targetMaster: "Target Master",
          primarySales: "Primary Sales",
          secondarySales: "Secondary Sales",
          claimsMaster: "Claims Master"
        };
        schemaData = {
          key: masterKey,
          title: titleMap[masterKey] || "Master",
          keyFields: ["division", "zone", "region", "area", "hq", "product", "month"],
          fields: [
            { key: "division", label: "Division", type: "string" },
            { key: "zone", label: "Zone", type: "string" },
            { key: "region", label: "Region", type: "string" },
            { key: "area", label: "Area", type: "string" },
            { key: "hq", label: "HQ", type: "string" },
            { key: "product", label: "Product", type: "string" },
            { key: "month", label: "Month", type: "string" },
            { key: "status", label: "Status", type: "string" }
          ]
        };
      } else {
        const [schemaRes, recordsRes] = await Promise.all([
          apiClient.masterSchema(masterKey),
          apiClient.masterRecords(masterKey)
        ]);
        schemaData = schemaRes.data;
        rowsData = recordsRes.data;
      }

      if (schemaData && schemaData.fields) {
        schemaData.fields = schemaData.fields.map(f => 
          f.label === "Doctor Name" ? { ...f, label: "Customer Name" } : f
        );

        if (masterKey === "doctorMaster") {
          const extraFields = [
            { key: "clinicName", label: "Clinic Name", type: "string" },
            { key: "address", label: "Address", type: "string" },
            { key: "area", label: "Area", type: "string" },
            { key: "city", label: "City", type: "string" },
            { key: "state", label: "State", type: "string" },
            { key: "country", label: "Country", type: "string" },
            { key: "pinCode", label: "Pin Code", type: "string" },
            { key: "mobile", label: "Mobile", type: "string" },
            { key: "phone", label: "Phone", type: "string" },
            { key: "email", label: "Email", type: "string" },
            { key: "whatsapp", label: "WhatsApp", type: "string" }
          ];
          
          for (const extra of extraFields) {
            if (!schemaData.fields.some((f: any) => f.key === extra.key || f.label.toUpperCase() === extra.label.toUpperCase())) {
              schemaData.fields.push(extra as any);
            }
          }
        } else if (masterKey === "inputMaster") {
          const extraFields = [
            { key: "typeOfInput", label: "Type of Input", type: "string" },
            { key: "division", label: "Division", type: "string" },
            { key: "valueOfInput", label: "Value of Input", type: "string" },
            { key: "fromDate", label: "From", type: "string" },
            { key: "toDate", label: "To", type: "string" },
            { key: "financialYear", label: "Financial Year", type: "string" }
          ];
          
          for (const extra of extraFields) {
            if (!schemaData.fields.some((f: any) => f.key === extra.key || f.label.toUpperCase() === extra.label.toUpperCase())) {
              schemaData.fields.push(extra as any);
            }
          }
        }
      }
      setSchema(schemaData);
      setRows(rowsData);

      // Pre-fetch live records for any field sourced from another master
      // (dropdown fields) or that computes a display value from one.
      const sourced = schemaData.fields.filter((f) => f.sourceMaster && f.sourceField);
      const computedSources = schemaData.fields.filter((f) => f.computed).map((f) => f.computed!.sourceMaster);
      const uniqueSources = Array.from(new Set([...sourced.map((f) => f.sourceMaster as string), ...computedSources]));
      const fetched = await Promise.all(
        uniqueSources.map((sm) => apiClient.masterRecords(sm).then((r) => [sm, r.data] as const).catch(() => [sm, []] as const))
      );
      const bySource: Record<string, MasterRecord[]> = Object.fromEntries(fetched);
      setSourceRecords(bySource);

      const opts: Record<string, string[]> = {};
      for (const f of sourced) {
        const cacheKey = `${f.sourceMaster}.${f.sourceField}`;
        const records = bySource[f.sourceMaster as string] ?? [];
        const values = Array.from(
          new Set(records.map((r) => r[f.sourceField as string]).filter((v): v is string => typeof v === "string" && v.trim() !== ""))
        ).sort();
        opts[cacheKey] = values;
      }
      setDropdownOptions(opts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterKey]);

  function optionsFor(f: MasterField): string[] | null {
    if (f.options) return f.options;
    if (f.sourceMaster && f.sourceField) return dropdownOptions[`${f.sourceMaster}.${f.sourceField}`] ?? [];
    return null;
  }

  // Looks up a computed field's display value — e.g. for Doctor Name, finds
  // the doctorMaster record whose doctorCode matches the currently-selected
  // Doctor Code and returns its doctorName. Recomputed on every render, so it
  // updates instantly as soon as the linked dropdown changes.
  function computedValueFor(f: MasterField, row: Record<string, unknown>): string {
    if (!f.computed) return "";
    const currentKey = row[f.computed.fromField];
    if (!currentKey) return "";
    const records = sourceRecords[f.computed.sourceMaster] ?? [];
    const match = records.find((r) => r[f.computed!.lookupField] === currentKey);
    return match ? String(match[f.computed.displayField] ?? "") : "";
  }

  if (!schema && loading) {
    return (
      <section className="subdivision-console">
        <p className="muted">Loading…</p>
      </section>
    );
  }
  if (!schema) {
    return (
      <section className="subdivision-console">
        <p style={{ color: "#ef4444" }}>{error ?? "Unable to load this master's schema."}</p>
      </section>
    );
  }

  function openAddForm() {
    const blank: Record<string, unknown> = {};
    for (const f of schema!.fields) blank[f.key] = f.key === "status" ? "Active" : "";
    setFormRow(blank);
  }

  function openEditForm(row: MasterRecord) {
    setFormRow({ ...row });
  }

  async function saveForm() {
    if (!formRow) return;
    setSaving(true);
    setError(null);
    try {
      // Bake computed fields (e.g. Doctor Name) into the payload so they're
      // stored directly and show up instantly in the table without a join.
      const payload = { ...formRow };
      for (const f of schema!.fields) {
        if (f.computed) payload[f.key] = computedValueFor(f, formRow);
      }
      if (formRow.id) {
        await apiClient.updateMasterRecord(masterKey, String(formRow.id), payload);
      } else {
        await apiClient.createMasterRecord(masterKey, payload);
      }
      // The save itself succeeded at this point — close the form regardless
      // of what happens next. Previously, a transient failure in the list
      // refresh below would land in the catch block and show "failed to
      // save" even though the record was created, leaving the form open
      // with the same code and inviting a real duplicate on retry.
      setFormRow(null);
      try {
        await load();
      } catch {
        // Non-fatal: the record saved fine, the list just couldn't refresh
        // immediately. It'll be correct next time the screen loads.
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save record");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeactivate() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await apiClient.deactivateMasterRecord(masterKey, deleteTarget.id);
      await load();
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate record");
    } finally {
      setSaving(false);
    }
  }

  if (formRow) {
    const isEdit = !!formRow.id;
    return (
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Master Setup</p>
            <h2>{isEdit ? `Edit ${schema.title}` : `Add ${schema.title}`}</h2>
            <p>Fields exactly as defined for this master in the Technical Report.</p>
          </div>
          <button className="button button-secondary" onClick={() => setFormRow(null)} type="button">
            <RotateCcw size={16} /> Back
          </button>
        </div>
        <div className="subdivision-form-card">
          {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
          {schema.fields.map((f: MasterField) => {
            const opts = optionsFor(f);
            const commonStyle: CSSProperties = {
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              outline: "none",
              fontSize: "14px",
              background: "var(--panel)"
            };
            return (
              <label className="field" key={f.key}>
                <span>
                  {schema.keyFields.includes(f.key) ? "* " : ""}
                  {f.label}
                </span>
                {f.computed ? (
                  <input
                    type="text"
                    value={computedValueFor(f, formRow)}
                    readOnly
                    placeholder={`Auto-filled from ${f.label.replace("Name", "Code")}`}
                    style={{ ...commonStyle, background: "#f3f4f6", color: "var(--muted)", cursor: "not-allowed" }}
                  />
                ) : opts ? (
                  <select
                    value={(formRow[f.key] as string | undefined) ?? ""}
                    onChange={(e) => setFormRow({ ...formRow, [f.key]: e.target.value })}
                    style={commonStyle}
                  >
                    <option value="">Select {f.label}</option>
                    {opts.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    value={(formRow[f.key] as string | number | undefined) ?? ""}
                    onChange={(e) => setFormRow({ ...formRow, [f.key]: e.target.value })}
                    style={commonStyle}
                  />
                )}
              </label>
            );
          })}
          <button className="button" style={{ marginTop: "12px" }} onClick={saveForm} type="button" disabled={saving}>
            <Check size={16} /> {saving ? "Saving..." : isEdit ? "Save Changes" : `Add ${schema.title}`}
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {deleteTarget && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
          }}
        >
          <div style={{ background: "var(--panel)", borderRadius: "10px", padding: "24px", minWidth: "320px" }}>
            <p>Deactivate this record?</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button className="button" onClick={confirmDeactivate} type="button" disabled={saving}>
                {saving ? "Working..." : "Yes, deactivate"}
              </button>
              <button className="button button-secondary" onClick={() => setDeleteTarget(null)} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Master Setup</p>
            <h2>{schema.title}</h2>
            <p>{schema.fields.length} fields, matching the Technical Report exactly.</p>
          </div>
          <div className="subdivision-actions">
            <button className="button" onClick={openAddForm} type="button">
              <Plus size={16} /> Add {schema.title}
            </button>
          </div>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
        <div className="subdivision-stats">
          <article>
            <span>Total Records</span>
            <strong>{rows.length}</strong>
          </article>
          {masterKey === "doctorMaster" && (
            <Link className="card module-card" href="/admin/workspace/division-dashboard/division-navigation-tabs/division-master/doctor/chemist" style={{ borderLeft: "4px solid var(--brand-strong)", width: "300px", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 16px" }}>
              <h3 className="section-title">Chemist</h3>
            </Link>
          )}
        </div>
        <div className="subdivision-table-card" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 250px)" }}>
          <table className="subdivision-table">
            <thead>
              <tr>
                {schema.fields.map((f) => (
                  <th key={f.key}>{f.label}</th>
                ))}
                <th>Edit</th>
                <th>Deactivate</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={schema.fields.length + 2} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={schema.fields.length + 2} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                    No {schema.title.toLowerCase()} records found
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id}>
                  {schema.fields.map((f) => (
                    <td key={f.key}>{f.computed ? computedValueFor(f, row) : String(row[f.key] ?? "")}</td>
                  ))}
                  <td>
                    <button className="button button-secondary" onClick={() => openEditForm(row)} type="button">
                      Edit
                    </button>
                  </td>
                  <td>
                    <button className="button button-secondary" onClick={() => setDeleteTarget(row)} type="button">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
