import { prisma } from "@/lib/prisma";
import { NotificationType, type Notification } from "@prisma/client";

export type UserNotificationItem = Notification;

export interface NotificationStats {
  total: number;
  unread: number;
}

/**
 * Fetches all in-app notifications for an authenticated user.
 */
export async function getUserNotifications(
  userId: string,
  limit = 50
): Promise<UserNotificationItem[]> {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return notifications;
}

/**
 * Returns the unread notification count for an authenticated user.
 */
export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

/**
 * Marks a specific notification as read.
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
) {
  try {
    const updated = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true, count: updated.count };
  } catch (err: unknown) {
    console.error("Mark notification read error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read.",
    };
  }
}

/**
 * Marks all unread notifications as read for a user.
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const res = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true, count: res.count };
  } catch (err: unknown) {
    console.error("Mark all notifications read error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read.",
    };
  }
}

/**
 * Retrieves all platform notifications for administrative monitoring and audit.
 */
export async function getAllNotificationsForAdmin(filters?: {
  type?: NotificationType | "ALL";
  search?: string;
}) {
  const whereClause: {
    type?: NotificationType;
    OR?: [
      { title: { contains: string; mode: "insensitive" } },
      { message: { contains: string; mode: "insensitive" } },
      { user: { email: { contains: string; mode: "insensitive" } } }
    ];
  } = {};

  if (filters?.type && filters.type !== "ALL") {
    whereClause.type = filters.type;
  }

  if (filters?.search && filters.search.trim() !== "") {
    const s = filters.search.trim();
    whereClause.OR = [
      { title: { contains: s, mode: "insensitive" } },
      { message: { contains: s, mode: "insensitive" } },
      { user: { email: { contains: s, mode: "insensitive" } } },
    ];
  }

  const notifications = await prisma.notification.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return notifications;
}
