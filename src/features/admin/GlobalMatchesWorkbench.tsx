"use client";

import * as React from "react";
import Link from "next/link";
import {
  Swords,
  Search,
  KeyRound,
  ExternalLink,
  Settings,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MatchRoomModal } from "@/features/admin/MatchRoomModal";
import type { MatchWithTeams } from "@/services/admin-match.service";
import type { Match, MatchStatus } from "@prisma/client";

interface GlobalMatchesWorkbenchProps {
  initialMatches: MatchWithTeams[];
  initialStats: {
    totalMatches: number;
    scheduledCount: number;
    roomOpenCount: number;
    ongoingCount: number;
    completedCount: number;
  };
}

export function GlobalMatchesWorkbench({
  initialMatches,
  initialStats,
}: GlobalMatchesWorkbenchProps) {
  const [matches, setMatches] = React.useState<MatchWithTeams[]>(initialMatches);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [activeModalMatch, setActiveModalMatch] =
    React.useState<MatchWithTeams | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMatchUpdated = (updatedMatch: Match) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === updatedMatch.id
          ? {
              ...m,
              status: updatedMatch.status,
              roomId: updatedMatch.roomId,
              roomPassword: updatedMatch.roomPassword,
              scheduledAt: updatedMatch.scheduledAt,
            }
          : m
      )
    );
  };

  const filteredMatches = matches.filter((m) => {
    const s = search.toLowerCase();
    const matchesSearch =
      m.tournament.name.toLowerCase().includes(s) ||
      (m.teamA?.name.toLowerCase().includes(s) ?? false) ||
      (m.teamB?.name.toLowerCase().includes(s) ?? false) ||
      (m.roomId?.toLowerCase().includes(s) ?? false);

    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900 text-xs">
            Scheduled
          </Badge>
        );
      case "ROOM_OPEN":
        return (
          <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs">
            Room Open
          </Badge>
        );
      case "ONGOING":
        return (
          <Badge variant="default" className="bg-purple-600 text-white font-bold text-xs animate-pulse">
            Live
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="border-sky-500/40 text-sky-400 bg-sky-950/30 text-xs">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="text-xs">
            Cancelled
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
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Match Operations & Custom Rooms
          </h1>
          <p className="text-sm text-slate-400">
            Monitor match rounds, input Free Fire custom Room IDs & passwords, and distribute credentials to squad captains.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Matches</p>
          <p className="text-2xl font-black text-white">{initialStats.totalMatches}</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Rooms Open Now</p>
          <p className="text-2xl font-black text-emerald-400">
            {matches.filter((m) => m.status === "ROOM_OPEN").length}
          </p>
          <p className="text-[10px] text-slate-500">Live credential disclosure</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Scheduled Matches</p>
          <p className="text-2xl font-black text-amber-400">
            {matches.filter((m) => m.status === "SCHEDULED").length}
          </p>
          <p className="text-[10px] text-slate-500">Upcoming rounds</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Completed Matches</p>
          <p className="text-2xl font-black text-white">
            {matches.filter((m) => m.status === "COMPLETED").length}
          </p>
          <p className="text-[10px] text-slate-500">Finished rounds</p>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All Matches", value: "ALL" },
            { label: "Room Open", value: "ROOM_OPEN" },
            { label: "Scheduled", value: "SCHEDULED" },
            { label: "Ongoing", value: "ONGOING" },
            { label: "Completed", value: "COMPLETED" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab.value)}
              className={
                statusFilter === tab.value
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "border-slate-700 text-slate-300 text-xs"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search tournament, team, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3">
            <Swords className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg text-white">No Matches Found</CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            {search || statusFilter !== "ALL"
              ? "No matches match your filter criteria."
              : "Generate matches inside a tournament to begin managing rooms."}
          </CardDescription>
          <div className="mt-4">
            <Link href="/admin/tournaments">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                Go to Tournaments Workbench
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((m) => {
            const hasCredentials = !!m.roomId;

            return (
              <Card
                key={m.id}
                className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Tournament & Match Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(m.status)}
                      <span className="text-xs font-bold text-amber-400">
                        Match #{m.matchNumber} ({m.roundName || `Round ${m.round}`})
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <Link
                        href={`/admin/tournaments/${m.tournament.id}/rooms`}
                        className="text-xs font-medium text-slate-300 hover:text-white underline underline-offset-2 flex items-center gap-1"
                      >
                        <span>{m.tournament.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Matchup */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-white">
                        {m.teamA?.name || "TBD (Squad A)"}
                      </span>
                      <span className="text-xs font-black text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                        VS
                      </span>
                      <span className="font-bold text-white">
                        {m.teamB?.name || "TBD (Squad B)"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {m.scheduledAt
                            ? new Date(m.scheduledAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Schedule TBD"}
                        </span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <span>Format: {m.tournament.gameMode.name}</span>
                    </div>
                  </div>

                  {/* Middle: Credentials Box */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 min-w-[220px]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <KeyRound className="h-3 w-3 text-amber-400" />
                        <span>Room Credentials</span>
                      </span>

                      {hasCredentials && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(`${m.roomId}:${m.roomPassword}`, m.id)
                          }
                          className="text-slate-400 hover:text-amber-400 p-0.5"
                        >
                          {copiedId === m.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {hasCredentials ? (
                      <div className="space-y-0.5 font-mono text-xs">
                        <p className="text-slate-300">
                          ID: <strong className="text-white">{m.roomId}</strong>
                        </p>
                        <p className="text-slate-300">
                          Pass: <strong className="text-amber-300">{m.roomPassword || "None"}</strong>
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-400/80 italic">
                        Credentials unconfigured
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveModalMatch(m)}
                      className="gap-1.5 border-slate-700 text-slate-300 hover:border-amber-500/50 text-xs"
                    >
                      <Settings className="h-3.5 w-3.5 text-amber-400" />
                      <span>Manage Room</span>
                    </Button>

                    <Link href={`/admin/tournaments/${m.tournament.id}/rooms`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white text-xs"
                      >
                        <span>Bracket</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Match Room Modal */}
      <MatchRoomModal
        match={activeModalMatch}
        isOpen={!!activeModalMatch}
        onClose={() => setActiveModalMatch(null)}
        onSuccess={handleMatchUpdated}
      />
    </div>
  );
}
