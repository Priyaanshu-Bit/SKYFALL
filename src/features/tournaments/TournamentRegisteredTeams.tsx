import * as React from "react";
import { Users, CheckCircle2 } from "lucide-react";
import type { RegistrationStatus } from "@prisma/client";

interface RegisteredTeamItem {
  id: string;
  registrationStatus: RegistrationStatus;
  registeredAt: Date;
  team: {
    id: string;
    name: string;
    captainId: string;
  };
}

interface TournamentRegisteredTeamsProps {
  registrations: RegisteredTeamItem[];
  teamCapacity: number;
}

export function TournamentRegisteredTeams({
  registrations,
  teamCapacity,
}: TournamentRegisteredTeamsProps) {
  const registeredCount = registrations.length;
  const availableSlots = Math.max(0, teamCapacity - registeredCount);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-skyfall-950/80 border border-skyfall-500/30 text-skyfall-400 shadow-sm">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Registered Squads</h3>
            <p className="text-xs text-slate-400">
              Verified teams locked in for this tournament
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Tournament Roster
          </span>
          <p className="text-base font-bold text-white">
            <span className="text-skyfall-400">{registeredCount}</span> / {teamCapacity} Teams Registered
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      {registeredCount > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {registrations.map((reg, idx) => (
            <div
              key={reg.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Slot index */}
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 text-[11px] font-black text-slate-300 shrink-0">
                  #{idx + 1}
                </span>

                {/* Team avatar / icon */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-skyfall-950 border border-skyfall-500/20 text-skyfall-400 shrink-0 font-bold text-xs uppercase">
                  {reg.team.name.slice(0, 3)}
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {reg.team.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Squad Entry
                  </span>
                </div>
              </div>

              {/* Verified pill */}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 shrink-0 ml-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Verified</span>
              </div>
            </div>
          ))}

          {/* Available Slots Placeholders (Show up to 3 slots) */}
          {Array.from({ length: Math.min(3, availableSlots) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center justify-between rounded-xl border border-dashed border-slate-800/80 bg-slate-950/20 p-3 text-slate-500"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold text-slate-600">
                  #{registeredCount + i + 1}
                </span>
                <span className="text-xs font-medium italic">
                  Slot Available
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                Open
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/30 p-8 text-center space-y-2">
          <Users className="h-8 w-8 text-slate-600" />
          <h4 className="text-sm font-bold text-white">No teams registered yet</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            Be the first squad to enter this tournament and claim Slot #1!
          </p>
        </div>
      )}
    </div>
  );
}
