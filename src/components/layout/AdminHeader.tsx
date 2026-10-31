"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Shield,
  Menu,
  X,
  ExternalLink,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "./AdminSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";

const ADMIN_TITLE_MAP: Record<string, string> = {
  "/admin": "Operations Overview",
  "/admin/tournaments": "Tournament Management",
  "/admin/registrations": "Registration Approvals",
  "/admin/teams": "Team Management",
  "/admin/payments": "Payment Verification",
  "/admin/matches": "Match Schedule & Rooms",
  "/admin/results": "Result Verification",
  "/admin/financials": "Financial Operations",
  "/admin/notifications": "Broadcasts & Alerts",
  "/admin/settings": "Platform Settings",
};

export function AdminHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const pageTitle = React.useMemo(() => {
    if (ADMIN_TITLE_MAP[pathname]) {
      return ADMIN_TITLE_MAP[pathname];
    }
    const matchedKey = Object.keys(ADMIN_TITLE_MAP)
      .filter((key) => key !== "/admin" && pathname.startsWith(key))
      .sort((a, b) => b.length - a.length)[0];

    return matchedKey ? ADMIN_TITLE_MAP[matchedKey] : "Admin Console";
  }, [pathname]);

  return (
    <>
      <header
        className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md"
        aria-label="Admin Header"
      >
        {/* Left: Mobile Toggle & Branding / Desktop Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Toggle Admin Navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Brand indicator */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-skyfall-600 shadow-sm shadow-amber-500/20">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide truncate max-w-[140px] sm:max-w-none">
              {pageTitle}
            </span>
          </div>

          {/* Desktop Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              Admin Ops
            </span>
            <span className="text-slate-600">/</span>
            <h1 className="text-sm font-bold text-white tracking-wide">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right: Role indicator & Actions */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/40 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <Shield className="h-3 w-3" />
            <span>Admin Mode</span>
          </span>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </Link>

          <NotificationBell
            viewAllHref="/admin/notifications"
            className="focus-visible:ring-amber-400"
          />

          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 border border-amber-500/50 shadow-sm",
              },
            }}
          />
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] border-r border-slate-800 bg-slate-950 p-5 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-skyfall-600">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-wider text-white">
                    SKYFALL
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-400">
                    Admin Console
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
                aria-label="Close Admin Navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {ADMIN_NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-amber-400" : "text-slate-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Shortcuts */}
            <div className="pt-4 border-t border-slate-800 space-y-1 mt-auto">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <Flame className="h-3.5 w-3.5 text-skyfall-400" />
                <span>Switch to Player View</span>
              </Link>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Back to Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
