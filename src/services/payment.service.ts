import { prisma } from "@/lib/prisma";
import {
  PaymentStatus,
  RegistrationStatus,
  NotificationType,
} from "@prisma/client";
import {
  PaymentSubmissionInput,
  validatePaymentInput,
} from "@/schemas/payment.schema";

export interface PaymentServiceResult {
  success: boolean;
  error?: string;
}

/**
 * Retrieves registration details for payment processing.
 * Enforces captain ownership.
 */
export async function getRegistrationForPayment(
  registrationId: string,
  userId: string
) {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      tournament: {
        include: { gameMode: true },
      },
      team: {
        include: { members: true },
      },
      payment: true,
    },
  });

  if (!registration) {
    return null;
  }

  // Ensure only the player who registered this squad can access payment
  if (registration.registeredById !== userId) {
    return null;
  }

  return registration;
}

/**
 * Retrieves the platform's active FamPay QR code and UPI details.
 */
export async function getFamPaySettings() {
  const settings = await prisma.platformSetting.findMany({
    where: {
      key: {
        in: ["FAMPAY_QR_IMAGE_URL", "FAMPAY_UPI_ID", "ORGANIZER_BRANDING"],
      },
    },
  });

  const settingsMap = new Map(settings.map((s) => [s.key, s.value]));

  return {
    qrImageUrl:
      settingsMap.get("FAMPAY_QR_IMAGE_URL") ||
      "/images/placeholder-fampay-qr.png",
    upiId: settingsMap.get("FAMPAY_UPI_ID") || "skyfall.esports@fam",
    branding: settingsMap.get("ORGANIZER_BRANDING") || "SKYFALL",
  };
}

/**
 * Submits manual UPI payment proof for a tournament registration.
 * Transitions payment to UNDER_VERIFICATION and registration to PAYMENT_SUBMITTED.
 */
export async function submitManualPayment(
  userId: string,
  input: PaymentSubmissionInput
): Promise<PaymentServiceResult> {
  try {
    // 1. Validate inputs
    const validation = validatePaymentInput(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || "Validation failed.",
      };
    }

    const cleanUtr = input.transactionReference.trim();

    // 2. Fetch registration
    const registration = await prisma.registration.findUnique({
      where: { id: input.registrationId },
      include: { tournament: true },
    });

    if (!registration) {
      return { success: false, error: "Registration record not found." };
    }

    if (registration.registeredById !== userId) {
      return {
        success: false,
        error: "Unauthorized: You do not own this tournament registration.",
      };
    }

    // 3. Duplicate UTR check across all payments
    const existingWithUtr = await prisma.payment.findUnique({
      where: { transactionReference: cleanUtr },
    });

    if (
      existingWithUtr &&
      existingWithUtr.registrationId !== input.registrationId
    ) {
      return {
        success: false,
        error:
          "This UPI Transaction Reference (UTR) has already been submitted for another registration.",
      };
    }

    // 4. Atomic transaction updating payment, registration, and issuing notification
    await prisma.$transaction(async (tx) => {
      await tx.payment.upsert({
        where: { registrationId: input.registrationId },
        update: {
          transactionReference: cleanUtr,
          screenshotUrl: input.screenshotUrl,
          amountPaise: registration.tournament.entryFeePaise,
          status: PaymentStatus.UNDER_VERIFICATION,
          rejectionReason: null,
        },
        create: {
          registrationId: input.registrationId,
          transactionReference: cleanUtr,
          screenshotUrl: input.screenshotUrl,
          amountPaise: registration.tournament.entryFeePaise,
          status: PaymentStatus.UNDER_VERIFICATION,
        },
      });

      await tx.registration.update({
        where: { id: input.registrationId },
        data: {
          registrationStatus: RegistrationStatus.PAYMENT_SUBMITTED,
        },
      });

      await tx.notification.create({
        data: {
          userId,
          type: NotificationType.PAYMENT,
          title: "Payment Receipt Submitted",
          message: `Your payment receipt (UTR: ${cleanUtr}) for ${registration.tournament.name} was received and is under administrator verification.`,
          link: `/dashboard/payments`,
        },
      });
    });

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to submit payment proof.";
    return { success: false, error: message };
  }
}
