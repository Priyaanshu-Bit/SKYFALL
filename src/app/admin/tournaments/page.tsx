import * as React from "react";
import { requireAdmin } from "@/lib/auth";
import { getAdminTournamentsList } from "@/services/admin-tournament.service";
import { AdminTournamentList } from "@/features/admin/AdminTournamentList";

export default async function AdminTournamentsPage() {
  // Enforce administrative authorization
  await requireAdmin();

  const tournaments = await getAdminTournamentsList();

  return (
    <div className="py-2">
      <AdminTournamentList initialTournaments={tournaments} />
    </div>
  );
}
