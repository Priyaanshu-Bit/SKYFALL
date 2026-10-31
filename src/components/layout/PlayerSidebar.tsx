"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Users,
  Trophy,
  CreditCard,
  Swords,
  Award,
  Bell,
  User,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PLAYER_NAV_ITEMS: PlayerNavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Teams", href: "/dashboard/teams", icon: Users },
  { name: "My Tournaments", href: "/dashboard/tournaments", icon: Trophy },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Matches", href: "/dashboard/matches", icon: Swords },
  { name: "Results", href: "/dashboard/results", icon: Award },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function PlayerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-950/95 p-4 text-slate-300 min-h-screen fixed left-0 top-0 z-30"
      aria-label="Player Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 px-3 border-b border-slate-800/80 mb-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 rounded-md"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-skyfall-500 to-skyfall-700 shadow-md shadow-skyfall-500/20">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-wider text-white">
              SKYFALL
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-skyfall-400 leading-none">
              Player Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1" aria-label="Player Navigation">
        {PLAYER_NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400",
                active
                  ? "bg-skyfall-950/80 text-skyfall-400 border border-skyfall-500/30 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-skyfall-400" : "text-slate-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Shortcuts */}
      <div className="pt-4 border-t border-slate-800/80 mt-auto">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Public Website</span>
        </Link>
      </div>
    </aside>
  );
}
