import type { ValidationError, ValidationResult } from "./registration.schema";

export interface PrizeAllocationInput {
  position: number;
  title: string;
  prizeAmountRupees: number;
}

export interface CreateTournamentInput {
  name: string;
  description?: string;
  game: string;
  gameModeId: string;
  tournamentFormat: "KNOCKOUT" | "LEAGUE" | "ROUND_ROBIN";
  teamCapacity: number;
  entryFeeRupees: number;
  totalPrizePoolRupees: number;
  status: "DRAFT" | "PUBLISHED" | "REGISTRATION_OPEN";
  registrationOpenAt: string;
  registrationCloseAt: string;
  tournamentDate: string;
  startTime: string;
  rules?: string;
  bannerUrl?: string;
  livestreamUrl?: string;
  prizes: PrizeAllocationInput[];
}

/**
 * Validates tournament creation configuration against competitive esports rules.
 */
export function validateCreateTournamentInput(
  input: CreateTournamentInput
): ValidationResult<CreateTournamentInput> {
  const errors: ValidationError[] = [];

  // 1. Name validation
  const name = input.name?.trim();
  if (!name || name.length < 3 || name.length > 100) {
    errors.push({
      field: "name",
      message: "Tournament name must be between 3 and 100 characters.",
    });
  }

  // 2. Game Mode
  if (!input.gameModeId || typeof input.gameModeId !== "string" || input.gameModeId.trim() === "") {
    errors.push({
      field: "gameModeId",
      message: "Please select a valid game mode.",
    });
  }

  // 3. Tournament Format
  const validFormats = ["KNOCKOUT", "LEAGUE", "ROUND_ROBIN"];
  if (!validFormats.includes(input.tournamentFormat)) {
    errors.push({
      field: "tournamentFormat",
      message: "Invalid tournament format selected.",
    });
  }

  // 4. Team Capacity (Must be an even integer >= 2)
  const capacity = Number(input.teamCapacity);
  if (!Number.isInteger(capacity) || capacity < 2 || capacity % 2 !== 0) {
    errors.push({
      field: "teamCapacity",
      message: "Team capacity must be an even integer of at least 2 (e.g. 4, 8, 12, 16, 24, 48).",
    });
  }

  // 5. Entry Fee (Rupees >= 0)
  const entryFee = Number(input.entryFeeRupees);
  if (isNaN(entryFee) || entryFee < 0) {
    errors.push({
      field: "entryFeeRupees",
      message: "Entry fee must be a non-negative amount in Rupees (0 for free entry).",
    });
  }

  // 6. Total Prize Pool (Rupees >= 0)
  const totalPrizePool = Number(input.totalPrizePoolRupees);
  if (isNaN(totalPrizePool) || totalPrizePool < 0) {
    errors.push({
      field: "totalPrizePoolRupees",
      message: "Total prize pool must be a non-negative amount in Rupees.",
    });
  }

  // 7. Status
  const validStatuses = ["DRAFT", "PUBLISHED", "REGISTRATION_OPEN"];
  if (!validStatuses.includes(input.status)) {
    errors.push({
      field: "status",
      message: "Invalid tournament status.",
    });
  }

  // 8. Dates & Schedule
  const regOpen = new Date(input.registrationOpenAt);
  const regClose = new Date(input.registrationCloseAt);
  const tourDate = new Date(input.tournamentDate);

  if (isNaN(regOpen.getTime())) {
    errors.push({
      field: "registrationOpenAt",
      message: "Valid registration open date and time is required.",
    });
  }

  if (isNaN(regClose.getTime())) {
    errors.push({
      field: "registrationCloseAt",
      message: "Valid registration closing date and time is required.",
    });
  } else if (!isNaN(regOpen.getTime()) && regClose <= regOpen) {
    errors.push({
      field: "registrationCloseAt",
      message: "Registration closing time must be strictly after the opening time.",
    });
  }

  if (isNaN(tourDate.getTime())) {
    errors.push({
      field: "tournamentDate",
      message: "Valid tournament event date is required.",
    });
  } else if (!isNaN(regClose.getTime()) && tourDate < regClose) {
    errors.push({
      field: "tournamentDate",
      message: "Tournament date cannot be earlier than the registration deadline.",
    });
  }

  // 9. Start Time
  const startTime = input.startTime?.trim();
  if (!startTime || startTime.length < 2) {
    errors.push({
      field: "startTime",
      message: "Tournament starting time is required (e.g. '18:00 IST').",
    });
  }

  // 10. Livestream URL (optional, if present check basic format)
  if (input.livestreamUrl && input.livestreamUrl.trim() !== "") {
    const url = input.livestreamUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      errors.push({
        field: "livestreamUrl",
        message: "Livestream link must be a valid URL starting with http:// or https://",
      });
    }
  }

  // 11. Prize Pool Distribution Breakdown
  if (!Array.isArray(input.prizes) || input.prizes.length === 0) {
    errors.push({
      field: "prizes",
      message: "At least one prize allocation (e.g. 1st Place) must be configured.",
    });
  } else {
    let sumAllocations = 0;
    const positionsSeen = new Set<number>();

    input.prizes.forEach((prize, idx) => {
      const pos = Number(prize.position);
      const amount = Number(prize.prizeAmountRupees);
      const title = prize.title?.trim();

      if (!Number.isInteger(pos) || pos < 1) {
        errors.push({
          field: `prizes[${idx}].position`,
          message: `Prize position #${idx + 1} must be a positive integer.`,
        });
      } else if (positionsSeen.has(pos)) {
        errors.push({
          field: `prizes[${idx}].position`,
          message: `Duplicate prize position #${pos}. Each prize position must be unique.`,
        });
      } else {
        positionsSeen.add(pos);
      }

      if (!title || title.length < 2) {
        errors.push({
          field: `prizes[${idx}].title`,
          message: `Title for prize #${idx + 1} is required.`,
        });
      }

      if (isNaN(amount) || amount < 0) {
        errors.push({
          field: `prizes[${idx}].prizeAmountRupees`,
          message: `Prize amount for position #${pos} must be >= 0.`,
        });
      } else {
        sumAllocations += amount;
      }
    });

    if (sumAllocations > totalPrizePool) {
      errors.push({
        field: "prizes",
        message: `Sum of prize allocations (₹${sumAllocations}) exceeds the configured total prize pool (₹${totalPrizePool}).`,
      });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: input };
}
