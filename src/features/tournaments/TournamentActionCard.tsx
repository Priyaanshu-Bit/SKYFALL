"use client";

import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Timer,
  Flame,
  ArrowRight,
  Tv,
  CheckCircle2,
} from "lucide-react";
import { formatPaiseToINR, formatDateTimeIST, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TournamentDetail } from "@/services/tournament.service";

interface TournamentActionCardProps {
  tournament: TournamentDetail;
}

export function TournamentActionCard({ tournament }: TournamentActionCardProps) {
  const isRegistrationOpen = tournament.status === "REGISTRATION_OPEN";
  const isFull = tournament.isFull;
  const isOngoing = tournament.status === "ONGOING";
  const isCompleted = tournament.status === "COMPLETED";
  const isCancelled = tournament.status === "CANCELLED";

  const fillPercentage = Math.min(
    100,
    Math.round((tournament.registeredCount / tournament.teamCapacity) * 100)
  );

  return (
    <div className="sticky top-24 space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
      {/* Financial Summary */}
      <div className="space-y-3 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Entry Fee per Team
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {formatPaiseToINR(tournament.entryFeePaise)}
            </span>
            <span className="text-xs text-slate-400">
              ({tournament.gameMode.playersPerTeam} Players)
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5" />
            <span>Guaranteed Prize Pool</span>
          </span>
          <p className="text-2xl font-black text-emerald-300 mt-0.5">
            {formatPaiseToINR(tournament.totalPrizePoolPaise, { showFree: false })}
          </p>
        </div>
      </div>

      {/* Slots Progress Indicator */}
      <div className="space-y-2 border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Users className="h-3.5 w-3.5 text-skyfall-400" />
            <span>Team Slots</span>
          </span>
          <span className="font-bold text-white">
            {tournament.registeredCount} / {tournament.teamCapacity} Filled
          </span>
        </div>

        {/* Progress track */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              isFull
                ? "bg-amber-500"
                : fillPercentage > 75
                ? "bg-skyfall-400"
                : "bg-emerald-500"
            )}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 text-right">
          {isFull ? (
            <span className="text-amber-400 font-semibold">Tournament Full</span>
          ) : (
            <span>{tournament.availableSlots} slot{tournament.availableSlots === 1 ? "" : "s"} remaining</span>
          )}
        </p>
      </div>

      {/* Deadline Info */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
        <Timer className="h-4 w-4 text-amber-400 shrink-0" />
        <div className="text-[11px]">
          <span className="text-slate-400">Deadline:</span>{" "}
          <span className="font-semibold text-white">
            {formatDateTimeIST(tournament.registrationCloseAt)}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        {isRegistrationOpen && !isFull ? (
          <Link href={`/tournaments/${tournament.id}/register`} className="block">
            <Button
              variant="default"
              size="lg"
              className="w-full gap-2 text-sm font-black shadow-lg shadow-skyfall-500/25"
            >
              <Flame className="h-4 w-4" />
              <span>Register Squad Now</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : isRegistrationOpen && isFull ? (
          <Button
            variant="outline"
            size="lg"
            disabled
            className="w-full border-amber-500/40 text-amber-300 opacity-80 cursor-not-allowed"
          >
            <span>Slots Full — Registration Closed</span>
          </Button>
        ) : isOngoing ? (
          <Link href={`/dashboard/matches`} className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-skyfall-500/50 text-skyfall-400 hover:bg-skyfall-950/50 gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-skyfall-400 animate-ping" />
              <span>Tournament Live — View Room</span>
            </Button>
          </Link>
        ) : isCompleted ? (
          <Link href={`/results`} className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <span>View Tournament Results</span>
            </Button>
          </Link>
        ) : isCancelled ? (
          <Button
            variant="outline"
            size="lg"
            disabled
            className="w-full border-red-500/40 text-red-400 opacity-80 cursor-not-allowed"
          >
            <span>Tournament Cancelled</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            disabled
            className="w-full border-slate-700 text-slate-400 opacity-80 cursor-not-allowed"
          >
            <span>Registration Not Started</span>
          </Button>
        )}
      </div>

      {/* Livestream link if configured */}
      {tournament.livestreamUrl && (
        <a
          href={tournament.livestreamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-950/20 py-2.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-950/40"
        >
          <Tv className="h-3.5 w-3.5" />
          <span>Watch Live YouTube Stream</span>
        </a>
      )}

      {/* Security note */}
      <div className="pt-2 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
        <span>100% Verified Prize Pool Guarantee</span>
      </div>
    </div>
  );
}
