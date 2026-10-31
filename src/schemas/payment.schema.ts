import type { ValidationError, ValidationResult } from "./registration.schema";

export interface PaymentSubmissionInput {
  registrationId: string;
  transactionReference: string;
  screenshotUrl: string;
}

/**
 * Validates a standard Indian banking UPI UTR (Unique Transaction Reference).
 * Standard UPI references consist of exactly 12 numeric digits.
 */
export function isValidUpiReference(ref: string): boolean {
  return /^\d{12}$/.test(ref.trim());
}

/**
 * Validates manual payment submission data.
 */
export function validatePaymentInput(
  input: PaymentSubmissionInput
): ValidationResult<PaymentSubmissionInput> {
  const errors: ValidationError[] = [];

  if (!input.registrationId || typeof input.registrationId !== "string" || input.registrationId.trim() === "") {
    errors.push({
      field: "registrationId",
      message: "Registration ID is required.",
    });
  }

  const utr = input.transactionReference?.trim();
  if (!utr || !isValidUpiReference(utr)) {
    errors.push({
      field: "transactionReference",
      message: "UPI Transaction Reference (UTR) must be exactly 12 numeric digits.",
    });
  }

  const screenshot = input.screenshotUrl?.trim();
  if (!screenshot || screenshot === "") {
    errors.push({
      field: "screenshotUrl",
      message: "Payment success screenshot proof is required.",
    });
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: input };
}
