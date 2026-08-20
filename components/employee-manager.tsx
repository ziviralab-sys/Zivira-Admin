"use client";

import type { Employee } from "@zivira/types";
import { RefreshCw, X, AlertTriangle } from "lucide-react";
import { ColumnFilterDropdown } from "@/components/column-filter-dropdown";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { formatDate } from "@/lib/format-date";

// The backend's employees.role is a fixed enum (NBH/BH/RBM/ZBM/ABM/SR_MR/MR/
// OTHER) and is required, but the Add Employee form only surfaces
// Designation — so every designation option needs a role it maps to.
const DESIGNATION_TO_ROLE: Record<string, string> = {
  "Medical Representative": "MR",
  "Area Sales Manager": "ABM",
  "Regional Sales Manager": "RBM",
  "Zonal Sales Manager": "ZBM",
  "Product Manager": "OTHER",
  "Finance Executive": "OTHER",
  "HR Executive": "OTHER"
};

// Sample initial data with all SFA master columns
const initialFieldForce: any[] = [];

export function EmployeeManager() {
  const [employees, setEmployees] = useState<any[]>(initialFieldForce);
  const [showForm, setShowForm] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      for (const [key, val] of Object.entries(columnFilters)) {
        if (val !== "All" && String(emp[key] || "").toUpperCase() !== val.toUpperCase()) return false;
      }
      return true;
    });
  }, [employees, columnFilters]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    employeeCode: "",
    name: "",
    gender: "Male",
    dob: "",
    joinDate: "",
    phone: "",
    email: "",
    department: "Sales",
    designation: "Medical Representative",
    division: "Zivira",
    reportingManager: "",
    region: "Tamil Nadu",
    hq: "",
    patch: "",
    drivingLicense: "",
    status: "ACTIVE"
  });
  const [saving, setSaving] = useState(false);

  async function loadEmployees() {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.employees();
      const mapped = response.data.map((emp, i) => ({
        ...emp,
        employeeCode: emp.employeeCode || `EMP-MR-${String(i + 1).padStart(4, "0")}`,
        gender: (emp as any).gender || (i % 2 === 0 ? "Male" : "Female"),
        dob: emp.dob || "1990-01-01",
        joinDate: emp.joinDate || "2022-01-01",
        phone: emp.phone || "9876543210",
        email: emp.email || `${emp.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        department: (emp as any).department || "Sales",
        region: (emp as any).region || "Tamil Nadu",
        hq: (emp as any).hq || emp.territory || "Chennai Central HQ",
        patch: (emp as any).patch || "T. Nagar"
      }));
      // Merge with initial data to ensure complete entries
      setEmployees([...initialFieldForce, ...mapped.filter(m => !initialFieldForce.some(f => f.id === m.id))]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load employees");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.employeeCode.trim() || !form.hq.trim()) return;

    setSaving(true);
    setError("");
    try {
      // The backend's Employee model requires "role" (a fixed enum) and
      // "territory" — neither is a field this form shows directly, so they
      // have to be derived from Designation and HQ respectively. Previously
      // this form never called the API at all (it only updated local
      // state), which is why nothing ever actually persisted.
      await apiClient.createEmployee({
        name: form.name,
        employeeCode: form.employeeCode,
        designation: form.designation,
        division: form.division,
        reportingManager: form.reportingManager || undefined,
        territory: form.hq,
        role: (DESIGNATION_TO_ROLE[form.designation] ?? "OTHER") as any,
        drivingLicense: form.drivingLicense || undefined,
        status: form.status as "ACTIVE" | "INACTIVE"
      } as any);
      setShowForm(false);
      setForm({
        employeeCode: "",
        name: "",
        gender: "Male",
        dob: "",
        joinDate: "",
        phone: "",
        email: "",
        department: "Sales",
        designation: "Medical Representative",
        division: "Zivira",
        reportingManager: "",
        region: "Tamil Nadu",
        hq: "",
        patch: "",
        drivingLicense: "",
        status: "ACTIVE"
      });
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save employee");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void loadEmployees();
  }, []);

  return (
    <>
      <div className="toolbar">
        <button className="button button-secondary" onClick={loadEmployees} type="button">
          <RefreshCw size={17} />
          {loading ? "Refreshing" : "Refresh"}
        </button>
        <button className="button" onClick={() => setShowForm((value) => !value)} type="button">
          Add Employee
        </button>
      </div>
      {error && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
          }}
        >
          <div style={{ background: "var(--panel)", borderRadius: "10px", padding: "24px", minWidth: "320px", maxWidth: "440px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={18} color="#ef4444" />
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#ef4444" }}>Something went wrong</h3>
              </div>
              <button className="subdivision-icon-button" onClick={() => setError("")} type="button" title="Close" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--ink)" }}>{error}</p>
            <button className="button button-secondary" style={{ marginTop: "16px", width: "100%" }} onClick={() => setError("")} type="button">
              Close
            </button>
          </div>
        </div>
      )}

      {showForm ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "var(--panel)", borderRadius: "10px", width: "100%", maxWidth: "800px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div className="subdivision-head" style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", marginBottom: 0 }}>
              <div>
                <h2>Add Employee</h2>
              </div>
            </div>
            <form className="form-grid" onSubmit={handleSave} style={{ padding: "24px", overflowY: "auto" }}>
          <div className="field">
            <label>Employee Code</label>
            <input required value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} placeholder="e.g. EMP-MR-0001" />
          </div>
          <div className="field">
            <label>Employee Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" />
          </div>
          <div className="field">
            <label>Gender</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="field">
            <label>Date of Birth</label>
            <input type="date" required value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
          </div>
          <div className="field">
            <label>Date of Joining (DOJ)</label>
            <input type="date" required value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
          </div>
          <div className="field">
            <label>Mobile Number</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
          </div>
          <div className="field">
            <label>Email ID</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="rahul@example.com" />
          </div>
          <div className="field">
            <label>Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Medical Affairs">Medical Affairs</option>
              <option value="Production">Production</option>
              <option value="Quality Assurance (QA)">Quality Assurance (QA)</option>
              <option value="Quality Control (QC)">Quality Control (QC)</option>
              <option value="Research & Development (R&D)">Research & Development (R&D)</option>
            </select>
          </div>
          <div className="field">
            <label>Designation</label>
            <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })}>
              <option value="Medical Representative">Medical Representative (MR)</option>
              <option value="Area Sales Manager">Area Sales Manager (ASM)</option>
              <option value="Regional Sales Manager">Regional Sales Manager (RSM)</option>
              <option value="Zonal Sales Manager">Zonal Sales Manager (ZSM)</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Finance Executive">Finance Executive</option>
              <option value="HR Executive">HR Executive</option>
            </select>
          </div>
          <div className="field">
            <label>Division</label>
            <select value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })}>
              <option value="Astra">Astra</option>
              <option value="Aura">Aura</option>
              <option value="Zivira">Zivira</option>
            </select>
          </div>
          <div className="field">
            <label>Reporting Manager</label>
            <input value={form.reportingManager} onChange={(e) => setForm({ ...form, reportingManager: e.target.value })} placeholder="Manager Name" />
          </div>
          <div className="field">
            <label>Region</label>
            <select required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
          <div className="field">
            <label>HQ</label>
            <input required value={form.hq} onChange={(e) => setForm({ ...form, hq: e.target.value })} placeholder="e.g. Chennai Central HQ" />
          </div>
          <div className="field">
            <label>Patch</label>
            <input required value={form.patch} onChange={(e) => setForm({ ...form, patch: e.target.value })} placeholder="e.g. T. Nagar" />
          </div>
          <div className="field">
            <label>Driving License</label>
            <input value={form.drivingLicense} onChange={(e) => setForm({ ...form, drivingLicense: e.target.value })} placeholder="e.g. DL-MH-20-1234567" />
          </div>
          <div className="field">
            <label>Employee Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
              <button className="button button-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="button" type="submit" disabled={saving}>{saving ? "Saving..." : "Add Employee"}</button>
            </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="table-wrap" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 240px)" }}>
        <table className="subdivision-table" style={{ minWidth: "1600px" }}>
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Employee Name</th>
              {[
                { key: "gender", label: "Gender" },
                { key: "dob", label: "DOB" },
                { key: "joinDate", label: "DOJ" },
                { key: "phone", label: "Mobile" },
                { key: "email", label: "Email" },
                { key: "department", label: "Department" },
                { key: "designation", label: "Designation" },
                { key: "division", label: "Division" },
                { key: "reportingManager", label: "Reporting Manager" },
                { key: "region", label: "Region" },
                { key: "hq", label: "HQ" },
                { key: "patch", label: "Patch" },
                { key: "drivingLicense", label: "Driving License" }
              ].map(f => {
                const isFiltered = ["Gender", "Department", "Designation", "Division", "Region", "HQ", "Patch"].includes(f.label);
                let options: {label: string, value: string}[] = [];
                if (isFiltered) {
                  const uniqueValues = Array.from(new Set(employees.map(r => String((r as any)[f.key] || "")))).filter(Boolean).sort();
                  options = uniqueValues.map(v => ({ label: v, value: v }));
                }
                
                return (
                  <th key={f.key}>
                    {isFiltered ? (
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
              <th>Employee Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, i) => (
              <tr key={employee.id || i}>
                <td style={{ fontWeight: 600 }}>{employee.employeeCode}</td>
                <td><strong>{employee.name}</strong></td>
                <td>{employee.gender}</td>
                <td>{formatDate(employee.dob)}</td>
                <td>{formatDate(employee.joinDate)}</td>
                <td>{employee.phone || "—"}</td>
                <td>{employee.email || "—"}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>{employee.division}</td>
                <td>{employee.reportingManager || "—"}</td>
                <td>{employee.region}</td>
                <td>{employee.hq || "—"}</td>
                <td>{employee.patch || "—"}</td>
                <td>{(employee as any).drivingLicense || "—"}</td>
                <td>
                  <span style={{ 
                    padding: "2px 8px", 
                    borderRadius: "999px", 
                    fontSize: "11px", 
                    fontWeight: 600, 
                    background: employee.status === "ACTIVE" ? "#10b98115" : "#ef444415", 
                    color: employee.status === "ACTIVE" ? "#10b981" : "#ef4444",
                    border: employee.status === "ACTIVE" ? "1px solid #10b98125" : "1px solid #ef444425"
                  }}>
                    {employee.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={16} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No field force found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
