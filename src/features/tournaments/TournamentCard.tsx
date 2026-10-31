"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Swords,
  ArrowRight,
  Flame,
} from "lucide-react";
import { formatPaiseToINR, formatDateIST, cn } from "@/lib/utils";
import { TournamentStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TournamentListItem } from "@/services/tournament.service";

export interface TournamentCardProps {
  tournament: TournamentListItem;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const isRegistrationOpen = tournament.status === "REGISTRATION_OPEN";
  const isOngoing = tournament.status === "ONGOING";
  const isCompleted = tournament.status === "COMPLETED";

  // Calculate slot fill percentage
  const fillPercentage = Math.min(
    100,
    Math.round((tournament.registeredCount / tournament.teamCapacity) * 100)
  );

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-100 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-skyfall-500/50 hover:shadow-2xl hover:shadow-skyfall-500/10">
      {/* Top Banner / Visual Accent */}
      <div className="relative h-32 w-full bg-gradient-to-br from-slate-800 via-slate-900 to-skyfall-950/60 overflow-hidden">
        {tournament.bannerUrl ? (
          <Image
            src={tournament.bannerUrl}
            alt={tournament.name}
            fill
            unoptimized
            className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Flame className="h-12 w-12 text-skyfall-500/20" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Badges on Banner */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200 backdrop-blur-md">
            <Swords className="h-3 w-3 text-skyfall-400" />
            <span>{tournament.gameMode.name}</span>
          </span>

          <TournamentStatusBadge status={tournament.status} />
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        {/* Title */}
        <div>
          <Link
            href={`/tournaments/${tournament.id}`}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 rounded"
          >
            <h3 className="text-lg font-black tracking-tight text-white line-clamp-1 group-hover:text-skyfall-400 transition-colors">
              {tournament.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span>Format: {tournament.tournamentFormat}</span>
            <span className="text-slate-600">•</span>
            <span>{tournament.game}</span>
          </p>
        </div>

        {/* Key Metrics: Entry Fee & Prize Pool */}
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Entry Fee
            </span>
            <p className="text-sm font-black text-white">
              {formatPaiseToINR(tournament.entryFeePaise)}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Prize Pool
            </span>
            <p className="text-sm font-black text-emerald-400 flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>{formatPaiseToINR(tournament.totalPrizePoolPaise, { showFree: false })}</span>
            </p>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatDateIST(tournament.tournamentDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{tournament.startTime}</span>
          </div>
        </div>

        {/* Slots Capacity Progress */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Users className="h-3.5 w-3.5" />
              <span>Slots Filled</span>
            </span>
            <span className="font-semibold text-slate-200">
              {tournament.registeredCount} / {tournament.teamCapacity} Teams
            </span>
          </div>
          {/* Progress track */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                tournament.isFull
                  ? "bg-amber-500"
                  : fillPercentage > 75
                  ? "bg-skyfall-400"
                  : "bg-emerald-500"
              )}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="border-t border-slate-800/80 p-4 bg-slate-950/40">
        <Link href={`/tournaments/${tournament.id}`} className="w-full block">
          {isRegistrationOpen && !tournament.isFull ? (
            <Button variant="default" size="sm" className="w-full gap-2 font-bold shadow-md shadow-skyfall-500/20">
              <span>Register Now</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : isRegistrationOpen && tournament.isFull ? (
            <Button variant="outline" size="sm" className="w-full border-amber-500/40 text-amber-300 hover:bg-amber-950/30">
              <span>Slots Full • View Details</span>
            </Button>
          ) : isOngoing ? (
            <Button variant="outline" size="sm" className="w-full border-skyfall-500/40 text-skyfall-400 hover:bg-skyfall-950/30 gap-2">
              <span className="h-2 w-2 rounded-full bg-skyfall-400 animate-ping" />
              <span>Live Tournament Details</span>
            </Button>
          ) : isCompleted ? (
            <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
              <span>View Final Standings</span>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
              <span>View Tournament</span>
            </Button>
          )}
        </Link>
      </div>
    </div>
  );
}
