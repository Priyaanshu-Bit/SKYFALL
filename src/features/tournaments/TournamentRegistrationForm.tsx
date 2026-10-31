"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  Flame,
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPaiseToINR, cn } from "@/lib/utils";
import { submitTournamentRegistration } from "./actions";
import type { TournamentDetail } from "@/services/tournament.service";
import type { PlayerRosterMember } from "@/schemas/registration.schema";

interface ExistingTeam {
  id: string;
  name: string;
  members: {
    id: string;
    playerName: string;
    freeFireUid: string;
    isCaptain: boolean;
  }[];
}

interface TournamentRegistrationFormProps {
  tournament: TournamentDetail;
  existingTeams: ExistingTeam[];
  currentUser: {
    name: string | null;
    freeFireUid: string | null;
  };
}

export function TournamentRegistrationForm({
  tournament,
  existingTeams,
  currentUser,
}: TournamentRegistrationFormProps) {
  const router = useRouter();
  const requiredPlayerCount = tournament.gameMode.playersPerTeam;

  const [mode, setMode] = React.useState<"EXISTING" | "NEW">(
    existingTeams.length > 0 ? "EXISTING" : "NEW"
  );

  const [selectedTeamId, setSelectedTeamId] = React.useState<string>(
    existingTeams[0]?.id || ""
  );

  const [teamName, setTeamName] = React.useState("");

  // Initialize roster members with default slots
  const [members, setMembers] = React.useState<PlayerRosterMember[]>(() => {
    return Array.from({ length: requiredPlayerCount }, (_, i) => {
      if (i === 0) {
        return {
          playerName: currentUser.name || "Captain",
          freeFireUid: currentUser.freeFireUid || "",
        };
      }
      return { playerName: "", freeFireUid: "" };
    });
  });

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleMemberChange = (
    index: number,
    field: "playerName" | "freeFireUid",
    value: string
  ) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await submitTournamentRegistration({
        tournamentId: tournament.id,
        mode,
        teamId: mode === "EXISTING" ? selectedTeamId : undefined,
        teamName: mode === "NEW" ? teamName : undefined,
        members: mode === "NEW" ? members : undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to register squad.");
        setIsSubmitting(false);
        return;
      }

      // If entry fee applies, redirect to payment step; otherwise direct to player tournaments
      if (tournament.entryFeePaise > 0) {
        router.push(
          `/tournaments/${tournament.id}/payment?registrationId=${res.registrationId}`
        );
      } else {
        router.push(`/dashboard/tournaments`);
      }
    } catch {
      setErrorMessage("A network or server error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const selectedTeam = existingTeams.find((t) => t.id === selectedTeamId);
  const isSelectedTeamEligible =
    selectedTeam && selectedTeam.members.length === requiredPlayerCount;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mode Switcher Tabs */}
      {existingTeams.length > 0 && (
        <div className="flex rounded-xl border border-slate-800 bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("EXISTING");
              setErrorMessage(null);
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all",
              mode === "EXISTING"
                ? "bg-skyfall-500 text-white shadow-md shadow-skyfall-500/20"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Shield className="h-4 w-4" />
            <span>Select Existing Squad ({existingTeams.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("NEW");
              setErrorMessage(null);
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all",
              mode === "NEW"
                ? "bg-skyfall-500 text-white shadow-md shadow-skyfall-500/20"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Plus className="h-4 w-4" />
            <span>Register New Squad</span>
          </button>
        </div>
      )}

      {/* Mode A: Select Existing Team */}
      {mode === "EXISTING" && existingTeams.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Choose Your Squad</h3>
            <p className="text-xs text-slate-400">
              Only squads where you are captain with {requiredPlayerCount} registered players are eligible.
            </p>
          </div>

          <div className="space-y-3">
            {existingTeams.map((team) => {
              const eligible = team.members.length === requiredPlayerCount;
              const isSelected = selectedTeamId === team.id;

              return (
                <div
                  key={team.id}
                  onClick={() => eligible && setSelectedTeamId(team.id)}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 transition-all cursor-pointer",
                    isSelected
                      ? "border-skyfall-500 bg-skyfall-950/30 shadow-md shadow-skyfall-500/10"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700",
                    !eligible && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border",
                        isSelected
                          ? "border-skyfall-400 bg-skyfall-500 text-white"
                          : "border-slate-700 bg-slate-900"
                      )}
                    >
                      {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{team.name}</h4>
                      <p className="text-xs text-slate-400">
                        {team.members.length} / {requiredPlayerCount} Players Configured
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {eligible ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                        <span>Needs {requiredPlayerCount} Players</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode B: Register New Squad On-The-Fly */}
      {mode === "NEW" && (
        <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Squad & Roster Details</h3>
            <p className="text-xs text-slate-400">
              Enter your squad name and configure all {requiredPlayerCount} starting players with their Free Fire In-Game UIDs.
            </p>
          </div>

          {/* Squad Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Squad Name <span className="text-skyfall-400">*</span>
            </label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Phoenix Esports, Team Delta"
              required
            />
          </div>

          {/* Roster Inputs Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-skyfall-400" />
                <span>Starting Roster ({requiredPlayerCount} Players)</span>
              </span>
              <span className="text-[11px] text-slate-500">
                All UIDs must be 8-14 numeric digits
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Player #{idx + 1} {idx === 0 && <span className="text-skyfall-400">(Captain)</span>}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Slot #{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-400">
                      Player / In-Game Name
                    </label>
                    <Input
                      value={member.playerName}
                      onChange={(e) =>
                        handleMemberChange(idx, "playerName", e.target.value)
                      }
                      placeholder={idx === 0 ? "Captain Name" : `Player ${idx + 1} Name`}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-400">
                      Free Fire UID
                    </label>
                    <Input
                      value={member.freeFireUid}
                      onChange={(e) =>
                        handleMemberChange(idx, "freeFireUid", e.target.value)
                      }
                      placeholder="e.g. 1928472910"
                      pattern="[0-9]{8,14}"
                      title="Please enter 8 to 14 numeric digits"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs sm:text-sm text-red-300">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Confirmation & Submit Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Entry Fee Required
          </span>
          <p className="text-2xl font-black text-white">
            {formatPaiseToINR(tournament.entryFeePaise)}
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || (mode === "EXISTING" && !isSelectedTeamEligible)}
          className="w-full sm:w-auto gap-2 font-black shadow-lg shadow-skyfall-500/20"
        >
          {isSubmitting ? (
            <span>Processing Squad Registration...</span>
          ) : (
            <>
              <Flame className="h-4 w-4" />
              <span>Confirm & Proceed to Payment</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
