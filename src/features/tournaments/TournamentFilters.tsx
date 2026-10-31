"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameMode } from "@prisma/client";

interface TournamentFiltersProps {
  gameModes: GameMode[];
  currentStatus?: string;
  currentMode?: string;
  currentSearch?: string;
}

const STATUS_TABS = [
  { label: "All Tournaments", value: "ALL" },
  { label: "Registration Open", value: "OPEN" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
];

export function TournamentFilters({
  gameModes,
  currentStatus = "ALL",
  currentMode = "ALL",
  currentSearch = "",
}: TournamentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = React.useState(currentSearch);

  // Sync state if URL prop changes
  React.useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateFilters = (updates: {
    status?: string;
    mode?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.status !== undefined) {
      if (updates.status === "ALL") {
        params.delete("status");
      } else {
        params.set("status", updates.status);
      }
    }

    if (updates.mode !== undefined) {
      if (updates.mode === "ALL") {
        params.delete("mode");
      } else {
        params.set("mode", updates.mode);
      }
    }

    if (updates.search !== undefined) {
      const trimmed = updates.search.trim();
      if (!trimmed) {
        params.delete("search");
      } else {
        params.set("search", trimmed);
      }
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    updateFilters({ search: "" });
  };

  const handleResetAll = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  const hasActiveFilters =
    currentStatus !== "ALL" || currentMode !== "ALL" || Boolean(currentSearch);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
      {/* Search Bar + Game Mode Dropdown row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Free Fire tournaments by name..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-9 py-2 text-sm text-white placeholder-slate-400 shadow-inner focus:border-skyfall-400 focus:outline-none focus:ring-1 focus:ring-skyfall-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Game Mode Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <Filter className="h-3.5 w-3.5 text-skyfall-400" />
            <span className="hidden sm:inline">Mode:</span>
          </div>
          <select
            value={currentMode}
            onChange={(e) => updateFilters({ mode: e.target.value })}
            className="w-full sm:w-48 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-200 shadow-inner focus:border-skyfall-400 focus:outline-none focus:ring-1 focus:ring-skyfall-400"
            aria-label="Filter by Game Mode"
          >
            <option value="ALL">All Game Modes</option>
            {gameModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.name} ({mode.playersPerTeam}v{mode.playersPerTeam})
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetAll}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 pt-1 border-t border-slate-800/80 text-xs">
        {STATUS_TABS.map((tab) => {
          const active = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => updateFilters({ status: tab.value })}
              className={cn(
                "rounded-lg px-3.5 py-1.5 font-semibold transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400",
                active
                  ? "bg-skyfall-500 text-white shadow-md shadow-skyfall-500/20"
                  : "bg-slate-950/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
