"use server";

import { requireAuth } from "@/lib/auth";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from "@/services/notification.service";
import { syncTournamentLifecycle } from "@/services/scheduled-sync.service";
import { revalidatePath } from "next/cache";

export async function markNotificationAsReadAction(notificationId: string) {
  const user = await requireAuth();
  const res = await markNotificationAsRead(notificationId, user.id);
  if (res.success) {
    revalidatePath("/dashboard/notifications");
    revalidatePath("/admin/notifications");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
  }
  return res;
}

export async function markAllNotificationsAsReadAction() {
  const user = await requireAuth();
  const res = await markAllNotificationsAsRead(user.id);
  if (res.success) {
    revalidatePath("/dashboard/notifications");
    revalidatePath("/admin/notifications");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
  }
  return res;
}

export async function getUnreadNotificationCountAction() {
  try {
    const user = await requireAuth();
    const count = await getUnreadNotificationCount(user.id);
    return { success: true, count };
  } catch {
    return { success: false, count: 0 };
  }
}

export async function triggerScheduledLifecycleSyncAction() {
  const res = await syncTournamentLifecycle();
  if (res.closedCount > 0) {
    revalidatePath("/tournaments");
    revalidatePath("/admin/tournaments");
    revalidatePath("/admin");
  }
  return res;
}
