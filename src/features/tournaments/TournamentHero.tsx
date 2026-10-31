"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Swords,
  Timer,
  Flame,
  Shield,
} from "lucide-react";
import { formatDateIST, formatDateTimeIST } from "@/lib/utils";
import { TournamentStatusBadge } from "@/components/ui/badge";
import type { TournamentDetail } from "@/services/tournament.service";

interface TournamentHeroProps {
  tournament: TournamentDetail;
}

export function TournamentHero({ tournament }: TournamentHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
      {/* Background Banner with Gradient Mask */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-skyfall-950">
        {tournament.bannerUrl ? (
          <Image
            src={tournament.bannerUrl}
            alt={tournament.name}
            fill
            unoptimized
            priority
            className="object-cover opacity-40"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Flame className="h-32 w-32 text-skyfall-500/10" />
          </div>
        )}

        {/* Multi-stage dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-8 md:p-10">
        {/* Top Back Link & Status */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md transition-colors hover:border-slate-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Tournaments</span>
          </Link>

          <TournamentStatusBadge status={tournament.status} />
        </div>

        {/* Bottom Hero Info */}
        <div className="space-y-4">
          {/* Badge Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-skyfall-500/30 bg-skyfall-950/70 px-3 py-1 text-xs font-bold text-skyfall-400 backdrop-blur-md">
              <Swords className="h-3.5 w-3.5" />
              <span>{tournament.gameMode.name}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-300 backdrop-blur-md">
              <Shield className="h-3.5 w-3.5 text-slate-400" />
              <span>{tournament.tournamentFormat} Format</span>
            </span>

            <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-300 backdrop-blur-md">
              {tournament.game}
            </span>
          </div>

          {/* Tournament Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-md">
            {tournament.name}
          </h1>

          {/* Schedule Badges */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-skyfall-400 shrink-0" />
              <span>{formatDateIST(tournament.tournamentDate)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-skyfall-400 shrink-0" />
              <span>Match Starts: {tournament.startTime}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Timer className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Registration Closes: {formatDateTimeIST(tournament.registrationCloseAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
