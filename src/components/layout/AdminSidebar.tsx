"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Shield,
  LayoutDashboard,
  Trophy,
  UserCheck,
  Users,
  CreditCard,
  Swords,
  Award,
  TrendingUp,
  Bell,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Tournaments", href: "/admin/tournaments", icon: Trophy },
  { name: "Registrations", href: "/admin/registrations", icon: UserCheck },
  { name: "Teams", href: "/admin/teams", icon: Users },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Matches", href: "/admin/matches", icon: Swords },
  { name: "Results", href: "/admin/results", icon: Award },
  { name: "Financials", href: "/admin/financials", icon: TrendingUp },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-950/95 p-4 text-slate-300 min-h-screen fixed left-0 top-0 z-30"
      aria-label="Admin Navigation Sidebar"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 px-3 border-b border-slate-800/80 mb-4">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 rounded-md"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-skyfall-600 shadow-md shadow-amber-500/20">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-wider text-white">
              SKYFALL
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-400 leading-none">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Admin Navigation">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                active
                  ? "bg-amber-950/60 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-amber-400" : "text-slate-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Shortcuts */}
      <div className="pt-4 border-t border-slate-800/80 mt-auto space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <Flame className="h-3.5 w-3.5 text-skyfall-400" />
          <span>Switch to Player View</span>
        </Link>
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
