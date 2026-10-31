import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getPlayerRegistrations } from "@/services/player-dashboard.service";
import { PlayerRegistrationCard } from "@/features/registrations/PlayerRegistrationCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Trophy, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "My Tournaments | SKYFALL Player Hub",
  description: "View and manage your registered Free Fire tournaments and squad slots.",
};

export default async function PlayerTournamentsPage() {
  const user = await requireAuth();
  const registrations = await getPlayerRegistrations(user.id);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-skyfall-400">
            <Trophy className="h-3.5 w-3.5" />
            <span>My Competitions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Tournament Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor squad approval statuses, view match schedules, and unlock room credentials.
          </p>
        </div>

        <Link href="/tournaments">
          <Button variant="default" size="sm" className="gap-2 font-bold shrink-0">
            <Plus className="h-4 w-4" />
            <span>Find Tournaments</span>
          </Button>
        </Link>
      </div>

      {/* Registrations List / Empty State */}
      {registrations.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{registrations.length}</strong> registered competition{registrations.length === 1 ? "" : "s"}
          </div>

          <div className="space-y-4">
            {registrations.map((registration) => (
              <PlayerRegistrationCard
                key={registration.id}
                registration={registration}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No Tournament Registrations Yet"
          description="You haven't registered your squad for any Free Fire tournaments yet. Explore open brackets and claim your team slot today."
          actionLabel="Browse Open Tournaments"
          className="my-8"
        />
      )}
    </div>
  );
}
