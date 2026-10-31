"use server";

import { requireAdmin } from "@/lib/auth";
import { approvePayment, rejectPayment } from "@/services/admin-payment.service";
import {
  createTournament,
  updateTournamentStatus,
} from "@/services/admin-tournament.service";
import {
  generateKnockoutMatches,
  updateMatchRoom,
} from "@/services/admin-match.service";
import { recordMatchResult } from "@/services/admin-result.service";
import { fulfillPrizePayout } from "@/services/admin-financial.service";
import type { CreateTournamentInput } from "@/schemas/tournament.schema";
import type { TournamentStatus, MatchStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function approvePaymentAction(paymentId: string) {
  const admin = await requireAdmin();
  return approvePayment(admin.id, paymentId);
}

export async function rejectPaymentAction(
  paymentId: string,
  rejectionReason: string
) {
  const admin = await requireAdmin();
  return rejectPayment(admin.id, paymentId, rejectionReason);
}

export async function createTournamentAction(input: CreateTournamentInput) {
  await requireAdmin();
  const res = await createTournament(input);
  if (res.success) {
    revalidatePath("/admin/tournaments");
    revalidatePath("/tournaments");
    revalidatePath("/admin");
  }
  return res;
}

export async function updateTournamentStatusAction(
  tournamentId: string,
  status: TournamentStatus
) {
  await requireAdmin();
  const res = await updateTournamentStatus(tournamentId, status);
  if (res.success) {
    revalidatePath("/admin/tournaments");
    revalidatePath("/tournaments");
    revalidatePath("/admin");
  }
  return res;
}

export async function generateKnockoutMatchesAction(tournamentId: string) {
  await requireAdmin();
  const res = await generateKnockoutMatches(tournamentId);
  if (res.success) {
    revalidatePath(`/admin/tournaments/${tournamentId}/rooms`);
    revalidatePath("/admin/matches");
    revalidatePath("/admin");
    revalidatePath("/dashboard/tournaments");
  }
  return res;
}

export async function updateMatchRoomAction(input: {
  matchId: string;
  roomId?: string;
  roomPassword?: string;
  scheduledAt?: string;
  status: MatchStatus;
}) {
  await requireAdmin();
  const res = await updateMatchRoom(input);
  if (res.success) {
    revalidatePath("/admin/matches");
    revalidatePath("/dashboard/tournaments");
    revalidatePath("/admin");
  }
  return res;
}

export async function recordMatchResultAction(input: {
  matchId: string;
  winnerTeamId: string;
  teamAScore?: number;
  teamBScore?: number;
  kills?: number;
  scoreboardProofUrl?: string;
}) {
  const admin = await requireAdmin();
  const res = await recordMatchResult({
    ...input,
    adminUserId: admin.id,
  });
  if (res.success) {
    revalidatePath("/admin/results");
    revalidatePath("/admin/matches");
    revalidatePath("/admin/tournaments");
    revalidatePath("/admin/financials");
    revalidatePath("/tournaments");
    revalidatePath("/dashboard/tournaments");
    revalidatePath("/admin");
  }
  return res;
}

export async function fulfillPrizePayoutAction(
  prizeId: string,
  input: {
    transactionReference: string;
    notes?: string;
  }
) {
  const admin = await requireAdmin();
  const res = await fulfillPrizePayout(prizeId, {
    ...input,
    adminUserId: admin.id,
  });
  if (res.success) {
    revalidatePath("/admin/financials");
    revalidatePath("/admin");
    revalidatePath("/dashboard/tournaments");
  }
  return res;
}
