import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTournamentById } from "@/services/tournament.service";
import { TournamentRegistrationForm } from "@/features/tournaments/TournamentRegistrationForm";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Clock,
  Swords,
  Shield,
  Flame,
} from "lucide-react";
import { formatPaiseToINR, formatDateIST } from "@/lib/utils";

interface RegisterPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Tournament Registration | SKYFALL",
  description: "Register your Free Fire squad for competitive tournament brackets.",
};

export default async function TournamentRegisterPage({
  params,
}: RegisterPageProps) {
  const user = await requireAuth();
  const { id } = await params;

  const tournament = await getTournamentById(id);

  if (!tournament) {
    notFound();
  }

  // Redirect if registration is not open or tournament is full
  if (tournament.status !== "REGISTRATION_OPEN" || tournament.isFull) {
    redirect(`/tournaments/${tournament.id}`);
  }

  // Fetch player's captained teams
  const existingTeams = await prisma.team.findMany({
    where: { captainId: user.id },
    include: {
      members: {
        orderBy: { position: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          href={`/tournaments/${tournament.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Tournament Details</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-skyfall-950/40 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-skyfall-500/30 bg-skyfall-950/60 px-3 py-1 text-xs font-semibold text-skyfall-400">
            <Flame className="h-3.5 w-3.5" />
            <span>Squad Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Register for {tournament.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Configure your roster according to {tournament.gameMode.name} ({tournament.gameMode.playersPerTeam}v{tournament.gameMode.playersPerTeam}) regulations and secure your slot.
          </p>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-skyfall-600/10 blur-3xl" />
      </div>

      {/* Main Form & Summary Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Registration Form */}
        <div className="lg:col-span-2">
          <TournamentRegistrationForm
            tournament={tournament}
            existingTeams={existingTeams}
            currentUser={{
              name: user.name,
              freeFireUid: user.freeFireUid,
            }}
          />
        </div>

        {/* Right 1 Column: Tournament Summary Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Tournament Brief
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Swords className="h-3.5 w-3.5 text-skyfall-400" />
                  <span>Mode</span>
                </span>
                <span className="font-bold text-white">
                  {tournament.gameMode.name} ({tournament.gameMode.playersPerTeam}v{tournament.gameMode.playersPerTeam})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  <span>Format</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {tournament.tournamentFormat}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Date</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {formatDateIST(tournament.tournamentDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Match Time</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {tournament.startTime}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Prize Pool</span>
                </span>
                <span className="text-sm font-black text-emerald-400">
                  {formatPaiseToINR(tournament.totalPrizePoolPaise, { showFree: false })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Entry Fee</span>
                <span className="text-base font-black text-white">
                  {formatPaiseToINR(tournament.entryFeePaise)}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-skyfall-500/20 bg-skyfall-950/30 p-3 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-skyfall-400">Next Step:</span>
              <p>
                After confirming your roster, you will be directed to submit the FamPay UPI transaction reference to lock in your squad slot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
