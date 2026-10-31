"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Swords,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Teams", href: "/dashboard/teams", icon: Users },
  { name: "Tournaments", href: "/dashboard/tournaments", icon: Trophy },
  { name: "Matches", href: "/dashboard/matches", icon: Swords },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function PlayerMobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-800 bg-slate-950/95 px-2 backdrop-blur-lg lg:hidden"
      aria-label="Mobile Player Navigation"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center min-w-[3.5rem] py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 rounded-md",
              active
                ? "text-skyfall-400 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={cn(
                "h-5 w-5 mb-0.5 transition-transform",
                active ? "text-skyfall-400 scale-110" : "text-slate-400"
              )}
            />
            <span className="truncate max-w-[4rem] text-center">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
