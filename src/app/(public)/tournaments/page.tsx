import * as React from "react";
import type { Metadata } from "next";
import { Flame } from "lucide-react";
import {
  getPublicTournaments,
  getActiveGameModes,
} from "@/services/tournament.service";
import { TournamentFilters } from "@/features/tournaments/TournamentFilters";
import { TournamentGrid } from "@/features/tournaments/TournamentGrid";

export const metadata: Metadata = {
  title: "Tournaments | SKYFALL Free Fire India",
  description:
    "Explore open Free Fire India tournaments, compete with your squad in Clash Squad & Battle Royale, and win verified cash prizes.",
};

interface TournamentsPageProps {
  searchParams: Promise<{
    status?: string;
    mode?: string;
    search?: string;
  }>;
}

export default async function TournamentsPage({
  searchParams,
}: TournamentsPageProps) {
  const params = await searchParams;

  const [tournaments, gameModes] = await Promise.all([
    getPublicTournaments({
      status: params.status,
      gameModeId: params.mode,
      search: params.search,
    }),
    getActiveGameModes(),
  ]);

  return (
    <div className="space-y-8">
      {/* Hero / Header Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-skyfall-950/40 p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-skyfall-500/30 bg-skyfall-950/70 px-3.5 py-1 text-xs font-semibold text-skyfall-400">
            <Flame className="h-4 w-4" />
            <span>Competitive Free Fire India</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Tournament <span className="text-skyfall-400">Arena</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            Discover upcoming Clash Squad and Battle Royale competitions. Register your team, lock in your slots, and battle for verified cash prize pools.
          </p>
        </div>

        {/* Ambient atmospheric glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-skyfall-600/15 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 -bottom-16 h-56 w-56 rounded-full bg-skyfall-500/10 blur-3xl" />
      </div>

      {/* Filter Toolbar */}
      <TournamentFilters
        gameModes={gameModes}
        currentStatus={params.status}
        currentMode={params.mode}
        currentSearch={params.search}
      />

      {/* Tournament Cards Grid */}
      <TournamentGrid tournaments={tournaments} />
    </div>
  );
}
