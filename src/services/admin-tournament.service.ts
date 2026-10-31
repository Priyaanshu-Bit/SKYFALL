import { prisma } from "@/lib/prisma";
import {
  TournamentStatus,
  TournamentFormat,
  type GameMode,
  type Tournament,
  type PrizeDistribution,
  type RegistrationStatus,
} from "@prisma/client";
import {
  validateCreateTournamentInput,
  type CreateTournamentInput,
} from "@/schemas/tournament.schema";

export interface AdminTournamentOverviewItem extends Tournament {
  gameMode: GameMode;
  prizes: PrizeDistribution[];
  _count: {
    registrations: number;
    matches: number;
  };
  totalPrizePoolPaise: number;
  confirmedRegistrationsCount: number;
  pendingPaymentCount: number;
}

/**
 * Generates a URL-friendly, unique slug for a tournament title.
 */
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${base || "tournament"}-${randomSuffix}`;
}

/**
 * Fetches all available active game modes for tournament creation.
 */
export async function getAvailableGameModes(): Promise<GameMode[]> {
  return prisma.gameMode.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Retrieves the comprehensive list of tournaments for the admin operational console.
 */
export async function getAdminTournamentsList(filters?: {
  status?: TournamentStatus | "ALL";
  search?: string;
}): Promise<AdminTournamentOverviewItem[]> {
  const whereClause: {
    status?: TournamentStatus;
    name?: { contains: string; mode: "insensitive" };
  } = {};

  if (filters?.status && filters.status !== "ALL") {
    whereClause.status = filters.status;
  }

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
      prizes: {
        orderBy: { position: "asc" },
      },
      registrations: {
        select: {
          id: true,
          registrationStatus: true,
        },
      },
      _count: {
        select: {
          registrations: true,
          matches: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tournaments.map((t) => {
    const totalPrizePoolPaise = t.prizes.reduce(
      (sum, p) => sum + p.prizeAmountPaise,
      0
    );
    const confirmedRegistrationsCount = t.registrations.filter(
      (r) => r.registrationStatus === ("CONFIRMED" as RegistrationStatus)
    ).length;
    const pendingPaymentCount = t.registrations.filter(
      (r) =>
        r.registrationStatus === ("PAYMENT_SUBMITTED" as RegistrationStatus) ||
        r.registrationStatus === ("PENDING_PAYMENT" as RegistrationStatus)
    ).length;

    const { registrations, ...rest } = t;
    void registrations;

    return {
      ...rest,
      totalPrizePoolPaise,
      confirmedRegistrationsCount,
      pendingPaymentCount,
    };
  });
}

/**
 * Creates a new tournament and atomically initializes its prize distribution tiers.
 */
export async function createTournament(input: CreateTournamentInput) {
  // 1. Strict validation
  const validation = validateCreateTournamentInput(input);
  if (!validation.success || !validation.data) {
    return {
      success: false,
      error: validation.errors?.map((e) => e.message).join(" ") || "Invalid tournament data.",
      errors: validation.errors,
    };
  }

  const data = validation.data;

  // 2. Ensure unique slug
  let slug = generateSlug(data.name);
  let existing = await prisma.tournament.findUnique({ where: { slug } });
  while (existing) {
    slug = generateSlug(data.name);
    existing = await prisma.tournament.findUnique({ where: { slug } });
  }

  // 3. Convert financial values to paise
  const entryFeePaise = Math.round(data.entryFeeRupees * 100);

  // 4. Atomic database insertion
  try {
    const created = await prisma.$transaction(async (tx) => {
      const tournament = await tx.tournament.create({
        data: {
          name: data.name.trim(),
          slug,
          description: data.description?.trim() || null,
          game: data.game?.trim() || "Free Fire India",
          gameModeId: data.gameModeId,
          tournamentFormat: data.tournamentFormat as TournamentFormat,
          teamCapacity: data.teamCapacity,
          entryFeePaise,
          currency: "INR",
          status: data.status as TournamentStatus,
          rules: data.rules?.trim() || null,
          bannerUrl: data.bannerUrl?.trim() || null,
          livestreamUrl: data.livestreamUrl?.trim() || null,
          registrationOpenAt: new Date(data.registrationOpenAt),
          registrationCloseAt: new Date(data.registrationCloseAt),
          tournamentDate: new Date(data.tournamentDate),
          startTime: data.startTime.trim(),
        },
      });

      // Insert prize allocations
      if (data.prizes && data.prizes.length > 0) {
        await tx.prizeDistribution.createMany({
          data: data.prizes.map((p) => ({
            tournamentId: tournament.id,
            position: p.position,
            title: p.title.trim(),
            prizeAmountPaise: Math.round(p.prizeAmountRupees * 100),
          })),
        });
      }

      return tournament;
    });

    return {
      success: true,
      tournament: created,
    };
  } catch (err: unknown) {
    console.error("Failed to create tournament:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create tournament in database.",
    };
  }
}

/**
 * Updates an existing tournament's lifecycle status (e.g. DRAFT -> PUBLISHED -> REGISTRATION_OPEN).
 */
export async function updateTournamentStatus(
  tournamentId: string,
  newStatus: TournamentStatus
) {
  try {
    const updated = await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: newStatus },
    });

    return { success: true, tournament: updated };
  } catch (err: unknown) {
    console.error("Failed to update tournament status:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update status.",
    };
  }
}
