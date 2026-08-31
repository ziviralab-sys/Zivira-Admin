"use client";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
export function PersonalInformationEntry() {
  const [activeCategory, setActiveCategory] = useState<"company" | "employee">("company");
  const [success, setSuccess] = useState(false);
  // Company Information State
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    address: "",
    contact: "",
    licenseKey: "",
    gstin: "",
    dlNo: "",
    panNo: ""
  });
  // Employee Personal Information State
  const [employeeForm, setEmployeeForm] = useState({
    employeeName: "",
    dob: "",
    doj: "",
    fatherName: "",
    contactNo: "",
    email: "",
    qualification: "",
    panNo: "",
    aadharNo: "",
    bankName: "",
    accountNo: "",
    ifscCode: ""
  });
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    if (activeCategory === "company") {
      setCompanyForm({
        companyName: "",
        address: "",
        contact: "",
        licenseKey: "",
        gstin: "",
        dlNo: "",
        panNo: ""
      });
    } else {
      setEmployeeForm({
        employeeName: "",
        dob: "",
        doj: "",
        fatherName: "",
        contactNo: "",
        email: "",
        qualification: "",
        panNo: "",
        aadharNo: "",
        bankName: "",
        accountNo: "",
        ifscCode: ""
      });
    }
  }
  return (
    <section className="subdivision-console">
      <div className="subdivision-head" style={{ marginBottom: "20px" }}>
        <div>
          <p className="subdivision-eyebrow">Master Setup</p>
          <h2>Personal — Entry</h2>
          <p>Configure company details or employee personal records.</p>
        </div>
      </div>
      {/* Tabs Row */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "8px 0", marginBottom: "20px", borderBottom: "1px solid var(--border)" }}>
        <button
          className={`button ${activeCategory === "company" ? "" : "button-secondary"}`}
          onClick={() => setActiveCategory("company")}
          style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
          type="button"
        >
          Company Information
        </button>
        <button
          className={`button ${activeCategory === "employee" ? "" : "button-secondary"}`}
          onClick={() => setActiveCategory("employee")}
          style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: "12px" }}
          type="button"
        >
          Employee Personal Information
        </button>
      </div>
      {success && (
        <p style={{ color: "#10b981", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>
          ✓ Record saved successfully!
        </p>
      )}
      {activeCategory === "company" ? (
        <form className="card form-grid" onSubmit={handleSave} style={{ animation: "popIn 0.3s ease-out forwards" }}>
          <div className="field">
            <label>Company Name</label>
            <input required value={companyForm.companyName} onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })} placeholder="e.g. Zivira Labs Pvt Ltd" />
          </div>
          <div className="field">
            <label>Address</label>
            <input required value={companyForm.address} onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })} placeholder="e.g. 12, Gandhi Road, Chennai" />
          </div>
          <div className="field">
            <label>Contact Number</label>
            <input required value={companyForm.contact} onChange={e => setCompanyForm({ ...companyForm, contact: e.target.value })} placeholder="e.g. +91 44 2847 1122" />
          </div>
          <div className="field">
            <label>License Key</label>
            <input required value={companyForm.licenseKey} onChange={e => setCompanyForm({ ...companyForm, licenseKey: e.target.value })} placeholder="e.g. LIC-ZIV-2024-99X" />
          </div>
          <div className="field">
            <label>GSTIN</label>
            <input required value={companyForm.gstin} onChange={e => setCompanyForm({ ...companyForm, gstin: e.target.value })} placeholder="e.g. 33AABCZ1234F1Z5" />
          </div>
          <div className="field">
            <label>DL Number (Drug License)</label>
            <input required value={companyForm.dlNo} onChange={e => setCompanyForm({ ...companyForm, dlNo: e.target.value })} placeholder="e.g. DL-202/M/2020" />
          </div>
          <div className="field">
            <label>PAN Number</label>
            <input required value={companyForm.panNo} onChange={e => setCompanyForm({ ...companyForm, panNo: e.target.value })} placeholder="e.g. AABCZ1234F" />
          </div>
          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
            <button className="button" type="submit">Add Company Details</button>
          </div>
        </form>
      ) : (
        <form className="card form-grid" onSubmit={handleSave} style={{ animation: "popIn 0.3s ease-out forwards" }}>
          <div className="field">
            <label>Employee Name</label>
            <input required value={employeeForm.employeeName} onChange={e => setFormVal("employeeName", e.target.value)} placeholder="Rahul Sharma" />
          </div>
          <div className="field">
            <label>Date of Birth (DOB)</label>
            <input type="date" required value={employeeForm.dob} onChange={e => setFormVal("dob", e.target.value)} />
          </div>
          <div className="field">
            <label>Date of Joining (DOJ)</label>
            <input type="date" required value={employeeForm.doj} onChange={e => setFormVal("doj", e.target.value)} />
          </div>
          <div className="field">
            <label>Father's Name</label>
            <input required value={employeeForm.fatherName} onChange={e => setFormVal("fatherName", e.target.value)} placeholder="Mr. Ramesh Sharma" />
          </div>
          <div className="field">
            <label>Contact Number</label>
            <input required value={employeeForm.contactNo} onChange={e => setFormVal("contactNo", e.target.value)} placeholder="9876543210" />
          </div>
          <div className="field">
            <label>Personal Email</label>
            <input type="email" required value={employeeForm.email} onChange={e => setFormVal("email", e.target.value)} placeholder="rahul@personal.com" />
          </div>
          <div className="field">
            <label>Qualification</label>
            <input required value={employeeForm.qualification} onChange={e => setFormVal("qualification", e.target.value)} placeholder="e.g. B.Pharm, MBA" />
          </div>
          <div className="field">
            <label>PAN Number</label>
            <input required value={employeeForm.panNo} onChange={e => setFormVal("panNo", e.target.value)} placeholder="e.g. ABCDE1234F" />
          </div>
          <div className="field">
            <label>Aadhar Number</label>
            <input required value={employeeForm.aadharNo} onChange={e => setFormVal("aadharNo", e.target.value)} placeholder="e.g. 1234 5678 9012" />
          </div>
          <div className="field">
            <label>Bank Name</label>
            <input required value={employeeForm.bankName} onChange={e => setFormVal("bankName", e.target.value)} placeholder="e.g. HDFC Bank" />
          </div>
          <div className="field">
            <label>Account Number</label>
            <input required value={employeeForm.accountNo} onChange={e => setFormVal("accountNo", e.target.value)} placeholder="e.g. 50100234567890" />
          </div>
          <div className="field">
            <label>IFSC Code</label>
            <input required value={employeeForm.ifscCode} onChange={e => setFormVal("ifscCode", e.target.value)} placeholder="e.g. HDFC0000123" />
          </div>
          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
            <button className="button" type="submit">Add Employee Details</button>
          </div>
        </form>
      )}
    </section>
  );
  function setFormVal(key: keyof typeof employeeForm, val: string) {
    setEmployeeForm({ ...employeeForm, [key]: val });
  }
}
