"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Flame, Menu, X, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioToggle } from "@/components/ui/AudioToggle";

interface NavItem {
  name: string;
  href: string;
}

const PUBLIC_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Tournaments", href: "/tournaments" },
  { name: "Results", href: "/results" },
  { name: "Leaderboards", href: "/leaderboards" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
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

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 rounded-md"
          aria-label="SKYFALL Homepage"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-skyfall-500 to-skyfall-700 shadow-md shadow-skyfall-500/20">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-black tracking-wider text-white">
              SKYFALL
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-skyfall-400 leading-none">
              Esports India
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1.5"
          aria-label="Main Navigation"
        >
          {PUBLIC_NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3.5 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400",
                  active
                    ? "bg-skyfall-950/80 text-skyfall-400 border border-skyfall-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-3 min-w-[140px] justify-end">
          <AudioToggle />
          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400"
              >
                <Trophy className="h-3.5 w-3.5 text-skyfall-400" />
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 border border-skyfall-500/40",
                  },
                }}
              />
            </>
          ) : isLoaded ? (
            <Link href="/sign-in">
              <Button size="sm" variant="default" className="text-xs font-bold">
                Sign In
              </Button>
            </Link>
          ) : (
            <div className="h-8 w-16 animate-pulse rounded bg-slate-800/60" />
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <AudioToggle />
          {isLoaded && isSignedIn && (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 border border-skyfall-500/40",
                },
              }}
            />
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-skyfall-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 backdrop-blur-lg animate-in slide-in-from-top-2 duration-200"
        >
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors",
                    active
                      ? "bg-skyfall-950 text-skyfall-400 border border-skyfall-500/30 font-bold"
                      : "text-slate-200 hover:bg-slate-900 hover:text-white"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-800/80">
            {isLoaded && isSignedIn ? (
              <Link
                href="/dashboard"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-skyfall-500 text-sm font-bold text-white shadow-md shadow-skyfall-500/20 hover:bg-skyfall-600"
              >
                <Trophy className="h-4 w-4" />
                Go to Player Dashboard
              </Link>
            ) : isLoaded ? (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/sign-in" className="w-full">
                  <Button variant="default" className="w-full text-xs font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="w-full">
                  <Button variant="outline" className="w-full text-xs font-semibold">
                    Create Account
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
