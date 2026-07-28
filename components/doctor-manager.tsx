"use client";

import type { Doctor, Employee } from "@zivira/types";
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { StatusBadge } from "./page-components";

export function DoctorManager() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    category: "C" as Doctor["category"],
    state: "",
    city: "",
    territory: "",
    mappedEmployeeCode: "",
    status: "ACTIVE" as Doctor["status"]
  });

  const tabs = Array.from({ length: 24 }, (_, i) => `Tab ${i + 1}`);

  async function loadDoctors() {
    setError("");

    try {
      const [docRes, empRes] = await Promise.all([apiClient.doctors(), apiClient.employees()]);
      setDoctors(docRes.data);
      setEmployees(empRes.data.filter((e) => e.role === "MR" || e.role === "SR_MR"));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load doctors");
    }
  }

  async function createDoctor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await apiClient.createDoctor(form);
      setShowForm(false);
      setForm({ ...form, name: "", specialty: "", state: "", city: "", territory: "", mappedEmployeeCode: "" });
      await loadDoctors();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create doctor");
    }
  }

  useEffect(() => {
    void loadDoctors();
  }, []);

  return (
    <>
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "8px 0", marginBottom: "16px", borderBottom: "1px solid var(--border)", WebkitOverflowScrolling: "touch" }}>
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`button ${activeTab === idx + 1 ? "" : "button-secondary"}`}
            onClick={() => setActiveTab(idx + 1)}
            style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="toolbar">
        <button className="button button-secondary" onClick={loadDoctors} type="button">
          <RefreshCw size={17} />
          Refresh
        </button>
        <button className="button" onClick={() => setShowForm((value) => !value)} type="button">
          <Plus size={17} />
          Add doctor
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {showForm ? (
        <form className="card form-grid" onSubmit={createDoctor}>
          <div className="field"><label>Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Specialty</label><input required value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} /></div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Doctor["category"] })}>
              {["A", "B", "C", "D"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label>State</label><input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
          <div className="field"><label>City</label><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div className="field"><label>Territory</label><input required value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} /></div>
          <div className="field">
            <label>
              Assign MR
              <span style={{ marginLeft: 6, color: "var(--red)", fontSize: 11, fontWeight: 400 }}>
                — doctor won&apos;t appear in Field Force if unassigned
              </span>
            </label>
            <select value={form.mappedEmployeeCode} onChange={(e) => setForm({ ...form, mappedEmployeeCode: e.target.value })}>
              <option value="">— Leave unassigned —</option>
              {employees.map((emp) => (
                <option key={emp.employeeCode} value={emp.employeeCode}>
                  {emp.employeeCode} — {emp.name} ({emp.territory})
                </option>
              ))}
            </select>
          </div>
          <button className="button" type="submit">Create doctor</button>
        </form>
      ) : null}
      <div className="table-wrap" style={{ overflowX: "auto" }}>
        <table style={{ minWidth: "2200px" }}>
          <thead>
            <tr>
              <th>Doctor Code</th>
              <th>D.O.B</th>
              <th>Anniversary Date</th>
              <th>Patch name</th>
              <th>Customer Name</th>
              <th>Gender</th>
              <th>Speciality</th>
              <th>Category</th>
              <th>Registration no</th>
              <th>Marital status</th>
              <th>Qualification</th>
              <th>Address1</th>
              <th>Location</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Postal Code</th>
              <th>Clinic name</th>
              <th>phone</th>
              <th>email</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, i) => {
              const docCode = `DOC${String(i + 1).padStart(3, "0")}`;
              return (
                <tr key={doctor.id}>
                  <td>{docCode}</td>
                  <td>12 May</td>
                  <td>19 Oct</td>
                  <td>{doctor.territory || "KUKATPALLY"}</td>
                  <td><strong>{doctor.name}</strong></td>
                  <td>Male</td>
                  <td>{doctor.specialty || "CARDIOLOGY"}</td>
                  <td>{doctor.category || "A"}</td>
                  <td>REG123456</td>
                  <td>Married</td>
                  <td>MD, MBBS</td>
                  <td>8-3, 2ND FL</td>
                  <td>Metro Road</td>
                  <td>Hyderabad</td>
                  <td>Telangana</td>
                  <td>India</td>
                  <td>500072</td>
                  <td>Care Clinic</td>
                  <td>9876543210</td>
                  <td>doctor@zivira.com</td>
                  <td>Grade A</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
