import * as React from "react";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getPlayerPayments } from "@/services/player-dashboard.service";
import { PlayerPaymentsTable } from "@/features/registrations/PlayerPaymentsTable";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment History | SKYFALL Player Hub",
  description: "View your submitted FamPay UPI payment receipts and verification status.",
};

export default async function PlayerPaymentsPage() {
  const user = await requireAuth();
  const payments = await getPlayerPayments(user.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Financial Records</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Payment & Transaction History
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Track all submitted FamPay UPI entry fee payments, transaction references, and administrator verification decisions.
        </p>
      </div>

      {/* Payments Table / Mobile Cards */}
      <PlayerPaymentsTable payments={payments} />
    </div>
  );
}
