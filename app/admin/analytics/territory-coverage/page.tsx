import { Suspense } from "react";
import { TerritoryCoverageAnalytics } from "@/components/territory-coverage-analytics";

export default function TerritoryCoveragePage() {
  return (
    <Suspense fallback={null}>
      <TerritoryCoverageAnalytics />
    </Suspense>
  );
}
