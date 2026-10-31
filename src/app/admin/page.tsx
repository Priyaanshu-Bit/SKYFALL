import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Trophy,
  CreditCard,
  Swords,
  ArrowRight,
  TrendingUp,
  Plus,
} from "lucide-react";

export default async function AdminDashboardPage() {

  return (
    <div className="space-y-6">
      {/* Admin Operations Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/60 px-3 py-1 text-xs font-semibold text-amber-400">
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Operational Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Overview & Control
            </h1>
            <p className="text-sm text-slate-300">
              Manage tournaments, verify UPI payment screenshots, coordinate match room credentials, and audit financial distribution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/admin/tournaments/new">
              <Button variant="default" size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                <Plus className="h-4 w-4" />
                <span>Create Tournament</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-amber-500/20 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Pending Approvals
            </CardTitle>
            <CreditCard className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-300">0</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Payments awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Active Tournaments
            </CardTitle>
            <Trophy className="h-4 w-4 text-skyfall-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">0</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Live or open for registration
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Live / Today Matches
            </CardTitle>
            <Swords className="h-4 w-4 text-skyfall-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">0</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Rooms to be distributed
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Verified Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">₹0</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Confirmed collections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operational Action Panels */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Payment Verification Queue */}
        <Card className="hover:border-amber-500/40 transition-colors">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 mb-2">
              <CreditCard className="h-5 w-5" />
            </div>
            <CardTitle>Payment Verification</CardTitle>
            <CardDescription>
              Review uploaded UPI transaction screenshots, match UTR numbers, and approve or reject team registrations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/payments">
              <Button variant="outline" size="sm" className="w-full gap-2 border-slate-700 hover:border-amber-500/50">
                <span>Open Verification Queue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tournament Management */}
        <Card className="hover:border-skyfall-500/40 transition-colors">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-skyfall-950/60 border border-skyfall-500/30 text-skyfall-400 mb-2">
              <Trophy className="h-5 w-5" />
            </div>
            <CardTitle>Tournament Operations</CardTitle>
            <CardDescription>
              Create new tournament brackets, update team capacities, close registrations, or mark tournaments completed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/tournaments">
              <Button variant="outline" size="sm" className="w-full gap-2 border-slate-700 hover:border-skyfall-500/50">
                <span>Manage Tournaments</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Room ID & Match Operations */}
        <Card className="hover:border-slate-600 transition-colors">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-slate-300 mb-2">
              <Swords className="h-5 w-5" />
            </div>
            <CardTitle>Match Rooms & Results</CardTitle>
            <CardDescription>
              Generate Free Fire Custom Room IDs and passwords, notify team captains, and record final match standings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/matches">
              <Button variant="outline" size="sm" className="w-full gap-2 border-slate-700 hover:border-slate-500">
                <span>Manage Matches</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
