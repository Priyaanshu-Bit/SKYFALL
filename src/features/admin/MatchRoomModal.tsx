"use client";

import * as React from "react";
import {
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  BellRing,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { updateMatchRoomAction } from "@/features/admin/actions";
import type { MatchWithTeams } from "@/services/admin-match.service";
import type { MatchStatus, Match } from "@prisma/client";

interface MatchRoomModalProps {
  match: MatchWithTeams | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedMatch: Match) => void;
}

function toDatetimeLocalString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function MatchRoomModal({
  match,
  isOpen,
  onClose,
  onSuccess,
}: MatchRoomModalProps) {
  const [roomId, setRoomId] = React.useState("");
  const [roomPassword, setRoomPassword] = React.useState("");
  const [scheduledAt, setScheduledAt] = React.useState("");
  const [status, setStatus] = React.useState<MatchStatus>("SCHEDULED");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (match) {
      setRoomId(match.roomId || "");
      setRoomPassword(match.roomPassword || "");
      setStatus(match.status);
      if (match.scheduledAt) {
        setScheduledAt(toDatetimeLocalString(new Date(match.scheduledAt)));
      } else {
        setScheduledAt(toDatetimeLocalString(new Date()));
      }
      setError(null);
    }
  }, [match]);

  if (!match) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async (overrideStatus?: MatchStatus) => {
    setIsSubmitting(true);
    setError(null);

    const targetStatus = overrideStatus || status;

    try {
      const res = await updateMatchRoomAction({
        matchId: match.id,
        roomId: roomId.trim(),
        roomPassword: roomPassword.trim(),
        scheduledAt: scheduledAt ? scheduledAt : undefined,
        status: targetStatus,
      });

      if (!res.success || !res.match) {
        setError(res.error || "Failed to update match room.");
      } else {
        onSuccess(res.match);
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
      title={`Match Room Console: #${match.matchNumber}`}
      description={`${match.roundName || `Round ${match.round}`} • ${match.tournament.name}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Teams Matchup Header */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="grid grid-cols-5 items-center text-center">
            {/* Team A */}
            <div className="col-span-2 text-left space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                Squad A
              </span>
              <p className="font-bold text-white text-sm truncate">
                {match.teamA?.name || "TBD / Winner"}
              </p>
              {match.teamA?.captain && (
                <p className="text-[11px] text-slate-400 truncate">
                  Capt: {match.teamA.captain.name || match.teamA.captain.email}
                </p>
              )}
            </div>

            {/* VS */}
            <div className="col-span-1">
              <span className="inline-block rounded-full bg-slate-800 px-2 py-0.5 text-xs font-black text-amber-400">
                VS
              </span>
            </div>

            {/* Team B */}
            <div className="col-span-2 text-right space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
                Squad B
              </span>
              <p className="font-bold text-white text-sm truncate">
                {match.teamB?.name || "TBD / Winner"}
              </p>
              {match.teamB?.captain && (
                <p className="text-[11px] text-slate-400 truncate">
                  Capt: {match.teamB.captain.name || match.teamB.captain.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Room Credentials Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Free Fire Room ID
              </label>
              {roomId && (
                <button
                  type="button"
                  onClick={() => handleCopy(roomId, "roomId")}
                  className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
                >
                  {copiedField === "roomId" ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>Copy</span>
                </button>
              )}
            </div>
            <Input
              placeholder="e.g. 84729103"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Room Password
              </label>
              {roomPassword && (
                <button
                  type="button"
                  onClick={() => handleCopy(roomPassword, "roomPassword")}
                  className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
                >
                  {copiedField === "roomPassword" ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>Copy</span>
                </button>
              )}
            </div>
            <Input
              placeholder="e.g. skyfall7"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        {/* Schedule & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Scheduled Match Date & Time"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />

          <Select
            label="Match Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as MatchStatus)}
            options={[
              { label: "Scheduled (Credentials Hidden)", value: "SCHEDULED" },
              { label: "Room Open (Captains Notified)", value: "ROOM_OPEN" },
              { label: "Ongoing (Live in-game)", value: "ONGOING" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Cancelled", value: "CANCELLED" },
            ]}
          />
        </div>

        {/* Notification Warning Banner */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-1 text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <BellRing className="h-4 w-4" />
            <span>Automatic Captain Credential Notification</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Setting status to <strong>ROOM_OPEN</strong> automatically unlocks room credentials for confirmed squad captains on their dashboard and dispatches in-app match alerts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto border-slate-700 text-slate-400"
          >
            Cancel
          </Button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {status !== "ROOM_OPEN" && (
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting || !roomId}
                onClick={() => handleSave("ROOM_OPEN")}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Open Room & Notify Captains</span>
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              disabled={isSubmitting}
              onClick={() => handleSave()}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-1.5 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
