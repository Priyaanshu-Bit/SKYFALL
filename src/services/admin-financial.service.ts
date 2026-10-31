import { prisma } from "@/lib/prisma";
import {
  PaymentStatus,
  PayoutStatus,
  NotificationType,
  type PrizeDistribution,
  type Tournament,
  type Team,
  type Payment,
} from "@prisma/client";

export interface FinancialStats {
  totalVerifiedCollectionsPaise: number;
  pendingVerificationPaise: number;
  totalRefundedPaise: number;
  totalPrizeCommitmentsPaise: number;
  totalPaidPrizesPaise: number;
  outstandingPrizeObligationsPaise: number;
  netOrganizerMarginPaise: number;
}

export interface PrizeDistributionItem extends PrizeDistribution {
  tournament: Tournament;
  recipientTeam:
    | (Team & {
        captain: {
          id: string;
          name: string | null;
          email: string;
          phone: string | null;
          freeFireUid: string | null;
        };
      })
    | null;
}

export interface CollectionLedgerItem extends Payment {
  registration: {
    id: string;
    tournament: Tournament;
    team: Team;
  };
  verifiedBy: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

/**
 * Calculates comprehensive financial statistics for the platform ledger.
 */
export async function getFinancialOverviewStats(): Promise<FinancialStats> {
  const [
    approvedPayments,
    pendingPayments,
    refundedPayments,
    allPrizes,
    paidPrizes,
    assignedPrizes,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: PaymentStatus.APPROVED },
      _sum: { amountPaise: true },
    }),
    prisma.payment.aggregate({
      where: { status: PaymentStatus.UNDER_VERIFICATION },
      _sum: { amountPaise: true },
    }),
    prisma.payment.aggregate({
      where: { status: PaymentStatus.REFUNDED },
      _sum: { amountPaise: true },
    }),
    prisma.prizeDistribution.aggregate({
      _sum: { prizeAmountPaise: true },
    }),
    prisma.prizeDistribution.aggregate({
      where: { payoutStatus: PayoutStatus.PAID },
      _sum: { prizeAmountPaise: true },
    }),
    prisma.prizeDistribution.aggregate({
      where: { payoutStatus: PayoutStatus.ASSIGNED },
      _sum: { prizeAmountPaise: true },
    }),
  ]);

  const totalVerifiedCollectionsPaise =
    approvedPayments._sum.amountPaise || 0;
  const pendingVerificationPaise = pendingPayments._sum.amountPaise || 0;
  const totalRefundedPaise = refundedPayments._sum.amountPaise || 0;
  const totalPrizeCommitmentsPaise = allPrizes._sum.prizeAmountPaise || 0;
  const totalPaidPrizesPaise = paidPrizes._sum.prizeAmountPaise || 0;
  const outstandingPrizeObligationsPaise =
    assignedPrizes._sum.prizeAmountPaise || 0;

  const netOrganizerMarginPaise =
    totalVerifiedCollectionsPaise -
    totalPrizeCommitmentsPaise -
    totalRefundedPaise;

  return {
    totalVerifiedCollectionsPaise,
    pendingVerificationPaise,
    totalRefundedPaise,
    totalPrizeCommitmentsPaise,
    totalPaidPrizesPaise,
    outstandingPrizeObligationsPaise,
    netOrganizerMarginPaise,
  };
}

/**
 * Retrieves the prize distribution fulfillment queue.
 */
export async function getPrizeDistributionsList(filters?: {
  payoutStatus?: PayoutStatus | "ALL";
  search?: string;
}): Promise<PrizeDistributionItem[]> {
  const whereClause: {
    payoutStatus?: PayoutStatus;
    OR?: [
      { tournament: { name: { contains: string; mode: "insensitive" } } },
      { recipientTeam: { name: { contains: string; mode: "insensitive" } } }
    ];
  } = {};

  if (filters?.payoutStatus && filters.payoutStatus !== "ALL") {
    whereClause.payoutStatus = filters.payoutStatus;
  }

  if (filters?.search && filters.search.trim() !== "") {
    const s = filters.search.trim();
    whereClause.OR = [
      { tournament: { name: { contains: s, mode: "insensitive" } } },
      { recipientTeam: { name: { contains: s, mode: "insensitive" } } },
    ];
  }

  const prizes = await prisma.prizeDistribution.findMany({
    where: whereClause,
    include: {
      tournament: true,
      recipientTeam: {
        include: {
          captain: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              freeFireUid: true,
            },
          },
        },
      },
    },
    orderBy: [{ payoutStatus: "asc" }, { createdAt: "desc" }],
  });

  return prizes as PrizeDistributionItem[];
}

/**
 * Retrieves verified payment collections for the financial accounting ledger.
 */
export async function getCollectionsLedger(filters?: {
  search?: string;
}): Promise<CollectionLedgerItem[]> {
  const whereClause: {
    status: PaymentStatus;
    OR?: [
      { transactionReference: { contains: string; mode: "insensitive" } },
      { registration: { tournament: { name: { contains: string; mode: "insensitive" } } } },
      { registration: { team: { name: { contains: string; mode: "insensitive" } } } }
    ];
  } = {
    status: PaymentStatus.APPROVED,
  };

  if (filters?.search && filters.search.trim() !== "") {
    const s = filters.search.trim();
    whereClause.OR = [
      { transactionReference: { contains: s, mode: "insensitive" } },
      { registration: { tournament: { name: { contains: s, mode: "insensitive" } } } },
      { registration: { team: { name: { contains: s, mode: "insensitive" } } } },
    ];
  }

  const collections = await prisma.payment.findMany({
    where: whereClause,
    include: {
      registration: {
        include: {
          tournament: true,
          team: true,
        },
      },
      verifiedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { verifiedAt: "desc" },
  });

  return collections as CollectionLedgerItem[];
}

/**
 * Records prize payout fulfillment, transitioning status to PAID and notifying the squad captain.
 */
export async function fulfillPrizePayout(
  prizeId: string,
  input: {
    transactionReference: string;
    notes?: string;
    adminUserId: string;
  }
) {
  const prize = await prisma.prizeDistribution.findUnique({
    where: { id: prizeId },
    include: {
      tournament: true,
      recipientTeam: {
        include: { captain: true },
      },
    },
  });

  if (!prize) {
    return { success: false, error: "Prize distribution record not found." };
  }

  if (prize.payoutStatus !== PayoutStatus.ASSIGNED) {
    return {
      success: false,
      error: `Cannot fulfill payout: prize status is ${prize.payoutStatus}. It must be ASSIGNED to a winning team first.`,
    };
  }

  if (!prize.recipientTeam) {
    return {
      success: false,
      error: "No winning team is assigned to this prize.",
    };
  }

  const txRef = input.transactionReference.trim();
  if (!txRef || txRef.length < 4) {
    return {
      success: false,
      error: "Valid payment transaction reference (UTR/UPI) is required.",
    };
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.prizeDistribution.update({
        where: { id: prize.id },
        data: {
          payoutStatus: PayoutStatus.PAID,
          paidAt: new Date(),
        },
      });

      // Dispatch confirmation in-app notification to captain
      if (prize.recipientTeam?.captain) {
        const prizeRupees = prize.prizeAmountPaise / 100;
        await tx.notification.create({
          data: {
            userId: prize.recipientTeam.captain.id,
            type: NotificationType.PRIZE,
            title: `Prize Money Transferred! — ₹${prizeRupees}`,
            message: `Your cash prize of ₹${prizeRupees} for ${prize.title} in ${prize.tournament.name} has been paid via FamPay/UPI. Reference: ${txRef}.`,
            link: `/dashboard/tournaments`,
          },
        });
      }

      return res;
    });

    return { success: true, prize: updated };
  } catch (err: unknown) {
    console.error("Prize payout fulfillment error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to record prize payout in database.",
    };
  }
}
