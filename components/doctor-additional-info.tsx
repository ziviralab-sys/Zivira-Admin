"use client";

import { Check, Pencil, Plus, RotateCcw, SlidersHorizontal, Trash2, Ban, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";

type AdditionalInfoRow = {
  id: string;
  doctorName: string;
  dob: string;
  anniversaryDate: string;
  remarks: string;
  // New request item 1 — "must be having the new text tab name as
  // Address. while entering the address it must be locate to the exact
  // location using the map and capture the pic of the map." `address` is
  // what the user types; `latitude`/`longitude` are auto-filled by
  // geocoding that address (free, no API key — OpenStreetMap's Nominatim
  // service); `mapImage` is a captured picture of that map location,
  // stored as a data URL (free, no API key — a static-map render of the
  // same OpenStreetMap data, fetched once and embedded so it keeps
  // working even if the map service is ever unreachable later).
  address: string;
  latitude: string;
  longitude: string;
  mapImage: string;
};

const initialInfos: AdditionalInfoRow[] = [];

// Free, keyless geocoding — turns the typed address into a lat/lon via
// OpenStreetMap's public Nominatim search endpoint.
async function geocodeAddress(address: string): Promise<{ lat: string; lon: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;
  const results = await res.json();
  if (!Array.isArray(results) || results.length === 0) return null;
  return { lat: results[0].lat, lon: results[0].lon };
}

// Free, keyless static-map picture — renders a pin at the geocoded
// location using the community staticmap.openstreetmap.de service (no
// API key), then re-encodes it as a data URL so the captured picture is
// self-contained (saved with the record, not just a link that could
// later 404 or change).
async function captureMapImage(lat: string, lon: string): Promise<string | null> {
  const url = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=16&size=600x360&markers=${lat},${lon},red-pushpin`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function InfoForm({ row, onSave, onBack }: { row: any; onSave: (r: AdditionalInfoRow) => void; onBack: () => void }) {
  const [form, setForm] = useState<AdditionalInfoRow>({
    id: row.id ?? "",
    doctorName: row.doctorName ?? "",
    dob: row.dob ?? "",
    anniversaryDate: row.anniversaryDate ?? "",
    remarks: row.remarks ?? "",
    address: row.address ?? "",
    latitude: row.latitude ?? "",
    longitude: row.longitude ?? "",
    mapImage: row.mapImage ?? ""
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState("");

  async function handleLocate() {
    if (!form.address.trim()) {
      setLocateError("Enter an address first.");
      return;
    }
    setIsLocating(true);
    setLocateError("");
    try {
      const geo = await geocodeAddress(form.address.trim());
      if (!geo) {
        setLocateError("Could not find that address on the map. Try adding more detail (city, state).");
        return;
      }
      const image = await captureMapImage(geo.lat, geo.lon);
      setForm((f) => ({ ...f, latitude: geo.lat, longitude: geo.lon, mapImage: image ?? f.mapImage }));
      if (!image) setLocateError("Location found, but capturing the map picture failed — you can retry.");
    } catch {
      setLocateError("Could not reach the map service. Check your connection and retry.");
    } finally {
      setIsLocating(false);
    }
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>{row.id ? "Edit Additional Information" : "Add Additional Information"}</h2>
          <p>Maintain personal event logs and statuses for doctors.</p>
        </div>
        <button className="button button-secondary" onClick={onBack} type="button"><RotateCcw size={16} /> Back</button>
      </div>
      <div className="subdivision-form-card">
        <label className="field">
          <span>* Doctor Name</span>
          <input value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} placeholder="Dr. Rajesh Kumar" />
        </label>
        <label className="field">
          <span>Date of Birth</span>
          <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>Anniversary Date</span>
          <input type="date" value={form.anniversaryDate} onChange={e => setForm({ ...form, anniversaryDate: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", outline: "none", fontSize: "14px", background: "var(--panel)" }} />
        </label>
        <label className="field">
          <span>Remarks</span>
          <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Enter remarks" />
        </label>
        <label className="field">
          <span>Address</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. 12 Anna Salai, Chennai, Tamil Nadu"
              style={{ flex: 1 }}
            />
            <button
              className="button button-secondary"
              type="button"
              onClick={handleLocate}
              disabled={isLocating || !form.address.trim()}
              style={{ whiteSpace: "nowrap" }}
            >
              {isLocating ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <MapPin size={16} />}
              {isLocating ? "Locating..." : "Locate on Map"}
            </button>
          </div>
          {locateError && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{locateError}</p>}
        </label>
        {form.mapImage && (
          <label className="field">
            <span>Captured Map</span>
            <img
              src={form.mapImage}
              alt={`Map location for ${form.address}`}
              style={{ width: "100%", maxWidth: "420px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
            />
          </label>
        )}
        <label className="field">
          <span>Latitude</span>
          <input value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="e.g. 13.0827 (auto-filled from address)" />
        </label>
        <label className="field">
          <span>Longitude</span>
          <input value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="e.g. 80.2707 (auto-filled from address)" />
        </label>
        <button className="button" style={{ marginTop: "12px" }} onClick={() => onSave(form)} type="button" disabled={!form.doctorName.trim()}>
          <Check size={16} /> Add Information
        </button>
      </div>
    </section>
  );
}

export function DoctorAdditionalInfo() {
  const [infos, setInfos] = useState<AdditionalInfoRow[]>(initialInfos);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<AdditionalInfoRow | null>(null);

  const filtered = infos.filter(
    (i) =>
      i.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      i.remarks.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(form: AdditionalInfoRow) {
    if (view === "add") {
      const newInfo = {
        ...form,
        id: `ADD${String(infos.length + 1).padStart(3, "0")}`
      };
      setInfos([...infos, newInfo]);
    } else {
      setInfos(infos.map(i => i.id === form.id ? { ...form } : i));
    }
    setView("list");
  }

  function handleDeactivate(id: string) {
    setInfos(infos.filter(i => i.id !== id));
  }

  if (view === "add") return <InfoForm row={{}} onSave={handleSave} onBack={() => setView("list")} />;
  if (view === "edit" && editTarget) return <InfoForm row={editTarget} onSave={handleSave} onBack={() => setView("list")} />;

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Additional Information</h2>
          <p>Create and manage doctor personal detail milestones.</p>
        </div>
        <div className="subdivision-actions">
          
          <button className="button" onClick={() => setView("add")} type="button"><Plus size={16} /> Add Information</button>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search by doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "360px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "14px",
            outline: "none"
          }}
        />
      </div>

      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>DOB</th>
              <th>Anniversary Date</th>
              <th>Remarks</th>
              <th>Address</th>
              <th>Map</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                 <td><strong style={{ color: "var(--ink)" }}>{row.doctorName}</strong></td>
                 <td>{formatDate(row.dob)}</td>
                 <td>{formatDate(row.anniversaryDate)}</td>
                 <td>{row.remarks}</td>
                 <td>{row.address}</td>
                 <td>
                   {row.mapImage ? (
                     <img src={row.mapImage} alt={`Map for ${row.doctorName}`} style={{ width: "72px", height: "48px", objectFit: "cover", borderRadius: "4px", border: "1px solid #e5e7eb" }} />
                   ) : (
                     <span style={{ color: "var(--muted)" }}>—</span>
                   )}
                 </td>
                 <td>{row.latitude}</td>
                 <td>{row.longitude}</td>
                <td>
                  <button className="subdivision-icon-button" onClick={() => { setEditTarget(row); setView("edit"); }} type="button">
                    <Pencil size={15} />
                  </button>
                </td>
                <td>
                  <button className="subdivision-danger-button" onClick={() => handleDeactivate(row.id)} type="button">
                    <Ban />
                  </button>
                </td>
              </tr>
            ))}
             {filtered.length === 0 && (
               <tr>
                 <td colSpan={10} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                   No records found
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
