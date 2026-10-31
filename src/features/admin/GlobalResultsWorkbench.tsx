"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  Search,
  Trophy,
  ExternalLink,
  CheckCircle2,
  Clock,
  Crown,
  FileCheck,
} from "lucide-react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RecordMatchResultModal } from "@/features/admin/RecordMatchResultModal";
import type { MatchWithResultData } from "@/services/admin-result.service";

interface GlobalResultsWorkbenchProps {
  initialMatches: MatchWithResultData[];
  initialStats: {
    totalMatches: number;
    completedCount: number;
    pendingCount: number;
  };
}

export function GlobalResultsWorkbench({
  initialMatches,
  initialStats,
}: GlobalResultsWorkbenchProps) {
  const [matches, setMatches] = React.useState<MatchWithResultData[]>(initialMatches);

  React.useEffect(() => {
    setMatches(initialMatches);
  }, [initialMatches]);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "ALL" | "COMPLETED" | "PENDING"
  >("ALL");
  const [activeModalMatch, setActiveModalMatch] =
    React.useState<MatchWithResultData | null>(null);

  const filteredMatches = matches.filter((m) => {
    const s = search.toLowerCase();
    const isCompleted = m.status === "COMPLETED";

    const matchesSearch =
      m.tournament.name.toLowerCase().includes(s) ||
      (m.teamA?.name.toLowerCase().includes(s) ?? false) ||
      (m.teamB?.name.toLowerCase().includes(s) ?? false) ||
      (m.winnerTeam?.name.toLowerCase().includes(s) ?? false);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "COMPLETED" && isCompleted) ||
      (statusFilter === "PENDING" && !isCompleted);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Match Results & Standings Verification
          </h1>
          <p className="text-sm text-slate-400">
            Record game scores, verify scoreboard proofs, advance tournament brackets, and declare champion standings.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Bracket Matches</p>
          <p className="text-2xl font-black text-white">{initialStats.totalMatches}</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Verified Results</p>
          <p className="text-2xl font-black text-emerald-400">
            {matches.filter((m) => m.status === "COMPLETED").length}
          </p>
          <p className="text-[10px] text-slate-500">Winners advanced</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Pending Results</p>
          <p className="text-2xl font-black text-amber-400">
            {matches.filter((m) => m.status !== "COMPLETED").length}
          </p>
          <p className="text-[10px] text-slate-500">Awaiting score verification</p>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All Matches", value: "ALL" },
            { label: "Verified Results", value: "COMPLETED" },
            { label: "Pending Verification", value: "PENDING" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab.value as "ALL" | "COMPLETED" | "PENDING")}
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
            placeholder="Search tournament, squad, winner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Results List */}
      {filteredMatches.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3">
            <Award className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg text-white">No Match Results Found</CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            {search || statusFilter !== "ALL"
              ? "No match results match your filter criteria."
              : "Generate and schedule matches to begin recording competitive outcomes."}
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((m) => {
            const isCompleted = m.status === "COMPLETED";
            const isGrandFinal = m.roundName?.toLowerCase().includes("final") || false;
            const res = m.results?.[0];

            let proofUrl: string | null = null;
            let killsCount: number | null = null;
            if (res?.resultData) {
              try {
                const parsed = JSON.parse(res.resultData);
                proofUrl = parsed.scoreboardProofUrl || null;
                killsCount = parsed.kills ?? null;
              } catch {
                // ignore
              }
            }

            return (
              <Card
                key={m.id}
                className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Match Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isCompleted ? (
                        <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Result Verified</span>
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Pending Result</span>
                        </Badge>
                      )}

                      {isGrandFinal && (
                        <Badge variant="outline" className="border-amber-500/40 bg-amber-950/30 text-amber-400 text-xs gap-1 font-bold">
                          <Crown className="h-3 w-3" />
                          <span>Grand Finals</span>
                        </Badge>
                      )}

                      <span className="text-xs font-bold text-slate-300">
                        #{m.matchNumber} ({m.roundName || `Round ${m.round}`})
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <Link
                        href={`/admin/tournaments/${m.tournament.id}/rooms`}
                        className="text-xs text-slate-400 hover:text-white underline underline-offset-2 flex items-center gap-1"
                      >
                        <span>{m.tournament.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Squads Matchup */}
                    <div className="flex items-center gap-3 text-sm">
                      <div
                        className={`flex items-center gap-1.5 ${
                          m.winnerTeamId === m.teamAId ? "font-black text-amber-400" : "text-white"
                        }`}
                      >
                        {m.winnerTeamId === m.teamAId && <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                        <span>{m.teamA?.name || "TBD (Squad A)"}</span>
                      </div>

                      <span className="text-xs font-black text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        VS
                      </span>

                      <div
                        className={`flex items-center gap-1.5 ${
                          m.winnerTeamId === m.teamBId ? "font-black text-amber-400" : "text-white"
                        }`}
                      >
                        {m.winnerTeamId === m.teamBId && <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                        <span>{m.teamB?.name || "TBD (Squad B)"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Scores & Proof Box */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 min-w-[220px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Scoreboard Outcome
                      </span>
                      {killsCount !== null && (
                        <span className="text-[10px] text-amber-400 font-mono">
                          {killsCount} kills
                        </span>
                      )}
                    </div>

                    {isCompleted && res ? (
                      <div className="space-y-1">
                        <div className="text-sm font-black text-white flex items-center gap-2">
                          <span>{res.teamAScore ?? 0}</span>
                          <span className="text-slate-500">-</span>
                          <span>{res.teamBScore ?? 0}</span>
                          <span className="text-[11px] font-normal text-emerald-400 ml-1">
                            (Winner: {m.winnerTeam?.name})
                          </span>
                        </div>
                        {proofUrl && (
                          <Link
                            href={proofUrl}
                            target="_blank"
                            className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <FileCheck className="h-3 w-3" />
                            <span>Scoreboard Proof</span>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">
                        Score not recorded
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                    <Button
                      size="sm"
                      onClick={() => setActiveModalMatch(m)}
                      className={
                        isCompleted
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs gap-1.5"
                          : "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs gap-1.5"
                      }
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>{isCompleted ? "Edit Result" : "Record Result"}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Record Match Result Modal */}
      <RecordMatchResultModal
        match={activeModalMatch}
        isOpen={!!activeModalMatch}
        onClose={() => setActiveModalMatch(null)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
