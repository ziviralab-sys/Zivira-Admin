"use client";

import { Plus, Pencil, Ban, Download, X, AlertTriangle, FileText, Sheet } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { apiClient, type MasterField, type MasterRecord, type MasterSchema } from "@/lib/api-client";
import Link from "next/link";
import { ColumnFilterDropdown } from "@/components/column-filter-dropdown";
import { StatusFilterDropdown } from "@/components/status-filter-dropdown";
import { CustomDatePicker } from "@/components/custom-date-picker";
import { CustomSelect } from "@/components/custom-select";

// A small set of readable prefixes for the masters whose code field doesn't
// otherwise give us a clean hint (falls back to initials of the label).
const CODE_PREFIX_HINTS: Record<string, string> = {
  divisionCode: "DIV",
  regionCode: "REG",
  hqCode: "HQ",
  therapyCode: "THR",
  moleculeCode: "MOL",
  brandCode: "BR",
  productCode: "PRD",
  doctorCode: "DOC",
  inputCode: "INP",
  patchCode: "PAT",
  stockistCode: "STK",
  campCode: "CAMP",
  employeeCode: "EMP"
};

function fallbackPrefixFor(field: MasterField): string {
  if (CODE_PREFIX_HINTS[field.key]) return CODE_PREFIX_HINTS[field.key];
  const letters = field.label.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((w) => w[0]);
  const joined = letters.join("").toUpperCase();
  return joined.slice(0, 4) || "REC";
}

// Generates the next sequential code for a master's single identifying code
// field (e.g. Doctor Code, Division Code) so the Add form opens with a ready
// value instead of an empty box the user has to guess a non-colliding code
// for. Looks at the highest numeric suffix already in use for whatever
// alpha/prefix pattern is most common among existing rows, and increments it,
// padding to match the width already in use (defaulting to 4 digits).
function computeNextCode(field: MasterField, rows: MasterRecord[]): string {
  const pattern = /^(.*?)(\d+)$/;
  const counts: Record<string, number> = {};
  let bestPrefix = "";
  let bestPadWidth = 4;
  let maxForBestPrefix = 0;
  const maxByPrefix: Record<string, number> = {};
  const padByPrefix: Record<string, number> = {};

  for (const row of rows) {
    const raw = row[field.key];
    if (typeof raw !== "string" || !raw.trim()) continue;
    const match = raw.trim().match(pattern);
    if (!match) continue;
    const prefix = match[1];
    const digits = match[2];
    const num = parseInt(digits, 10);
    counts[prefix] = (counts[prefix] ?? 0) + 1;
    if (num > (maxByPrefix[prefix] ?? 0)) {
      maxByPrefix[prefix] = num;
      padByPrefix[prefix] = digits.length;
    }
  }

  for (const [prefix, count] of Object.entries(counts)) {
    if (count > (counts[bestPrefix] ?? 0) || bestPrefix === "") {
      bestPrefix = prefix;
    }
  }

  if (bestPrefix) {
    maxForBestPrefix = maxByPrefix[bestPrefix] ?? 0;
    bestPadWidth = padByPrefix[bestPrefix] ?? 4;
  } else {
    bestPrefix = `${fallbackPrefixFor(field)}-`;
  }

  const next = maxForBestPrefix + 1;
  return `${bestPrefix}${String(next).padStart(bestPadWidth, "0")}`;
}

// The Doctor — Additional Info map preview used to fetch a picture from a
// third-party static-map service (staticmap.openstreetmap.de). That's an
// external network call on every render — when it was slow, rate-limited,
// or simply unreachable, the onError handler hid the <img>, so the box
// looked like it "disappeared" after a while even though the location was
// still saved. This draws the location "picture" locally as an inline SVG
// data URI instead — a pin + the captured coordinates — so the box always
// renders instantly and never depends on an outside service being up.
function locationPreviewDataUri(lat: unknown, lon: unknown): string {
  const latNum = Number(lat);
  const lonNum = Number(lon);
  const latText = Number.isFinite(latNum) ? latNum.toFixed(5) : String(lat ?? "");
  const lonText = Number.isFinite(lonNum) ? lonNum.toFixed(5) : String(lon ?? "");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">` +
    `<rect width="320" height="180" fill="#fdf0e4"/>` +
    `<g stroke="#f2d3b6" stroke-width="1">` +
    `<line x1="0" y1="45" x2="320" y2="45"/><line x1="0" y1="90" x2="320" y2="90"/><line x1="0" y1="135" x2="320" y2="135"/>` +
    `<line x1="80" y1="0" x2="80" y2="180"/><line x1="160" y1="0" x2="160" y2="180"/><line x1="240" y1="0" x2="240" y2="180"/>` +
    `</g>` +
    `<path d="M160 62c-16 0-29 13-29 29 0 22 29 51 29 51s29-29 29-51c0-16-13-29-29-29z" fill="#ea580c"/>` +
    `<circle cx="160" cy="91" r="10" fill="#fff7ed"/>` +
    `<text x="160" y="158" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#7c2d12">${latText}, ${lonText}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

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
  // The Export button opens a small menu offering Excel / PDF / CSV instead
  // of downloading a single fixed format.
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Cache of live dropdown options fetched from other masters, keyed by
  // "sourceMaster.sourceField" so multiple fields sharing a source only fetch once.
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, string[]>>({});
  // Full records per source master (not just distinct values), used to look up
  // a computed field's display value (e.g. Doctor Name from a chosen Doctor Code).
  const [sourceRecords, setSourceRecords] = useState<Record<string, MasterRecord[]>>({});
  // Doctor — Additional Info's Add/Edit form replaces the raw Latitude /
  // Longitude number inputs with a single clickable "Map" box: clicking it
  // asks the browser to capture the device's current GPS location (instead
  // of typing coordinates by hand) and stores lat/lng straight onto the
  // form row, same as before — only how they're captured changed.
  const [capturingLocation, setCapturingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // "Reporting Structure" is a toggle on the same screen as Manager Expense
  // — Reports, but it's backed by a genuinely different table (division's
  // BH/ZBM/RBM/ABM/BE chain, not a monthly budget) — it has its own
  // registry key so its keyFields/required-field checks match what this
  // view's form actually shows, instead of failing "Missing Monthly, Team"
  // on every save because the reporting-structure form never has those.
  //
  // "doctorStockistCombined" (the Doctor -> Stockist Master screen) isn't a
  // real backend collection at all — it's a client-side merge of
  // stockistMaster plus 4 other Stockist sub-tabs' schemas, so every save
  // through it 404'd with "Unknown master". The fields it actually owns
  // belong to stockistMaster; everything else is wired as a computed
  // lookup below, so route real saves to stockistMaster.
  const effectiveMasterKey =
    masterKey === "expenseReports" && isReportingStructure
      ? "reportingStructure"
      : masterKey === "doctorStockistCombined"
      ? "stockistMaster"
      : masterKey;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      let schemaData: MasterSchema;
      let rowsData: MasterRecord[] = [];

      if (masterKey === "doctorStockistCombined") {
        const [smRes, addrRes, contRes, hqRes, licRes, smRecords, addrRecords, contRecords, hqRecords, licRecords] = await Promise.all([
          apiClient.masterSchema("stockistMaster"),
          apiClient.masterSchema("stockistAddress"),
          apiClient.masterSchema("stockistContact"),
          apiClient.masterSchema("stockistHeadquarters"),
          apiClient.masterSchema("stockistLicenseDetails"),
          apiClient.masterRecords("stockistMaster"),
          apiClient.masterRecords("stockistAddress"),
          apiClient.masterRecords("stockistContact"),
          apiClient.masterRecords("stockistHeadquarters"),
          apiClient.masterRecords("stockistLicenseDetails")
        ]);

        // Only stockistMaster's own fields actually live on the
        // stockistMaster collection. Every other sub-tab — Address/
        // Contact/Headquarters/License — is a SEPARATE collection keyed by
        // the same stockistCode. Rather than leave those as per-cell
        // "computed" lookups (fragile — one stale sourceRecords fetch and
        // every one of those columns goes blank, which is what this screen
        // was reported showing), the records are joined into flat row
        // objects here, once, up front — the same stockistCode key both
        // collections already share.
        const seenKeys = new Set<string>();
        const uniqueFields: any[] = [];
        for (const f of smRes.data.fields) {
          if (f.key === "status" || seenKeys.has(f.key)) continue;
          seenKeys.add(f.key);
          uniqueFields.push(f);
        }
        const subMasterFieldLists: MasterField[][] = [addrRes.data.fields, contRes.data.fields, hqRes.data.fields, licRes.data.fields];
        for (const fields of subMasterFieldLists) {
          for (const f of fields) {
            if (f.key === "status" || f.key === "stockistCode" || seenKeys.has(f.key)) continue;
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

        const byCode = <T extends MasterRecord>(records: T[]) => {
          const map = new Map<string, T>();
          for (const r of records) if (typeof r.stockistCode === "string") map.set(r.stockistCode, r);
          return map;
        };
        const addrByCode = byCode(addrRecords.data);
        const contByCode = byCode(contRecords.data);
        const hqByCode = byCode(hqRecords.data);
        const licByCode = byCode(licRecords.data);
        rowsData = smRecords.data.map((row) => ({
          ...(addrByCode.get(String(row.stockistCode)) ?? {}),
          ...(contByCode.get(String(row.stockistCode)) ?? {}),
          ...(hqByCode.get(String(row.stockistCode)) ?? {}),
          ...(licByCode.get(String(row.stockistCode)) ?? {}),
          ...row // stockistMaster's own fields always win over any sub-tab field with the same key
        }));
      } else {
        const [schemaRes, recordsRes] = await Promise.all([
          apiClient.masterSchema(effectiveMasterKey),
          apiClient.masterRecords(effectiveMasterKey)
        ]);
        schemaData = schemaRes.data;
        rowsData = recordsRes.data;
      }

      if (schemaData && schemaData.fields) {
        schemaData.fields = schemaData.fields.map(f => {
          if (f.label === "Doctor Name") return { ...f, label: "Customer Name" };
          if (f.label === "Doctor Category (A/B/C)") return { ...f, label: "Doctor Category" };
          // Relabel only — Doctor Classification's status-like field is
          // stored under the key "active" (registry + seed data both use
          // it). Renaming the *key* too, as this used to, displayed
          // "Status" as the header but then tried to read row.status,
          // which doesn't exist on these documents — every row showed
          // blank. The status-ensure block further down already treats any
          // field labeled "Status" as the master's status column
          // regardless of its key, so the key never needed to change.
          if (f.label.toUpperCase() === "ACTIVE") return { ...f, label: "Status" };
          return f;
        });

        if (masterKey === "doctorAdditionalInfo") {
          // The client asked for the separate Latitude / Longitude columns to
          // be replaced by a single "Map" column: if a doctor's location was
          // sent, show the map picture right in the tab instead of two raw
          // coordinate numbers. Latitude/Longitude stay real, editable form
          // fields (so a location can still be captured) — they're just
          // hidden from the table view in favor of the map preview.
          schemaData.fields = schemaData.fields.map((f: any) =>
            f.key === "latitude" || f.key === "longitude" ? { ...f, hideInTable: true } : f
          );
          const statusIdxForMap = schemaData.fields.findIndex((f: any) => f.key === "status" || f.label.toUpperCase() === "STATUS");
          const mapField = { key: "mapPreview", label: "Map", type: "map", tableOnly: true } as any;
          if (statusIdxForMap === -1) {
            schemaData.fields.push(mapField);
          } else {
            schemaData.fields.splice(statusIdxForMap, 0, mapField);
          }
        }

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
              const newFields: MasterField[] = [
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
        }

        // Globally ensure ALL masters have a Status column AT THE VERY END.
        // The fallback used to have no `options`, which rendered as a plain
        // text box instead of an Active/Inactive dropdown for every master
        // whose registry entry didn't already define its own status field —
        // defaulting it here means every tab's status is always selectable.
        const statusIdx = schemaData.fields.findIndex((f: any) => f.key === "status" || f.label.toUpperCase() === "STATUS");
        let statusField: MasterField = { key: "status", label: "Status", type: "string", options: ["Active", "Inactive"] };
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
    "doctorStockistCombined", // read-only join across 5 Stockist collections — no single backing collection to save an edit into
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
        // The status-like field isn't always literally keyed "status" (e.g.
        // Doctor Classification stores it under "active") — resolve the
        // real key from the schema instead of assuming.
        const statusKey = schema?.fields.find((f) => f.label.toUpperCase() === "STATUS")?.key ?? "status";
        const rowStatus = String((row as any)[statusKey] || "").toUpperCase();
        if (rowStatus !== statusFilter.toUpperCase()) isMatch = false;
      }
      return isMatch;
    });
  }, [rows, columnFilters, statusFilter, schema]);

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

  // Columns actually shown in the on-screen table (e.g. Doctor Additional
  // Info hides raw Latitude/Longitude here in favor of the Map column).
  const tableFields = schema.fields.filter((f: any) => !f.hideInTable);
  // Columns included in CSV/Excel/PDF exports — the reverse of tableFields:
  // real data (like the hidden Latitude/Longitude) is still exported, only
  // synthetic display-only columns (like the Map picture) are dropped since
  // they don't have a meaningful flat-file representation.
  const exportFields = schema.fields.filter((f: any) => !(f as any).tableOnly);

  // The single field that uniquely identifies a record is auto-code-eligible
  // when it's the master's only key field, isn't a dropdown/sourced value,
  // and looks like a "code" (its key ends in "Code" or it's the only key
  // field on a master with a single identifying column).
  function autoCodeField(): MasterField | null {
    if (!schema || schema.keyFields.length !== 1) return null;
    const key = schema.keyFields[0];
    const field = schema.fields.find((f) => f.key === key);
    if (!field || field.sourceMaster || field.options) return null;
    // Only auto-fill fields that actually look like a code (e.g. "Division
    // Code", "brandCode") — a single free-text key field like Allowance
    // Fixation's "Location" or Expense Category's "Category" isn't a code,
    // and auto-filling it with a made-up "L-0001"-style value only produced
    // nonsense the user then had to notice and clear before typing the real
    // location/category name.
    const looksLikeCode = /code/i.test(field.key) || /code/i.test(field.label);
    if (!looksLikeCode) return null;
    return field;
  }

  // Some masters' Active/Inactive field isn't literally keyed "status" —
  // Doctor Classification's is keyed "active" — so the default-to-"Active"
  // logic below has to recognize it by shape (a 2-option Active/Inactive
  // dropdown), not just by key name. Without this, opening Add left the
  // field blank instead of pre-selected, and it's easy to submit without
  // ever noticing there was a status field to fill in.
  function isActiveInactiveField(f: MasterField): boolean {
    // A field's own declared options are the source of truth when present —
    // some masters key their status column "status" but give it a totally
    // different fixed choice list (Manager Expense - Travel Approval and
    // Expense Approval use ["Approved","Pending","Rejected"], not
    // Active/Inactive). Defaulting those to "Active" on Add made every save
    // fail with "Status must be one of: Approved, Pending, Rejected" since
    // "Active" was never a legal value for that field. Only fall back to the
    // key-name heuristic for a synthetic status column with no options at
    // all (e.g. Doctor - Dealer Mapping's client-appended Active/Inactive).
    if (f.options && f.options.length) {
      return f.options.length === 2 && f.options.includes("Active") && f.options.includes("Inactive");
    }
    return f.key === "status" || f.key === "active";
  }

  // Renders Active/Inactive values as a colored pill (green/red) instead of
  // plain text, matching the styling already used in the dedicated master
  // components (hospital-master.tsx, chemist-master.tsx, employee-manager.tsx).
  function renderCellValue(f: MasterField, row: MasterRecord) {
    if ((f as any).type === "map") {
      const lat = (row as any).latitude;
      const lon = (row as any).longitude;
      const hasLocation = lat !== undefined && lat !== null && String(lat).trim() !== "" &&
        lon !== undefined && lon !== null && String(lon).trim() !== "";
      if (!hasLocation) {
        return <span style={{ color: "var(--muted)", fontSize: "12px" }}>No location sent</span>;
      }
      const mapImgSrc = locationPreviewDataUri(lat, lon);
      const mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
      return (
        <a href={mapLink} target="_blank" rel="noopener noreferrer" title="Open this exact location in a map" style={{ display: "inline-block", lineHeight: 0 }}>
          <img
            src={mapImgSrc}
            alt="Captured location"
            width={110}
            height={70}
            style={{ borderRadius: "6px", border: "1px solid var(--line)", objectFit: "cover" }}
          />
        </a>
      );
    }
    const raw = f.computed ? computedValueFor(f, row) : row[f.key];
    if (isActiveInactiveField(f)) {
      // Masters whose registry entry doesn't declare its own status field
      // (e.g. Doctor — Dealer Mapping) get a synthetic Active/Inactive
      // column appended above, but older records saved before that column
      // existed have no `status` key at all — row[f.key] is undefined, so
      // this rendered a blank cell instead of a pill. New rows already
      // default to "Active" on save (see openAddForm); treat a genuinely
      // unset value the same way here so every row shows a real status
      // instead of nothing.
      const text = String(raw ?? "").trim() || "Active";
      const isActive = text.toUpperCase() === "ACTIVE";
      const isInactive = text.toUpperCase() === "INACTIVE";
      if (isActive || isInactive) {
        const color = isActive ? "#10b981" : "#ef4444";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              background: `${color}15`,
              color,
              border: `1px solid ${color}25`,
              textTransform: "capitalize"
            }}
          >
            {text}
          </span>
        );
      }
    }
    return String(raw ?? "");
  }

  // Asks the browser for the device's current GPS position and writes it
  // straight onto the open form row's latitude/longitude — this is what the
  // Doctor — Additional Info form's Map box calls when clicked, replacing
  // manual Latitude/Longitude typing with a single "capture my location" tap.
  function captureLocation() {
    if (!formRow) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationError("Location capture isn't supported in this browser.");
      return;
    }
    setLocationError(null);
    setCapturingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormRow((prev) =>
          prev
            ? {
                ...prev,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            : prev
        );
        setCapturingLocation(false);
      },
      (geoError) => {
        setLocationError(
          geoError.code === geoError.PERMISSION_DENIED
            ? "Location permission was denied. Allow location access and try again."
            : "Couldn't capture the current location. Please try again."
        );
        setCapturingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function openAddForm() {
    const codeField = autoCodeField();
    // Recompute against a fresh fetch rather than whatever `rows` happened
    // to hold from the last full page load — if the screen has been open a
    // while, or another add landed in between, the in-memory list can be
    // stale and suggest a code that's already taken, which is what made
    // "Add" fail immediately on the very first try for several tabs.
    let freshRows = rows;
    if (codeField) {
      try {
        const fresh = await apiClient.masterRecords(effectiveMasterKey);
        freshRows = fresh.data;
        setRows(fresh.data);
      } catch {
        // Non-fatal — fall back to the already-loaded rows.
      }
    }
    const blank: Record<string, unknown> = {};
    for (const f of schema!.fields) {
      if (isActiveInactiveField(f)) {
        blank[f.key] = "Active";
      } else if (codeField && f.key === codeField.key) {
        blank[f.key] = computeNextCode(codeField, freshRows);
      } else {
        blank[f.key] = "";
      }
    }
    setLocationError(null);
    setFormRow(blank);
  }

  function openEditForm(row: MasterRecord) {
    setLocationError(null);
    const next: Record<string, unknown> = { ...row };
    // Same "no status ever saved on this old record" gap as the table
    // display — default it to Active here too so Edit opens with a real
    // selection instead of a blank dropdown.
    for (const f of schema?.fields ?? []) {
      if (isActiveInactiveField(f) && !String(next[f.key] ?? "").trim()) {
        next[f.key] = "Active";
      }
    }
    setFormRow(next);
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
        await apiClient.updateMasterRecord(effectiveMasterKey, String(formRow.id), payload);
      } else {
        const codeField = autoCodeField();
        const originalCode = codeField ? payload[codeField.key] : undefined;
        let lastErr: unknown = null;
        // The auto-suggested code can go stale if the list we computed it
        // from wasn't the latest (another save landed in between, two tabs
        // open, months of prior test data piled up, etc). Rather than
        // surface a scary "already exists" error for something the user
        // didn't even type in themselves, re-fetch and retry with a bumped
        // code. Each retry checks the *actual* set of taken codes from the
        // fresh fetch and keeps bumping until it lands on one that isn't in
        // that set, instead of trusting a single recomputation — a set that
        // has accumulated many stale/duplicate codes over repeated testing
        // can otherwise make computeNextCode land on an already-taken value
        // more than once in a row and exhaust a small retry budget.
        for (let attempt = 0; attempt < 20; attempt++) {
          try {
            await apiClient.createMasterRecord(effectiveMasterKey, payload);
            lastErr = null;
            break;
          } catch (err) {
            lastErr = err;
            const isCodeConflict = err instanceof Error && /already exists/i.test(err.message);
            const codeIsAutoFilled = codeField && payload[codeField.key] === originalCode || (codeField && attempt > 0);
            if (!isCodeConflict || !codeField || !codeIsAutoFilled) break;
            const fresh = await apiClient.masterRecords(effectiveMasterKey);
            const takenCodes = new Set(
              fresh.data
                .map((r) => r[codeField.key])
                .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
            );
            let retryCode = computeNextCode(codeField, fresh.data);
            // Keep bumping the trailing number until it's a code we know
            // for certain isn't already taken, rather than trusting a
            // single recomputation to have jumped far enough ahead.
            let guard = 0;
            while (takenCodes.has(retryCode) && guard < 200) {
              const match = String(retryCode).match(/^(.*?)(\d+)$/);
              if (!match) break;
              retryCode = `${match[1]}${String(parseInt(match[2], 10) + 1).padStart(match[2].length, "0")}`;
              guard++;
            }
            payload[codeField.key] = retryCode;
          }
        }
        if (lastErr) throw lastErr;
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
      await apiClient.deactivateMasterRecord(effectiveMasterKey, deleteTarget.id);
      await load();
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate record");
    } finally {
      setSaving(false);
    }
  }

  // Shared helper: builds the plain header/row string matrix used by all
  // three export formats, so Excel/PDF/CSV never drift out of sync with
  // each other or with what's actually on screen.
  function buildExportMatrix(): { headers: string[]; rows: string[][] } {
    const fields = schema!.fields.filter((f: any) => !(f as any).tableOnly);
    const headers = fields.map((f) => f.label);
    const dataRows = filteredRows.map((row) =>
      fields.map((f) => {
        let val = f.computed ? computedValueFor(f, row) : (row as any)[f.key];
        if (val === undefined || val === null) val = "";
        return String(val);
      })
    );
    return { headers, rows: dataRows };
  }

  // Excel column widths are sized from the actual longest value in each
  // column (header included) rather than a fixed guess, so a short "Status"
  // column stays narrow while a long "Description" column doesn't clip —
  // matches the export text to the exact data instead of hiding it behind a
  // fixed-width cell.
  async function exportToExcel() {
    if (!schema || rows.length === 0) return;
    const { headers, rows: dataRows } = buildExportMatrix();
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
    worksheet["!cols"] = headers.map((h, colIdx) => {
      const longest = dataRows.reduce((max, r) => Math.max(max, (r[colIdx] ?? "").length), h.length);
      // Clamp so one very long free-text cell can't blow the sheet out to an
      // unreadable width; Excel still wraps/truncates gracefully within a cell.
      return { wch: Math.min(Math.max(longest + 2, 10), 60) };
    });
    worksheet["!rows"] = [{ hpt: 20 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, (schema.title || masterKey).slice(0, 31));
    XLSX.writeFile(workbook, `${schema.title || masterKey}.xlsx`);
  }

  // PDF export: column widths are computed from content length too (not left
  // to autoTable's default even split), text wraps onto multiple lines
  // instead of being clipped, and the page switches to landscape + a smaller
  // font as column count grows so wide masters (many fields) still fit
  // on the page without any column's text spilling into its neighbor.
  async function exportToPDF() {
    if (!schema || rows.length === 0) return;
    const { headers, rows: dataRows } = buildExportMatrix();
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const isWide = headers.length > 6;
    const fontSize = headers.length > 12 ? 6.5 : headers.length > 8 ? 7.5 : 8.5;
    const doc = new jsPDF({ orientation: isWide ? "landscape" : "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 28;
    const usableWidth = pageWidth - margin * 2;

    // Proportional column widths from the longest value per column, then
    // scaled so the total exactly fills the usable page width — this is what
    // keeps every header aligned directly above its own data instead of
    // drifting once the table is narrower or wider than the page.
    const rawWidths = headers.map((h, colIdx) =>
      Math.max(h.length, ...dataRows.map((r) => (r[colIdx] ?? "").length), 3)
    );
    const totalRaw = rawWidths.reduce((a, b) => a + b, 0) || 1;
    const columnStyles: Record<number, { cellWidth: number }> = {};
    headers.forEach((_, colIdx) => {
      columnStyles[colIdx] = { cellWidth: (rawWidths[colIdx] / totalRaw) * usableWidth };
    });

    doc.setFontSize(13);
    doc.text(schema.title || masterKey, margin, 20);
    autoTable(doc, {
      head: [headers],
      body: dataRows,
      startY: 28,
      margin: { left: margin, right: margin },
      tableWidth: usableWidth,
      styles: { fontSize, cellPadding: 4, overflow: "linebreak", valign: "middle" },
      headStyles: { fillColor: [230, 81, 0], textColor: [255, 255, 255], fontStyle: "bold", halign: "left" },
      bodyStyles: { halign: "left" },
      columnStyles
    });
    doc.save(`${schema.title || masterKey}.pdf`);
  }

  return (
    <>
      {error && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70
          }}
        >
          <div style={{ background: "var(--panel)", borderRadius: "10px", padding: "24px", minWidth: "320px", maxWidth: "440px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={18} color="#ef4444" />
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#ef4444" }}>Something went wrong</h3>
              </div>
              <button className="subdivision-icon-button" onClick={() => setError(null)} type="button" title="Close" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--ink)" }}>{error}</p>
            <button className="button button-secondary" style={{ marginTop: "16px", width: "100%" }} onClick={() => setError(null)} type="button">
              Close
            </button>
          </div>
        </div>
      )}
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
                  Close
                </button>
              </div>
              <div className="subdivision-form-card" style={{ boxShadow: "none", padding: 0 }}>
                {schema.fields
                  .filter((f: any) => !f.tableOnly)
                  // Doctor — Additional Info: Longitude is captured together
                  // with Latitude by the single Map box below, so it doesn't
                  // get its own separate field row in the form.
                  .filter((f: any) => !(masterKey === "doctorAdditionalInfo" && f.key === "longitude"))
                  .map((f: MasterField) => {
                  let opts = optionsFor(f);
                  // Any master whose single key field is itself a lookup into
                  // another master (Doctor Code, Stockist Code, "Stockist"...)
                  // is a "one record per parent" tab — Doctor - Additional
                  // Info, Doctor - Classification, every Stockist - * sub-tab,
                  // etc. Their Add dropdown used to list every doctor/stockist
                  // from the parent master regardless of whether it already
                  // had a record here, so picking an already-used one always
                  // 409'd with "A record with this <field> already exists".
                  // Narrow the list, on Add only, to values that don't have a
                  // record yet; Edit keeps the row's own already-assigned
                  // value selectable (opts already includes it there).
                  if (
                    schema.keyFields.length === 1 &&
                    schema.keyFields[0] === f.key &&
                    f.sourceMaster &&
                    opts &&
                    !isEdit
                  ) {
                    const taken = new Set(rows.map((r) => String((r as any)[f.key])));
                    opts = opts.filter((code) => !taken.has(code));
                  }
                  const commonStyle: CSSProperties = {
                    width: "100%", padding: "8px 12px", borderRadius: "6px",
                    border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)"
                  };
                  if (masterKey === "doctorAdditionalInfo" && f.key === "latitude") {
                    const lat = formRow["latitude"];
                    const lon = formRow["longitude"];
                    const hasLocation = lat !== undefined && lat !== null && String(lat).trim() !== "" &&
                      lon !== undefined && lon !== null && String(lon).trim() !== "";
                    const mapImgSrc = hasLocation ? locationPreviewDataUri(lat, lon) : "";
                    return (
                      <label className="field" key="map-box" style={{ display: "block", marginBottom: "12px" }}>
                        <span style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 500 }}>
                          Map
                        </span>
                        <button
                          type="button"
                          onClick={captureLocation}
                          disabled={capturingLocation}
                          title={hasLocation ? "Click to re-capture the current location" : "Click to capture the current location"}
                          style={{
                            width: "100%", padding: 0, borderRadius: "8px",
                            border: "1px dashed var(--line)", background: "var(--panel)",
                            cursor: capturingLocation ? "wait" : "pointer", overflow: "hidden",
                            display: "block"
                          }}
                        >
                          {hasLocation ? (
                            <img
                              src={mapImgSrc}
                              alt="Captured location"
                              style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                            />
                          ) : (
                            <div style={{ height: "160px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", color: "var(--muted)", fontSize: "13px" }}>
                              <span>{capturingLocation ? "Capturing location…" : "Click to capture the current location"}</span>
                            </div>
                          )}
                        </button>
                        {locationError && (
                          <span style={{ display: "block", marginTop: "4px", fontSize: "12px", color: "#ef4444" }}>{locationError}</span>
                        )}
                      </label>
                    );
                  }
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
                        <CustomSelect
                          value={(formRow[f.key] as string | undefined) ?? ""}
                          options={opts}
                          onChange={(val) => setFormRow({ ...formRow, [f.key]: val })}
                          placeholder={`Select ${f.label}`}
                        />
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
                  {saving ? "Saving..." : isEdit ? "Save Changes" : `Add ${schema.title}`}
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
        <div className="subdivision-stats" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <article>
            <span>Total Records</span>
            <strong>{rows.length}</strong>
          </article>
          <div ref={exportMenuRef} style={{ position: "relative" }}>
            <button
              className="button"
              onClick={() => setExportMenuOpen((v) => !v)}
              type="button"
              style={{ padding: "8px 16px", backgroundColor: "white", color: "var(--brand)", border: "1px solid var(--brand)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Download size={16} /> Export
            </button>
            {exportMenuOpen && (
              <div
                style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 30,
                  background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "8px",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.18)", minWidth: "160px", overflow: "hidden"
                }}
              >
                <button type="button" onClick={() => { exportToExcel(); setExportMenuOpen(false); }} className="export-menu-option" style={exportMenuOptionStyle}>
                  <Sheet size={15} /> Excel
                </button>
                <button type="button" onClick={() => { exportToPDF(); setExportMenuOpen(false); }} className="export-menu-option" style={exportMenuOptionStyle}>
                  <FileText size={15} /> PDF
                </button>
              </div>
            )}
          </div>
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
        <div className="subdivision-table-card" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 250px)", minHeight: "220px" }}>
          <table className="subdivision-table">
            <thead>
              <tr>
                {tableFields.map((f) => {
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
                  <td colSpan={tableFields.length + 2} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={tableFields.length + 2} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                    No {schema.title.toLowerCase()} records found
                  </td>
                </tr>
              )}
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  {tableFields.map((f) => (
                    <td key={f.key}>{renderCellValue(f, row)}</td>
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
                        <Ban size={15} />
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
