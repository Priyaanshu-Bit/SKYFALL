import * as React from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import {
  getAdminPaymentQueue,
  getPaymentQueueStats,
} from "@/services/admin-payment.service";
import { PaymentVerificationQueue } from "@/features/admin/PaymentVerificationQueue";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Verification Queue | SKYFALL Admin",
  description: "Audit and verify manual FamPay UPI receipts and confirm team tournament registrations.",
};

export default async function AdminPaymentsPage() {
  await requireAdmin();

  const [payments, stats] = await Promise.all([
    getAdminPaymentQueue(),
    getPaymentQueueStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="space-y-1 border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Operational Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Payment Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Review uploaded FamPay UPI transaction screenshots, verify 12-digit UTR references against bank statements, and approve or reject squad registration slots.
        </p>
      </div>

      {/* Verification Queue Workbench */}
      <PaymentVerificationQueue initialPayments={payments} stats={stats} />
    </div>
  );
}
