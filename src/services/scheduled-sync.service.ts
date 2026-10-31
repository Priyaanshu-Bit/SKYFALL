import { prisma } from "@/lib/prisma";
import { TournamentStatus, MatchStatus } from "@prisma/client";

/**
 * Automates tournament lifecycle progression.
 * Closes registration for tournaments whose registration deadlines have passed.
 */
export async function syncTournamentLifecycle() {
  const now = new Date();

  // Find tournaments with elapsed registration windows
  const expiredTournaments = await prisma.tournament.findMany({
    where: {
      status: TournamentStatus.REGISTRATION_OPEN,
      registrationCloseAt: { lte: now },
    },
    select: { id: true, name: true },
  });

  if (expiredTournaments.length === 0) {
    return { closedCount: 0 };
  }

  const updated = await prisma.tournament.updateMany({
    where: {
      id: { in: expiredTournaments.map((t) => t.id) },
      status: TournamentStatus.REGISTRATION_OPEN,
    },
    data: {
      status: TournamentStatus.REGISTRATION_CLOSED,
    },
  });

  return { closedCount: updated.count, tournaments: expiredTournaments };
}

/**
 * Checks for upcoming matches starting within 15 minutes that need attention.
 */
export async function syncMatchReminders() {
  const now = new Date();
  const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

  const upcomingMatches = await prisma.match.findMany({
    where: {
      status: MatchStatus.SCHEDULED,
      scheduledAt: {
        gte: now,
        lte: fifteenMinutesFromNow,
      },
    },
    include: {
      tournament: true,
      teamA: { include: { captain: true } },
      teamB: { include: { captain: true } },
    },
  });

  return { upcomingMatchesCount: upcomingMatches.length };
}
