import { prisma } from "@/lib/prisma";
import { Role, type User } from "@prisma/client";

export interface SyncUserData {
  clerkUserId: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  freeFireUid?: string | null;
}

export class UserService {
  /**
   * Synchronizes or creates an application user record from Clerk identity.
   * Enforces role assignment based on configured ADMIN_EMAIL_ALLOWLIST.
   */
  static async syncUser(data: SyncUserData): Promise<User> {
    const adminEmails = (process.env.ADMIN_EMAIL_ALLOWLIST || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isAllowlistedAdmin = adminEmails.includes(data.email.toLowerCase());

    return prisma.user.upsert({
      where: { clerkUserId: data.clerkUserId },
      update: {
        email: data.email,
        ...(data.name ? { name: data.name } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
      },
      create: {
        clerkUserId: data.clerkUserId,
        email: data.email,
        name: data.name || data.email.split("@")[0],
        phone: data.phone,
        freeFireUid: data.freeFireUid,
        role: isAllowlistedAdmin ? Role.ADMIN : Role.PLAYER,
      },
    });
  }

  /**
   * Updates player Free Fire UID and profile information.
   */
  static async updateProfile(
    userId: string,
    data: { name?: string; phone?: string; freeFireUid?: string }
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.freeFireUid !== undefined ? { freeFireUid: data.freeFireUid } : {}),
      },
    });
  }

  /**
   * Retrieves a user by application ID.
   */
  static async getById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * Assigns user role (admin operation).
   */
  static async setRole(userId: string, role: Role): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}
