"use client";

import * as React from "react";
import {
  Trophy,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fulfillPrizePayoutAction } from "@/features/admin/actions";
import { formatPaiseToINR } from "@/lib/utils";
import type { PrizeDistributionItem } from "@/services/admin-financial.service";
import { playTrophyTone, playErrorTone } from "@/lib/sound";

interface FulfillPayoutModalProps {
  prize: PrizeDistributionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FulfillPayoutModal({
  prize,
  isOpen,
  onClose,
  onSuccess,
}: FulfillPayoutModalProps) {
  const [transactionReference, setTransactionReference] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (prize) {
      setTransactionReference("");
      setNotes("");
      setError(null);
    }
  }, [prize]);

  if (!prize) return null;

  const handleSubmit = async () => {
    const ref = transactionReference.trim();
    if (!ref || ref.length < 4) {
      playErrorTone();
      setError("Please provide a valid UPI / FamPay transaction reference.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fulfillPrizePayoutAction(prize.id, {
        transactionReference: ref,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        playErrorTone();
        setError(
          ("error" in res ? res.error : undefined) ||
            "Failed to record prize payout."
        );
      } else {
        playTrophyTone();
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      playErrorTone();
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fulfill Prize Payout"
      description={`${prize.title} • ${prize.tournament.name}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Payout Hero Card */}
        <div className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {prize.title} (#{prize.position})
                </span>
                <p className="text-sm font-bold text-white">
                  {prize.recipientTeam?.name || "Winning Squad"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Payout Amount
              </span>
              <p className="text-xl font-black text-amber-400">
                {formatPaiseToINR(prize.prizeAmountPaise, { showFree: false })}
              </p>
            </div>
          </div>

          {/* Captain details */}
          {prize.recipientTeam?.captain && (
            <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400">Captain Name:</span>
                <p className="font-semibold text-white">
                  {prize.recipientTeam.captain.name || prize.recipientTeam.captain.email}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Phone / Free Fire UID:</span>
                <p className="font-semibold text-white font-mono">
                  {prize.recipientTeam.captain.phone ||
                    prize.recipientTeam.captain.freeFireUid ||
                    "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error alert */}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Transaction Reference Input */}
        <Input
          label="UPI / FamPay Transaction Reference (UTR)"
          required
          placeholder="e.g. 504281938210"
          value={transactionReference}
          onChange={(e) => setTransactionReference(e.target.value)}
          hint="Reference ID generated after sending the prize money from your FamPay/UPI app."
        />

        {/* Administration Notes */}
        <Textarea
          label="Optional Admin Audit Notes"
          rows={2}
          placeholder="e.g. Paid to captain's UPI ID: captain@fam..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Notice */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Recording this payout transitions status to <strong>PAID</strong>, updates the financial ledger, and notifies the captain on their dashboard.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-slate-700 text-slate-400"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isSubmitting || !transactionReference.trim()}
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 min-w-36"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <DollarSign className="h-3.5 w-3.5" />
                <span>Confirm Prize Transfer</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
