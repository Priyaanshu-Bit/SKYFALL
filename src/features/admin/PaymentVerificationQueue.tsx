"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Search,
  Check,
  X,
  Copy,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Users,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPaiseToINR, formatDateTimeIST, cn } from "@/lib/utils";
import { approvePaymentAction, rejectPaymentAction } from "./actions";
import { playSuccessTone, playErrorTone, playClickTone } from "@/lib/sound";
import type {
  AdminPaymentQueueItem,
  PaymentQueueStats,
} from "@/services/admin-payment.service";
import type { PaymentStatus } from "@prisma/client";

interface PaymentVerificationQueueProps {
  initialPayments: AdminPaymentQueueItem[];
  stats: PaymentQueueStats;
}

export function PaymentVerificationQueue({
  initialPayments,
  stats,
}: PaymentVerificationQueueProps) {
  const router = useRouter();

  const [payments, setPayments] = React.useState<AdminPaymentQueueItem[]>(initialPayments);
  const [activeTab, setActiveTab] = React.useState<PaymentStatus | "ALL">("UNDER_VERIFICATION");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [copiedUtr, setCopiedUtr] = React.useState<string | null>(null);

  // Review Modal State
  const [selectedPayment, setSelectedPayment] = React.useState<AdminPaymentQueueItem | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  // Rejection Sub-State
  const [showRejectForm, setShowRejectForm] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");

  React.useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    playClickTone();
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleOpenReview = (payment: AdminPaymentQueueItem) => {
    setSelectedPayment(payment);
    setShowRejectForm(false);
    setRejectionReason("");
    setActionError(null);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setShowRejectForm(false);
    setRejectionReason("");
    setActionError(null);
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;
    setIsProcessing(true);
    setActionError(null);

    try {
      const res = await approvePaymentAction(selectedPayment.id);
      if (!res.success) {
        playErrorTone();
        setActionError(res.error || "Failed to approve payment.");
        setIsProcessing(false);
        return;
      }

      playSuccessTone();
      // Update local item
      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id
            ? { ...p, status: "APPROVED", verifiedAt: new Date() }
            : p
        )
      );

      handleCloseModal();
      router.refresh();
    } catch {
      playErrorTone();
      setActionError("A network error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    const reason = rejectionReason.trim();
    if (!reason) {
      playErrorTone();
      setActionError("Please provide an administrative rejection explanation.");
      return;
    }

    setIsProcessing(true);
    setActionError(null);

    try {
      const res = await rejectPaymentAction(selectedPayment.id, reason);
      if (!res.success) {
        playErrorTone();
        setActionError(res.error || "Failed to reject payment.");
        setIsProcessing(false);
        return;
      }

      playErrorTone(); // Rejection alert tone
      // Update local item
      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id
            ? {
                ...p,
                status: "REJECTED",
                rejectionReason: reason,
                verifiedAt: new Date(),
              }
            : p
        )
      );

      handleCloseModal();
      router.refresh();
    } catch {
      playErrorTone();
      setActionError("A network error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  // Filter list by tab and search
  const filteredPayments = React.useMemo(() => {
    return payments.filter((p) => {
      const matchesTab = activeTab === "ALL" || p.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.transactionReference.toLowerCase().includes(q) ||
        p.registration.team.name.toLowerCase().includes(q) ||
        p.registration.tournament.name.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [payments, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-400">
            <span>Awaiting Review</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-amber-300">{stats.pendingCount}</p>
          <p className="text-[11px] text-slate-400">Requires manual audit</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <span>Approved Payments</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-emerald-300">{stats.approvedCount}</p>
          <p className="text-[11px] text-slate-400">Confirmed registrations</p>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-red-400">
            <span>Rejected Receipts</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-red-300">{stats.rejectedCount}</p>
          <p className="text-[11px] text-slate-400">Denied or invalid UTRs</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Verified Collections</span>
            <CreditCard className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {formatPaiseToINR(stats.totalVerifiedAmountPaise, { showFree: false })}
          </p>
          <p className="text-[11px] text-slate-400">Actual collected revenue</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("UNDER_VERIFICATION")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shrink-0",
              activeTab === "UNDER_VERIFICATION"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-950/40 text-slate-400 hover:text-white"
            )}
          >
            <span>Pending Review</span>
            <span className="rounded-full bg-slate-950/30 px-1.5 py-0.2 text-[10px] font-black">
              {stats.pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("APPROVED")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shrink-0",
              activeTab === "APPROVED"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-950/40 text-slate-400 hover:text-white"
            )}
          >
            <span>Approved</span>
            <span className="rounded-full bg-slate-950/30 px-1.5 py-0.2 text-[10px] font-black">
              {stats.approvedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("REJECTED")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shrink-0",
              activeTab === "REJECTED"
                ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                : "bg-slate-950/40 text-slate-400 hover:text-white"
            )}
          >
            <span>Rejected</span>
            <span className="rounded-full bg-slate-950/30 px-1.5 py-0.2 text-[10px] font-black">
              {stats.rejectedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shrink-0",
              activeTab === "ALL"
                ? "bg-slate-700 text-white"
                : "bg-slate-950/40 text-slate-400 hover:text-white"
            )}
          >
            All Submissions
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search UTR, Squad, or Tournament..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Queue Table */}
      {filteredPayments.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 uppercase text-[10px] font-bold tracking-wider text-slate-400">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Squad & Captain
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Tournament
                </th>
                <th scope="col" className="px-5 py-3.5">
                  12-Digit UTR
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Amount
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Submitted At
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPayments.map((p) => {
                const isCopied = copiedUtr === p.transactionReference;
                return (
                  <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white text-sm">
                        {p.registration.team.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{p.registration.registeredBy.name || "Captain"}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-200">
                        {p.registration.tournament.name}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {p.registration.tournament.gameMode.name}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
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

                    <td className="px-5 py-3.5 font-black text-white">
                      {formatPaiseToINR(p.amountPaise)}
                    </td>

                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {formatDateTimeIST(p.createdAt)}
                    </td>

                    <td className="px-5 py-3.5">
                      <PaymentStatusBadge status={p.status} />
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant={p.status === "UNDER_VERIFICATION" ? "default" : "outline"}
                        onClick={() => handleOpenReview(p)}
                        className={cn(
                          "gap-1 text-xs h-8 font-bold",
                          p.status === "UNDER_VERIFICATION"
                            ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                            : ""
                        )}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Review</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No Transactions In This View"
          description="There are currently no payment submissions matching your active filter criteria."
          className="my-8"
        />
      )}

      {/* Review & Decision Modal */}
      {selectedPayment && (
        <Modal
          isOpen={Boolean(selectedPayment)}
          onClose={handleCloseModal}
          title="Review Payment Proof"
          className="max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left: High-Res Screenshot Viewer */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Submitted Payment Proof
              </span>
              <div className="relative h-96 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
                {selectedPayment.screenshotUrl ? (
                  <Image
                    src={selectedPayment.screenshotUrl}
                    alt="Payment receipt screenshot"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                    No screenshot uploaded
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Compare UTR and timestamp against the organizer FamPay bank statement.
              </p>
            </div>

            {/* Right: Verification Workbench */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                {/* UTR Callout */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    12-Digit Transaction Reference (UTR)
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-black text-white">
                      {selectedPayment.transactionReference}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUtr(selectedPayment.transactionReference)}
                      className="h-8 gap-1.5 text-xs"
                    >
                      {copiedUtr === selectedPayment.transactionReference ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy UTR</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Amount Callout */}
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
                  <span className="text-slate-400">Expected Entry Fee:</span>
                  <span className="font-black text-white text-base">
                    {formatPaiseToINR(selectedPayment.amountPaise)}
                  </span>
                </div>

                {/* Squad & Captain Details */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">
                      {selectedPayment.registration.team.name}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {selectedPayment.registration.tournament.gameMode.name}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-slate-500" />
                      <span>{selectedPayment.registration.registeredBy.name || "Captain"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span>{selectedPayment.registration.registeredBy.email}</span>
                    </div>
                    {selectedPayment.registration.registeredBy.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        <span>{selectedPayment.registration.registeredBy.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Squad Roster */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>Roster Players & Free Fire UIDs</span>
                  </span>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {selectedPayment.registration.team.members.map((m, idx) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-[11px] text-slate-300 border-b border-slate-900 pb-1"
                      >
                        <span>
                          #{idx + 1} {m.playerName} {m.isCaptain && "(C)"}
                        </span>
                        <span className="font-mono text-slate-400">UID: {m.freeFireUid}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Rejection Panel */}
              <div className="space-y-3 pt-2">
                {actionError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
                    {actionError}
                  </div>
                )}

                {showRejectForm ? (
                  <div className="space-y-3 rounded-xl border border-red-500/30 bg-red-950/20 p-3.5">
                    <div className="flex items-center justify-between text-xs font-bold text-red-400">
                      <span>Reason for Rejection</span>
                      <button
                        type="button"
                        onClick={() => setShowRejectForm(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Quick Reason Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Invalid UTR reference",
                        "Amount mismatch",
                        "Screenshot unreadable",
                        "Duplicate receipt",
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setRejectionReason(preset)}
                          className="rounded bg-slate-900 border border-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-800"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain to captain why payment proof is rejected..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-400"
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isProcessing || !rejectionReason.trim()}
                      onClick={handleReject}
                      className="w-full font-bold"
                    >
                      {isProcessing ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="destructive"
                      size="lg"
                      disabled={isProcessing}
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1 font-bold"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject Proof</span>
                    </Button>

                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      disabled={isProcessing}
                      onClick={handleApprove}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-500/20"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve & Confirm Slot</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
