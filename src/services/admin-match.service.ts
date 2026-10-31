import { prisma } from "@/lib/prisma";
import {
  MatchStatus,
  NotificationType,
  RegistrationStatus,
  type Match,
  type Team,
  type Tournament,
  type GameMode,
} from "@prisma/client";

export interface MatchWithTeams extends Match {
  tournament: Tournament & { gameMode: GameMode };
  teamA: (Team & { captain: { id: string; name: string | null; email: string; phone: string | null } }) | null;
  teamB: (Team & { captain: { id: string; name: string | null; email: string; phone: string | null } }) | null;
  winnerTeam: Team | null;
}

export interface TournamentMatchWorkbenchData {
  tournament: Tournament & {
    gameMode: GameMode;
    prizes: { id: string; position: number; title: string; prizeAmountPaise: number }[];
  };
  confirmedTeams: {
    id: string;
    name: string;
    captain: {
      id: string;
      name: string | null;
      email: string;
      phone: string | null;
      freeFireUid: string | null;
    };
  }[];
  matches: MatchWithTeams[];
  rounds: {
    round: number;
    roundName: string;
    matches: MatchWithTeams[];
  }[];
}

/**
 * Calculates the smallest power of 2 greater than or equal to n.
 */
function nextPowerOfTwo(n: number): number {
  let p = 1;
  while (p < n) {
    p *= 2;
  }
  return p;
}

/**
 * Determines a human-readable title for a bracket round based on total rounds.
 */
function getRoundTitle(roundNumber: number, totalRounds: number): string {
  const fromFinal = totalRounds - roundNumber;
  if (fromFinal === 0) return "Grand Finals";
  if (fromFinal === 1) return "Semifinals";
  if (fromFinal === 2) return "Quarterfinals";
  if (fromFinal === 3) return "Round of 16";
  if (fromFinal === 4) return "Round of 32";
  return `Round ${roundNumber}`;
}

/**
 * Fetches all matches, confirmed teams, and tournament specs for the match room workbench.
 */
export async function getTournamentMatchWorkbench(
  tournamentId: string
): Promise<TournamentMatchWorkbenchData | null> {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      gameMode: true,
      prizes: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!tournament) return null;

  // Query confirmed squads
  const confirmedRegistrations = await prisma.registration.findMany({
    where: {
      tournamentId,
      registrationStatus: RegistrationStatus.CONFIRMED,
    },
    include: {
      team: {
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
    orderBy: { registeredAt: "asc" },
  });

  const confirmedTeams = confirmedRegistrations.map((r) => r.team);

  // Query existing matches
  const matches = (await prisma.match.findMany({
    where: { tournamentId },
    include: {
      tournament: {
        include: { gameMode: true },
      },
      teamA: {
        include: {
          captain: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      teamB: {
        include: {
          captain: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      winnerTeam: true,
    },
    orderBy: [{ round: "asc" }, { matchNumber: "asc" }],
  })) as MatchWithTeams[];

  // Group by round
  const roundMap = new Map<number, { roundName: string; matches: MatchWithTeams[] }>();
  matches.forEach((m) => {
    if (!roundMap.has(m.round)) {
      roundMap.set(m.round, {
        roundName: m.roundName || `Round ${m.round}`,
        matches: [],
      });
    }
    roundMap.get(m.round)!.matches.push(m);
  });

  const rounds = Array.from(roundMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([round, data]) => ({
      round,
      roundName: data.roundName,
      matches: data.matches,
    }));

  return {
    tournament,
    confirmedTeams,
    matches,
    rounds,
  };
}

/**
 * Automatically seeds and generates single-elimination knockout matches for all confirmed squads.
 * Handles both power-of-two (4, 8, 16) and non-power-of-two (6, 10, 12, etc.) capacities via standard byes.
 */
export async function generateKnockoutMatches(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    return { success: false, error: "Tournament not found." };
  }

  // 1. Fetch confirmed registered squads
  const confirmedRegistrations = await prisma.registration.findMany({
    where: {
      tournamentId,
      registrationStatus: RegistrationStatus.CONFIRMED,
    },
    include: { team: true },
    orderBy: { registeredAt: "asc" },
  });

  const teams = confirmedRegistrations.map((r) => r.team);
  const N = teams.length;

  if (N < 2) {
    return {
      success: false,
      error: `At least 2 confirmed squads are required to generate knockout matches. (Currently confirmed: ${N})`,
    };
  }

  // 2. Prevent generating if matches are currently live or completed
  const activeOrCompletedCount = await prisma.match.count({
    where: {
      tournamentId,
      status: { in: [MatchStatus.ROOM_OPEN, MatchStatus.ONGOING, MatchStatus.COMPLETED] },
    },
  });

  if (activeOrCompletedCount > 0) {
    return {
      success: false,
      error: "Cannot regenerate matches: tournament already has live or completed rounds.",
    };
  }

  // 3. Mathematical bracket planning
  const P = nextPowerOfTwo(N); // Bracket size (e.g. 12 -> 16, 8 -> 8, 4 -> 4)
  const totalRounds = Math.log2(P);
  const byesCount = P - N;

  // Base schedule time from tournament
  const baseTime = new Date(tournament.tournamentDate);

  try {
    return await prisma.$transaction(async (tx) => {
      // Clean previous scheduled matches
      await tx.match.deleteMany({
        where: { tournamentId },
      });

      let overallMatchSeq = 1;

      if (byesCount === 0) {
        // Standard Power of 2 (4, 8, 16)
        // Round 1
        const r1Matches: {
          tournamentId: string;
          round: number;
          roundName: string;
          matchNumber: number;
          teamAId: string;
          teamBId: string;
          scheduledAt: Date;
          status: MatchStatus;
        }[] = [];

        for (let i = 0; i < N; i += 2) {
          const matchTime = new Date(baseTime.getTime() + 0 * 45 * 60 * 1000);
          r1Matches.push({
            tournamentId,
            round: 1,
            roundName: getRoundTitle(1, totalRounds),
            matchNumber: overallMatchSeq++,
            teamAId: teams[i].id,
            teamBId: teams[i + 1].id,
            scheduledAt: matchTime,
            status: MatchStatus.SCHEDULED,
          });
        }

        await tx.match.createMany({ data: r1Matches });

        // Generate empty placeholder matches for subsequent rounds
        let matchesInRound = N / 4;
        for (let r = 2; r <= totalRounds; r++) {
          const roundName = getRoundTitle(r, totalRounds);
          const roundTime = new Date(baseTime.getTime() + (r - 1) * 45 * 60 * 1000);

          const subsequentMatches = [];
          for (let m = 0; m < matchesInRound; m++) {
            subsequentMatches.push({
              tournamentId,
              round: r,
              roundName,
              matchNumber: overallMatchSeq++,
              scheduledAt: roundTime,
              status: MatchStatus.SCHEDULED,
            });
          }

          await tx.match.createMany({ data: subsequentMatches });
          matchesInRound = Math.floor(matchesInRound / 2);
        }
      } else {
        // Non-Power of 2 with Byes (e.g. 12 squads in a 16-bracket)
        // Top `byesCount` squads get byes directly into Round 2
        const byeTeams = teams.slice(0, byesCount);
        const r1Teams = teams.slice(byesCount);

        // Round 1 preliminary matches
        const r1Matches = [];
        for (let i = 0; i < r1Teams.length; i += 2) {
          r1Matches.push({
            tournamentId,
            round: 1,
            roundName: getRoundTitle(1, totalRounds),
            matchNumber: overallMatchSeq++,
            teamAId: r1Teams[i].id,
            teamBId: r1Teams[i + 1].id,
            scheduledAt: new Date(baseTime.getTime()),
            status: MatchStatus.SCHEDULED,
          });
        }
        await tx.match.createMany({ data: r1Matches });

        // Round 2 matches: bye teams pre-assigned as teamA!
        const r2MatchesCount = P / 4;
        const r2Matches = [];
        const r2Time = new Date(baseTime.getTime() + 1 * 45 * 60 * 1000);
        const r2Name = getRoundTitle(2, totalRounds);

        for (let m = 0; m < r2MatchesCount; m++) {
          const byeTeam = byeTeams[m];
          r2Matches.push({
            tournamentId,
            round: 2,
            roundName: r2Name,
            matchNumber: overallMatchSeq++,
            teamAId: byeTeam ? byeTeam.id : undefined,
            scheduledAt: r2Time,
            status: MatchStatus.SCHEDULED,
          });
        }
        await tx.match.createMany({ data: r2Matches });

        // Subsequent rounds up to Grand Finals
        let matchesInRound = Math.floor(r2MatchesCount / 2);
        for (let r = 3; r <= totalRounds; r++) {
          const roundName = getRoundTitle(r, totalRounds);
          const roundTime = new Date(baseTime.getTime() + (r - 1) * 45 * 60 * 1000);

          const subsequentMatches = [];
          for (let m = 0; m < matchesInRound; m++) {
            subsequentMatches.push({
              tournamentId,
              round: r,
              roundName,
              matchNumber: overallMatchSeq++,
              scheduledAt: roundTime,
              status: MatchStatus.SCHEDULED,
            });
          }

          await tx.match.createMany({ data: subsequentMatches });
          matchesInRound = Math.floor(matchesInRound / 2);
        }
      }

      return {
        success: true,
        totalMatchesGenerated: overallMatchSeq - 1,
        totalRounds,
      };
    });
  } catch (err: unknown) {
    console.error("Bracket generation error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to generate matches in database.",
    };
  }
}

/**
 * Updates match room credentials (Room ID, Password, Schedule time, Status)
 * and automatically notifies team captains when the custom room is opened.
 */
export async function updateMatchRoom(input: {
  matchId: string;
  roomId?: string;
  roomPassword?: string;
  scheduledAt?: string;
  status: MatchStatus;
}) {
  const match = await prisma.match.findUnique({
    where: { id: input.matchId },
    include: {
      tournament: true,
      teamA: {
        include: { captain: true },
      },
      teamB: {
        include: { captain: true },
      },
    },
  });

  if (!match) {
    return { success: false, error: "Match not found." };
  }

  const newStatus = input.status;
  const isOpeningRoom =
    newStatus === MatchStatus.ROOM_OPEN && match.status !== MatchStatus.ROOM_OPEN;

  const dataToUpdate: {
    status: MatchStatus;
    roomId?: string | null;
    roomPassword?: string | null;
    scheduledAt?: Date;
  } = {
    status: newStatus,
  };

  if (input.roomId !== undefined) {
    dataToUpdate.roomId = input.roomId.trim() || null;
  }
  if (input.roomPassword !== undefined) {
    dataToUpdate.roomPassword = input.roomPassword.trim() || null;
  }
  if (input.scheduledAt) {
    dataToUpdate.scheduledAt = new Date(input.scheduledAt);
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.match.update({
        where: { id: input.matchId },
        data: dataToUpdate,
      });

      // Dispatch real-time in-app notifications if room is opened
      if (isOpeningRoom) {
        const captainsToNotify: { id: string; name: string | null }[] = [];
        if (match.teamA?.captain) {
          captainsToNotify.push({
            id: match.teamA.captain.id,
            name: match.teamA.name,
          });
        }
        if (match.teamB?.captain) {
          captainsToNotify.push({
            id: match.teamB.captain.id,
            name: match.teamB.name,
          });
        }

        const effectiveRoomId = dataToUpdate.roomId || match.roomId || "Pending";
        const effectivePassword =
          dataToUpdate.roomPassword || match.roomPassword || "Pending";

        for (const capt of captainsToNotify) {
          await tx.notification.create({
            data: {
              userId: capt.id,
              type: NotificationType.MATCH,
              title: `Match Room Open: ${match.roundName || "Round " + match.round}`,
              message: `Your Free Fire India match room is now open for ${capt.name}. Room ID: ${effectiveRoomId} | Password: ${effectivePassword}. Please enter within 10 minutes.`,
              link: `/dashboard/tournaments`,
            },
          });
        }
      }

      return res;
    });

    return { success: true, match: updated };
  } catch (err: unknown) {
    console.error("Match room update error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update match room credentials.",
    };
  }
}

/**
 * Queries all matches platform-wide for the global admin match workbench.
 */
export async function getAllMatchesForAdmin(filters?: {
  status?: MatchStatus | "ALL";
  search?: string;
}) {
  const whereClause: {
    status?: MatchStatus;
    OR?: [
      { tournament: { name: { contains: string; mode: "insensitive" } } },
      { teamA: { name: { contains: string; mode: "insensitive" } } },
      { teamB: { name: { contains: string; mode: "insensitive" } } }
    ];
  } = {};

  if (filters?.status && filters.status !== "ALL") {
    whereClause.status = filters.status;
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
    },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
  })) as MatchWithTeams[];

  const [scheduledCount, roomOpenCount, ongoingCount, completedCount] =
    await Promise.all([
      prisma.match.count({ where: { status: MatchStatus.SCHEDULED } }),
      prisma.match.count({ where: { status: MatchStatus.ROOM_OPEN } }),
      prisma.match.count({ where: { status: MatchStatus.ONGOING } }),
      prisma.match.count({ where: { status: MatchStatus.COMPLETED } }),
    ]);

  return {
    matches,
    stats: {
      totalMatches: matches.length,
      scheduledCount,
      roomOpenCount,
      ongoingCount,
      completedCount,
    },
  };
}
