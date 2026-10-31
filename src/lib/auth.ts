import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role, type User } from "@prisma/client";
import { redirect } from "next/navigation";

export interface AuthContext {
  clerkUserId: string;
  user: User;
}

/**
 * Retrieves the currently authenticated application user from PostgreSQL.
 * If the user is logged into Clerk but not yet present in the database,
 * automatically provisions their user profile based on Clerk identity.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!dbUser) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }

    const primaryEmail =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
      return null;
    }

    const adminEmails = (process.env.ADMIN_EMAIL_ALLOWLIST || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isAllowlistedAdmin = adminEmails.includes(primaryEmail.toLowerCase());

    const fullName = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    dbUser = await prisma.user.create({
      data: {
        clerkUserId,
        email: primaryEmail,
        name: fullName || primaryEmail.split("@")[0],
        phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        role: isAllowlistedAdmin ? Role.ADMIN : Role.PLAYER,
      },
    });
  }

  return dbUser;
}

/**
 * Enforces that the current request is authenticated.
 * Returns the application User record, or redirects to /sign-in if not authenticated.
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

/**
 * Enforces that the current request is authenticated with ADMIN role.
 * Throws 403 or redirects if unauthorized.
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();

  if (user.role !== Role.ADMIN) {
    throw new Error("Forbidden: Administrator access required.");
  }

  return user;
}

/**
 * Checks whether the current user is an admin without throwing.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === Role.ADMIN;
}
