import { prisma } from "@/lib/prisma";
import {
  PaymentStatus,
  RegistrationStatus,
  NotificationType,
  TournamentStatus,
} from "@prisma/client";

export interface AdminPaymentQueueItem {
  id: string;
  transactionReference: string;
  amountPaise: number;
  status: PaymentStatus;
  screenshotUrl: string;
  rejectionReason: string | null;
  verifiedAt: Date | null;
  createdAt: Date;
  verifiedBy: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  registration: {
    id: string;
    registrationStatus: RegistrationStatus;
    registeredAt: Date;
    registeredBy: {
      id: string;
      name: string | null;
      email: string;
      phone: string | null;
      freeFireUid: string | null;
    };
    tournament: {
      id: string;
      name: string;
      status: TournamentStatus;
      entryFeePaise: number;
      teamCapacity: number;
      gameMode: {
        name: string;
        playersPerTeam: number;
      };
    };
    team: {
      id: string;
      name: string;
      members: {
        id: string;
        playerName: string;
        freeFireUid: string;
        isCaptain: boolean;
      }[];
    };
  };
}

export interface PaymentQueueStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalVerifiedAmountPaise: number;
}

/**
 * Retrieves the list of submitted payments for admin verification.
 */
export async function getAdminPaymentQueue(filters?: {
  status?: PaymentStatus | "ALL";
  search?: string;
  tournamentId?: string;
}): Promise<AdminPaymentQueueItem[]> {
  const whereClause: {
    status?: PaymentStatus;
    transactionReference?: { contains: string; mode: "insensitive" };
    registration?: { tournamentId?: string };
  } = {};

  if (filters?.status && filters.status !== "ALL") {
    whereClause.status = filters.status;
  }

  if (filters?.search && filters.search.trim() !== "") {
    whereClause.transactionReference = {
      contains: filters.search.trim(),
      mode: "insensitive",
    };
  }

  if (filters?.tournamentId && filters.tournamentId !== "ALL") {
    whereClause.registration = { tournamentId: filters.tournamentId };
  }

  const payments = await prisma.payment.findMany({
    where: whereClause,
    include: {
      verifiedBy: {
        select: { id: true, name: true, email: true },
      },
      registration: {
        include: {
          registeredBy: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              freeFireUid: true,
            },
          },
          tournament: {
            include: {
              gameMode: {
                select: { name: true, playersPerTeam: true },
              },
            },
          },
          team: {
            include: {
              members: {
                orderBy: { position: "asc" },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return payments;
}

/**
 * Calculates operational stats for the payment verification queue.
 */
export async function getPaymentQueueStats(): Promise<PaymentQueueStats> {
  const [pendingCount, approvedCount, rejectedCount, approvedSum] =
    await Promise.all([
      prisma.payment.count({
        where: { status: PaymentStatus.UNDER_VERIFICATION },
      }),
      prisma.payment.count({
        where: { status: PaymentStatus.APPROVED },
      }),
      prisma.payment.count({
        where: { status: PaymentStatus.REJECTED },
      }),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.APPROVED },
        _sum: { amountPaise: true },
      }),
    ]);

  return {
    pendingCount,
    approvedCount,
    rejectedCount,
    totalVerifiedAmountPaise: approvedSum._sum.amountPaise || 0,
  };
}

/**
 * Approves a manual payment and confirms the tournament registration slot.
 */
export async function approvePayment(adminId: string, paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        registration: {
          include: {
            tournament: true,
            team: true,
          },
        },
      },
    });

    if (!payment) {
      return { success: false, error: "Payment record not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.APPROVED,
          verifiedById: adminId,
          verifiedAt: new Date(),
          rejectionReason: null,
        },
      });

      await tx.registration.update({
        where: { id: payment.registrationId },
        data: {
          registrationStatus: RegistrationStatus.CONFIRMED,
        },
      });

      await tx.notification.create({
        data: {
          userId: payment.registration.registeredById,
          type: NotificationType.PAYMENT,
          title: "Payment Approved — Slot Confirmed!",
          message: `Your payment of ₹${payment.amountPaise / 100} for ${payment.registration.tournament.name} (UTR: ${payment.transactionReference}) was approved. Squad ${payment.registration.team.name} is confirmed!`,
          link: `/dashboard/tournaments`,
        },
      });
    });

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to approve payment.";
    return { success: false, error: message };
  }
}

/**
 * Rejects a manual payment with an administrative explanation.
 */
export async function rejectPayment(
  adminId: string,
  paymentId: string,
  rejectionReason: string
) {
  try {
    const reason = rejectionReason.trim();
    if (!reason) {
      return { success: false, error: "Rejection reason is required." };
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        registration: {
          include: {
            tournament: true,
            team: true,
          },
        },
      },
    });

    if (!payment) {
      return { success: false, error: "Payment record not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.REJECTED,
          rejectionReason: reason,
          verifiedById: adminId,
          verifiedAt: new Date(),
        },
      });

      await tx.registration.update({
        where: { id: payment.registrationId },
        data: {
          registrationStatus: RegistrationStatus.REJECTED,
        },
      });

      await tx.notification.create({
        data: {
          userId: payment.registration.registeredById,
          type: NotificationType.PAYMENT,
          title: "Payment Verification Rejected",
          message: `Your payment verification for ${payment.registration.tournament.name} was rejected. Reason: ${reason}. You can resubmit corrected proof in your dashboard.`,
          link: `/dashboard/tournaments`,
        },
      });
    });

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to reject payment.";
    return { success: false, error: message };
  }
}
