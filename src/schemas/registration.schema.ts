export interface PlayerRosterMember {
  playerName: string;
  freeFireUid: string;
}

export interface TournamentRegistrationInput {
  tournamentId: string;
  mode: "EXISTING" | "NEW";
  teamId?: string;
  teamName?: string;
  members?: PlayerRosterMember[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Validates Free Fire in-game UID format.
 * Standard Free Fire India UIDs consist of 8 to 14 numeric digits.
 */
export function isValidFreeFireUid(uid: string): boolean {
  return /^\d{8,14}$/.test(uid.trim());
}

/**
 * Validates a tournament registration submission against game mode player requirements.
 */
export function validateRegistrationInput(
  input: TournamentRegistrationInput,
  expectedPlayerCount: number
): ValidationResult<TournamentRegistrationInput> {
  const errors: ValidationError[] = [];

  if (!input.tournamentId || typeof input.tournamentId !== "string" || input.tournamentId.trim() === "") {
    errors.push({ field: "tournamentId", message: "Tournament ID is required." });
  }

  if (input.mode !== "EXISTING" && input.mode !== "NEW") {
    errors.push({ field: "mode", message: "Invalid registration mode." });
    return { success: false, errors };
  }

  if (input.mode === "EXISTING") {
    if (!input.teamId || typeof input.teamId !== "string" || input.teamId.trim() === "") {
      errors.push({ field: "teamId", message: "Please select an existing squad." });
    }
  } else {
    // Mode is NEW
    const teamName = input.teamName?.trim();
    if (!teamName || teamName.length < 3 || teamName.length > 30) {
      errors.push({
        field: "teamName",
        message: "Squad name must be between 3 and 30 characters.",
      });
    }

    if (!Array.isArray(input.members)) {
      errors.push({
        field: "members",
        message: "Player roster information is required.",
      });
    } else {
      if (input.members.length !== expectedPlayerCount) {
        errors.push({
          field: "members",
          message: `This tournament requires exactly ${expectedPlayerCount} squad members.`,
        });
      }

      const seenUids = new Set<string>();

      input.members.forEach((member, index) => {
        const name = member.playerName?.trim();
        const uid = member.freeFireUid?.trim();

        if (!name || name.length < 2 || name.length > 30) {
          errors.push({
            field: `members.${index}.playerName`,
            message: `Player #${index + 1} name must be between 2 and 30 characters.`,
          });
        }

        if (!uid || !isValidFreeFireUid(uid)) {
          errors.push({
            field: `members.${index}.freeFireUid`,
            message: `Player #${index + 1} Free Fire UID must be 8-14 numeric digits.`,
          });
        } else if (seenUids.has(uid)) {
          errors.push({
            field: `members.${index}.freeFireUid`,
            message: `Duplicate Free Fire UID (${uid}) found in squad roster.`,
          });
        } else {
          seenUids.add(uid);
        }
      });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: input };
}
