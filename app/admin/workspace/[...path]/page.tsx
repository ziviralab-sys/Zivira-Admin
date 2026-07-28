import { notFound } from "next/navigation";
import { AdminDrilldown } from "@/components/admin-drilldown";
import { BackButton } from "@/components/back-button";
import { PageHeader } from "@/components/page-components";
import { findTreeNode } from "@/lib/tree-lookup";

export default async function AdminWorkspacePage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const node = findTreeNode(path);

  if (!node) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Module"
        title={node.title}
        description="Working modern page for this exact architecture tab. Data CRUD can be wired to its MongoDB collection."
        action={<BackButton fallback="/admin/home" />}
      />
      <AdminDrilldown node={node} path={path} />
    </>
  );
}
