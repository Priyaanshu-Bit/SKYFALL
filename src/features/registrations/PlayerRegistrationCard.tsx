"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  KeyRound,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  RegistrationStatusBadge,
  TournamentStatusBadge,
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPaiseToINR, formatDateIST } from "@/lib/utils";
import type { PlayerRegistrationItem } from "@/services/player-dashboard.service";

interface PlayerRegistrationCardProps {
  registration: PlayerRegistrationItem;
}

export function PlayerRegistrationCard({
  registration,
}: PlayerRegistrationCardProps) {
  const [showRoster, setShowRoster] = React.useState(false);
  const [copiedRoomId, setCopiedRoomId] = React.useState(false);
  const [copiedPass, setCopiedPass] = React.useState(false);

  const { tournament, team, payment, registrationStatus } = registration;

  // Find active match with room credentials if room is open
  const activeRoomMatch = tournament.matches?.find(
    (m) => m.status === "ROOM_OPEN" && m.roomId
  );

  const handleCopy = (text: string, type: "room" | "pass") => {
    navigator.clipboard.writeText(text);
    if (type === "room") {
      setCopiedRoomId(true);
      setTimeout(() => setCopiedRoomId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-sm transition-all hover:border-slate-700">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/60 p-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/tournaments/${tournament.id}`}
            className="text-base sm:text-lg font-black text-white hover:text-skyfall-400 transition-colors"
          >
            {tournament.name}
          </Link>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-semibold text-slate-300">
            {tournament.gameMode.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TournamentStatusBadge status={tournament.status} />
          <RegistrationStatusBadge status={registrationStatus} />
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Core Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Squad Info */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-skyfall-400" />
              <span>Registered Squad</span>
            </span>
            <p className="text-sm font-bold text-white truncate">{team.name}</p>
            <p className="text-[11px] text-slate-400">
              {team.members.length} Players • Captain:{" "}
              {team.members.find((m) => m.isCaptain)?.playerName || "You"}
            </p>
          </div>

          {/* Schedule Info */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-skyfall-400" />
              <span>Match Schedule</span>
            </span>
            <p className="text-sm font-bold text-white">
              {formatDateIST(tournament.tournamentDate)}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Starts: {tournament.startTime}</span>
            </p>
          </div>

          {/* Payment & Slot Status */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-skyfall-400" />
              <span>Payment Details</span>
            </span>
            <p className="text-sm font-bold text-white">
              {formatPaiseToINR(tournament.entryFeePaise)}
            </p>
            {payment?.transactionReference ? (
              <p className="text-[11px] text-slate-400 font-mono">
                UTR: {payment.transactionReference}
              </p>
            ) : (
              <p className="text-[11px] text-amber-400">Payment pending submission</p>
            )}
          </div>
        </div>

        {/* Status Callouts */}
        {registrationStatus === "REJECTED" && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              <span>Payment Verification Rejected</span>
            </div>
            <p className="text-xs text-red-200">
              Reason:{" "}
              <strong className="text-white">
                {payment?.rejectionReason || "Transaction reference could not be verified on the bank statement."}
              </strong>
            </p>
            <Link
              href={`/tournaments/${tournament.id}/payment?registrationId=${registration.id}`}
              className="inline-block pt-1"
            >
              <Button size="sm" variant="destructive" className="text-xs gap-1.5">
                <span>Resubmit Corrected Payment Proof</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        )}

        {registrationStatus === "PAYMENT_SUBMITTED" && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-center gap-3 text-xs text-amber-300">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span>
              Your payment receipt is under administrator verification. Your slot will be confirmed once matched with our bank records.
            </span>
          </div>
        )}

        {/* Live Match Room Credentials (Unlocked only for confirmed registrations) */}
        {registrationStatus === "CONFIRMED" && (
          <div className="rounded-xl border border-skyfall-500/30 bg-skyfall-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-skyfall-400 flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                <span>Custom Room Credentials</span>
              </span>

              {activeRoomMatch ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Room Open</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Releases 15 mins before match
                </span>
              )}
            </div>

            {activeRoomMatch ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Room ID */}
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Room ID:</span>
                    <p className="text-sm font-mono font-bold text-white">
                      {activeRoomMatch.roomId}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(activeRoomMatch.roomId!, "room")}
                    className="h-8 px-2 text-xs"
                  >
                    {copiedRoomId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Password:</span>
                    <p className="text-sm font-mono font-bold text-white">
                      {activeRoomMatch.roomPassword}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(activeRoomMatch.roomPassword!, "pass")}
                    className="h-8 px-2 text-xs"
                  >
                    {copiedPass ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Room ID & Password will be distributed here automatically 15 minutes prior to the tournament start time. Ensure all squad players are logged into Free Fire.
              </p>
            )}
          </div>
        )}

        {/* Collapsible Squad Roster */}
        <div className="border-t border-slate-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowRoster(!showRoster)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <span>View Squad Roster ({team.members.length} Players)</span>
            {showRoster ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showRoster && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
              {team.members.map((member, i) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      #{i + 1}
                    </span>
                    <span className="font-bold text-white">
                      {member.playerName}
                    </span>
                    {member.isCaptain && (
                      <span className="rounded bg-skyfall-950 border border-skyfall-500/30 px-1.5 py-0.2 text-[9px] font-bold text-skyfall-400">
                        Captain
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">
                    UID: {member.freeFireUid}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      {registrationStatus === "PENDING_PAYMENT" && tournament.entryFeePaise > 0 && (
        <div className="border-t border-slate-800 bg-slate-950/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Payment required to lock in slot #{team.name}
          </span>
          <Link
            href={`/tournaments/${tournament.id}/payment?registrationId=${registration.id}`}
            className="w-full sm:w-auto"
          >
            <Button size="sm" variant="default" className="w-full sm:w-auto gap-2 font-bold">
              <span>Complete Payment</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
