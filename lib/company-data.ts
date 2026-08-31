import {
  AlertTriangle,
  BarChart3,
  Building2,
  Cake,
  CalendarDays,
  ClipboardList,
  FileBarChart,
  Gauge,
  MapPin,
  PackageSearch,
  Settings,
  ShieldCheck,
  Stethoscope,
  TableProperties,
  Trophy,
  Wallet,
  Workflow
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const companyNav: NavGroup[] = [
  {
    title: "Platform",
    items: [
      { title: "Home", href: "/admin/home", icon: Gauge },
      { title: "Masters", href: "/admin/masters", icon: TableProperties },
      { title: "Activities", href: "/admin/activities", icon: Workflow },
      { title: "Activity Reports", href: "/admin/activity-reports", icon: FileBarChart },
      { title: "MIS Reports", href: "/admin/mis-reports", icon: CalendarDays },
      { title: "Options", href: "/admin/options", icon: Settings },
      { title: "Doctor Celebrations", href: "/admin/doctor-celebrations", icon: Cake },
      { title: "Branches & GST", href: "/admin/branches", icon: Building2 },
      { title: "Doctor Coverage", href: "/admin/doctor-coverage", icon: Stethoscope },
      // Zivira_Project_Basic.docx — SFA/CRM Analytics + BI Platform. Purely
      // additive: every link below is a new route consuming the existing
      // /company/analytics/* backend; nothing above this line was changed.
      { title: "Compliance", href: "/admin/analytics/compliance", icon: ShieldCheck },
      { title: "Payroll", href: "/admin/analytics/payroll", icon: Wallet },
      { title: "Rep vs Manager", href: "/admin/analytics/rep-manager", icon: Trophy },
      { title: "Territory Coverage", href: "/admin/analytics/territory-coverage", icon: MapPin },
      { title: "Product Exposure", href: "/admin/analytics/product-exposure", icon: BarChart3 },
      { title: "Sample Distribution", href: "/admin/analytics/sample-distribution", icon: PackageSearch },
      { title: "KPI Engine", href: "/admin/analytics/kpi", icon: Gauge },
      { title: "BI Reports", href: "/admin/analytics", icon: ClipboardList },
      { title: "Alerts", href: "/admin/analytics/alerts", icon: AlertTriangle },
      { title: "Executive Dashboard", href: "/admin/analytics/executive", icon: ClipboardList },
      { title: "Tour Plans", href: "/admin/tour-plans", icon: FileBarChart }
    ]
  }
];

export const fallbackMetrics = [
  { label: "Employees", value: "2", trend: "Seed tenant users" },
  { label: "Doctors", value: "1", trend: "Mapped to territory" },
  { label: "Products", value: "1", trend: "Active catalog" },
  { label: "DCR Today", value: "0", trend: "Awaiting field submissions" }
];
