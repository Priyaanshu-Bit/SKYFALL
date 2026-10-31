"use client";

import * as React from "react";
import {
  Trophy,
  Swords,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Crown,
  Sparkles,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recordMatchResultAction } from "@/features/admin/actions";
import type { MatchWithResultData } from "@/services/admin-result.service";

interface RecordMatchResultModalProps {
  match: MatchWithResultData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecordMatchResultModal({
  match,
  isOpen,
  onClose,
  onSuccess,
}: RecordMatchResultModalProps) {
  const [selectedWinnerId, setSelectedWinnerId] = React.useState<string>("");
  const [teamAScore, setTeamAScore] = React.useState<number>(0);
  const [teamBScore, setTeamBScore] = React.useState<number>(0);
  const [kills, setKills] = React.useState<number>(0);
  const [scoreboardProofUrl, setScoreboardProofUrl] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (match) {
      setSelectedWinnerId(match.winnerTeamId || match.teamAId || "");
      const res = match.results?.[0];
      if (res) {
        setTeamAScore(res.teamAScore ?? 0);
        setTeamBScore(res.teamBScore ?? 0);
        try {
          const parsed = res.resultData ? JSON.parse(res.resultData) : {};
          setKills(parsed.kills ?? 0);
          setScoreboardProofUrl(parsed.scoreboardProofUrl ?? "");
        } catch {
          // ignore json parse error
        }
      } else {
        setTeamAScore(0);
        setTeamBScore(0);
        setKills(0);
        setScoreboardProofUrl("");
      }
      setError(null);
    }
  }, [match]);

  if (!match) return null;

  const isGrandFinal = match.roundName?.toLowerCase().includes("final") || false;

  const handleSubmit = async () => {
    if (!selectedWinnerId) {
      setError("Please select the winning squad.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await recordMatchResultAction({
        matchId: match.id,
        winnerTeamId: selectedWinnerId,
        teamAScore: Number(teamAScore) || 0,
        teamBScore: Number(teamBScore) || 0,
        kills: Number(kills) || 0,
        scoreboardProofUrl: scoreboardProofUrl.trim() || undefined,
      });

      if (!res.success) {
        setError(
          ("error" in res ? res.error : undefined) ||
            "Failed to record match result."
        );
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Match Result: #${match.matchNumber}`}
      description={`${match.roundName || `Round ${match.round}`} • ${match.tournament.name}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Grand Final Alert Banner */}
        {isGrandFinal && (
          <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-slate-900 p-3.5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Championship Decider</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Recording this result concludes the tournament, assigns 1st and 2nd place cash prizes, and sends victory notifications.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Winner Selection Cards */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Select Winning Squad <span className="text-amber-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Squad A */}
            <button
              type="button"
              onClick={() => match.teamAId && setSelectedWinnerId(match.teamAId)}
              disabled={!match.teamAId}
              className={`rounded-xl border p-4 text-left transition-all ${
                selectedWinnerId === match.teamAId
                  ? "border-amber-500 bg-amber-950/40 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10"
                  : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Squad A
                </span>
                {selectedWinnerId === match.teamAId && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    <Trophy className="h-3 w-3" />
                    <span>Winner</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-black text-white truncate">
                {match.teamA?.name || "TBD (Squad A)"}
              </p>
              {match.teamA?.captain && (
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  Capt: {match.teamA.captain.name || match.teamA.captain.email}
                </p>
              )}
            </button>

            {/* Squad B */}
            <button
              type="button"
              onClick={() => match.teamBId && setSelectedWinnerId(match.teamBId)}
              disabled={!match.teamBId}
              className={`rounded-xl border p-4 text-left transition-all ${
                selectedWinnerId === match.teamBId
                  ? "border-amber-500 bg-amber-950/40 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10"
                  : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  Squad B
                </span>
                {selectedWinnerId === match.teamBId && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    <Trophy className="h-3 w-3" />
                    <span>Winner</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-black text-white truncate">
                {match.teamB?.name || "TBD (Squad B)"}
              </p>
              {match.teamB?.captain && (
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  Capt: {match.teamB.captain.name || match.teamB.captain.email}
                </p>
              )}
            </button>
          </div>
        </div>

        {/* Scores & Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Squad A Score (Rounds)"
            type="number"
            min={0}
            value={teamAScore}
            onChange={(e) => setTeamAScore(Number(e.target.value) || 0)}
          />

          <Input
            label="Squad B Score (Rounds)"
            type="number"
            min={0}
            value={teamBScore}
            onChange={(e) => setTeamBScore(Number(e.target.value) || 0)}
          />

          <Input
            label="Total Match Kills"
            type="number"
            min={0}
            value={kills}
            onChange={(e) => setKills(Number(e.target.value) || 0)}
          />
        </div>

        {/* Scoreboard Proof URL */}
        <Input
          label="Optional Scoreboard Proof URL"
          placeholder="https://example.com/scoreboard-proof.jpg"
          value={scoreboardProofUrl}
          onChange={(e) => setScoreboardProofUrl(e.target.value)}
          hint="Link to verified in-game match result screenshot."
        />

        {/* Notice */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400 flex items-center gap-2">
          <Swords className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            {isGrandFinal
              ? "Tournament status will be updated to COMPLETED upon submission."
              : "Advancing the winner will automatically place them into the next knockout round."}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-slate-700 text-slate-400"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isSubmitting || !selectedWinnerId}
            onClick={handleSubmit}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-1.5 min-w-36"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Recording...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirm & Advance</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
