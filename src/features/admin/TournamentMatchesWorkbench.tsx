"use client";

import * as React from "react";
import Link from "next/link";
import {
  Swords,
  Users,
  KeyRound,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchRoomModal } from "@/features/admin/MatchRoomModal";
import { generateKnockoutMatchesAction } from "@/features/admin/actions";
import { formatDateIST } from "@/lib/utils";
import type {
  TournamentMatchWorkbenchData,
  MatchWithTeams,
} from "@/services/admin-match.service";
import type { Match, MatchStatus } from "@prisma/client";

interface TournamentMatchesWorkbenchProps {
  initialData: TournamentMatchWorkbenchData;
}

export function TournamentMatchesWorkbench({
  initialData,
}: TournamentMatchesWorkbenchProps) {
  const [data, setData] = React.useState<TournamentMatchWorkbenchData>(initialData);
  const [selectedRound, setSelectedRound] = React.useState<number>(
    data.rounds[0]?.round || 1
  );
  const [activeModalMatch, setActiveModalMatch] =
    React.useState<MatchWithTeams | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generateError, setGenerateError] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const { tournament, confirmedTeams, matches, rounds } = data;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateBracket = async () => {
    if (confirmedTeams.length < 2) {
      setGenerateError(
        `At least 2 confirmed squads are required to generate bracket matches. Currently confirmed: ${confirmedTeams.length}`
      );
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await generateKnockoutMatchesAction(tournament.id);
      if (!res.success) {
        setGenerateError(
          ("error" in res ? res.error : undefined) ||
            "Failed to generate knockout bracket."
        );
      } else {
        // Refresh page state
        window.location.reload();
      }
    } catch (err: unknown) {
      setGenerateError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMatchUpdated = (updatedMatch: Match) => {
    setData((prev) => {
      const newMatches = prev.matches.map((m) =>
        m.id === updatedMatch.id
          ? {
              ...m,
              status: updatedMatch.status,
              roomId: updatedMatch.roomId,
              roomPassword: updatedMatch.roomPassword,
              scheduledAt: updatedMatch.scheduledAt,
            }
          : m
      );

      const newRounds = prev.rounds.map((r) => ({
        ...r,
        matches: r.matches.map((m) =>
          m.id === updatedMatch.id
            ? {
                ...m,
                status: updatedMatch.status,
                roomId: updatedMatch.roomId,
                roomPassword: updatedMatch.roomPassword,
                scheduledAt: updatedMatch.scheduledAt,
              }
            : m
        ),
      }));

      return {
        ...prev,
        matches: newMatches,
        rounds: newRounds,
      };
    });
  };

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900 text-[10px]">
            Scheduled
          </Badge>
        );
      case "ROOM_OPEN":
        return (
          <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
            Room Open
          </Badge>
        );
      case "ONGOING":
        return (
          <Badge variant="default" className="bg-purple-600 text-white font-bold text-[10px] animate-pulse">
            Live
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="border-sky-500/40 text-sky-400 bg-sky-950/30 text-[10px]">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="text-[10px]">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activeRoundData = rounds.find((r) => r.round === selectedRound) || rounds[0];

  return (
    <div className="space-y-6">
      {/* Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Match Operations & Credential Distribution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {tournament.name}
          </h1>
          <p className="text-sm text-slate-400">
            {tournament.game} • {tournament.gameMode.name} • Format: {tournament.tournamentFormat}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/tournaments">
            <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-300">
              <ArrowLeft className="h-4 w-4" />
              <span>Tournaments</span>
            </Button>
          </Link>

          {matches.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateBracket}
              disabled={isGenerating}
              className="gap-2 border-amber-500/40 text-amber-400 hover:bg-amber-950/40"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Regenerate Bracket</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleGenerateBracket}
              disabled={isGenerating || confirmedTeams.length < 2}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Generate Knockout Matches</span>
            </Button>
          )}
        </div>
      </div>

      {/* Generation Error Alert */}
      {generateError && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{generateError}</span>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Confirmed Squads</p>
          <p className="text-2xl font-black text-white">
            {confirmedTeams.length} / {tournament.teamCapacity}
          </p>
          <p className="text-[10px] text-slate-500">Verified & seeded</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Rounds</p>
          <p className="text-2xl font-black text-amber-400">
            {rounds.length || 0}
          </p>
          <p className="text-[10px] text-slate-500">
            {matches.length} Total matches
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Rooms Open Now</p>
          <p className="text-2xl font-black text-emerald-400">
            {matches.filter((m) => m.status === "ROOM_OPEN").length}
          </p>
          <p className="text-[10px] text-slate-500">Captains accessing credentials</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Tournament Date</p>
          <p className="text-lg font-bold text-white truncate">
            {formatDateIST(tournament.tournamentDate)}
          </p>
          <p className="text-[10px] text-slate-500">Start: {tournament.startTime}</p>
        </Card>
      </div>

      {/* Matches Workbench & Rounds */}
      {matches.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-4 border border-amber-500/30">
            <Swords className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl text-white">No Bracket Matches Generated Yet</CardTitle>
          <CardDescription className="text-slate-400 max-w-md mx-auto mt-2">
            Once teams are confirmed by verifying their FamPay UPI payments, generate the competitive knockout bracket.
          </CardDescription>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              size="sm"
              onClick={handleGenerateBracket}
              disabled={isGenerating || confirmedTeams.length < 2}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Generate Single-Elimination Matches</span>
            </Button>
            <p className="text-xs text-slate-500">
              Requires at least 2 confirmed squads ({confirmedTeams.length} currently confirmed).
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Round Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            {rounds.map((r) => {
              const isSelected = r.round === (activeRoundData?.round || 1);
              return (
                <button
                  key={r.round}
                  type="button"
                  onClick={() => setSelectedRound(r.round)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  <span>{r.roundName}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected ? "bg-slate-950/30 text-slate-950" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {r.matches.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Round Match Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRoundData?.matches.map((m) => {
              const hasCredentials = !!m.roomId;

              return (
                <Card
                  key={m.id}
                  className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3 border-b border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-xs font-bold text-amber-400">
                          #{m.matchNumber}
                        </span>
                        <CardTitle className="text-sm text-white font-bold">
                          {m.roundName || `Round ${m.round}`}
                        </CardTitle>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(m.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="py-4 space-y-4">
                    {/* Teams Matchup */}
                    <div className="space-y-2">
                      {/* Team A */}
                      <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/70">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/20 text-xs font-bold text-amber-300">
                            A
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              {m.teamA?.name || "TBD (Awaiting Winner)"}
                            </p>
                            {m.teamA?.captain && (
                              <p className="text-[10px] text-slate-400">
                                Capt: {m.teamA.captain.name || m.teamA.captain.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {m.winnerTeamId === m.teamAId && m.teamAId && (
                          <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-400">
                            Winner
                          </Badge>
                        )}
                      </div>

                      {/* Team B */}
                      <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/70">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-sky-500/20 text-xs font-bold text-sky-300">
                            B
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              {m.teamB?.name || "TBD (Awaiting Winner)"}
                            </p>
                            {m.teamB?.captain && (
                              <p className="text-[10px] text-slate-400">
                                Capt: {m.teamB.captain.name || m.teamB.captain.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {m.winnerTeamId === m.teamBId && m.teamBId && (
                          <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-400">
                            Winner
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Room Credentials Box */}
                    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-amber-400 shrink-0" />
                        <div>
                          {hasCredentials ? (
                            <div className="flex items-center gap-3 font-mono">
                              <span>ID: <strong className="text-white">{m.roomId}</strong></span>
                              <span>Pass: <strong className="text-amber-300">{m.roomPassword || "None"}</strong></span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">
                              Room credentials not configured
                            </span>
                          )}
                        </div>
                      </div>

                      {hasCredentials && (
                        <button
                          type="button"
                          onClick={() => handleCopy(`${m.roomId}:${m.roomPassword}`, m.id)}
                          className="text-slate-400 hover:text-amber-400 p-1"
                        >
                          {copiedId === m.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </CardContent>

                  <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {m.scheduledAt
                        ? new Date(m.scheduledAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Schedule pending"}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveModalMatch(m)}
                      className="h-8 text-xs gap-1.5 border-slate-700 text-slate-300 hover:border-amber-500/50"
                    >
                      <Settings className="h-3.5 w-3.5 text-amber-400" />
                      <span>Configure Room</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmed Roster Summary */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Users className="h-4 w-4" />
            <span>Confirmed Participating Squads ({confirmedTeams.length})</span>
          </div>
          <CardTitle className="text-lg text-white">Tournament Roster Seed List</CardTitle>
          <CardDescription className="text-slate-400">
            Verified squads eligible for bracket placement. Byes are awarded to top seeds in non-power-of-two tournaments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {confirmedTeams.map((team, idx) => (
              <div
                key={team.id}
                className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5 text-xs flex items-center gap-2.5"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500/10 font-bold text-amber-400 text-[10px]">
                  #{idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white truncate">{team.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    Capt: {team.captain.name || team.captain.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal for editing room credentials */}
      <MatchRoomModal
        match={activeModalMatch}
        isOpen={!!activeModalMatch}
        onClose={() => setActiveModalMatch(null)}
        onSuccess={handleMatchUpdated}
      />
    </div>
  );
}
