import * as React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Swords,
  Users,
  Wallet,
  AlertCircle,
  ArrowRight,
  Flame,
  ShieldCheck,
} from "lucide-react";

export default async function PlayerDashboardPage() {
  const user = await getCurrentUser();
  const playerName = user?.name || "Player";
  const hasFreeFireUid = Boolean(user?.freeFireUid);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-skyfall-950/40 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-skyfall-500/30 bg-skyfall-950/60 px-3 py-1 text-xs font-semibold text-skyfall-400">
            <Flame className="h-3.5 w-3.5" />
            <span>Competitive Season 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, <span className="text-skyfall-400">{playerName}</span>!
          </h1>
          <p className="text-sm text-slate-300">
            Track your registrations, coordinate with your squad, and view upcoming match room credentials.
          </p>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-skyfall-600/10 blur-3xl" />
      </div>

      {/* In-Game UID Warning (If not configured) */}
      {!hasFreeFireUid && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-amber-300">
                Free Fire UID Missing:
              </span>{" "}
              Link your in-game UID to participate in tournaments and receive room invitations.
            </div>
          </div>
          <Link href="/dashboard/profile" className="shrink-0">
            <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-300 hover:bg-amber-950/50 text-xs">
              Configure UID
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Active Tournaments
            </CardTitle>
            <Trophy className="h-4 w-4 text-skyfall-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">0</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Currently registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Upcoming Matches
            </CardTitle>
            <Swords className="h-4 w-4 text-skyfall-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">0</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Next 48 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              My Teams
            </CardTitle>
            <Users className="h-4 w-4 text-skyfall-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">0</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Roster memberships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Prize Winnings
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">₹0</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Verified payouts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Launchpad Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="hover:border-slate-700 transition-colors">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-skyfall-950 border border-skyfall-500/20 text-skyfall-400 mb-2">
              <Trophy className="h-5 w-5" />
            </div>
            <CardTitle>Find Tournaments</CardTitle>
            <CardDescription>
              Explore open Free Fire tournaments, view prize pools, and register your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tournaments">
              <Button variant="default" size="sm" className="w-full gap-2">
                <span>Browse Tournaments</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-skyfall-950 border border-skyfall-500/20 text-skyfall-400 mb-2">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle>Manage Squad</CardTitle>
            <CardDescription>
              Build your competitive roster, send team invites, and register together.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/teams">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <span>Manage Teams</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-700 transition-colors">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-skyfall-950 border border-skyfall-500/20 text-skyfall-400 mb-2">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle>Fair Play & Verification</CardTitle>
            <CardDescription>
              Ensure your Free Fire UID and WhatsApp contact are verified for room access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <span>View Profile</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
