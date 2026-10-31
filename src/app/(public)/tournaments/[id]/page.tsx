import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTournamentById } from "@/services/tournament.service";
import { TournamentHero } from "@/features/tournaments/TournamentHero";
import { TournamentPrizeTable } from "@/features/tournaments/TournamentPrizeTable";
import { TournamentRules } from "@/features/tournaments/TournamentRules";
import { TournamentRegisteredTeams } from "@/features/tournaments/TournamentRegisteredTeams";
import { TournamentActionCard } from "@/features/tournaments/TournamentActionCard";
import { formatPaiseToINR } from "@/lib/utils";

interface TournamentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TournamentPageProps): Promise<Metadata> {
  const { id } = await params;
  const tournament = await getTournamentById(id);

  if (!tournament) {
    return {
      title: "Tournament Not Found | SKYFALL",
    };
  }

  const prize = formatPaiseToINR(tournament.totalPrizePoolPaise, {
    showFree: false,
  });

  return {
    title: `${tournament.name} (${prize} Prize Pool) | SKYFALL`,
    description: `Register for ${tournament.name} on SKYFALL. Compete in ${tournament.gameMode.name} Free Fire esports with a ${prize} verified prize pool.`,
  };
}

export default async function TournamentDetailPage({
  params,
}: TournamentPageProps) {
  const { id } = await params;
  const tournament = await getTournamentById(id);

  if (!tournament) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* High-Impact Hero Banner */}
      <TournamentHero tournament={tournament} />

      {/* Main Grid: Details & Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Comprehensive Details */}
        <div className="space-y-8 lg:col-span-2">
          {/* Tournament Overview Description */}
          {tournament.description && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-2">
              <h3 className="text-base font-bold text-white">About the Tournament</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {tournament.description}
              </p>
            </div>
          )}

          {/* Prize Pool Breakdown Table */}
          <TournamentPrizeTable
            prizes={tournament.prizes}
            totalPrizePoolPaise={tournament.totalPrizePoolPaise}
          />

          {/* Tournament Rules & Device Guidelines */}
          <TournamentRules
            customRules={tournament.rules}
            gameModeRules={tournament.gameMode.rules}
            gameModeName={tournament.gameMode.name}
          />

          {/* Registered Squads List & Slots */}
          <TournamentRegisteredTeams
            registrations={tournament.registrations}
            teamCapacity={tournament.teamCapacity}
          />
        </div>

        {/* Right 1 Column: Sticky Registration & Financial Action Card */}
        <div className="lg:col-span-1">
          <TournamentActionCard tournament={tournament} />
        </div>
      </div>
    </div>
  );
}
