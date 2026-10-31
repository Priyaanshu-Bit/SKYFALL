import * as React from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getTournamentMatchWorkbench } from "@/services/admin-match.service";
import { TournamentMatchesWorkbench } from "@/features/admin/TournamentMatchesWorkbench";

interface TournamentRoomsPageProps {
  params: Promise<{ id: string }>;
}

export default async function TournamentRoomsPage({
  params,
}: TournamentRoomsPageProps) {
  // Enforce administrative authorization
  await requireAdmin();

  const { id } = await params;
  const data = await getTournamentMatchWorkbench(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="py-2">
      <TournamentMatchesWorkbench initialData={data} />
    </div>
  );
}
