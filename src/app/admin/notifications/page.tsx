import * as React from "react";
import { requireAdmin } from "@/lib/auth";
import { getAllNotificationsForAdmin } from "@/services/notification.service";
import { NotificationCenterView } from "@/features/notifications/NotificationCenterView";

export default async function AdminNotificationsPage() {
  await requireAdmin();

  const notifications = await getAllNotificationsForAdmin();

  return (
    <div className="py-2">
      <NotificationCenterView
        initialNotifications={notifications}
        title="Admin Operational Alerts & System Log"
        subtitle="Audit all automated match room credential releases, payment decisions, and prize payouts dispatched to players."
      />
    </div>
  );
}
