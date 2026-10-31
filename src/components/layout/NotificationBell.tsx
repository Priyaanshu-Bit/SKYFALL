"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Swords,
  Trophy,
  Check,
  ChevronRight,
} from "lucide-react";
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from "@/features/notifications/actions";
import type { Notification, NotificationType } from "@prisma/client";
import { playClickTone } from "@/lib/sound";

interface NotificationBellProps {
  initialNotifications?: Notification[];
  initialUnreadCount?: number;
  viewAllHref?: string;
  className?: string;
}

export function NotificationBell({
  initialNotifications = [],
  initialUnreadCount = 0,
  viewAllHref = "/dashboard/notifications",
  className,
}: NotificationBellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] =
    React.useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = React.useState<number>(initialUnreadCount);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Sync props
  React.useEffect(() => {
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
  }, [initialNotifications, initialUnreadCount]);

  // Click outside listener
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, link?: string | null) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    await markNotificationAsReadAction(id);

    if (link) {
      setIsOpen(false);
      router.push(link);
    }
  };

  const handleMarkAllRead = async () => {
    playClickTone();
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    await markAllNotificationsAsReadAction();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "PAYMENT":
        return <CreditCard className="h-4 w-4 text-emerald-400" />;
      case "MATCH":
        return <Swords className="h-4 w-4 text-purple-400" />;
      case "PRIZE":
        return <Trophy className="h-4 w-4 text-amber-400" />;
      case "REGISTRATION":
        return <CheckCircle2 className="h-4 w-4 text-sky-400" />;
      default:
        return <Bell className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          playClickTone();
          setIsOpen(!isOpen);
        }}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 ${className}`}
        aria-label="In-App Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-md shadow-red-600/50 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-950/95 p-0 text-slate-100 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-medium text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Scrollable list */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="py-12 text-center px-4 space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-500 border border-slate-800">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-300">All Caught Up!</p>
                <p className="text-[11px] text-slate-500">
                  Match room credentials, payment confirmations, and prizes will appear here.
                </p>
              </div>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.link)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-900/60 ${
                    !n.isRead ? "bg-amber-950/15" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs truncate ${
                          !n.isRead ? "font-bold text-white" : "font-medium text-slate-300"
                        }`}
                      >
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-500 pt-0.5">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800/80 bg-slate-900/40 p-2 text-center">
            <Link
              href={viewAllHref}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 py-1"
            >
              <span>View All Notification History</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
