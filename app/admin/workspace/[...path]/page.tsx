import { notFound } from "next/navigation";
import { AdminDrilldown } from "@/components/admin-drilldown";
import { BackButton } from "@/components/back-button";
import { PageHeader } from "@/components/page-components";
import { findTreeNode } from "@/lib/tree-lookup";

export default async function AdminWorkspacePage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path: rawPath } = await params;
  const path = rawPath.map(p => decodeURIComponent(p).replace(/\s+/g, "-"));
  const pathStr = path.join("/");
  console.log("DEBUG PATHSTR:", pathStr);
  let node: any = findTreeNode(path);

  if (!node) {
    if (pathStr.includes("daily-mr-work")) {
      const lastPart = path[path.length - 1];
      if (lastPart === "daily-mr-work") {
        node = {
          title: "Daily MR Work",
          slug: "daily-mr-work",
          children: [
            { title: "Attendance", slug: "attendance" },
            { title: "Daily Call Report", slug: "daily-call-report" },
            { title: "Tour Plan", slug: "tour-plan" },
            { title: "Expense", slug: "expense" },
            { title: "Leaves", slug: "leaves" },
            { title: "Camp", slug: "camp" },
            { title: "Market Survey", slug: "market-survey" }
          ]
        };
      } else {
        const titleMap: Record<string, string> = {
          attendance: "Attendance",
          "daily-call-report": "Daily Call Report",
          "tour-plan": "Tour Plan",
          expense: "Expense",
          leaves: "Leaves",
          camp: "Camp",
          "market-survey": "Market Survey"
        };
        node = {
          title: titleMap[lastPart] || lastPart,
          slug: lastPart
        };
      }
    } else if (pathStr.includes("manager-activity-report")) {
      const lastPart = path[path.length - 1];
      if (lastPart === "manager-activity-report") {
        node = {
          title: "Manager Activity Report",
          slug: "manager-activity-report",
          children: [
            { title: "Attendance Report", slug: "attendance-report" },
            { title: "Daily Call Report Summary", slug: "daily-call-report-summary" },
            { title: "Tour Plan Report", slug: "tour-plan-report" },
            { title: "Expense Report", slug: "expense-report" },
            { title: "Leave Report", slug: "leave-report" },
            { title: "Camp Report", slug: "camp-report" },
            { title: "Market Survey Report", slug: "market-survey-report" },
            { title: "Doctor Coverage Report", slug: "doctor-coverage-report" },
            { title: "Chemist Coverage Report", slug: "chemist-coverage-report" },
            { title: "Productivity Dashboard", slug: "productivity-dashboard" }
          ]
        };
      } else {
        const titleMap: Record<string, string> = {
          "attendance-report": "Attendance Report",
          "daily-call-report-summary": "Daily Call Report Summary",
          "tour-plan-report": "Tour Plan Report",
          "expense-report": "Expense Report",
          "leave-report": "Leave Report",
          "camp-report": "Camp Report",
          "market-survey-report": "Market Survey Report",
          "doctor-coverage-report": "Doctor Coverage Report",
          "chemist-coverage-report": "Chemist Coverage Report",
          "productivity-dashboard": "Productivity Dashboard"
        };
        node = {
          title: titleMap[lastPart] || lastPart,
          slug: lastPart
        };
      }
    } else if (pathStr.endsWith("doctor/chemist")) {
      node = { title: "Chemist", slug: "chemist" };
    }
  }

  if (!node) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={node.title}
        description="Working modern page for this exact architecture tab. Data CRUD can be wired to its MongoDB collection."
        action={<BackButton fallback="/admin/home" />}
      />
      <AdminDrilldown node={node} path={path} />
    </>
  );
}
