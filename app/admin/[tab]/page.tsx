#The admin portal
import { notFound } from "next/navigation";
import { AdminTabGrid } from "@/components/admin-tab-grid";
import { AdminHomeDashboard } from "@/components/admin-home-dashboard";
import { BackButton } from "@/components/back-button";
import { PageHeader } from "@/components/page-components";
import { adminTabMeta, getAdminTab } from "@/lib/admin-tabs";

export default async function AdminTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const node = getAdminTab(tab);
  const meta = adminTabMeta[tab];

  if (!node || !meta) {
    notFound();
  }

  const rootPath = tab === "home" ? ["division-dashboard", "division-navigation-tabs"] : ["division-dashboard", "division-navigation-tabs", node.slug];

  return (
    <>
      <PageHeader
        eyebrow={meta.eyebrow}
        title={meta.title}
        description={meta.description}
        action={tab === "home" ? undefined : <BackButton />}
      />
      {tab === "home" ? <AdminHomeDashboard /> : <AdminTabGrid node={node} path={rootPath} />}
    </>
  );
}
