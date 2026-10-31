"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Flame, Bell, Trophy, ArrowUpRight } from "lucide-react";

const TITLE_MAP: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/teams": "My Teams",
  "/dashboard/tournaments": "My Tournaments",
  "/dashboard/payments": "Payments & Wallet",
  "/dashboard/matches": "Match Schedule",
  "/dashboard/results": "Tournament Results",
  "/dashboard/notifications": "Notifications",
  "/dashboard/profile": "Player Profile",
};

export function PlayerHeader() {
  const pathname = usePathname();

  // Find longest matching prefix or exact match
  const pageTitle = React.useMemo(() => {
    if (TITLE_MAP[pathname]) {
      return TITLE_MAP[pathname];
    }
    const matchedKey = Object.keys(TITLE_MAP)
      .filter((key) => key !== "/dashboard" && pathname.startsWith(key))
      .sort((a, b) => b.length - a.length)[0];

    return matchedKey ? TITLE_MAP[matchedKey] : "Player Hub";
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md"
      aria-label="Player Header"
    >
      {/* Mobile Branding (Visible only on small/medium screens) */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 rounded-md"
          aria-label="SKYFALL Home"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-skyfall-500 to-skyfall-700 shadow-md shadow-skyfall-500/20">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-black tracking-wider text-white">
            SKYFALL
          </span>
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-xs font-semibold text-skyfall-400 truncate max-w-[120px] sm:max-w-none">
          {pageTitle}
        </span>
      </div>

      {/* Desktop Breadcrumb/Title */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Player
        </span>
        <span className="text-slate-600">/</span>
        <h1 className="text-sm font-bold text-white tracking-wide">
          {pageTitle}
        </h1>
      </div>

      {/* Action shortcuts & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick link to explore tournaments */}
        <Link
          href="/tournaments"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400"
        >
          <Trophy className="h-3.5 w-3.5 text-skyfall-400" />
          <span>Tournaments</span>
          <ArrowUpRight className="h-3 w-3 text-slate-500" />
        </Link>

        {/* Notifications shortcut */}
        <Link
          href="/dashboard/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Link>

        {/* Clerk User Button */}
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8 border border-skyfall-500/40 shadow-sm",
            },
          }}
        />
      </div>
    </header>
  );
}
