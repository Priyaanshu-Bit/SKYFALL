import { prisma } from "@/lib/prisma";
import { TournamentStatus, RegistrationStatus } from "@prisma/client";
import {
  TournamentRegistrationInput,
  validateRegistrationInput,
} from "@/schemas/registration.schema";

export interface RegistrationServiceResult {
  success: boolean;
  registrationId?: string;
  error?: string;
}

/**
 * Registers a squad for an active tournament.
 * Enforces tournament open status, deadline, slot capacity concurrency checks,
 * squad member count conformity, and duplicate player UID protection.
 */
export async function registerSquadForTournament(
  userId: string,
  input: TournamentRegistrationInput
): Promise<RegistrationServiceResult> {
  try {
    // 1. Fetch tournament details with active registrations and squad rosters
    const tournament = await prisma.tournament.findUnique({
      where: { id: input.tournamentId },
      include: {
        gameMode: true,
        registrations: {
          where: {
            registrationStatus: {
              in: [
                RegistrationStatus.CONFIRMED,
                RegistrationStatus.PAYMENT_SUBMITTED,
                RegistrationStatus.PENDING_PAYMENT,
              ],
            },
          },
          include: {
            team: {
              include: { members: true },
            },
          },
        },
      },
    });

    if (!tournament) {
      return { success: false, error: "Tournament not found." };
    }

    if (tournament.status !== TournamentStatus.REGISTRATION_OPEN) {
      return {
        success: false,
        error: "Tournament registration is currently not open.",
      };
    }

    if (new Date() > tournament.registrationCloseAt) {
      return {
        success: false,
        error: "Tournament registration deadline has passed.",
      };
    }

    if (tournament.registrations.length >= tournament.teamCapacity) {
      return {
        success: false,
        error: "Tournament team capacity is completely full.",
      };
    }

    // 2. Validate input schema
    const validation = validateRegistrationInput(
      input,
      tournament.gameMode.playersPerTeam
    );

    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || "Validation failed.",
      };
    }

    // 3. Compile list of all player UIDs already participating in this tournament
    const registeredUids = new Set<string>();
    tournament.registrations.forEach((r) => {
      r.team.members.forEach((m) => registeredUids.add(m.freeFireUid.trim()));
    });

    let targetTeamId = input.teamId;

    if (input.mode === "EXISTING") {
      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        include: { members: true },
      });

      if (!team) {
        return { success: false, error: "Selected squad does not exist." };
      }

      if (team.captainId !== userId) {
        return {
          success: false,
          error: "Only the designated squad captain can register this team.",
        };
      }

      if (team.members.length !== tournament.gameMode.playersPerTeam) {
        return {
          success: false,
          error: `Selected squad has ${team.members.length} members, but ${tournament.gameMode.name} requires exactly ${tournament.gameMode.playersPerTeam} members.`,
        };
      }

      const isTeamAlreadyRegistered = tournament.registrations.some(
        (r) => r.teamId === team.id
      );

      if (isTeamAlreadyRegistered) {
        return {
          success: false,
          error: "This squad is already registered for this tournament.",
        };
      }

      for (const m of team.members) {
        if (registeredUids.has(m.freeFireUid.trim())) {
          return {
            success: false,
            error: `Player "${m.playerName}" (Free Fire UID: ${m.freeFireUid}) is already registered with another squad in this tournament.`,
          };
        }
      }
    } else {
      // Mode is NEW
      for (const m of input.members!) {
        const uid = m.freeFireUid.trim();
        if (registeredUids.has(uid)) {
          return {
            success: false,
            error: `Player "${m.playerName}" (Free Fire UID: ${uid}) is already registered with another squad in this tournament.`,
          };
        }
      }
    }

    // 4. Atomically persist team (if new) and registration within a transaction
    const registration = await prisma.$transaction(async (tx) => {
      // Re-verify slot capacity inside transaction to prevent race conditions
      const currentActiveCount = await tx.registration.count({
        where: {
          tournamentId: tournament.id,
          registrationStatus: {
            in: [
              RegistrationStatus.CONFIRMED,
              RegistrationStatus.PAYMENT_SUBMITTED,
              RegistrationStatus.PENDING_PAYMENT,
            ],
          },
        },
      });

      if (currentActiveCount >= tournament.teamCapacity) {
        throw new Error("Tournament reached full capacity during submission.");
      }

      if (input.mode === "NEW") {
        const createdTeam = await tx.team.create({
          data: {
            name: input.teamName!.trim(),
            captainId: userId,
            members: {
              create: input.members!.map((m, idx) => ({
                playerName: m.playerName.trim(),
                freeFireUid: m.freeFireUid.trim(),
                position: idx + 1,
                isCaptain: idx === 0,
              })),
            },
          },
        });
        targetTeamId = createdTeam.id;
      }

      return tx.registration.create({
        data: {
          tournamentId: tournament.id,
          teamId: targetTeamId!,
          registeredById: userId,
          registrationStatus: RegistrationStatus.PENDING_PAYMENT,
        },
      });
    });

    return {
      success: true,
      registrationId: registration.id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register squad.";
    return { success: false, error: message };
  }
}
