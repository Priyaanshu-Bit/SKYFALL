"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { TournamentCard } from "./TournamentCard";
import type { TournamentListItem } from "@/services/tournament.service";

interface TournamentGridProps {
  tournaments: TournamentListItem[];
}

export function TournamentGrid({ tournaments }: TournamentGridProps) {
  const router = useRouter();

  if (tournaments.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No Tournaments Found"
        description="There are currently no tournaments matching your selected filters or search terms. Try clearing your filters or check back shortly for upcoming competitive brackets."
        actionLabel="View All Tournaments"
        onAction={() => router.push("/tournaments")}
        className="my-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Result Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="font-bold text-white">{tournaments.length}</span> tournament{tournaments.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  );
}
