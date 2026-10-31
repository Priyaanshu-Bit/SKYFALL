"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Swords,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Shield,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createTournamentAction } from "@/features/admin/actions";
import type { GameMode } from "@prisma/client";
import type { PrizeAllocationInput } from "@/schemas/tournament.schema";

interface CreateTournamentFormProps {
  gameModes: GameMode[];
}

function toDatetimeLocalString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function CreateTournamentForm({ gameModes }: CreateTournamentFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Default dates
  const now = new Date();
  const defaultRegClose = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  defaultRegClose.setHours(16, 0, 0, 0);

  const defaultTourDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  defaultTourDate.setHours(18, 0, 0, 0);

  // Form State
  const [name, setName] = React.useState("Free Fire India Battle Clash #1");
  const [description, setDescription] = React.useState(
    "Official SKYFALL competitive tournament for elite Free Fire India squads. Fast-paced, high-stakes battle for the grand championship."
  );
  const [game, setGame] = React.useState("Free Fire India");
  const [gameModeId, setGameModeId] = React.useState<string>(
    gameModes[0]?.id || ""
  );
  const [tournamentFormat, setTournamentFormat] = React.useState<
    "KNOCKOUT" | "LEAGUE" | "ROUND_ROBIN"
  >("KNOCKOUT");
  const [bannerUrl, setBannerUrl] = React.useState("");
  const [livestreamUrl, setLivestreamUrl] = React.useState("");

  // Financials & Capacity
  const [teamCapacity, setTeamCapacity] = React.useState<number>(12);
  const [entryFeeRupees, setEntryFeeRupees] = React.useState<number>(50);
  const [totalPrizePoolRupees, setTotalPrizePoolRupees] =
    React.useState<number>(500);
  const [status, setStatus] = React.useState<
    "DRAFT" | "PUBLISHED" | "REGISTRATION_OPEN"
  >("REGISTRATION_OPEN");

  // Schedule & Rules
  const [registrationOpenAt, setRegistrationOpenAt] = React.useState<string>(
    toDatetimeLocalString(now)
  );
  const [registrationCloseAt, setRegistrationCloseAt] = React.useState<string>(
    toDatetimeLocalString(defaultRegClose)
  );
  const [tournamentDate, setTournamentDate] = React.useState<string>(
    toDatetimeLocalString(defaultTourDate)
  );
  const [startTime, setStartTime] = React.useState("18:00 IST");
  const [rules, setRules] = React.useState(
    `1. FAIR PLAY MANDATE: Emulators, scripts, macro tools, and modified APKs are strictly prohibited. Violators face immediate squad disqualification and a permanent platform ban.
2. SQUAD ROSTER INTEGRITY: All participating players must join using the exact Free Fire India UIDs registered on the team roster.
3. PUNCTUALITY: Squads must enter the custom room within 10 minutes of room credential release. Late arrivals forfeit the slot.
4. SCREENSHOT VERIFICATION: Winning captains must submit final in-game scoreboard screenshots immediately upon match conclusion.
5. DISPUTES: Admin room coordinator decisions are final and binding across all rounds.`
  );

  // Prize Tiers
  const [prizes, setPrizes] = React.useState<PrizeAllocationInput[]>([
    { position: 1, title: "1st Place (Champion)", prizeAmountRupees: 300 },
    { position: 2, title: "2nd Place (Runner-up)", prizeAmountRupees: 150 },
    { position: 3, title: "3rd Place (2nd Runner-up)", prizeAmountRupees: 50 },
  ]);

  // Derived selected game mode
  const selectedGameMode =
    gameModes.find((g) => g.id === gameModeId) || gameModes[0];

  // Prize Pool Calculations
  const sumAllocatedPrizes = prizes.reduce(
    (acc, p) => acc + (Number(p.prizeAmountRupees) || 0),
    0
  );
  const remainingPrizePool = totalPrizePoolRupees - sumAllocatedPrizes;
  const isOverAllocated = remainingPrizePool < 0;

  // Margin Calculation
  const projectedRevenue = teamCapacity * entryFeeRupees;
  const projectedMargin = projectedRevenue - totalPrizePoolRupees;

  // Prize Preset Handler
  const applyPrizePreset = (type: "100" | "70_30" | "60_25_15" | "50_25_15_10") => {
    const total = totalPrizePoolRupees;
    if (type === "100") {
      setPrizes([
        {
          position: 1,
          title: "1st Place (Champion)",
          prizeAmountRupees: total,
        },
      ]);
    } else if (type === "70_30") {
      setPrizes([
        {
          position: 1,
          title: "1st Place (Champion)",
          prizeAmountRupees: Math.round(total * 0.7),
        },
        {
          position: 2,
          title: "2nd Place (Runner-up)",
          prizeAmountRupees: Math.round(total * 0.3),
        },
      ]);
    } else if (type === "60_25_15") {
      setPrizes([
        {
          position: 1,
          title: "1st Place (Champion)",
          prizeAmountRupees: Math.round(total * 0.6),
        },
        {
          position: 2,
          title: "2nd Place (Runner-up)",
          prizeAmountRupees: Math.round(total * 0.25),
        },
        {
          position: 3,
          title: "3rd Place (2nd Runner-up)",
          prizeAmountRupees: Math.round(total * 0.15),
        },
      ]);
    } else if (type === "50_25_15_10") {
      setPrizes([
        {
          position: 1,
          title: "1st Place (Champion)",
          prizeAmountRupees: Math.round(total * 0.5),
        },
        {
          position: 2,
          title: "2nd Place (Runner-up)",
          prizeAmountRupees: Math.round(total * 0.25),
        },
        {
          position: 3,
          title: "3rd Place",
          prizeAmountRupees: Math.round(total * 0.15),
        },
        {
          position: 4,
          title: "Top Fragger / MVP",
          prizeAmountRupees: Math.round(total * 0.1),
        },
      ]);
    }
  };

  const handleAddPrizeTier = () => {
    const nextPos = prizes.length + 1;
    setPrizes((prev) => [
      ...prev,
      {
        position: nextPos,
        title: `${nextPos}th Place`,
        prizeAmountRupees: 0,
      },
    ]);
  };

  const handleRemovePrizeTier = (index: number) => {
    setPrizes((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((p, idx) => ({ ...p, position: idx + 1 }))
    );
  };

  const handlePrizeChange = (
    index: number,
    field: keyof PrizeAllocationInput,
    value: string | number
  ) => {
    setPrizes((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          [field]: field === "prizeAmountRupees" ? Number(value) || 0 : value,
        };
      })
    );
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    setFormError(null);
    if (step === 1) {
      if (!name.trim() || name.length < 3) {
        setFormError("Please enter a valid tournament name (at least 3 characters).");
        return false;
      }
      if (!gameModeId) {
        setFormError("Please select a game mode.");
        return false;
      }
    }

    if (step === 2) {
      if (teamCapacity < 2 || teamCapacity % 2 !== 0) {
        setFormError("Team capacity must be an even number >= 2 (e.g. 4, 8, 12, 16).");
        return false;
      }
      if (entryFeeRupees < 0) {
        setFormError("Entry fee cannot be negative.");
        return false;
      }
      if (totalPrizePoolRupees < 0) {
        setFormError("Total prize pool cannot be negative.");
        return false;
      }
    }

    if (step === 3) {
      if (prizes.length === 0) {
        setFormError("At least one prize allocation tier is required.");
        return false;
      }
      if (isOverAllocated) {
        setFormError(
          `Prize allocations sum (₹${sumAllocatedPrizes}) exceeds total prize pool (₹${totalPrizePoolRupees}).`
        );
        return false;
      }
    }

    if (step === 4) {
      const regOpen = new Date(registrationOpenAt);
      const regClose = new Date(registrationCloseAt);
      const tourDate = new Date(tournamentDate);

      if (isNaN(regOpen.getTime()) || isNaN(regClose.getTime())) {
        setFormError("Please provide valid registration dates.");
        return false;
      }
      if (regClose <= regOpen) {
        setFormError("Registration deadline must be after registration opening date.");
        return false;
      }
      if (tourDate < regClose) {
        setFormError("Tournament event date cannot be earlier than the registration deadline.");
        return false;
      }
      if (!startTime.trim()) {
        setFormError("Please specify a starting time.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setFormError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Handler
  const handleSubmit = async () => {
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setIsSubmitting(true);
    setFormError(null);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      game: game.trim(),
      gameModeId,
      tournamentFormat,
      teamCapacity: Number(teamCapacity),
      entryFeeRupees: Number(entryFeeRupees),
      totalPrizePoolRupees: Number(totalPrizePoolRupees),
      status,
      registrationOpenAt,
      registrationCloseAt,
      tournamentDate,
      startTime: startTime.trim(),
      rules: rules.trim(),
      bannerUrl: bannerUrl.trim() || undefined,
      livestreamUrl: livestreamUrl.trim() || undefined,
      prizes: prizes.map((p) => ({
        position: Number(p.position),
        title: p.title.trim(),
        prizeAmountRupees: Number(p.prizeAmountRupees),
      })),
    };

    try {
      const result = await createTournamentAction(payload);
      if (!result.success) {
        setFormError(result.error || "Failed to create tournament.");
        setIsSubmitting(false);
      } else {
        router.push("/admin/tournaments");
        router.refresh();
      }
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: "Game & Format", icon: Swords },
    { number: 2, label: "Capacity & Entry", icon: DollarSign },
    { number: 3, label: "Prize Allocation", icon: Trophy },
    { number: 4, label: "Schedule & Rules", icon: Calendar },
    { number: 5, label: "Review & Publish", icon: Sparkles },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Tournament Creator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create New Tournament
          </h1>
          <p className="text-sm text-slate-400">
            Configure match rules, slot capacity, manual entry fee, and automated prize distribution.
          </p>
        </div>

        <Link href="/admin/tournaments">
          <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-300">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tournaments</span>
          </Button>
        </Link>
      </div>

      {/* Stepper Progress Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => {
                  if (s.number < currentStep || validateStep(currentStep)) {
                    setCurrentStep(s.number);
                  }
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-center sm:text-left transition-all ${
                  isCurrent
                    ? "bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold"
                    : isCompleted
                    ? "bg-slate-800/60 text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent
                      ? "bg-amber-500 text-slate-950"
                      : isCompleted
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.number}
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs truncate">
                  <Icon className="h-3 w-3" />
                  <span>{s.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-300 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Validation Issue</p>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* STEP 1: Basic Information & Game Mode */}
      {currentStep === 1 && (
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Swords className="h-4 w-4" />
              <span>Step 1: Game & Tournament Format</span>
            </div>
            <CardTitle className="text-xl text-white">Basic Tournament Details</CardTitle>
            <CardDescription className="text-slate-400">
              Select the competitive game mode and title configuration for this event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Tournament Name"
              required
              placeholder="e.g. Free Fire India Clash Squad Masters #1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              hint="Public title displayed across the platform and player dashboards."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Game Title"
                required
                value={game}
                onChange={(e) => setGame(e.target.value)}
                hint="Default competitive title is Free Fire India."
              />

              <Select
                label="Game Mode"
                required
                value={gameModeId}
                onChange={(e) => setGameModeId(e.target.value)}
                options={gameModes.map((gm) => ({
                  label: `${gm.name} (${gm.playersPerTeam}v${gm.playersPerTeam})`,
                  value: gm.id,
                }))}
                hint={selectedGameMode?.description || "Select competition mode."}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Tournament Format"
                required
                value={tournamentFormat}
                onChange={(e) =>
                  setTournamentFormat(
                    e.target.value as "KNOCKOUT" | "LEAGUE" | "ROUND_ROBIN"
                  )
                }
                options={[
                  { label: "Single Elimination (Knockout)", value: "KNOCKOUT" },
                  { label: "Round Robin Group Stage", value: "ROUND_ROBIN" },
                  { label: "Points League", value: "LEAGUE" },
                ]}
                hint="Knockout automatically advances winners round-by-round."
              />

              <Input
                label="Optional Banner URL"
                placeholder="https://example.com/banner.jpg"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                hint="High-res 16:9 banner image for tournament hero header."
              />
            </div>

            <Textarea
              label="Tournament Description"
              rows={3}
              placeholder="Describe tournament stakes, organizer details, and eligibility..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              label="Optional YouTube Livestream Link"
              placeholder="https://www.youtube.com/watch?v=..."
              value={livestreamUrl}
              onChange={(e) => setLivestreamUrl(e.target.value)}
              hint="Embeds a live stream player once the tournament begins."
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-800/80 pt-4">
            <span className="text-xs text-slate-500">Step 1 of 5</span>
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              <span>Next: Capacity & Entry Fee</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Capacity & Financials */}
      {currentStep === 2 && (
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <DollarSign className="h-4 w-4" />
              <span>Step 2: Capacity & Entry Configuration</span>
            </div>
            <CardTitle className="text-xl text-white">Team Slots & Fee Setup</CardTitle>
            <CardDescription className="text-slate-400">
              Configure participating team capacity and manual FamPay entry fees.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Capacity with quick chips */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Team Slot Capacity <span className="text-amber-400">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {[4, 8, 12, 16, 24, 48].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={teamCapacity === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTeamCapacity(preset)}
                    className={
                      teamCapacity === preset
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "border-slate-700 text-slate-300"
                    }
                  >
                    {preset} Teams
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                min={2}
                step={2}
                value={teamCapacity}
                onChange={(e) => setTeamCapacity(Number(e.target.value) || 2)}
                hint="Must be an even integer >= 2. Can be any valid even number (e.g. 12, 14, 20)."
              />
            </div>

            {/* Entry Fee & Total Prize Pool */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Entry Fee per Team (₹ INR)"
                required
                type="number"
                min={0}
                value={entryFeeRupees}
                onChange={(e) => setEntryFeeRupees(Number(e.target.value) || 0)}
                hint="Set to 0 for Free-to-enter tournaments."
              />

              <Input
                label="Total Prize Pool (₹ INR)"
                required
                type="number"
                min={0}
                value={totalPrizePoolRupees}
                onChange={(e) => setTotalPrizePoolRupees(Number(e.target.value) || 0)}
                hint="Total prize pot committed to winning teams."
              />
            </div>

            {/* Live Financial Margin Breakdown */}
            <div className="rounded-xl border border-slate-700/80 bg-slate-950/60 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Layers className="h-4 w-4 text-amber-400" />
                <span>Financial Projections & Organizer Margin</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                  <p className="text-xs text-slate-400">Total Slot Revenue</p>
                  <p className="text-lg font-bold text-white">₹{projectedRevenue}</p>
                  <p className="text-[10px] text-slate-500">
                    {teamCapacity} squads × ₹{entryFeeRupees}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                  <p className="text-xs text-slate-400">Prize Commitment</p>
                  <p className="text-lg font-bold text-amber-400">₹{totalPrizePoolRupees}</p>
                  <p className="text-[10px] text-slate-500">Guaranteed Pool</p>
                </div>
                <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                  <p className="text-xs text-slate-400">Net Platform Margin</p>
                  <p
                    className={`text-lg font-bold ${
                      projectedMargin >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {projectedMargin >= 0 ? `+₹${projectedMargin}` : `-₹${Math.abs(projectedMargin)}`}
                  </p>
                  <p className="text-[10px] text-slate-500">Revenue - Prize Pool</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-800/80 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="gap-2 border-slate-700 text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              <span>Next: Prize Allocation</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: Prize Allocation Breakdown */}
      {currentStep === 3 && (
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Trophy className="h-4 w-4" />
              <span>Step 3: Prize Distribution Breakdown</span>
            </div>
            <CardTitle className="text-xl text-white">Position Payout Allocation</CardTitle>
            <CardDescription className="text-slate-400">
              Assign exact prize amounts to placements. Total allocations cannot exceed the ₹
              {totalPrizePoolRupees} prize pool.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Quick Allocation Presets
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPrizePreset("100")}
                  className="border-slate-700 text-xs"
                >
                  Winner Takes All (100%)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPrizePreset("70_30")}
                  className="border-slate-700 text-xs"
                >
                  Top 2 (70% / 30%)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPrizePreset("60_25_15")}
                  className="border-slate-700 text-xs"
                >
                  Top 3 (60% / 25% / 15%)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPrizePreset("50_25_15_10")}
                  className="border-slate-700 text-xs"
                >
                  Top 4 + MVP (50 / 25 / 15 / 10)
                </Button>
              </div>
            </div>

            {/* Prize Allocation Rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Prize Tiers
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPrizeTier}
                  className="gap-1.5 border-amber-500/40 text-amber-400 hover:bg-amber-950/40 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Position</span>
                </Button>
              </div>

              {prizes.map((prize, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-bold text-amber-400 text-xs">
                    #{prize.position}
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Title (e.g. 1st Place / Champion)"
                      value={prize.title}
                      onChange={(e) =>
                        handlePrizeChange(idx, "title", e.target.value)
                      }
                      className="h-9 text-xs"
                    />

                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Amount"
                        value={prize.prizeAmountRupees}
                        onChange={(e) =>
                          handlePrizeChange(idx, "prizeAmountRupees", e.target.value)
                        }
                        className="h-9 pl-7 text-xs"
                      />
                    </div>
                  </div>

                  {prizes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePrizeTier(idx)}
                      className="h-8 w-8 p-0 text-slate-500 hover:text-red-400 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Real-time Allocation Summary Meter */}
            <div
              className={`rounded-xl border p-4 transition-all ${
                isOverAllocated
                  ? "border-red-500/40 bg-red-950/30 text-red-300"
                  : remainingPrizePool === 0
                  ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                  : "border-slate-800 bg-slate-950/60 text-slate-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    Prize Allocation Audit
                  </p>
                  <p className="text-sm">
                    Allocated: <span className="font-bold">₹{sumAllocatedPrizes}</span> of{" "}
                    <span className="font-bold">₹{totalPrizePoolRupees}</span>
                  </p>
                </div>

                <div>
                  {isOverAllocated ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Over allocated by ₹{Math.abs(remainingPrizePool)}</span>
                    </Badge>
                  ) : remainingPrizePool === 0 ? (
                    <Badge variant="success" className="gap-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>100% Fully Distributed</span>
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1">
                      <span>Unallocated: ₹{remainingPrizePool}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-800/80 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="gap-2 border-slate-700 text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={isOverAllocated}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold disabled:opacity-50"
            >
              <span>Next: Schedule & Rules</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 4: Schedule & Rules */}
      {currentStep === 4 && (
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Calendar className="h-4 w-4" />
              <span>Step 4: Scheduling & Tournament Rules</span>
            </div>
            <CardTitle className="text-xl text-white">Dates, Timelines & Guidelines</CardTitle>
            <CardDescription className="text-slate-400">
              Establish registration windows, match schedule, and anti-cheat competitive rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registration Opens At"
                required
                type="datetime-local"
                value={registrationOpenAt}
                onChange={(e) => setRegistrationOpenAt(e.target.value)}
                hint="When players can begin registering squad slots."
              />

              <Input
                label="Registration Deadline"
                required
                type="datetime-local"
                value={registrationCloseAt}
                onChange={(e) => setRegistrationCloseAt(e.target.value)}
                hint="After this deadline, registration closes permanently."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tournament Match Date"
                required
                type="datetime-local"
                value={tournamentDate}
                onChange={(e) => setTournamentDate(e.target.value)}
                hint="Scheduled tournament day."
              />

              <Input
                label="Match Start Time"
                required
                placeholder="e.g. 18:00 IST"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                hint="Time custom room opens and credentials are distributed."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Competitive Tournament Rules & Anti-Cheat Policy
                </label>
                <span className="text-[10px] text-slate-500">Markdown enabled</span>
              </div>
              <Textarea
                rows={7}
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                hint="Transparent guidelines shown to captains prior to registration."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-800/80 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="gap-2 border-slate-700 text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              <span>Next: Review & Publish</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 5: Review & Publish */}
      {currentStep === 5 && (
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Step 5: Final Review & Confirmation</span>
            </div>
            <CardTitle className="text-xl text-white">Review Tournament Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Audit all settings before making this tournament active on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Preview Box */}
            <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-xs mb-1">
                    {game} • {selectedGameMode?.name}
                  </Badge>
                  <h3 className="text-lg font-black text-white">{name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Prize Pool</p>
                  <p className="text-2xl font-black text-amber-400">₹{totalPrizePoolRupees}</p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                  <p className="text-slate-400">Format</p>
                  <p className="font-semibold text-white">{tournamentFormat}</p>
                </div>
                <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                  <p className="text-slate-400">Capacity</p>
                  <p className="font-semibold text-white">{teamCapacity} Squads</p>
                </div>
                <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                  <p className="text-slate-400">Entry Fee</p>
                  <p className="font-semibold text-emerald-400">
                    {entryFeeRupees === 0 ? "FREE" : `₹${entryFeeRupees} / team`}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                  <p className="text-slate-400">Match Schedule</p>
                  <p className="font-semibold text-white">{startTime}</p>
                </div>
              </div>

              {/* Prize Tiers */}
              <div className="space-y-1.5 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Prize Allocations:
                </p>
                <div className="flex flex-wrap gap-2">
                  {prizes.map((p) => (
                    <div
                      key={p.position}
                      className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs flex items-center gap-2"
                    >
                      <span className="font-bold text-amber-400">#{p.position}</span>
                      <span className="text-slate-300">{p.title}:</span>
                      <span className="font-bold text-white">₹{p.prizeAmountRupees}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Publication Status Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Initial Tournament Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("REGISTRATION_OPEN")}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    status === "REGISTRATION_OPEN"
                      ? "border-emerald-500 bg-emerald-950/30 text-emerald-300"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <p className="text-xs font-bold">Open for Registration</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Immediately visible to players and open for squad sign-ups.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("PUBLISHED")}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    status === "PUBLISHED"
                      ? "border-sky-500 bg-sky-950/30 text-sky-300"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <p className="text-xs font-bold">Published (Upcoming)</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Visible on discovery listings with registration countdown.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("DRAFT")}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    status === "DRAFT"
                      ? "border-amber-500 bg-amber-950/30 text-amber-300"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <p className="text-xs font-bold">Save as Draft</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Hidden from public view until admin explicitly publishes it.
                  </p>
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-800/80 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="gap-2 border-slate-700 text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isOverAllocated}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold disabled:opacity-50 min-w-36"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Confirm & Create</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
