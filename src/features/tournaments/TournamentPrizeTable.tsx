import * as React from "react";
import { Trophy, Award, ShieldCheck } from "lucide-react";
import { formatPaiseToINR, cn } from "@/lib/utils";
import type { PrizeDistribution } from "@prisma/client";

interface TournamentPrizeTableProps {
  prizes: PrizeDistribution[];
  totalPrizePoolPaise: number;
}

export function TournamentPrizeTable({
  prizes,
  totalPrizePoolPaise,
}: TournamentPrizeTableProps) {
  const getPositionStyling = (position: number) => {
    switch (position) {
      case 1:
        return {
          bg: "bg-amber-950/40 border-amber-500/40",
          text: "text-amber-300",
          badge: "bg-amber-500 text-slate-950",
          iconColor: "text-amber-400",
        };
      case 2:
        return {
          bg: "bg-slate-800/40 border-slate-700/60",
          text: "text-slate-200",
          badge: "bg-slate-400 text-slate-950",
          iconColor: "text-slate-300",
        };
      case 3:
        return {
          bg: "bg-amber-950/20 border-amber-800/40",
          text: "text-amber-400",
          badge: "bg-amber-700 text-white",
          iconColor: "text-amber-600",
        };
      default:
        return {
          bg: "bg-slate-900/60 border-slate-800",
          text: "text-slate-300",
          badge: "bg-slate-700 text-slate-200",
          iconColor: "text-slate-400",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 shadow-sm">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Prize Pool Breakdown</h3>
            <p className="text-xs text-slate-400">
              Verified payouts distributed post-match
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Prize Pool
          </span>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">
            {formatPaiseToINR(totalPrizePoolPaise, { showFree: false })}
          </p>
        </div>
      </div>

      {/* Prize Allocation Cards */}
      {prizes.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {prizes.map((prize) => {
            const style = getPositionStyling(prize.position);
            return (
              <div
                key={prize.id}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3.5 transition-colors",
                  style.bg
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg font-black text-xs shadow-sm",
                      style.badge
                    )}
                  >
                    #{prize.position}
                  </div>
                  <div>
                    <h4 className={cn("text-sm font-bold", style.text)}>
                      {prize.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Position #{prize.position} Standing
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-white">
                    {formatPaiseToINR(prize.prizeAmountPaise)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <Award className="h-5 w-5 text-skyfall-400 shrink-0" />
          <span>
            Winner takes all:{" "}
            <strong className="text-emerald-400">
              {formatPaiseToINR(totalPrizePoolPaise, { showFree: false })}
            </strong>
          </span>
        </div>
      )}

      {/* Payout Security Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-slate-300">Instant UPI Disbursement:</span>{" "}
          Winning team captain receives prize payout directly via FamPay/UPI within 2 hours after final match scorecard verification by platform administrators.
        </p>
      </div>
    </div>
  );
}
