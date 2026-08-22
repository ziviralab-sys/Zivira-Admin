import {
  BarChart3,
  Building2,
  Cake,
  CalendarDays,
  FileBarChart,
  Gauge,
  Settings,
  Stethoscope,
  TableProperties,
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
      { title: "Tour Plans", href: "/admin/tour-plans", icon: FileBarChart },
      // Zivira_Project_Basic.docx — SFA/CRM Analytics + BI Platform hub.
      // Purely additive: every module behind this link is a new route
      // consuming the existing /company/analytics/* backend; nothing above
      // this line was changed.
      { title: "Analytics & BI Center", href: "/admin/analytics", icon: BarChart3 }
    ]
  }
];

export const fallbackMetrics = [
  { label: "Employees", value: "2", trend: "Seed tenant users" },
  { label: "Doctors", value: "1", trend: "Mapped to territory" },
  { label: "Products", value: "1", trend: "Active catalog" },
  { label: "DCR Today", value: "0", trend: "Awaiting field submissions" }
];
