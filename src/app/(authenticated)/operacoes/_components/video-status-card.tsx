import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OperationsVideoStatusSlice } from "@/lib/operations-overview";
import { formatLabel } from "@/lib/saas-formatters";

const numberFormatter = new Intl.NumberFormat("pt-BR");

type VideoStatusCardProps = {
  byStatus: OperationsVideoStatusSlice[];
  total: number;
};

export function VideoStatusCard({ byStatus, total }: VideoStatusCardProps) {
  const maxCount = Math.max(...byStatus.map((slice) => slice.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">Vídeos por status</CardTitle>
        <CardDescription>{numberFormatter.format(total)} mídias cadastradas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {byStatus.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma mídia cadastrada.</p>
        ) : (
          byStatus.map((slice) => {
            const widthPercent = Math.max(4, Math.round((slice.count / maxCount) * 100));

            return (
              <div key={slice.status} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{formatLabel(slice.status)}</span>
                  <span className="text-muted-foreground tabular-nums">{numberFormatter.format(slice.count)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${widthPercent}%` }} />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
