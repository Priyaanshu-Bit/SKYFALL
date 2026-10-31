"use client";

import * as React from "react";
import {
  DollarSign,
  Trophy,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Receipt,
  Shield,
} from "lucide-react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FulfillPayoutModal } from "@/features/admin/FulfillPayoutModal";
import { formatPaiseToINR, formatDateIST } from "@/lib/utils";
import type {
  FinancialStats,
  PrizeDistributionItem,
  CollectionLedgerItem,
} from "@/services/admin-financial.service";
import type { PayoutStatus } from "@prisma/client";

interface FinancialManagementWorkbenchProps {
  stats: FinancialStats;
  initialPrizes: PrizeDistributionItem[];
  initialCollections: CollectionLedgerItem[];
}

export function FinancialManagementWorkbench({
  stats,
  initialPrizes,
  initialCollections,
}: FinancialManagementWorkbenchProps) {
  const [activeTab, setActiveTab] = React.useState<"PRIZES" | "COLLECTIONS">("PRIZES");
  const [prizes, setPrizes] = React.useState<PrizeDistributionItem[]>(initialPrizes);

  React.useEffect(() => {
    setPrizes(initialPrizes);
  }, [initialPrizes]);
  const [collections] = React.useState<CollectionLedgerItem[]>(initialCollections);
  const [prizeFilter, setPrizeFilter] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");
  const [activeModalPrize, setActiveModalPrize] =
    React.useState<PrizeDistributionItem | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrizes = prizes.filter((p) => {
    const s = search.toLowerCase();
    const matchesSearch =
      p.tournament.name.toLowerCase().includes(s) ||
      (p.recipientTeam?.name.toLowerCase().includes(s) ?? false) ||
      p.title.toLowerCase().includes(s);

    const matchesStatus =
      prizeFilter === "ALL" || p.payoutStatus === prizeFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredCollections = collections.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.registration.tournament.name.toLowerCase().includes(s) ||
      c.registration.team.name.toLowerCase().includes(s) ||
      c.transactionReference.toLowerCase().includes(s)
    );
  });

  const getPayoutStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case "CONFIGURED":
        return (
          <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900 text-xs">
            Configured
          </Badge>
        );
      case "ASSIGNED":
        return (
          <Badge variant="warning" className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs gap-1 font-bold">
            <Clock className="h-3 w-3" />
            <span>Assigned (Pending Payout)</span>
          </Badge>
        );
      case "PAID":
        return (
          <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Paid & Disbursed</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Financial Operations & Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial Management & Prize Fulfillment
          </h1>
          <p className="text-sm text-slate-400">
            Audit verified FamPay collections, disburse prize money to tournament champions, and track net margin.
          </p>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Verified Collections */}
        <Card className="border-slate-800 bg-slate-900/60 p-3.5">
          <p className="text-[11px] text-slate-400">Verified Revenue</p>
          <p className="text-xl font-black text-emerald-400">
            {formatPaiseToINR(stats.totalVerifiedCollectionsPaise, { showFree: false })}
          </p>
          <p className="text-[10px] text-slate-500">Approved UPI receipts</p>
        </Card>

        {/* Pending Collections */}
        <Card className="border-slate-800 bg-slate-900/60 p-3.5">
          <p className="text-[11px] text-slate-400">Pending Review</p>
          <p className="text-xl font-black text-amber-300">
            {formatPaiseToINR(stats.pendingVerificationPaise, { showFree: false })}
          </p>
          <p className="text-[10px] text-slate-500">Unverified queue</p>
        </Card>

        {/* Total Prize Pool Commitments */}
        <Card className="border-slate-800 bg-slate-900/60 p-3.5">
          <p className="text-[11px] text-slate-400">Prize Obligations</p>
          <p className="text-xl font-black text-white">
            {formatPaiseToINR(stats.totalPrizeCommitmentsPaise, { showFree: false })}
          </p>
          <p className="text-[10px] text-slate-500">Total committed pots</p>
        </Card>

        {/* Paid Prizes */}
        <Card className="border-slate-800 bg-slate-900/60 p-3.5">
          <p className="text-[11px] text-slate-400">Paid Out</p>
          <p className="text-xl font-black text-emerald-400">
            {formatPaiseToINR(stats.totalPaidPrizesPaise, { showFree: false })}
          </p>
          <p className="text-[10px] text-slate-500">Disbursed to captains</p>
        </Card>

        {/* Outstanding Payouts */}
        <Card className="border-slate-800 bg-slate-900/60 p-3.5">
          <p className="text-[11px] text-slate-400">Awaiting Payout</p>
          <p className="text-xl font-black text-amber-400">
            {formatPaiseToINR(stats.outstandingPrizeObligationsPaise, { showFree: false })}
          </p>
          <p className="text-[10px] text-slate-500">Assigned champions</p>
        </Card>

        {/* Net Organizer Margin */}
        <Card className="border-amber-500/30 bg-amber-950/20 p-3.5">
          <p className="text-[11px] text-amber-400 font-semibold">Net Platform Margin</p>
          <p
            className={`text-xl font-black ${
              stats.netOrganizerMarginPaise >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {stats.netOrganizerMarginPaise >= 0 ? "+" : ""}
            {formatPaiseToINR(stats.netOrganizerMarginPaise, { showFree: false })}
          </p>
          <p className="text-[10px] text-slate-400">Revenue - Prizes</p>
        </Card>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("PRIZES");
            setSearch("");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
            activeTab === "PRIZES"
              ? "border-amber-500 text-amber-400 bg-amber-500/10"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Trophy className="h-4 w-4" />
          <span>Prize Payout Fulfillment Queue</span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
            {prizes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("COLLECTIONS");
            setSearch("");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
            activeTab === "COLLECTIONS"
              ? "border-amber-500 text-amber-400 bg-amber-500/10"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Verified Collections Ledger</span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
            {collections.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PRIZE FULFILLMENT QUEUE */}
      {activeTab === "PRIZES" && (
        <div className="space-y-4">
          {/* Sub Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "All Prizes", value: "ALL" },
                { label: "Assigned (Needs Payout)", value: "ASSIGNED" },
                { label: "Paid", value: "PAID" },
                { label: "Configured (Upcoming)", value: "CONFIGURED" },
              ].map((subTab) => (
                <Button
                  key={subTab.value}
                  variant={prizeFilter === subTab.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrizeFilter(subTab.value)}
                  className={
                    prizeFilter === subTab.value
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "border-slate-700 text-slate-300 text-xs"
                  }
                >
                  {subTab.label}
                </Button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search tournament, squad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          {filteredPrizes.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/40 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3">
                <Trophy className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg text-white">No Prize Records Found</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Prizes are configured upon tournament creation and assigned upon match completion.
              </CardDescription>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPrizes.map((p) => {
                const isAssigned = p.payoutStatus === "ASSIGNED";
                const isPaid = p.payoutStatus === "PAID";

                return (
                  <Card
                    key={p.id}
                    className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Placement & Tournament */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {getPayoutStatusBadge(p.payoutStatus)}
                          <span className="text-xs font-bold text-amber-400">
                            #{p.position} — {p.title}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-300">
                            {p.tournament.name}
                          </span>
                        </div>

                        {/* Recipient Squad */}
                        <div className="text-sm">
                          {p.recipientTeam ? (
                            <p className="font-bold text-white">
                              Winning Squad:{" "}
                              <span className="text-amber-300">{p.recipientTeam.name}</span>
                              {p.recipientTeam.captain && (
                                <span className="text-xs font-normal text-slate-400 ml-2">
                                  (Capt: {p.recipientTeam.captain.name || p.recipientTeam.captain.email} • Tel:{" "}
                                  {p.recipientTeam.captain.phone || "N/A"})
                                </span>
                              )}
                            </p>
                          ) : (
                            <p className="text-xs text-slate-500 italic">
                              Winning squad to be determined upon tournament finals
                            </p>
                          )}
                        </div>

                        {isPaid && p.paidAt && (
                          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Paid on {formatDateIST(p.paidAt)}</span>
                          </p>
                        )}
                      </div>

                      {/* Middle: Prize Amount */}
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-right shrink-0">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Prize Allocation
                        </span>
                        <span className="text-xl font-black text-amber-400">
                          {formatPaiseToINR(p.prizeAmountPaise, { showFree: false })}
                        </span>
                      </div>

                      {/* Right: Action */}
                      <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                        {isAssigned ? (
                          <Button
                            size="sm"
                            onClick={() => setActiveModalPrize(p)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
                          >
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>Fulfill Payout</span>
                          </Button>
                        ) : isPaid ? (
                          <span className="text-xs text-slate-500">Fulfilled</span>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Awaiting Winner</span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VERIFIED COLLECTIONS LEDGER */}
      {activeTab === "COLLECTIONS" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search tournament, squad, UTR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          {filteredCollections.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/40 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3">
                <Receipt className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg text-white">No Verified Collections Yet</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Approved payments from the verification queue will appear here in the audited ledger.
              </CardDescription>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredCollections.map((col) => (
                <Card
                  key={col.id}
                  className="border-slate-800 bg-slate-900/80 p-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                          Approved
                        </Badge>
                        <span className="text-xs font-bold text-white">
                          {col.registration.team.name}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-300">
                          {col.registration.tournament.name}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>
                          UTR: <strong className="text-slate-200 font-mono">{col.transactionReference}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(col.transactionReference, col.id)}
                          className="text-slate-500 hover:text-amber-400"
                        >
                          {copiedId === col.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <span className="text-slate-600">•</span>
                        <span>
                          Verified: {col.verifiedAt ? formatDateIST(col.verifiedAt) : "N/A"}
                        </span>
                        {col.verifiedBy && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span>Admin: {col.verifiedBy.name || col.verifiedBy.email}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-400">
                        {formatPaiseToINR(col.amountPaise, { showFree: false })}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fulfill Payout Modal */}
      <FulfillPayoutModal
        prize={activeModalPrize}
        isOpen={!!activeModalPrize}
        onClose={() => setActiveModalPrize(null)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
