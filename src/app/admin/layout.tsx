import * as React from "react";
import { requireAuth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce admin role authentication at the server boundary
  const user = await requireAuth();

  if (user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Desktop Admin Sidebar (w-64, fixed, lg:flex) */}
      <AdminSidebar />

      {/* Main Content Area (offset by 64 (16rem) on lg screens) */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
