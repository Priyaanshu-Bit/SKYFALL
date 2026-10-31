import Link from "next/link";
import { Flame, ShieldCheck, Mail, MessageSquare } from "lucide-react";

export function PublicFooter() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand & Overview */}
          <div className="space-y-4 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-skyfall-400 rounded-md"
              aria-label="SKYFALL Homepage"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-skyfall-500 to-skyfall-700 shadow-md shadow-skyfall-500/20">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                SKYFALL
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              The premier Free Fire India tournament organisation platform. Discover
              competitive tournaments, register squads, verify payments, and compete
              for real prize pools.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Verified Fair Play Environment</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-skyfall-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tournaments"
                  className="transition-colors hover:text-skyfall-400"
                >
                  Explore Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/results"
                  className="transition-colors hover:text-skyfall-400"
                >
                  Match Results
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboards"
                  className="transition-colors hover:text-skyfall-400"
                >
                  Leaderboards & Standings
                </Link>
              </li>
            </ul>
          </div>

          {/* Rules & Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Tournament Rules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-skyfall-400"
                >
                  About SKYFALL
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Clash Squad Official Rules
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  No Emulator / Anti-Cheat Policy
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Prize Payout Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Organizer Support
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have inquiries about registrations, payment verification, or room
              credentials?
            </p>
            <div className="space-y-2 pt-1 text-sm">
              <Link
                href="/contact"
                className="flex items-center gap-2 text-slate-300 hover:text-skyfall-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-skyfall-400" />
                <span>Contact Organizers</span>
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>UPI Support via FamPay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-12 border-t border-slate-800/80 pt-8 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> Free Fire and
            Free Fire India are registered trademarks of Garena International.
            SKYFALL is an independent esports competition organiser platform and is
            not affiliated with, endorsed by, or sponsored by Garena.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p>© {currentYear} SKYFALL. All rights reserved.</p>
            <p className="text-[11px] text-slate-600">
              Built for competitive gaming excellence.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
