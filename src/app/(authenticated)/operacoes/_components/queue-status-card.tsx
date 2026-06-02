import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OperationsQueueStats } from "@/lib/operations-overview";

const numberFormatter = new Intl.NumberFormat("pt-BR");

const queueLabels: Record<keyof OperationsQueueStats, string> = {
  waiting: "Aguardando",
  active: "Em execução",
  completed: "Concluídos",
  failed: "Falhas",
  delayed: "Atrasados",
};

type QueueStatusCardProps = {
  queue: OperationsQueueStats;
};

export function QueueStatusCard({ queue }: QueueStatusCardProps) {
  const entries = Object.entries(queue) as Array<[keyof OperationsQueueStats, number]>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">Jobs de processamento de vídeo</CardTitle>
        <CardDescription>Fila BullMQ `video-processing` (Redis)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {entries.map(([key, value]) => (
            <div key={key} className="rounded-lg border bg-muted/30 px-3 py-2">
              <p className="text-muted-foreground text-xs">{queueLabels[key]}</p>
              <p className="font-medium text-2xl tabular-nums">{numberFormatter.format(value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
