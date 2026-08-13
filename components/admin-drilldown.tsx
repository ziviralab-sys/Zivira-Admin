"use client";

import type { ZiviraTreeNode } from "@zivira/types";
import Link from "next/link";
import { GenericMasterTable } from "@/components/generic-master-table";
import { AdminDcrView } from "@/components/admin-dcr-view";
import { ExpenseMaster } from "@/components/expense-master";
import { EmployeeManager } from "@/components/employee-manager";
import { TerritoryListedDoctor } from "@/components/territory-listed-doctor";
import { ChemistMaster } from "@/components/chemist-master";
import { HospitalMaster } from "@/components/hospital-master";
import { ManagerSfcUpdation } from "@/components/manager-sfc-updation";
import { ManagerWorkTypeAllowance } from "@/components/manager-work-type-allowance";
import { TerritoryBulkDeactivation } from "@/components/territory-bulk-deactivation";
import { ListedDoctorMaster } from "@/components/listed-doctor-master";
import { UnlistedDoctorMaster } from "@/components/unlisted-doctor-master";

export function AdminDrilldown({ node, path }: { node: ZiviraTreeNode; path: string[] }) {
  const pathStr = path.join("/");
  console.log("DEBUG drilldown pathStr:", pathStr);

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/territory") {
    return <GenericMasterTable masterKey="patchNameMaster" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/territory-listed-doctor") {
    return <TerritoryListedDoctor />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/territory-bulk-deactivation") {
    return <TerritoryBulkDeactivation />;
  }

  if (pathStr.endsWith("listed-doctor")) {
    return <ListedDoctorMaster />;
  }

  if (pathStr.endsWith("unlisted-doctor")) {
    return <UnlistedDoctorMaster />;
  }

  if (pathStr.endsWith("chemist")) {
    return <ChemistMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/hospital") {
    return <HospitalMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force") {
    return <EmployeeManager />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/subdivision/entry") {
    return <GenericMasterTable masterKey="divisionMaster" />;
  }

  // Tree title: "Regional Zone Master"
  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/view-productwise") {
    return <GenericMasterTable masterKey="regionZoneMaster" />;
  }

  // Tree title: "Territory / Headquarters Master"
  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/view-field-forcewise") {
    return <GenericMasterTable masterKey="territoryHqMaster" />;
  }

  {/* Product hierarchy: Therapy → Molecule → Brand → Product → Rate */}
  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/category") {
    return <GenericMasterTable masterKey="therapyMaster" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/group") {
    return <GenericMasterTable masterKey="moleculeMaster" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/brand") {
    return <GenericMasterTable masterKey="brandMaster" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/product-detail") {
    return <GenericMasterTable masterKey="productMaster" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/statewise-rate-fixation") {
    return <GenericMasterTable masterKey="rateMaster" />;
  }

  {/* Doctor's 7 sub-tabs, per tree titles: Doctor Master, Address, Classification,
      Mapping, Dealer Mapping, Contact Details, Additional Information */}
  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/category") {
    return <GenericMasterTable masterKey="doctorMaster" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/class") {
    return <GenericMasterTable masterKey="doctorClassification" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/speciality") {
    return <GenericMasterTable masterKey="doctorAddress" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/qualification") {
    return <GenericMasterTable masterKey="doctorDealerMapping" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/campaign") {
    return <GenericMasterTable masterKey="doctorMapping" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/chemists-category") {
    return <GenericMasterTable masterKey="doctorContactDetails" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/chemists-class") {
    return <GenericMasterTable masterKey="doctorAdditionalInfo" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/input") {
    return <GenericMasterTable masterKey="inputMaster" />;
  }

  if (pathStr.endsWith("stockist-details/stockist-master") || pathStr.endsWith("stockist-details/stockist master")) {
    return <GenericMasterTable masterKey="stockistMaster" />;
  }

  if (pathStr.endsWith("stockist-details/address")) {
    return <GenericMasterTable masterKey="stockistAddress" />;
  }

  if (pathStr.endsWith("stockist-details/contact")) {
    return <GenericMasterTable masterKey="stockistContact" />;
  }

  if (pathStr.endsWith("stockist-details/headquaters") || pathStr.endsWith("stockist-details/headquarters")) {
    return <GenericMasterTable masterKey="stockistHeadquarters" />;
  }

  if (pathStr.endsWith("stockist-details/divided-maping") || pathStr.endsWith("stockist-details/divided maping")) {
    return <GenericMasterTable masterKey="stockistDivisionMapping" />;
  }

  if (pathStr.endsWith("stockist-details/bank-details") || pathStr.endsWith("stockist-details/bank details")) {
    return <GenericMasterTable masterKey="stockistBankDetails" />;
  }

  if (pathStr.endsWith("stockist-details/license-details") || pathStr.endsWith("stockist-details/license details")) {
    return <GenericMasterTable masterKey="stockistLicenseDetails" />;
  }

  if (pathStr.endsWith("stockist-details/status")) {
    return <GenericMasterTable masterKey="stockistStatus" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/expense") {
    return <ExpenseMaster />;
  }

  if (pathStr.endsWith("expense/sfc-view")) {
    return <GenericMasterTable masterKey="sfc" />;
  }

  if (pathStr.endsWith("expense/allowance-fixation")) {
    return <GenericMasterTable masterKey="allowanceFixation" />;
  }

  if (pathStr.endsWith("expense/fixed-variable-expense-parameter")) {
    return <GenericMasterTable masterKey="expenseCategory" />;
  }

  if (pathStr.endsWith("expense/expense-setup")) {
    return <GenericMasterTable masterKey="expenseTypes" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/manager-expense/allowance-fixation-automatic") {
    return <GenericMasterTable masterKey="allowanceFixation" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/manager-expense/sfc-updation") {
    return <ManagerSfcUpdation />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/manager-expense/wrk-type-wise-allowance-fix") {
    return <ManagerWorkTypeAllowance />;
  }

  if (pathStr.endsWith("manager-expense/travel-approval") || pathStr.endsWith("manager-expense/travel approval")) {
    return <GenericMasterTable masterKey="managerTravelApproval" />;
  }

  if (pathStr.endsWith("state-master") || pathStr.endsWith("state master")) {
    return <GenericMasterTable masterKey="holidayStateMaster" />;
  }

  if (pathStr.endsWith("holiday-calendar") || pathStr.endsWith("holiday calendar")) {
    return <GenericMasterTable masterKey="holidayCalendar" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/personal-information/personal-entry") {
    return <GenericMasterTable masterKey="employeePersonalInfo" />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/personal-information/personal-view") {
    return <GenericMasterTable masterKey="personalInformationView" />;
  }

  if (pathStr.includes("daily-mr-work/attendance")) {
    return <GenericMasterTable masterKey="attendance" />;
  }

  if (pathStr.includes("daily-mr-work/daily-call-report")) {
    return <GenericMasterTable masterKey="dcrEntry" />;
  }

  if (pathStr.includes("daily-mr-work/tour-plan")) {
    return <GenericMasterTable masterKey="tourPlanEntry" />;
  }

  if (pathStr.includes("daily-mr-work/expense")) {
    return <GenericMasterTable masterKey="expenseEntry" />;
  }

  if (pathStr.includes("daily-mr-work/leaves")) {
    return <GenericMasterTable masterKey="leaveEntry" />;
  }

  if (pathStr.includes("daily-mr-work/camp")) {
    return <GenericMasterTable masterKey="campEntry" />;
  }

  if (pathStr.includes("daily-mr-work/market-survey")) {
    return <GenericMasterTable masterKey="marketSurveyEntry" />;
  }

  if (pathStr.includes("manager-activity-report/attendance-report")) {
    return <GenericMasterTable masterKey="attendanceReport" />;
  }

  if (pathStr.includes("manager-activity-report/daily-call-report-summary")) {
    return <GenericMasterTable masterKey="dcrSummaryReport" />;
  }

  if (pathStr.includes("manager-activity-report/tour-plan-report")) {
    return <GenericMasterTable masterKey="tourPlanReport" />;
  }

  if (pathStr.includes("manager-activity-report/expense-report")) {
    return <GenericMasterTable masterKey="expenseReport" />;
  }

  if (pathStr.includes("manager-activity-report/leave-report")) {
    return <GenericMasterTable masterKey="leaveReport" />;
  }

  if (pathStr.includes("manager-activity-report/camp-report")) {
    return <GenericMasterTable masterKey="campReport" />;
  }

  if (pathStr.includes("manager-activity-report/market-survey-report")) {
    return <GenericMasterTable masterKey="marketSurveyReport" />;
  }

  if (pathStr.includes("manager-activity-report/doctor-coverage-report")) {
    return <GenericMasterTable masterKey="doctorCoverageReport" />;
  }

  if (pathStr.includes("manager-activity-report/chemist-coverage-report")) {
    return <GenericMasterTable masterKey="chemistCoverageReport" />;
  }

  if (pathStr.endsWith("travel-approval")) {
    return <GenericMasterTable masterKey="managerTravelApproval" />;
  }

  if (pathStr.endsWith("expense-approval")) {
    return <GenericMasterTable masterKey="expenseApproval" />;
  }

  if (pathStr.endsWith("manager-expense/reports")) {
    return <GenericMasterTable masterKey="expenseReports" />;
  }

  if (pathStr.endsWith("productivity-dashboard")) {
    return <GenericMasterTable masterKey="productivityDashboard" />;
  }

  if (pathStr.endsWith("target-master")) {
    return <GenericMasterTable masterKey="targetMaster" />;
  }

  if (pathStr.endsWith("primary-sales")) {
    return <GenericMasterTable masterKey="primarySales" />;
  }

  if (pathStr.endsWith("secondary-sales")) {
    return <GenericMasterTable masterKey="secondarySales" />;
  }

  if (pathStr.endsWith("claims-master")) {
    return <GenericMasterTable masterKey="claimsMaster" />;
  }

  if (pathStr.includes("activity/dcr") || pathStr.includes("activities/dcr")) {
    return <AdminDcrView />;
  }

  const isMisDcr = pathStr === "division-dashboard/division-navigation-tabs/mis-reports/mis-dcr";

  if (!node.children?.length && !isMisDcr) {
    return (
      <article className="card empty-module">
        <h3 className="section-title">{node.title}</h3>
        <p className="muted">This tab is ready for its form, table, report, or approval workflow.</p>
      </article>
    );
  }

  return (
    <>
      {node.children && node.children.length > 0 && (
        <div className="grid grid-3">
          {node.children.map((child) => {
            const childPath = [...path, child.slug];
            const href = `/admin/workspace/${childPath.join("/")}`;

            return (
              <Link className="card module-card" href={href} key={`${child.slug}-${child.title}`}>
                <div className="card-head">
                  <div>
                    <h3 className="section-title">{child.title}</h3>
                    {child.children && child.children.length > 0 ? (
                      <p className="muted">{child.children.length} sub tabs</p>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {isMisDcr && (
        <div style={{ marginTop: node.children && node.children.length > 0 ? "40px" : "0px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
            Activities
          </h2>
          <div className="grid grid-2" style={{ gap: "20px" }}>
            <Link className="card module-card" href="/admin/workspace/division-dashboard/division-navigation-tabs/mis-reports/mis-dcr/daily-mr-work" style={{ borderLeft: "4px solid var(--brand-strong)" }}>
              <div className="card-head">
                <div>
                  <h3 className="section-title">Daily MR Work</h3>
                  <p className="muted">Track Attendance, Daily Call Reports (DCR), Tour Plans, Expenses, Leaves, Camps, and Market Surveys</p>
                </div>
              </div>
            </Link>
            <Link className="card module-card" href="/admin/workspace/division-dashboard/division-navigation-tabs/mis-reports/mis-dcr/manager-activity-report" style={{ borderLeft: "4px solid #10b981" }}>
              <div className="card-head">
                <div>
                  <h3 className="section-title">Manager Activity Report</h3>
                  <p className="muted">View Attendance, DCR Summary, Tour Plans, Expenses, Leaves, Camps, Surveys, Coverages, and Productivity Dashboards</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
