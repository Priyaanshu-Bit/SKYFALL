"use client";

import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  Search,
  ExternalLink,
  Users,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateTournamentStatusAction } from "@/features/admin/actions";
import { formatPaiseToINR } from "@/lib/utils";
import type { AdminTournamentOverviewItem } from "@/services/admin-tournament.service";
import type { TournamentStatus } from "@prisma/client";

interface AdminTournamentListProps {
  initialTournaments: AdminTournamentOverviewItem[];
}

export function AdminTournamentList({
  initialTournaments,
}: AdminTournamentListProps) {
  const [tournaments, setTournaments] =
    React.useState<AdminTournamentOverviewItem[]>(initialTournaments);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [isUpdatingId, setIsUpdatingId] = React.useState<string | null>(null);

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.gameMode.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (
    tournamentId: string,
    newStatus: TournamentStatus
  ) => {
    setIsUpdatingId(tournamentId);
    try {
      const res = await updateTournamentStatusAction(tournamentId, newStatus);
      if (res.success && res.tournament) {
        setTournaments((prev) =>
          prev.map((item) =>
            item.id === tournamentId
              ? { ...item, status: res.tournament.status }
              : item
          )
        );
      }
    } finally {
      setIsUpdatingId(null);
    }
  };

  const getStatusBadge = (status: TournamentStatus) => {
    switch (status) {
      case "DRAFT":
        return (
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-950/30">
            Draft
          </Badge>
        );
      case "PUBLISHED":
        return (
          <Badge variant="outline" className="border-sky-500/40 text-sky-400 bg-sky-950/30">
            Upcoming
          </Badge>
        );
      case "REGISTRATION_OPEN":
        return (
          <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
            Reg. Open
          </Badge>
        );
      case "REGISTRATION_CLOSED":
        return (
          <Badge variant="warning" className="bg-amber-500/20 text-amber-300 border-amber-500/40">
            Reg. Closed
          </Badge>
        );
      case "ONGOING":
        return (
          <Badge variant="default" className="bg-purple-600 text-white font-bold animate-pulse">
            Live Matches
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="border-slate-600 text-slate-400 bg-slate-900">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tournaments Workbench
          </h1>
          <p className="text-sm text-slate-400">
            Create, audit, and configure competitive Free Fire India tournament operations.
          </p>
        </div>

        <Link href="/admin/tournaments/new">
          <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
            <Plus className="h-4 w-4" />
            <span>Create Tournament</span>
          </Button>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Tournaments</p>
          <p className="text-2xl font-black text-white">{tournaments.length}</p>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Open for Registration</p>
          <p className="text-2xl font-black text-emerald-400">
            {tournaments.filter((t) => t.status === "REGISTRATION_OPEN").length}
          </p>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Draft Tournaments</p>
          <p className="text-2xl font-black text-amber-400">
            {tournaments.filter((t) => t.status === "DRAFT").length}
          </p>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Prize Commitments</p>
          <p className="text-2xl font-black text-white">
            {formatPaiseToINR(
              tournaments.reduce((acc, t) => acc + t.totalPrizePoolPaise, 0),
              { showFree: false }
            )}
          </p>
        </Card>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All", value: "ALL" },
            { label: "Reg. Open", value: "REGISTRATION_OPEN" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Drafts", value: "DRAFT" },
            { label: "Reg. Closed", value: "REGISTRATION_CLOSED" },
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
            placeholder="Search tournaments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Tournaments List Cards */}
      {filteredTournaments.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-4">
            <Trophy className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg text-white">No Tournaments Found</CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            {search || statusFilter !== "ALL"
              ? "No tournaments match your filter criteria."
              : "No tournaments have been configured yet."}
          </CardDescription>
          <div className="mt-6">
            <Link href="/admin/tournaments/new">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                Create First Tournament
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTournaments.map((t) => {
            const isUpdating = isUpdatingId === t.id;
            const confirmedRatio = (t.confirmedRegistrationsCount / t.teamCapacity) * 100;

            return (
              <Card
                key={t.id}
                className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all overflow-hidden"
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(t.status)}
                      <span className="text-xs font-semibold text-slate-400">
                        {t.game} • {t.gameMode.name}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs font-semibold text-slate-400">
                        {t.tournamentFormat}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-white hover:text-amber-400 transition-colors">
                      {t.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-sky-400" />
                        <span>
                          <strong className="text-white">{t.confirmedRegistrationsCount}</strong> /{" "}
                          {t.teamCapacity} Squads Confirmed
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-amber-400" />
                        <span>
                          {new Date(t.tournamentDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          ({t.startTime})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5 text-amber-400" />
                        <span>Prize: <strong className="text-white">{formatPaiseToINR(t.totalPrizePoolPaise, { showFree: false })}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Entry:</span>
                        <strong className="text-emerald-400">
                          {t.entryFeePaise === 0 ? "FREE" : formatPaiseToINR(t.entryFeePaise)}
                        </strong>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="w-full max-w-md pt-2 space-y-1">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${Math.min(confirmedRatio, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{t.confirmedRegistrationsCount} confirmed slots</span>
                        <span>{t.teamCapacity - t.confirmedRegistrationsCount} slots available</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 shrink-0 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/tournaments/${t.id}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 border-slate-700 text-slate-300 text-xs"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Public Page</span>
                        </Button>
                      </Link>

                      {t.status === "DRAFT" && (
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(t.id, "REGISTRATION_OPEN")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Publish & Open
                        </Button>
                      )}

                      {t.status === "REGISTRATION_OPEN" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(t.id, "REGISTRATION_CLOSED")}
                          className="border-amber-500/40 text-amber-400 hover:bg-amber-950/40 text-xs"
                        >
                          Close Reg.
                        </Button>
                      )}

                      {t.status === "REGISTRATION_CLOSED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(t.id, "REGISTRATION_OPEN")}
                          className="border-slate-700 text-slate-300 text-xs"
                        >
                          Reopen Reg.
                        </Button>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500">
                      ID: {t.id.substring(0, 8)}... • Slug: {t.slug}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
