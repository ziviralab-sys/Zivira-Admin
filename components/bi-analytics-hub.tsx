"use client";
// components/bi-analytics-hub.tsx
// Zivira_Project_Basic.docx Topic 13 — Business Intelligence (BI) Reports
//
// A single landing surface linking every SFA/CRM Analytics + BI module
// from the requirements document — Employee, Manager, Doctor, Product and
// Territory report families, plus the KPI Engine, Alert Engine, Payroll
// Hold queue and Executive Dashboard. Every card below routes to an
// already-built, already-wired page; this file adds no new backend calls
// of its own.
//
// New file — purely additive, does not touch any existing component.
import {
  AlertTriangle, BarChart3, ClipboardList, Gauge, MapPin,
  PackageSearch, ShieldCheck, Trophy, Wallet
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BackButton } from "@/components/back-button";

const MODULES: { title: string; description: string; href: string; icon: LucideIcon; group: string }[] = [
  { title: "Attendance & Compliance Analytics", description: "DCR submission discipline + Chronic Defaulter detection", href: "/admin/analytics/compliance", icon: ShieldCheck, group: "Employee Reports" },
  { title: "Payroll — Compliance Hold Queue", description: "Salary Integration Engine: hold / explanation / release workflow", href: "/admin/analytics/payroll", icon: Wallet, group: "Employee Reports" },
  { title: "KPI Engine", description: "Representative and Manager KPIs, calculated automatically", href: "/admin/analytics/kpi", icon: Gauge, group: "Employee Reports" },
  { title: "Representative vs Manager Analysis", description: "Joint Field Work Analysis + manager joint-call ranking", href: "/admin/analytics/rep-manager", icon: Trophy, group: "Manager Reports" },
  { title: "Territory Coverage & Doctor Exceptions", description: "Doctors not visited 30/60/90/180 days, with logged reasons", href: "/admin/analytics/territory-coverage", icon: MapPin, group: "Territory Reports" },
  { title: "Product Exposure & Performance", description: "Most/least promoted products, prescription-interest signal", href: "/admin/analytics/product-exposure", icon: BarChart3, group: "Product Reports" },
  { title: "Sample Distribution Analytics", description: "Issued vs Distributed vs Remaining, product-wise + stock ledger", href: "/admin/analytics/sample-distribution", icon: PackageSearch, group: "Product Reports" },
  { title: "Alert & Notification Engine", description: "DCR gaps, low coverage, low sample stock, salary holds — ranked by severity", href: "/admin/analytics/alerts", icon: AlertTriangle, group: "Doctor Reports" },
  { title: "Executive Dashboard", description: "Centralized MD / CEO / RGM view across every module above", href: "/admin/analytics/executive", icon: ClipboardList, group: "Executive" }
];

const GROUPS = ["Employee Reports", "Manager Reports", "Doctor Reports", "Product Reports", "Territory Reports", "Executive"];

export function BiAnalyticsHub() {
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">SFA Analytics &amp; BI</p>
          <h2>Analytics &amp; BI Center</h2>
          <p>Every DCR-driven analytics module from the SFA/CRM Analytics + BI requirements — DCR compliance, payroll integration, field coaching, product and territory intelligence, and the executive rollup.</p>
        </div>
        <BackButton fallback="/admin/home" />
      </div>

      {GROUPS.map((group) => {
        const items = MODULES.filter((m) => m.group === group);
        if (!items.length) return null;
        return (
          <div key={group} style={{ marginBottom: 28 }}>
            <h3 className="section-title" style={{ marginBottom: 12 }}>{group}</h3>
            <div className="grid grid-3">
              {items.map((m) => (
                <Link key={m.href} className="card module-card" href={m.href}>
                  <div className="card-head">
                    <div>
                      <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 6 }}><m.icon size={16} /> {m.title}</h3>
                      <p className="muted">{m.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
