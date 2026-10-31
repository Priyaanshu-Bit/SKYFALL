"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Swords,
  Trophy,
  Check,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from "@/features/notifications/actions";
import type { Notification, NotificationType } from "@prisma/client";

interface NotificationCenterViewProps {
  initialNotifications: Notification[];
  title?: string;
  subtitle?: string;
}

export function NotificationCenterView({
  initialNotifications,
  title = "Notification Center",
  subtitle = "Stay updated on tournament registrations, payment verifications, match room credentials, and cash prize disbursements.",
}: NotificationCenterViewProps) {
  const router = useRouter();
  const [notifications, setNotifications] =
    React.useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string, link?: string | null) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markNotificationAsReadAction(id);

    if (link) {
      router.push(link);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsAsReadAction();
  };

  const filteredNotifications = notifications.filter((n) => {
    const s = search.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(s) || n.message.toLowerCase().includes(s);

    let matchesFilter = true;
    if (filter === "UNREAD") matchesFilter = !n.isRead;
    else if (filter === "PAYMENT") matchesFilter = n.type === "PAYMENT";
    else if (filter === "MATCH") matchesFilter = n.type === "MATCH";
    else if (filter === "PRIZE") matchesFilter = n.type === "PRIZE";

    return matchesSearch && matchesFilter;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "PAYMENT":
        return <CreditCard className="h-5 w-5 text-emerald-400" />;
      case "MATCH":
        return <Swords className="h-5 w-5 text-purple-400" />;
      case "PRIZE":
        return <Trophy className="h-5 w-5 text-amber-400" />;
      case "REGISTRATION":
        return <CheckCircle2 className="h-5 w-5 text-sky-400" />;
      default:
        return <Bell className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">{subtitle}</p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllRead}
            className="gap-2 border-slate-700 text-slate-300 hover:text-white shrink-0 text-xs"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Mark All as Read ({unreadCount})</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All Alerts", value: "ALL" },
            { label: `Unread (${unreadCount})`, value: "UNREAD" },
            { label: "Payments", value: "PAYMENT" },
            { label: "Matches & Rooms", value: "MATCH" },
            { label: "Prizes", value: "PRIZE" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={filter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.value)}
              className={
                filter === tab.value
                  ? "bg-amber-500 text-slate-950 font-bold text-xs"
                  : "border-slate-700 text-slate-300 text-xs"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Notification Cards */}
      {filteredNotifications.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3">
            <Bell className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg text-white">No Notifications Found</CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            {search || filter !== "ALL"
              ? "No alerts match your filter criteria."
              : "You have no notifications right now."}
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <Card
              key={n.id}
              onClick={() => handleMarkAsRead(n.id, n.link)}
              className={`border-slate-800 p-4 transition-all cursor-pointer hover:border-slate-700 ${
                !n.isRead
                  ? "bg-gradient-to-r from-amber-950/20 via-slate-900/90 to-slate-900 border-amber-500/30"
                  : "bg-slate-900/70"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-800">
                  {getNotificationIcon(n.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2
                        className={`text-sm ${
                          !n.isRead ? "font-black text-white" : "font-bold text-slate-200"
                        }`}
                      >
                        {n.title}
                      </h2>
                      {!n.isRead && (
                        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 shrink-0">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {n.message}
                  </p>

                  {n.link && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline">
                        <span>Go to Dashboard</span>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
