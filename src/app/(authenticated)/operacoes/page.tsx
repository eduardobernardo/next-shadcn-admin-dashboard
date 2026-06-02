import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RotateCw } from "lucide-react";

import { getOperationsOverview } from "@/http/operations";

import { OperationsKpis } from "./_components/operations-kpis";
import { QueueStatusCard } from "./_components/queue-status-card";
import { RecentJobsTable } from "./_components/recent-jobs-table";
import { StorageByOrgTable } from "./_components/storage-by-org-table";
import { VideoStatusCard } from "./_components/video-status-card";

export default async function OperacoesPage() {
  const overview = await getOperationsOverview().catch(() => null);
  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const updatedAt = overview ? format(new Date(overview.generatedAt), "HH:mm", { locale: ptBR }) : null;

  if (!overview) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        Não foi possível carregar o painel de operações.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Operações</h1>
          <p className="text-muted-foreground text-sm capitalize">{formattedDate}</p>
          {overview.storageProvider.bucket ? (
            <p className="text-muted-foreground text-xs">
              Bucket {overview.storageProvider.bucket}
              {overview.storageProvider.region ? ` · ${overview.storageProvider.region}` : ""} ·{" "}
              {overview.storageProvider.note}
            </p>
          ) : null}
        </div>

        {updatedAt ? (
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <RotateCw className="size-4" />
            <span>Dados de {updatedAt}</span>
          </div>
        ) : null}
      </div>

      <OperationsKpis overview={overview} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <QueueStatusCard queue={overview.queue} />
        </div>
        <div className="xl:col-span-5">
          <VideoStatusCard byStatus={overview.videos.byStatus} total={overview.videos.total} />
        </div>
      </div>

      <StorageByOrgTable rows={overview.storage.byOrganization} />
      <RecentJobsTable jobs={overview.recentJobs} />
    </div>
  );
}
