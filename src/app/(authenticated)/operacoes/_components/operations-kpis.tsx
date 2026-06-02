import { AlertTriangle, Clapperboard, HardDrive, ListOrdered } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OperationsOverview } from "@/lib/operations-overview";
import { formatBytes } from "@/lib/saas-formatters";

const numberFormatter = new Intl.NumberFormat("pt-BR");

type OperationsKpisProps = {
  overview: OperationsOverview;
};

export function OperationsKpis({ overview }: OperationsKpisProps) {
  const { queue, videos, storage } = overview;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <ListOrdered className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Fila de vídeo</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {numberFormatter.format(queue.waiting + queue.active)}
            </div>
            <Badge variant={queue.failed > 0 ? "destructive" : "outline"}>{queue.failed} falhas</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {queue.waiting} aguardando · {queue.active} em execução
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Clapperboard className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Vídeos na plataforma</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {numberFormatter.format(videos.total)}
            </div>
            <Badge variant="outline">+{numberFormatter.format(videos.uploadedLast30Days)} / 30d</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {videos.processed} processados · {videos.processing} em processamento
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <AlertTriangle className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Falhas de processamento</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {numberFormatter.format(videos.failed)}
            </div>
            <Badge variant={videos.failed > 0 ? "destructive" : "default"}>
              {videos.failed > 0 ? "Atenção" : "OK"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Mídias com status FAILED no banco</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <HardDrive className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Armazenamento registrado</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
            {formatBytes(storage.totalBytes)}
          </div>
          <p className="text-muted-foreground text-sm">
            Vídeos {formatBytes(storage.mediaBytes)} · anexos {formatBytes(storage.attachmentBytes)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
