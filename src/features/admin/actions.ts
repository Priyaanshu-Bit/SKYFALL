"use server";

import { requireAdmin } from "@/lib/auth";
import { approvePayment, rejectPayment } from "@/services/admin-payment.service";

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
