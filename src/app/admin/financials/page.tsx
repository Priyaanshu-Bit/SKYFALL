import * as React from "react";
import { requireAdmin } from "@/lib/auth";
import {
  getFinancialOverviewStats,
  getPrizeDistributionsList,
  getCollectionsLedger,
} from "@/services/admin-financial.service";
import { FinancialManagementWorkbench } from "@/features/admin/FinancialManagementWorkbench";

export default async function AdminFinancialsPage() {
  // Enforce administrative authorization
  await requireAdmin();

  const [stats, prizes, collections] = await Promise.all([
    getFinancialOverviewStats(),
    getPrizeDistributionsList(),
    getCollectionsLedger(),
  ]);

  return (
    <div className="py-2">
      <FinancialManagementWorkbench
        stats={stats}
        initialPrizes={prizes}
        initialCollections={collections}
      />
    </div>
  );
}
