"use client";

import type { Employee } from "@zivira/types";
import { Plus, RefreshCw, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { formatDate } from "@/lib/format-date";

// Sample initial data with all SFA master columns
const initialFieldForce: any[] = [];

export function EmployeeManager() {
  const [employees, setEmployees] = useState<any[]>(initialFieldForce);
  const [showForm, setShowForm] = useState(false);
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
    status: "ACTIVE"
  });

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

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.employeeCode.trim()) return;

    const newEmp = {
      ...form,
      id: Math.random().toString(36).slice(2, 9)
    };
    setEmployees([newEmp, ...employees]);
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
      status: "ACTIVE"
    });
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
          <Plus size={17} />
          Add Employee
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      
      {showForm ? (
        <form className="card form-grid" onSubmit={handleSave} style={{ animation: "popIn 0.3s ease-out forwards", marginBottom: "20px" }}>
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
              <option value="Ara">Ara</option>
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
            <label>Employee Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
            <button className="button button-secondary" type="button" onClick={() => setShowForm(false)}><X size={15} /> Cancel</button>
            <button className="button" type="submit"><Check size={15} /> Add Employee</button>
          </div>
        </form>
      ) : null}

      <div className="table-wrap" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 240px)" }}>
        <table className="subdivision-table" style={{ minWidth: "1600px" }}>
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Employee Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>DOJ</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Division</th>
              <th>Reporting Manager</th>
              <th>Region</th>
              <th>HQ</th>
              <th>Patch</th>
              <th>Driving License</th>
              <th>Employee Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, i) => (
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
