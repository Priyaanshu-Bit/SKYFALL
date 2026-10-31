import { prisma } from "@/lib/prisma";
import {
  RegistrationStatus,
  PaymentStatus,
  TournamentStatus,
  MatchStatus,
} from "@prisma/client";

export interface PlayerRegistrationItem {
  id: string;
  registrationStatus: RegistrationStatus;
  registeredAt: Date;
  tournament: {
    id: string;
    name: string;
    status: TournamentStatus;
    entryFeePaise: number;
    tournamentDate: Date;
    startTime: string;
    bannerUrl: string | null;
    gameMode: {
      name: string;
      playersPerTeam: number;
    };
    matches: {
      id: string;
      matchNumber: number;
      status: MatchStatus;
      scheduledAt: Date | null;
      roomId: string | null;
      roomPassword: string | null;
    }[];
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
  payment: {
    id: string;
    transactionReference: string;
    status: PaymentStatus;
    rejectionReason: string | null;
    createdAt: Date;
  } | null;
}

export interface PlayerPaymentItem {
  id: string;
  transactionReference: string;
  amountPaise: number;
  status: PaymentStatus;
  rejectionReason: string | null;
  screenshotUrl: string;
  createdAt: Date;
  registration: {
    id: string;
    tournament: {
      id: string;
      name: string;
    };
    team: {
      id: string;
      name: string;
    };
  };
}

/**
 * Fetches all tournament registrations initiated by the given player.
 */
export async function getPlayerRegistrations(
  userId: string
): Promise<PlayerRegistrationItem[]> {
  try {
    const registrations = await prisma.registration.findMany({
      where: { registeredById: userId },
      include: {
        tournament: {
          include: {
            gameMode: {
              select: { name: true, playersPerTeam: true },
            },
            matches: {
              where: {
                status: {
                  in: [
                    MatchStatus.SCHEDULED,
                    MatchStatus.ROOM_OPEN,
                    MatchStatus.ONGOING,
                  ],
                },
              },
              select: {
                id: true,
                matchNumber: true,
                status: true,
                scheduledAt: true,
                roomId: true,
                roomPassword: true,
              },
              orderBy: { matchNumber: "asc" },
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
        payment: {
          select: {
            id: true,
            transactionReference: true,
            status: true,
            rejectionReason: true,
            createdAt: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    return registrations;
  } catch (error) {
    console.error("getPlayerRegistrations database error:", error);
    return [];
  }
}

/**
 * Fetches all payment transactions associated with the player's registrations.
 */
export async function getPlayerPayments(
  userId: string
): Promise<PlayerPaymentItem[]> {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        registration: {
          registeredById: userId,
        },
      },
      include: {
        registration: {
          select: {
            id: true,
            tournament: {
              select: { id: true, name: true },
            },
            team: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return payments;
  } catch (error) {
    console.error("getPlayerPayments database error:", error);
    return [];
  }
}
