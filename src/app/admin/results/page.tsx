import * as React from "react";
import { requireAdmin } from "@/lib/auth";
import { getAllResultsForAdmin } from "@/services/admin-result.service";
import { GlobalResultsWorkbench } from "@/features/admin/GlobalResultsWorkbench";

export default async function AdminResultsPage() {
  // Enforce administrative authorization
  await requireAdmin();

  const { matches, stats } = await getAllResultsForAdmin();

  return (
    <div className="py-2">
      <GlobalResultsWorkbench
        initialMatches={matches}
        initialStats={stats}
      />
    </div>
  );
}
