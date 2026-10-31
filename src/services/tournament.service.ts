import { prisma } from "@/lib/prisma";
import {
  TournamentStatus,
  RegistrationStatus,
  type Tournament,
  type GameMode,
  type PrizeDistribution,
} from "@prisma/client";

export interface TournamentListItem extends Tournament {
  gameMode: GameMode;
  prizes: PrizeDistribution[];
  _count: {
    registrations: number;
  };
  totalPrizePoolPaise: number;
  registeredCount: number;
  availableSlots: number;
  isFull: boolean;
}

export interface TournamentFilterOptions {
  status?: string;
  gameModeId?: string;
  search?: string;
}

/**
 * Fetches public tournaments matching optional status, game mode, and search criteria.
 * Draft tournaments are strictly excluded from public discovery.
 */
export async function getPublicTournaments(
  filters?: TournamentFilterOptions
): Promise<TournamentListItem[]> {
  const whereClause: {
    status: { in?: TournamentStatus[]; not?: TournamentStatus; equals?: TournamentStatus };
    gameModeId?: string;
    name?: { contains: string; mode: "insensitive" };
  } = {
    // Exclude draft tournaments from public viewing
    status: { not: TournamentStatus.DRAFT },
  };

  // Status Filter
  if (filters?.status && filters.status !== "ALL") {
    if (filters.status === "OPEN") {
      whereClause.status = { equals: TournamentStatus.REGISTRATION_OPEN };
    } else if (filters.status === "ONGOING") {
      whereClause.status = { equals: TournamentStatus.ONGOING };
    } else if (filters.status === "COMPLETED") {
      whereClause.status = { equals: TournamentStatus.COMPLETED };
    } else if (Object.values(TournamentStatus).includes(filters.status as TournamentStatus)) {
      whereClause.status = { equals: filters.status as TournamentStatus };
    }
  }

  // Game Mode Filter
  if (filters?.gameModeId && filters.gameModeId !== "ALL") {
    whereClause.gameModeId = filters.gameModeId;
  }

  // Search Filter
  if (filters?.search && filters.search.trim() !== "") {
    whereClause.name = {
      contains: filters.search.trim(),
      mode: "insensitive",
    };
  }

  const tournaments = await prisma.tournament.findMany({
    where: whereClause,
    include: {
      gameMode: true,
      prizes: true,
      _count: {
        select: {
          registrations: {
            where: {
              registrationStatus: {
                in: [
                  RegistrationStatus.CONFIRMED,
                  RegistrationStatus.PAYMENT_SUBMITTED,
                ],
              },
            },
          },
        },
      },
    },
    orderBy: [
      { tournamentDate: "asc" },
      { createdAt: "desc" },
    ],
  });

  return tournaments.map((t) => {
    const totalPrizePoolPaise = t.prizes.reduce(
      (sum, p) => sum + p.prizeAmountPaise,
      0
    );
    const registeredCount = t._count.registrations;
    const availableSlots = Math.max(0, t.teamCapacity - registeredCount);
    const isFull = registeredCount >= t.teamCapacity;

    return {
      ...t,
      totalPrizePoolPaise,
      registeredCount,
      availableSlots,
      isFull,
    };
  });
}

/**
 * Fetches all active game modes for filter dropdowns.
 */
export async function getActiveGameModes(): Promise<GameMode[]> {
  return prisma.gameMode.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}
