"use client";

import * as React from "react";
import Image from "next/image";
import {
  CreditCard,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPaiseToINR, formatDateTimeIST } from "@/lib/utils";
import type { PlayerPaymentItem } from "@/services/player-dashboard.service";

interface PlayerPaymentsTableProps {
  payments: PlayerPaymentItem[];
}

export function PlayerPaymentsTable({ payments }: PlayerPaymentsTableProps) {
  const [copiedUtr, setCopiedUtr] = React.useState<string | null>(null);
  const [viewingScreenshot, setViewingScreenshot] = React.useState<string | null>(null);

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No Payment Records Found"
        description="You have not submitted any UPI tournament payments yet. When you enter paid competitive brackets, your payment receipts and verification status will appear here."
        className="my-8"
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Desktop Table View (>= 768px) */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 uppercase text-[10px] font-bold tracking-wider text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Tournament / Squad
                </th>
                <th scope="col" className="px-6 py-4">
                  UTR Reference
                </th>
                <th scope="col" className="px-6 py-4">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4">
                  Submitted At
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Proof
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {payments.map((p) => {
                const isCopied = copiedUtr === p.transactionReference;
                return (
                  <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">
                        {p.registration.tournament.name}
                      </div>
                      <div className="text-[11px] text-skyfall-400">
                        Squad: {p.registration.team.name}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-slate-200">
                        <span>{p.transactionReference}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyUtr(p.transactionReference)}
                          className="rounded p-1 text-slate-400 hover:text-white"
                          title="Copy UTR"
                        >
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-white">
                      {formatPaiseToINR(p.amountPaise)}
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {formatDateTimeIST(p.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <PaymentStatusBadge status={p.status} />
                        {p.rejectionReason && (
                          <p className="text-[10px] text-red-400 line-clamp-1" title={p.rejectionReason}>
                            Reason: {p.rejectionReason}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {p.screenshotUrl && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingScreenshot(p.screenshotUrl)}
                          className="gap-1.5 text-xs h-8"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Receipt</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (< 768px) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {payments.map((p) => {
            const isCopied = copiedUtr === p.transactionReference;
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-lg text-xs"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {p.registration.tournament.name}
                    </h4>
                    <span className="text-skyfall-400 font-semibold text-[11px]">
                      Squad: {p.registration.team.name}
                    </span>
                  </div>
                  <PaymentStatusBadge status={p.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Amount Paid</span>
                    <span className="font-black text-white text-sm">
                      {formatPaiseToINR(p.amountPaise)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Date</span>
                    <span className="text-slate-300">
                      {formatDateTimeIST(p.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] text-slate-400 block">UTR Reference</span>
                    <span className="font-mono font-bold text-slate-200 truncate block">
                      {p.transactionReference}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyUtr(p.transactionReference)}
                    className="h-7 px-2 text-xs"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>

                {p.rejectionReason && (
                  <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-2.5 text-red-300 text-[11px]">
                    <span className="font-bold">Rejection Note:</span> {p.rejectionReason}
                  </div>
                )}

                {p.screenshotUrl && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setViewingScreenshot(p.screenshotUrl)}
                    className="w-full gap-1.5 text-xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Submitted Receipt</span>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Screenshot Viewer Modal */}
      <Modal
        isOpen={Boolean(viewingScreenshot)}
        onClose={() => setViewingScreenshot(null)}
        title="Payment Screenshot Receipt"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="relative h-96 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
            {viewingScreenshot && (
              <Image
                src={viewingScreenshot}
                alt="Payment proof screenshot"
                fill
                unoptimized
                className="object-contain"
              />
            )}
          </div>
          <p className="text-xs text-slate-400 text-center">
            Submitted payment receipt under review by SKYFALL platform administrators.
          </p>
        </div>
      </Modal>
    </>
  );
}
