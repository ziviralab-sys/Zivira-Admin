"use client";

import type { ZiviraTreeNode } from "@zivira/types";
import Link from "next/link";
import { SubdivisionMaster, SubdivisionProductwise, SubdivisionFieldforcewise } from "@/components/subdivision-master";
import { ProductCategoryMaster } from "@/components/product-category-master";
import { ProductBrandMaster } from "@/components/product-brand-master";
import { ProductDetailMaster } from "@/components/product-detail-master";
import { ProductGroupMaster } from "@/components/product-group-master";
import { DoctorCategoryMaster } from "@/components/doctor-category-master";
import { DoctorSpecialityMaster } from "@/components/doctor-speciality-master";
import { DoctorQualificationMaster } from "@/components/doctor-qualification-master";
import { DoctorManager } from "@/components/doctor-manager";
import { AdminDcrView } from "@/components/admin-dcr-view";
import { InputMaster } from "@/components/input-master";
import { StockistDetailsMaster } from "@/components/stockist-details-master";
import { ExpenseMaster } from "@/components/expense-master";
import { HolidayMaster } from "@/components/holiday-master";
import { EmployeeManager } from "@/components/employee-manager";
import { TerritoryMaster } from "@/components/territory-master";
import { TerritoryListedDoctor } from "@/components/territory-listed-doctor";
import { ChemistMaster } from "@/components/chemist-master";
import { HospitalMaster } from "@/components/hospital-master";
import { StatewiseRateFixation } from "@/components/statewise-rate-fixation";
import { ManagerAllowanceAutomatic } from "@/components/manager-allowance-automatic";
import { ManagerSfcUpdation } from "@/components/manager-sfc-updation";
import { ManagerWorkTypeAllowance } from "@/components/manager-work-type-allowance";

export function AdminDrilldown({ node, path }: { node: ZiviraTreeNode; path: string[] }) {
  const pathStr = path.join("/");

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/territory") {
    return <TerritoryMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/territory-listed-doctor") {
    return <TerritoryListedDoctor />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/chemist") {
    return <ChemistMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force-entries/hospital") {
    return <HospitalMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/field-force") {
    return <EmployeeManager />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/subdivision/entry") {
    return <SubdivisionMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/subdivision/view-productwise") {
    return <SubdivisionProductwise />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/subdivision/view-field-forcewise") {
    return <SubdivisionFieldforcewise />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/category") {
    return <ProductCategoryMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/group") {
    return <ProductGroupMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/brand") {
    return <ProductBrandMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/product-detail") {
    return <ProductDetailMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/statewise-rate-fixation") {
    return <StatewiseRateFixation />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/category") {
    return <DoctorCategoryMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/class") {
    return <DoctorManager />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/speciality") {
    return <DoctorSpecialityMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/doctor/qualification") {
    return <DoctorQualificationMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/input") {
    return <InputMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/stockist-details/add-edit-deactivate") {
    return <StockistDetailsMaster isSuperStockist={false} />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/stockist-details/super-stockist-create-map") {
    return <StockistDetailsMaster isSuperStockist={true} />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/expense") {
    return <ExpenseMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/manager-expense/allowance-fixation-automatic") {
    return <ManagerAllowanceAutomatic />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/manager-expense/sfc-updation") {
    return <ManagerSfcUpdation />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/manager-expense/wrk-type-wise-allowance-fix") {
    return <ManagerWorkTypeAllowance />;
  }

  if (pathStr.startsWith("division-dashboard/division-navigation-tabs/division-master/statewise-holiday-fixation")) {
    return <HolidayMaster />;
  }

  if (pathStr.includes("activity/dcr") || pathStr.includes("activities/dcr")) {
    return <AdminDcrView />;
  }

  if (!node.children?.length) {
    return (
      <article className="card empty-module">
        <h3 className="section-title">{node.title}</h3>
        <p className="muted">This tab is ready for its form, table, report, or approval workflow.</p>
      </article>
    );
  }

  return (
    <div className="grid grid-3">
      {node.children.map((child) => {
        const childPath = [...path, child.slug];
        const href = `/admin/workspace/${childPath.join("/")}`;

        return (
          <Link className="card module-card" href={href} key={`${child.slug}-${child.title}`}>
            <div className="card-head">
              <div>
                <h3 className="section-title">{child.title}</h3>
                <p className="muted">{child.children?.length ? `${child.children.length} sub tabs` : child.title}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
