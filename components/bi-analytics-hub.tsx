"use client";
// components/bi-analytics-hub.tsx
// Zivira_Project_Basic.docx Topic 13 — Business Intelligence (BI) Reports
//
// Grouped exactly like the project brief's report families — Employee,
// Manager, Doctor, Product and Territory Reports — with each individual
// report as its own link. Every enabled link opens a dedicated page with
// that report's own data (reusing an existing Analytics/BI page or DCR
// Reports where one already covers it, and two small new derived-report
// pages — Products Discussed, Visit Frequency — where none did). Items the
// project brief flags as needing data this system doesn't capture yet
// (Growth, Market Share, Doctor Density) are shown disabled, exactly as
// called out, rather than linking to fabricated numbers.
//
// New file — purely additive, does not touch any existing component.
import { ArrowRight, BarChart3, ClipboardList, MapPin, ShieldCheck, Stethoscope, Users } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BackButton } from "@/components/back-button";

type ReportLink = { label: string; href: string } | { label: string; note: string };

type ReportGroup = { title: string; icon: LucideIcon; items: ReportLink[] };

const GROUPS: ReportGroup[] = [
  {
    title: "Employee Reports",
    icon: Users,
    items: [
      { label: "Daily Activity", href: "/admin/dcr" },
      { label: "Attendance & Compliance", href: "/admin/analytics/compliance" },
      { label: "Missed DCR", href: "/admin/analytics/compliance" },
      { label: "Productivity (KPIs)", href: "/admin/analytics/kpi" }
    ]
  },
  {
    title: "Manager Reports",
    icon: ShieldCheck,
    items: [
      { label: "Joint Calls", href: "/admin/analytics/rep-manager" },
      { label: "Territory Visits", href: "/admin/analytics/territory-coverage" },
      { label: "Team Performance (KPIs)", href: "/admin/analytics/kpi" },
      { label: "Coaching Analysis (manager ranking)", href: "/admin/analytics/rep-manager" }
    ]
  },
  {
    title: "Doctor Reports",
    icon: Stethoscope,
    items: [
      { label: "Last Visit / Coverage Alerts", href: "/admin/analytics/territory-coverage" },
      { label: "Products Discussed", href: "/admin/analytics/products-discussed" },
      { label: "Samples Received", href: "/admin/analytics/sample-distribution" },
      { label: "Prescription Trend", href: "/admin/analytics/product-exposure" }
    ]
  },
  {
    title: "Product Reports",
    icon: BarChart3,
    items: [
      { label: "Exposure", href: "/admin/analytics/product-exposure" },
      { label: "Conversion (proxy: prescription interest)", href: "/admin/analytics/product-exposure" },
      { label: "Growth", note: "Needs multi-period sales/prescription data not yet captured." },
      { label: "Market Share", note: "Needs competitor/market data outside this system." }
    ]
  },
  {
    title: "Territory Reports",
    icon: MapPin,
    items: [
      { label: "Coverage", href: "/admin/analytics/territory-coverage" },
      { label: "Visit Frequency", href: "/admin/analytics/visit-frequency" },
      { label: "Untouched Doctors", href: "/admin/analytics/territory-coverage?bucket=NEVER_VISITED" },
      { label: "Doctor Density", note: "Needs a geographic doctor map, not tracked yet." }
    ]
  }
];

export function BiAnalyticsHub() {
  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Business Intelligence</p>
          <h2>BI Reports</h2>
          <p>Every report category from the project brief, pointing at the live data already powering it — organized so nothing has to be found twice.</p>
        </div>
        <BackButton fallback="/admin/home" />
      </div>

      <div className="grid grid-2" style={{ gap: 16 }}>
        {GROUPS.map((group) => (
          <div key={group.title} className="card" style={{ padding: 18 }}>
            <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <group.icon size={16} /> {group.title}
            </h3>
            <div style={{ display: "grid", gap: 2 }}>
              {group.items.map((item) =>
                "href" in item ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 4px", color: "var(--ink)", fontSize: 14, borderBottom: "1px solid var(--line)"
                    }}
                  >
                    {item.label} <ArrowRight size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
                  </Link>
                ) : (
                  <p
                    key={item.label}
                    style={{ padding: "9px 4px", fontSize: 13, color: "var(--muted)", fontStyle: "italic", margin: 0 }}
                  >
                    {item.label} — {item.note}
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <ClipboardList size={16} style={{ opacity: 0.6, flexShrink: 0 }} />
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>
          Looking for the Alert Engine, Payroll hold queue, or Executive rollup? Those live under their own sidebar links —{" "}
          <Link href="/admin/analytics/alerts" style={{ color: "var(--brand)", fontWeight: 600 }}>Alerts</Link>,{" "}
          <Link href="/admin/analytics/payroll" style={{ color: "var(--brand)", fontWeight: 600 }}>Payroll</Link>, and{" "}
          <Link href="/admin/analytics/executive" style={{ color: "var(--brand)", fontWeight: 600 }}>Executive Dashboard</Link>.
        </p>
      </div>
    </section>
  );
}
