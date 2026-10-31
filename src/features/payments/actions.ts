"use server";

import { requireAuth } from "@/lib/auth";
import { submitManualPayment } from "@/services/payment.service";
import type { PaymentSubmissionInput } from "@/schemas/payment.schema";

export async function submitPaymentProof(input: PaymentSubmissionInput) {
  const user = await requireAuth();
  return submitManualPayment(user.id, input);
}
