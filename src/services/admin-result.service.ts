import { prisma } from "@/lib/prisma";
import {
  MatchStatus,
  NotificationType,
  TournamentStatus,
  PayoutStatus,
  type Match,
  type Team,
  type Tournament,
  type GameMode,
  type MatchResult,
  type PrizeDistribution,
} from "@prisma/client";

export interface MatchWithResultData extends Match {
  tournament: Tournament & { gameMode: GameMode };
  teamA: (Team & { captain: { id: string; name: string | null; email: string; phone: string | null } }) | null;
  teamB: (Team & { captain: { id: string; name: string | null; email: string; phone: string | null } }) | null;
  winnerTeam: Team | null;
  results: (MatchResult & {
    verifiedBy: { id: string; name: string | null; email: string } | null;
  })[];
}

export interface TournamentStandings {
  champion: Team | null;
  runnerUp: Team | null;
  prizes: PrizeDistribution[];
  completedMatchesCount: number;
  totalMatchesCount: number;
  isTournamentFinished: boolean;
}

export interface RecordMatchResultInput {
  matchId: string;
  winnerTeamId: string;
  teamAScore?: number;
  teamBScore?: number;
  kills?: number;
  scoreboardProofUrl?: string;
  adminUserId: string;
}

/**
 * Records, verifies, and publishes a competitive match result.
 * Automatically advances the winning squad in the knockout bracket
 * and marks the tournament COMPLETED when the Grand Finals conclude.
 */
export async function recordMatchResult(input: RecordMatchResultInput) {
  const match = await prisma.match.findUnique({
    where: { id: input.matchId },
    include: {
      tournament: true,
      teamA: { include: { captain: true } },
      teamB: { include: { captain: true } },
    },
  });

  if (!match) {
    return { success: false, error: "Match not found." };
  }

  if (!match.teamAId || !match.teamBId) {
    return {
      success: false,
      error: "Cannot record result: both participating teams must be determined first.",
    };
  }

  if (
    input.winnerTeamId !== match.teamAId &&
    input.winnerTeamId !== match.teamBId
  ) {
    return {
      success: false,
      error: "Winner must be one of the participating squads (Team A or Team B).",
    };
  }

  const loserTeamId =
    input.winnerTeamId === match.teamAId ? match.teamBId : match.teamAId;

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Update Match status and winner
      const updatedMatch = await tx.match.update({
        where: { id: match.id },
        data: {
          winnerTeamId: input.winnerTeamId,
          status: MatchStatus.COMPLETED,
        },
      });

      // 2. Upsert MatchResult record
      const resultDataJson = JSON.stringify({
        kills: input.kills ?? null,
        scoreboardProofUrl: input.scoreboardProofUrl?.trim() || null,
        recordedAt: new Date().toISOString(),
      });

      const existingResult = await tx.matchResult.findFirst({
        where: { matchId: match.id },
      });

      if (existingResult) {
        await tx.matchResult.update({
          where: { id: existingResult.id },
          data: {
            winnerTeamId: input.winnerTeamId,
            teamAScore: input.teamAScore ?? null,
            teamBScore: input.teamBScore ?? null,
            resultData: resultDataJson,
            verifiedById: input.adminUserId,
            verifiedAt: new Date(),
          },
        });
      } else {
        await tx.matchResult.create({
          data: {
            matchId: match.id,
            winnerTeamId: input.winnerTeamId,
            teamAScore: input.teamAScore ?? null,
            teamBScore: input.teamBScore ?? null,
            resultData: resultDataJson,
            submittedById: input.adminUserId,
            verifiedById: input.adminUserId,
            verifiedAt: new Date(),
          },
        });
      }

      // 3. Bracket Progression Logic
      // Query all matches for this tournament grouped by round
      const allTournamentMatches = await tx.match.findMany({
        where: { tournamentId: match.tournamentId },
        orderBy: [{ round: "asc" }, { matchNumber: "asc" }],
      });

      const maxRound = Math.max(...allTournamentMatches.map((m) => m.round));
      const currentRoundMatches = allTournamentMatches.filter(
        (m) => m.round === match.round
      );

      const isGrandFinal = match.round === maxRound;

      if (isGrandFinal) {
        // Tournament Concluded!
        // Champion is input.winnerTeamId, Runner-up is loserTeamId
        await tx.tournament.update({
          where: { id: match.tournamentId },
          data: { status: TournamentStatus.COMPLETED },
        });

        // Assign 1st place prize
        await tx.prizeDistribution.updateMany({
          where: {
            tournamentId: match.tournamentId,
            position: 1,
          },
          data: {
            recipientTeamId: input.winnerTeamId,
            payoutStatus: PayoutStatus.ASSIGNED,
          },
        });

        // Assign 2nd place prize
        await tx.prizeDistribution.updateMany({
          where: {
            tournamentId: match.tournamentId,
            position: 2,
          },
          data: {
            recipientTeamId: loserTeamId,
            payoutStatus: PayoutStatus.ASSIGNED,
          },
        });

        // Dispatch notifications to Champion and Runner-up captains
        const winningTeam =
          input.winnerTeamId === match.teamAId ? match.teamA : match.teamB;
        const runnerUpTeam =
          loserTeamId === match.teamAId ? match.teamA : match.teamB;

        if (winningTeam?.captain) {
          await tx.notification.create({
            data: {
              userId: winningTeam.captain.id,
              type: NotificationType.PRIZE,
              title: `Grand Champion! — ${match.tournament.name}`,
              message: `Congratulations! Squad ${winningTeam.name} has claimed 1st Place Championship in ${match.tournament.name}. Your prize allocation is configured.`,
              link: `/dashboard/tournaments`,
            },
          });
        }

        if (runnerUpTeam?.captain) {
          await tx.notification.create({
            data: {
              userId: runnerUpTeam.captain.id,
              type: NotificationType.PRIZE,
              title: `2nd Place Runner-Up — ${match.tournament.name}`,
              message: `Great performance! Squad ${runnerUpTeam.name} secured 2nd Place Runner-up in ${match.tournament.name}. Your prize allocation is configured.`,
              link: `/dashboard/tournaments`,
            },
          });
        }
      } else {
        // Advance winner into subsequent round (round + 1)
        const nextRoundMatches = allTournamentMatches.filter(
          (m) => m.round === match.round + 1
        );

        if (nextRoundMatches.length > 0) {
          const matchIndexInRound = currentRoundMatches.findIndex(
            (m) => m.id === match.id
          );
          const nextMatchIndex = Math.floor(matchIndexInRound / 2);
          const nextMatch = nextRoundMatches[nextMatchIndex];

          if (nextMatch) {
            // If matchIndex is even, assign to teamA (unless teamA is already a bye team)
            const isEven = matchIndexInRound % 2 === 0;

            if (isEven && !nextMatch.teamAId) {
              await tx.match.update({
                where: { id: nextMatch.id },
                data: { teamAId: input.winnerTeamId },
              });
            } else {
              // Otherwise assign to teamB
              await tx.match.update({
                where: { id: nextMatch.id },
                data: { teamBId: input.winnerTeamId },
              });
            }
          }
        }
      }

      return {
        success: true,
        match: updatedMatch,
        isGrandFinal,
      };
    });
  } catch (err: unknown) {
    console.error("Record match result error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to save match result in database.",
    };
  }
}

/**
 * Retrieves standings, winner assignments, and match results for a specific tournament.
 */
export async function getTournamentStandings(
  tournamentId: string
): Promise<TournamentStandings | null> {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      prizes: {
        include: { recipientTeam: true },
        orderBy: { position: "asc" },
      },
      matches: {
        orderBy: [{ round: "desc" }, { matchNumber: "asc" }],
        include: { winnerTeam: true },
      },
    },
  });

  if (!tournament) return null;

  const totalMatchesCount = tournament.matches.length;
  const completedMatchesCount = tournament.matches.filter(
    (m) => m.status === MatchStatus.COMPLETED
  ).length;

  const firstPlacePrize = tournament.prizes.find((p) => p.position === 1);
  const secondPlacePrize = tournament.prizes.find((p) => p.position === 2);

  const champion = firstPlacePrize?.recipientTeam || null;
  const runnerUp = secondPlacePrize?.recipientTeam || null;

  return {
    champion,
    runnerUp,
    prizes: tournament.prizes,
    completedMatchesCount,
    totalMatchesCount,
    isTournamentFinished: tournament.status === TournamentStatus.COMPLETED,
  };
}

/**
 * Retrieves all matches with their published results and scoreboard proofs for the global admin results console.
 */
export async function getAllResultsForAdmin(filters?: {
  status?: "ALL" | "COMPLETED" | "PENDING";
  search?: string;
}) {
  const whereClause: {
    status?: MatchStatus | { not: MatchStatus };
    OR?: [
      { tournament: { name: { contains: string; mode: "insensitive" } } },
      { teamA: { name: { contains: string; mode: "insensitive" } } },
      { teamB: { name: { contains: string; mode: "insensitive" } } }
    ];
  } = {};

  if (filters?.status === "COMPLETED") {
    whereClause.status = MatchStatus.COMPLETED;
  } else if (filters?.status === "PENDING") {
    whereClause.status = { not: MatchStatus.COMPLETED };
  }

  if (filters?.search && filters.search.trim() !== "") {
    const s = filters.search.trim();
    whereClause.OR = [
      { tournament: { name: { contains: s, mode: "insensitive" } } },
      { teamA: { name: { contains: s, mode: "insensitive" } } },
      { teamB: { name: { contains: s, mode: "insensitive" } } },
    ];
  }

  const matches = (await prisma.match.findMany({
    where: whereClause,
    include: {
      tournament: {
        include: { gameMode: true },
      },
      teamA: {
        include: {
          captain: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      },
      teamB: {
        include: {
          captain: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      },
      winnerTeam: true,
      results: {
        include: {
          verifiedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: [{ round: "desc" }, { scheduledAt: "desc" }],
  })) as MatchWithResultData[];

  const [totalMatches, completedCount, pendingCount] = await Promise.all([
    prisma.match.count(),
    prisma.match.count({ where: { status: MatchStatus.COMPLETED } }),
    prisma.match.count({
      where: { status: { not: MatchStatus.COMPLETED } },
    }),
  ]);

  return {
    matches,
    stats: {
      totalMatches,
      completedCount,
      pendingCount,
    },
  };
}
