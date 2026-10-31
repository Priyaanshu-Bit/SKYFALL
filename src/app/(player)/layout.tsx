import * as React from "react";
import { requireAuth } from "@/lib/auth";
import { PlayerSidebar } from "@/components/layout/PlayerSidebar";
import { PlayerHeader } from "@/components/layout/PlayerHeader";
import { PlayerMobileNav } from "@/components/layout/PlayerMobileNav";

export default async function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce player authentication at the server boundary
  await requireAuth();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Desktop Sidebar (lg:flex, w-64, fixed) */}
      <PlayerSidebar />

      {/* Main Content Area (offset by 64 (16rem) on lg screens) */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        <PlayerHeader />

        {/* Content canvas with bottom padding to clear mobile bottom navigation */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation (<1024px) */}
      <PlayerMobileNav />
    </div>
  );
}
