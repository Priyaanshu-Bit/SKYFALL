"use server";

import { requireAuth } from "@/lib/auth";
import { registerSquadForTournament } from "@/services/registration.service";
import type { TournamentRegistrationInput } from "@/schemas/registration.schema";

export async function submitTournamentRegistration(
  input: TournamentRegistrationInput
) {
  const user = await requireAuth();
  return registerSquadForTournament(user.id, input);
}
