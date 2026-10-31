import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-6 right-6 flex items-center gap-4">
        {userId ? (
          <>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <UserButton />
          </>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800"
          >
            Sign In
          </Link>
        )}
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center rounded-full border border-skyfall-500/30 bg-skyfall-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-skyfall-400">
          Esports Tournament Platform
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-white">
          SKYFALL
        </h1>
        <p className="text-base text-slate-400 sm:text-lg">
          Competitive Free Fire India tournaments, seamless team registrations,
          verified manual payments, and real-time bracket progression.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/tournaments"
            className="rounded-lg bg-skyfall-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-skyfall-500/25 transition-all hover:bg-skyfall-600 focus:outline-none focus:ring-2 focus:ring-skyfall-400"
          >
            Explore Tournaments
          </Link>
          <Link
            href="/results"
            className="rounded-lg border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            View Results
          </Link>
        </div>
      </div>
    </main>
  );
}
