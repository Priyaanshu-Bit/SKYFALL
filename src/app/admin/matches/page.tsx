import * as React from "react";
import { requireAdmin } from "@/lib/auth";
import { getAllMatchesForAdmin } from "@/services/admin-match.service";
import { GlobalMatchesWorkbench } from "@/features/admin/GlobalMatchesWorkbench";

export default async function AdminMatchesPage() {
  // Enforce administrative authorization
  await requireAdmin();

  const { matches, stats } = await getAllMatchesForAdmin();

  return (
    <div className="py-2">
      <GlobalMatchesWorkbench
        initialMatches={matches}
        initialStats={stats}
      />
    </div>
  );
}
