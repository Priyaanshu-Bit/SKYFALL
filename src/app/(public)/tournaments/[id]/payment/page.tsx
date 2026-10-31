import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  getRegistrationForPayment,
  getFamPaySettings,
} from "@/services/payment.service";
import { PaymentSubmissionForm } from "@/features/payments/PaymentSubmissionForm";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { formatPaiseToINR } from "@/lib/utils";

interface PaymentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ registrationId?: string }>;
}

export const metadata: Metadata = {
  title: "Tournament Payment | SKYFALL",
  description: "Complete your Free Fire tournament registration payment via FamPay UPI.",
};

export default async function TournamentPaymentPage({
  params,
  searchParams,
}: PaymentPageProps) {
  const user = await requireAuth();
  const { id } = await params;
  const { registrationId } = await searchParams;

  if (!registrationId) {
    redirect(`/tournaments/${id}`);
  }

  const [registration, fampaySettings] = await Promise.all([
    getRegistrationForPayment(registrationId, user.id),
    getFamPaySettings(),
  ]);

  if (!registration || registration.tournamentId !== id) {
    notFound();
  }

  // If entry fee is free, redirect directly to dashboard
  if (registration.tournament.entryFeePaise === 0) {
    redirect("/dashboard/tournaments");
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href={`/tournaments/${registration.tournamentId}`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Tournament Details</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure Manual UPI Payment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Complete Entry Fee Payment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Scan the official FamPay QR code to transfer{" "}
            <strong className="text-emerald-400 font-bold">
              {formatPaiseToINR(registration.tournament.entryFeePaise)}
            </strong>{" "}
            for squad <strong className="text-white">{registration.team.name}</strong>, then submit your 12-digit UTR reference below.
          </p>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-600/10 blur-3xl" />
      </div>

      {/* Interactive Payment Submission Form */}
      <PaymentSubmissionForm
        registrationId={registration.id}
        tournamentId={registration.tournamentId}
        tournamentName={registration.tournament.name}
        teamName={registration.team.name}
        entryFeePaise={registration.tournament.entryFeePaise}
        fampaySettings={fampaySettings}
        initialUtr={registration.payment?.transactionReference || ""}
      />
    </div>
  );
}
