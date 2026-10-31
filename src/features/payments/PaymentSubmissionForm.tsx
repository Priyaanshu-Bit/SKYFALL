"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Copy,
  Check,
  QrCode,
  Upload,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPaiseToINR, cn } from "@/lib/utils";
import { submitPaymentProof } from "./actions";

interface PaymentSubmissionFormProps {
  registrationId: string;
  tournamentId: string;
  tournamentName: string;
  teamName: string;
  entryFeePaise: number;
  fampaySettings: {
    qrImageUrl: string;
    upiId: string;
    branding: string;
  };
  initialUtr?: string;
}

export function PaymentSubmissionForm({
  registrationId,
  tournamentId,
  tournamentName,
  teamName,
  entryFeePaise,
  fampaySettings,
  initialUtr = "",
}: PaymentSubmissionFormProps) {
  const router = useRouter();

  const [copiedUpi, setCopiedUpi] = React.useState(false);
  const [utr, setUtr] = React.useState(initialUtr);
  const [screenshotDataUrl, setScreenshotDataUrl] = React.useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = React.useState(false);

  const formattedAmount = formatPaiseToINR(entryFeePaise);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(fampaySettings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Screenshot file size must be less than 5MB.");
      return;
    }

    setScreenshotFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotDataUrl(null);
    setScreenshotFileName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUtr = utr.trim();
    if (!/^\d{12}$/.test(cleanUtr)) {
      setErrorMessage("UPI Reference (UTR) must be exactly 12 numeric digits.");
      return;
    }

    if (!screenshotDataUrl) {
      setErrorMessage("Please upload a screenshot of your payment receipt.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitPaymentProof({
        registrationId,
        transactionReference: cleanUtr,
        screenshotUrl: screenshotDataUrl,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to submit payment proof.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmittedSuccess(true);
    } catch {
      setErrorMessage("A network or server error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSubmittedSuccess) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-6 sm:p-10 text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
          <Check className="h-8 w-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-black text-white">Payment Proof Submitted!</h2>
          <p className="text-sm text-slate-300">
            Your UPI reference <strong className="text-emerald-400 font-mono">{utr}</strong> for squad{" "}
            <strong className="text-white">{teamName}</strong> has been logged for administrative verification.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400 max-w-md mx-auto text-left space-y-1.5">
          <span className="font-bold text-slate-200">What happens next?</span>
          <p>
            1. Admins match your 12-digit UTR against the platform FamPay account statement.
          </p>
          <p>
            2. Upon approval (usually within 30 minutes), your tournament slot is confirmed.
          </p>
          <p>
            3. Room ID & Password will appear in your Player Dashboard before the match.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => router.push("/dashboard/tournaments")}
            variant="default"
            className="w-full sm:w-auto font-bold"
          >
            <span>View My Registrations</span>
          </Button>
          <Button
            onClick={() => router.push(`/tournaments/${tournamentId}`)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <span>Return to Tournament</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: QR Code & Payment Instructions */}
      <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-skyfall-500/30 bg-skyfall-950/60 px-3 py-0.5 text-xs font-semibold text-skyfall-400">
            <QrCode className="h-3.5 w-3.5" />
            <span>Step 1: Scan & Transfer</span>
          </div>
          <h2 className="text-xl font-black text-white">FamPay UPI Payment</h2>
          <p className="text-xs text-slate-400">
            Scan the official QR code or copy the UPI ID using any UPI app (FamPay, GPay, PhonePe, Paytm).
          </p>
        </div>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="relative h-56 w-56 overflow-hidden rounded-xl border-2 border-slate-700 bg-white p-2 shadow-inner">
            {fampaySettings.qrImageUrl && fampaySettings.qrImageUrl !== "/images/placeholder-fampay-qr.png" ? (
              <Image
                src={fampaySettings.qrImageUrl}
                alt="FamPay UPI QR Code"
                fill
                unoptimized
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-900 p-4 text-center">
                <QrCode className="h-16 w-16 text-slate-800 mb-2" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  {fampaySettings.branding} UPI QR
                </span>
                <span className="text-[10px] text-slate-600 font-mono mt-1 break-all">
                  {fampaySettings.upiId}
                </span>
              </div>
            )}
          </div>

          {/* Amount Badge */}
          <div className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Exact Amount to Transfer
            </span>
            <p className="text-3xl font-black text-emerald-400">{formattedAmount}</p>
          </div>

          {/* Copyable UPI ID Box */}
          <div className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Official UPI VPA
              </span>
              <span className="text-xs font-mono font-bold text-white truncate block">
                {fampaySettings.upiId}
              </span>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCopyUpi}
              className="gap-1.5 text-xs shrink-0"
            >
              {copiedUpi ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy UPI</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Instructions Steps */}
        <div className="space-y-2 text-xs text-slate-300">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Payment Checklist:
          </span>
          <ul className="space-y-1.5 list-disc list-inside text-slate-400">
            <li>Ensure the transfer amount is exactly <strong className="text-white">{formattedAmount}</strong>.</li>
            <li>Once transfer completes, copy the <strong className="text-white">12-digit UPI Reference / UTR Number</strong>.</li>
            <li>Take a clear screenshot of the payment success screen showing the UTR.</li>
          </ul>
        </div>
      </div>

      {/* Right Column: UTR & Screenshot Submission Form */}
      <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-0.5 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Step 2: Submit Proof</span>
            </div>
            <h2 className="text-xl font-black text-white">Transaction Verification</h2>
            <p className="text-xs text-slate-400">
              Provide your transaction reference and upload proof for admin review.
            </p>
          </div>

          {/* Registration Summary Pill */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tournament:</span>
              <span className="font-bold text-white">{tournamentName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Squad:</span>
              <span className="font-bold text-skyfall-400">{teamName}</span>
            </div>
          </div>

          {/* 12-Digit UTR Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                12-Digit UPI UTR Reference <span className="text-skyfall-400">*</span>
              </label>
              <span
                className={cn(
                  "text-[10px] font-mono",
                  utr.trim().length === 12
                    ? "text-emerald-400 font-bold"
                    : "text-slate-500"
                )}
              >
                {utr.trim().length} / 12 Digits
              </span>
            </div>
            <Input
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="e.g. 431289567123"
              maxLength={12}
              required
              className="font-mono tracking-wider text-base"
            />
            <p className="text-[11px] text-slate-500">
              Found on your transaction receipt as &quot;UPI Ref ID&quot;, &quot;UTR&quot;, or &quot;Google Transaction ID&quot;.
            </p>
          </div>

          {/* Screenshot Upload Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Payment Screenshot Proof <span className="text-skyfall-400">*</span>
            </label>

            {screenshotDataUrl ? (
              <div className="relative rounded-2xl border border-slate-700 bg-slate-950 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-300 truncate max-w-[200px]">
                    {screenshotFileName}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-900">
                  <Image
                    src={screenshotDataUrl}
                    alt="Payment Screenshot Preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/60 p-6 cursor-pointer hover:border-slate-700 hover:bg-slate-950 transition-colors">
                <Upload className="h-8 w-8 text-skyfall-400 mb-2" />
                <span className="text-xs font-bold text-white">
                  Click to upload payment screenshot
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  PNG, JPG, or WEBP (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs text-red-300">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Security Alert */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-300">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Admin Verification Notice:</strong> Submitting your receipt locks your squad in queue. An administrator verifies the transaction before confirming your slot.
            </p>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || utr.trim().length !== 12 || !screenshotDataUrl}
            className="w-full gap-2 font-black shadow-lg shadow-skyfall-500/20"
          >
            {isSubmitting ? (
              <span>Submitting Payment Proof...</span>
            ) : (
              <>
                <span>Submit for Verification</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
