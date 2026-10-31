import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type {
  TournamentStatus,
  PaymentStatus,
  RegistrationStatus,
} from "@prisma/client";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-skyfall-500 text-white shadow hover:bg-skyfall-600",
        secondary:
          "border-transparent bg-slate-800 text-slate-200 hover:bg-slate-700",
        destructive:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
        outline: "text-slate-300 border-slate-700",
        success:
          "border-emerald-500/20 bg-emerald-950/60 text-emerald-400 font-medium",
        warning:
          "border-amber-500/20 bg-amber-950/60 text-amber-400 font-medium",
        info: "border-sky-500/20 bg-sky-950/60 text-sky-400 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

/**
 * Tournament Status Badge specialized for SKYFALL statuses.
 */
export function TournamentStatusBadge({
  status,
  className,
}: {
  status: TournamentStatus;
  className?: string;
}) {
  switch (status) {
    case "REGISTRATION_OPEN":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-400",
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Registration Open
        </span>
      );
    case "REGISTRATION_CLOSED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-amber-500/30 bg-amber-950/80 px-2.5 py-0.5 text-xs font-semibold text-amber-400",
            className
          )}
        >
          Registration Closed
        </span>
      );
    case "ONGOING":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-skyfall-500/40 bg-skyfall-950/80 px-2.5 py-0.5 text-xs font-semibold text-skyfall-400",
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-skyfall-400 animate-ping" />
          Live / Ongoing
        </span>
      );
    case "COMPLETED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-xs font-semibold text-slate-300",
            className
          )}
        >
          Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-red-500/30 bg-red-950/80 px-2.5 py-0.5 text-xs font-semibold text-red-400",
            className
          )}
        >
          Cancelled
        </span>
      );
    case "PUBLISHED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-blue-500/30 bg-blue-950/80 px-2.5 py-0.5 text-xs font-semibold text-blue-400",
            className
          )}
        >
          Upcoming
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-slate-400",
            className
          )}
        >
          Draft
        </span>
      );
  }
}

/**
 * Payment Verification Status Badge.
 */
export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  switch (status) {
    case "APPROVED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-400",
            className
          )}
        >
          Verified / Approved
        </span>
      );
    case "UNDER_VERIFICATION":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/80 px-2.5 py-0.5 text-xs font-semibold text-amber-400",
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Under Review
        </span>
      );
    case "REJECTED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-red-500/30 bg-red-950/80 px-2.5 py-0.5 text-xs font-semibold text-red-400",
            className
          )}
        >
          Payment Rejected
        </span>
      );
    case "AWAITING_PAYMENT":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300",
            className
          )}
        >
          Awaiting Payment
        </span>
      );
    case "REFUNDED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-purple-500/30 bg-purple-950/80 px-2.5 py-0.5 text-xs font-semibold text-purple-400",
            className
          )}
        >
          Refunded
        </span>
      );
  }
}

/**
 * Registration Status Badge.
 */
export function RegistrationStatusBadge({
  status,
  className,
}: {
  status: RegistrationStatus;
  className?: string;
}) {
  switch (status) {
    case "CONFIRMED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-400",
            className
          )}
        >
          Confirmed Slot
        </span>
      );
    case "PAYMENT_SUBMITTED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-amber-500/30 bg-amber-950/80 px-2.5 py-0.5 text-xs font-semibold text-amber-400",
            className
          )}
        >
          Payment Submitted
        </span>
      );
    case "PENDING_PAYMENT":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300",
            className
          )}
        >
          Pending Payment
        </span>
      );
    case "REJECTED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-red-500/30 bg-red-950/80 px-2.5 py-0.5 text-xs font-semibold text-red-400",
            className
          )}
        >
          Rejected
        </span>
      );
    case "CANCELLED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-slate-400",
            className
          )}
        >
          Cancelled
        </span>
      );
    case "REFUNDED":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-purple-500/30 bg-purple-950/80 px-2.5 py-0.5 text-xs font-semibold text-purple-400",
            className
          )}
        >
          Refunded
        </span>
      );
  }
}
