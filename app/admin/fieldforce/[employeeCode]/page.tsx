import { BackButton } from "@/components/back-button";
import { PageHeader, StatusBadge } from "@/components/page-components";

export default async function FieldforceDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ employeeCode: string }>;
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const { employeeCode } = await params;
  const { month = "Apr", year = "2026" } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="FieldForce View"
        title={`FieldForce ${employeeCode}`}
        description={`Detailed dashboard for ${employeeCode} during ${month} ${year}. This screen is ready for user-specific DCR, TP, attendance, and doctor coverage records.`}
        action={<BackButton fallback="/admin/home" />}
      />
      <div className="grid grid-3">
        <article className="card">
          <h3 className="section-title">DCR Summary</h3>
          <p className="metric-value">0</p>
          <p className="muted">Submitted records for selected period.</p>
          <StatusBadge status="READY" />
        </article>
        <article className="card">
          <h3 className="section-title">Doctor Coverage</h3>
          <p className="metric-value">0%</p>
          <p className="muted">Coverage will calculate from mapped doctors.</p>
          <StatusBadge status="READY" />
        </article>
        <article className="card">
          <h3 className="section-title">Attendance</h3>
          <p className="metric-value">0</p>
          <p className="muted">Attendance days for selected month.</p>
          <StatusBadge status="READY" />
        </article>
      </div>
    </>
  );
}
