"use client";

import type { Employee } from "@zivira/types";
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { StatusBadge } from "./page-components";

export function EmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    employeeCode: "",
    designation: "Medical Representative",
    division: "Cardio Diabetes",
    reportingManager: "",
    territory: "",
    role: "MR" as Employee["role"],
    status: "ACTIVE" as Employee["status"]
  });

  async function loadEmployees() {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.employees();
      setEmployees(response.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load employees");
    } finally {
      setLoading(false);
    }
  }

  async function createEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await apiClient.createEmployee(form);
      setShowForm(false);
      setForm({ ...form, name: "", employeeCode: "", reportingManager: "", territory: "" });
      await loadEmployees();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create employee");
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
          <Plus size={17} />
          Add employee
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {showForm ? (
        <form className="card form-grid" onSubmit={createEmployee}>
          <div className="field">
            <label>Name</label>
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div className="field">
            <label>Employee code</label>
            <input required value={form.employeeCode} onChange={(event) => setForm({ ...form, employeeCode: event.target.value })} />
          </div>
          <div className="field">
            <label>Designation</label>
            <input required value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} />
          </div>
          <div className="field">
            <label>Role</label>
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Employee["role"] })}>
              {["NBH", "BH", "RBM", "ZBM", "ABM", "SR_MR", "MR"].map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Division</label>
            <input required value={form.division} onChange={(event) => setForm({ ...form, division: event.target.value })} />
          </div>
          <div className="field">
            <label>Territory</label>
            <input required value={form.territory} onChange={(event) => setForm({ ...form, territory: event.target.value })} />
          </div>
          <button className="button" type="submit">Create employee</button>
        </form>
      ) : null}
      <div className="table-wrap" style={{ overflowX: "auto" }}>
        <table style={{ minWidth: "1800px" }}>
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>EmployeeName</th>
              <th>Date of Birth</th>
              <th>emailid</th>
              <th>mobilecontactnumber</th>
              <th>division</th>
              <th>rolename</th>
              <th>Employeecode</th>
              <th>joindate</th>
              <th>address1</th>
              <th>landmark</th>
              <th>location</th>
              <th>city</th>
              <th>State name</th>
              <th>country</th>
              <th>postalcode</th>
              <th>HQ /Territory</th>
              <th>L1 Reporting manager employeecode</th>
              <th>L1 Division</th>
              <th>L1 Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, i) => {
              return (
                <tr key={employee.id}>
                  <td>{i + 1}</td>
                  <td><strong>{employee.name}</strong></td>
                  <td>15-Jul-1990</td>
                  <td>employee{i + 1}@zivira.com</td>
                  <td>9876543210</td>
                  <td>{employee.division}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.employeeCode}</td>
                  <td>12-Jan-2020</td>
                  <td>{employee.address || "NO: 3/597-1"}</td>
                  <td>Near Tech Park</td>
                  <td>Outer Ring Road</td>
                  <td>Bengaluru</td>
                  <td>Karnataka</td>
                  <td>India</td>
                  <td>560100</td>
                  <td>BENGALURU</td>
                  <td>MGR001</td>
                  <td>{employee.division}</td>
                  <td>REGIONAL MANAGER</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
