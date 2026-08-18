"use client";

import { RotateCcw, Trash2, Check, Plus, Pencil, Ban, Download } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState, useMemo } from "react";
import { apiClient, type MasterField, type MasterRecord, type MasterSchema } from "@/lib/api-client";
import Link from "next/link";
import { ColumnFilterDropdown } from "@/components/column-filter-dropdown";
import { StatusFilterDropdown } from "@/components/status-filter-dropdown";
import { CustomDatePicker } from "@/components/custom-date-picker";

/**
 * Renders a full CRUD console (list + add/edit form) for any of the 38
 * document-derived masters, using the exact field labels the backend returns
 * for that master key. This is intentionally generic — one component serves
 * every master instead of ~30 near-identical hand-written files, and it can
 * never drift out of sync with the document because the headers come from
 * the backend's registry, not from anything hardcoded here.
 */
export function GenericMasterTable({ masterKey }: { masterKey: string }) {
  const [isSuperStockist, setIsSuperStockist] = useState(false);
  const [isReportingStructure, setIsReportingStructure] = useState(false);
  const [schema, setSchema] = useState<MasterSchema | null>(null);
  const [rows, setRows] = useState<MasterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState("All");
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
      } else if (masterKey === "doctorStockistCombined") {
        const [smRes, addrRes, contRes, hqRes, licRes, rRes] = await Promise.all([
          apiClient.masterSchema("stockistMaster"),
          apiClient.masterSchema("stockistAddress"),
          apiClient.masterSchema("stockistContact"),
          apiClient.masterSchema("stockistHeadquarters"),
          apiClient.masterSchema("stockistLicenseDetails"),
          apiClient.masterRecords("stockistMaster")
        ]);
        
        const allFields = [
          ...smRes.data.fields,
          ...addrRes.data.fields,
          ...contRes.data.fields,
          ...hqRes.data.fields,
          ...licRes.data.fields
        ];

        // remove duplicates by key
        const uniqueFields: any[] = [];
        const seenKeys = new Set<string>();
        for (const f of allFields) {
          if (!seenKeys.has(f.key) && f.key !== "status") {
            seenKeys.add(f.key);
            uniqueFields.push(f);
          }
        }

        schemaData = {
          key: "doctorStockistCombined",
          title: "Stockist Master",
          keyFields: smRes.data.keyFields,
          fields: uniqueFields
        };
        rowsData = rRes.data;
      } else {
        const [schemaRes, recordsRes] = await Promise.all([
          apiClient.masterSchema(masterKey),
          apiClient.masterRecords(masterKey)
        ]);
        schemaData = schemaRes.data;
        rowsData = recordsRes.data;
      }

      if (schemaData && schemaData.fields) {
        schemaData.fields = schemaData.fields.map(f => {
          if (f.label === "Doctor Name") return { ...f, label: "Customer Name" };
          if (f.label === "Doctor Category (A/B/C)") return { ...f, label: "Doctor Category" };
          if (f.label.toUpperCase() === "ACTIVE") return { ...f, label: "Status", key: "status" };
          return f;
        });

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
        } else if (masterKey === "stockistMaster") {
          if (isSuperStockist) {
             schemaData.fields = [
               { key: "stockistCode", label: "Stockist Code", type: "string" },
               { key: "stockistName", label: "Stockist Name", type: "string" },
               { key: "contactNumber", label: "Contact Number", type: "string" },
               { key: "emailAddress", label: "Email Address", type: "string" },
               { key: "location", label: "Location", type: "string" },
               { key: "city", label: "City", type: "string" },
               { key: "state", label: "State", type: "string" },
               { key: "pincode", label: "Pincode", type: "string" },
               { key: "gstNo", label: "GST No", type: "string" },
               { key: "licenseNo", label: "License No", type: "string" }
             ];
             schemaData.title = "Super Stockist";
          } else {
            schemaData.fields = schemaData.fields.filter((f: any) => 
              f.label.toLowerCase() !== "gst no" && f.label.toLowerCase() !== "license no"
            );
            
            const stockistNameIdx = schemaData.fields.findIndex((f: any) => f.label.toLowerCase() === "stockist name");
            if (stockistNameIdx !== -1) {
              const newFields = [
                { key: "contactNumber", label: "Contact Number", type: "string" },
                { key: "emailAddress", label: "Email Address", type: "string" },
                { key: "territory", label: "Territory", type: "string" },
                { key: "hq", label: "HQ", type: "string" },
                { key: "state", label: "State", type: "string" },
                { key: "pinCode", label: "Pin Code", type: "string" }
              ];
              const fieldsToAdd = newFields.filter(nf => !schemaData.fields.some((f: any) => f.key === nf.key || f.label.toLowerCase() === nf.label.toLowerCase()));
              schemaData.fields.splice(stockistNameIdx + 1, 0, ...fieldsToAdd);
            }
            schemaData.title = "Stockist Master";
          }
        } else if (masterKey === "expenseReports" && isReportingStructure) {
          schemaData.fields = [
            { key: "division", label: "Division", type: "string" },
            { key: "bh", label: "BH", type: "string" },
            { key: "zbm", label: "ZBM", type: "string" },
            { key: "rbm", label: "RBM", type: "string" },
            { key: "abm", label: "ABM", type: "string" },
            { key: "be", label: "BE", type: "string" }
          ];
          schemaData.title = "Reporting Structure";
        }

        // Globally ensure ALL masters have a Status column AT THE VERY END
        const statusIdx = schemaData.fields.findIndex((f: any) => f.key === "status" || f.label.toUpperCase() === "STATUS");
        let statusField = { key: "status", label: "Status", type: "string" };
        if (statusIdx !== -1) {
          statusField = schemaData.fields.splice(statusIdx, 1)[0];
        }
        schemaData.fields.push(statusField as any);
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

  // Hardcoded keys for which we should hide the Edit and Inactive buttons
  const readonlyKeys = [
    "holidayStateMaster", "holidayCalendar", // Statewise - Holiday Fixation
    "stockistMaster", "stockistAddress", "stockistContact", "stockistHeadquarters", "stockistDivisionMapping", "stockistBankDetails", "stockistLicenseDetails", "stockistStatus", // Stockist Details
    "expenseCategory", "expenseTypes", "sfc", "allowanceFixation", // Expense Setup
    "managerTravelApproval", "expenseApproval", "expenseReports", // Manager Expense
    "employeePersonalInfo", "personalInformationView", // Personal Information
    "targetMaster", "primarySales", "secondarySales", "claimsMaster" // Sales
  ];
  const isReadonly = readonlyKeys.includes(masterKey);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterKey, isSuperStockist, isReportingStructure]);

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

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      let isMatch = true;
      for (const [key, val] of Object.entries(columnFilters)) {
        if (val !== "All") {
          const rowVal = String((row as any)[key] || "").toUpperCase();
          if (rowVal !== val.toUpperCase()) isMatch = false;
        }
      }
      if (statusFilter !== "All") {
        const rowStatus = String((row as any).status || "").toUpperCase();
        if (rowStatus !== statusFilter.toUpperCase()) isMatch = false;
      }
      return isMatch;
    });
  }, [rows, columnFilters, statusFilter]);

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

  function exportToCSV() {
    if (!schema || rows.length === 0) return;
    const headers = schema.fields.map((f) => f.label);
    const csvRows = filteredRows.map((row) => {
      return schema.fields.map((f) => {
        let val = (row as any)[f.key];
        if (f.computed) {
          val = computedValueFor(f, row);
        }
        if (val === undefined || val === null) val = "";
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      }).join(",");
    });
    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${schema.title || masterKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {formRow && (() => {
        const isEdit = !!formRow.id;
        return (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
              padding: "20px"
            }}
          >
            <div style={{ background: "var(--panel)", borderRadius: "10px", padding: "24px", minWidth: "500px", maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{isEdit ? `Edit ${schema.title}` : `Add ${schema.title}`}</h2>
                <button className="button button-secondary" onClick={() => setFormRow(null)} type="button">
                  <RotateCcw size={16} /> Close
                </button>
              </div>
              <div className="subdivision-form-card" style={{ boxShadow: "none", padding: 0 }}>
                {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
                {schema.fields.map((f: MasterField) => {
                  const opts = optionsFor(f);
                  const commonStyle: CSSProperties = {
                    width: "100%", padding: "8px 12px", borderRadius: "6px",
                    border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)"
                  };
                  return (
                    <label className="field" key={f.key} style={{ display: "block", marginBottom: "12px" }}>
                      <span style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>
                        {schema.keyFields.includes(f.key) ? "* " : ""}
                        {f.label}
                      </span>
                      {f.computed ? (
                        <input
                          type="text" value={computedValueFor(f, formRow)} readOnly
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
                      ) : f.type === "date" ? (
                        <CustomDatePicker
                          value={(formRow[f.key] as string) || ""}
                          onChange={(val) => setFormRow({ ...formRow, [f.key]: val })}
                        />
                      ) : (
                        <input
                          type={f.type === "number" ? "number" : "text"}
                          value={(formRow[f.key] as string | number | undefined) ?? ""}
                          onChange={(e) => setFormRow({ ...formRow, [f.key]: e.target.value })}
                          style={commonStyle}
                        />
                      )}
                    </label>
                  );
                })}
                <button className="button" style={{ marginTop: "16px", width: "100%" }} onClick={saveForm} type="button" disabled={saving}>
                  <Check size={16} /> {saving ? "Saving..." : isEdit ? "Save Changes" : `Add ${schema.title}`}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      <section className="subdivision-console">
        <div className="subdivision-head">
          <div>
            <p className="subdivision-eyebrow">Master Setup</p>
            <h2>{schema.title}</h2>
            <p>{schema.fields.length} fields, matching the Technical Report exactly.</p>
          </div>
          <div className="subdivision-actions">
            <button className="button" onClick={openAddForm} type="button">
              Add {schema.title}
            </button>
          </div>
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
        <div className="subdivision-stats" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <article>
            <span>Total Records</span>
            <strong>{rows.length}</strong>
          </article>
          <button 
            className="button" 
            onClick={exportToCSV} 
            type="button" 
            style={{ padding: "8px 16px", backgroundColor: "white", color: "var(--brand)", border: "1px solid var(--brand)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Download size={16} /> Export CSV
          </button>
          {masterKey === "stockistMaster" && (
            <button 
              className="button" 
              onClick={() => setIsSuperStockist(!isSuperStockist)} 
              type="button" 
              style={{ padding: "8px 16px", backgroundColor: isSuperStockist ? "var(--brand)" : "white", color: isSuperStockist ? "white" : "var(--brand)", border: "1px solid var(--brand)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              {isSuperStockist ? "Stockist" : "Super Stockist"}
            </button>
          )}
          {masterKey === "doctorMaster" && (
            <Link className="card module-card" href="/admin/workspace/division-dashboard/division-navigation-tabs/division-master/doctor/chemist" style={{ borderLeft: "4px solid var(--brand-strong)", width: "300px", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 16px" }}>
              <h3 className="section-title">Chemist</h3>
            </Link>
          )}
          {masterKey === "doctorAdditionalInfo" && (
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="button"
              style={{ padding: "8px 16px", backgroundColor: "var(--brand)", color: "white", border: "1px solid var(--brand)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", textDecoration: "none" }}
            >
              Map
            </a>
          )}
          {masterKey === "expenseReports" && (
            <button 
              className="button" 
              onClick={() => setIsReportingStructure(!isReportingStructure)} 
              type="button" 
              style={{ padding: "8px 16px", backgroundColor: isReportingStructure ? "var(--brand)" : "white", color: isReportingStructure ? "white" : "var(--brand)", border: "1px solid var(--brand)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              {isReportingStructure ? "Reports" : "Reporting Structure"}
            </button>
          )}
        </div>
        <div className="subdivision-table-card" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 250px)" }}>
          <table className="subdivision-table">
            <thead>
              <tr>
                {schema.fields.map((f) => {
                  const isFiltered = ["hq code", "headquarters name", "metro / non-metro", "zone", "patch name", "zone name", "region name", "division name", "division short name", "therapy name", "molecule name", "therapy", "brand name", "division", "product name", "brand", "product", "batch no", "gender", "department", "designation", "region", "hq", "patch", "qualification", "specialty", "area", "city", "state", "country", "doctor category", "potential", "visit frequency", "bank"].includes(f.label.toLowerCase());
                  let options: {label: string, value: string}[] = [];
                  if (isFiltered) {
                    const uniqueValues = Array.from(new Set(rows.map(r => String((r as any)[f.key] || "")))).filter(Boolean).sort();
                    options = uniqueValues.map(v => ({ label: v, value: v }));
                  }
                  
                  return (
                    <th key={f.key}>
                      {f.key.toLowerCase() === "status" || f.label.toLowerCase() === "status" ? (
                        <div style={{ minWidth: "140px" }}>
                          <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
                        </div>
                      ) : isFiltered ? (
                        <div style={{ minWidth: "140px" }}>
                          <ColumnFilterDropdown 
                            title={f.label} 
                            value={columnFilters[f.key] || "All"} 
                            options={options} 
                            onChange={(val) => setColumnFilters(prev => ({ ...prev, [f.key]: val }))} 
                          />
                        </div>
                      ) : (
                        f.label
                      )}
                    </th>
                  );
                })}
                {!isReadonly && <th>Edit</th>}
                {!isReadonly && <th>Inactive</th>}
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
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  {schema.fields.map((f) => (
                    <td key={f.key}>{f.computed ? computedValueFor(f, row) : String(row[f.key] ?? "")}</td>
                  ))}
                  {!isReadonly && (
                    <td>
                      <button className="subdivision-icon-button" onClick={() => openEditForm(row)} type="button" title="Edit">
                        <Pencil size={15} />
                      </button>
                    </td>
                  )}
                  {!isReadonly && (
                    <td>
                      <button className="subdivision-danger-button" onClick={() => setDeleteTarget(row)} type="button" title="Deactivate">
                        <Ban />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
