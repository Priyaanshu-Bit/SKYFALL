import * as React from "react";
import { requireAdmin } from "@/lib/auth";
import { getAvailableGameModes } from "@/services/admin-tournament.service";
import { CreateTournamentForm } from "@/features/admin/CreateTournamentForm";

export default async function NewTournamentPage() {
  // Enforce administrative authorization
  await requireAdmin();

  const gameModes = await getAvailableGameModes();

  return (
    <div className="py-2">
      <CreateTournamentForm gameModes={gameModes} />
    </div>
  );
}
