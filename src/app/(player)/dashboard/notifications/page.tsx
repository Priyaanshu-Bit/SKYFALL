import * as React from "react";
import { requireAuth } from "@/lib/auth";
import { getUserNotifications } from "@/services/notification.service";
import { NotificationCenterView } from "@/features/notifications/NotificationCenterView";

export default async function PlayerNotificationsPage() {
  const user = await requireAuth();

  const notifications = await getUserNotifications(user.id);

  return (
    <div className="py-2">
      <NotificationCenterView initialNotifications={notifications} />
    </div>
  );
}
