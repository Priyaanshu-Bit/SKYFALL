"use server";

import { requireAdmin } from "@/lib/auth";
import { approvePayment, rejectPayment } from "@/services/admin-payment.service";
import {
  createTournament,
  updateTournamentStatus,
} from "@/services/admin-tournament.service";
import type { CreateTournamentInput } from "@/schemas/tournament.schema";
import type { TournamentStatus } from "@prisma/client";
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
