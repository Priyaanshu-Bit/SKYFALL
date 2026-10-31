import * as React from "react";
import {
  ShieldAlert,
  Smartphone,
  KeyRound,
  FileText,
  AlertCircle,
} from "lucide-react";

interface TournamentRulesProps {
  customRules?: string | null;
  gameModeRules?: string | null;
  gameModeName: string;
}

export function TournamentRules({
  customRules,
  gameModeRules,
  gameModeName,
}: TournamentRulesProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-skyfall-950/80 border border-skyfall-500/30 text-skyfall-400 shadow-sm">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Rules & Competitive Guidelines
          </h3>
          <p className="text-xs text-slate-400">
            Mandatory tournament regulations for all participating players
          </p>
        </div>
      </div>

      {/* Grid of Key Policies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Device Policy */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-skyfall-400 font-bold text-xs uppercase tracking-wider">
            <Smartphone className="h-4 w-4" />
            <span>Device Policy</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Mobile Only.</strong> PC Emulators (BlueStacks, LDPlayer, etc.) and iPads/tablets are strictly prohibited. Using an emulator results in instant team disqualification and platform ban.
          </p>
        </div>

        {/* Room Access Policy */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <KeyRound className="h-4 w-4" />
            <span>Room Access</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Custom Room ID & Password are released inside the <strong className="text-white">Player Dashboard</strong> exactly 15 minutes before the match start time. All squad members must enter within 10 minutes.
          </p>
        </div>

        {/* Fair Play Policy */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4" />
            <span>Fair Play</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hacks, mods, third-party crosshairs, or teaming up with opposing squads is forbidden. Match referees record gameplay; decisions by tournament administrators are final.
          </p>
        </div>
      </div>

      {/* Custom Rules or Mode Rules */}
      {(customRules || gameModeRules) && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {customRules ? "Tournament Specific Rules" : `${gameModeName} Rules`}
          </h4>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {customRules || gameModeRules}
          </div>
        </div>
      )}

      {/* Fair Play Reminder */}
      <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-300">
        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
        <span>
          Ensure each player&apos;s Free Fire In-Game UID matches their roster registration. Mismatched players will be kicked from the custom room prior to launch.
        </span>
      </div>
    </div>
  );
}
