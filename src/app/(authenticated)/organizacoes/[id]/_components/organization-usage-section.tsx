import { Activity } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrganizationControlSnapshot, PlanUsageMetric } from "@/lib/organization-detail";
import { formatBytes, formatLabel } from "@/lib/saas-formatters";
import { cn } from "@/lib/utils";

const numberFormatter = new Intl.NumberFormat("pt-BR");

function formatMetricValue(metric: PlanUsageMetric) {
  if (metric.used === null) {
    return "—";
  }

  return metric.unit === "BYTES" ? formatBytes(metric.used) : numberFormatter.format(metric.used);
}

function formatMetricLimit(metric: PlanUsageMetric) {
  if (metric.limit === null) {
    return "—";
  }

  return metric.unit === "BYTES" ? formatBytes(metric.limit) : numberFormatter.format(metric.limit);
}

function usagePercent(metric: PlanUsageMetric) {
  if (metric.used === null || metric.limit === null || metric.limit <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((metric.used / metric.limit) * 100));
}

const stateBarStyles: Record<string, string> = {
  OK: "bg-emerald-500",
  WARNING: "bg-amber-500",
  EXHAUSTED: "bg-rose-500",
  UNAVAILABLE: "bg-muted-foreground/40",
};

type OrganizationUsageSectionProps = {
  metrics: PlanUsageMetric[];
  snapshot: OrganizationControlSnapshot;
};

export function OrganizationUsageSection({ metrics, snapshot }: OrganizationUsageSectionProps) {
  const { counts, storage } = snapshot;

  const operationalRows = [
    { label: "Anexos", value: numberFormatter.format(counts.attachments) },
    { label: "Certificados emitidos", value: numberFormatter.format(counts.certificatesIssued) },
    { label: "Convites pendentes", value: numberFormatter.format(counts.pendingInvites) },
    { label: "Vídeos com falha", value: numberFormatter.format(counts.videosFailed) },
    { label: "Armazenamento em certificados", value: formatBytes(storage.certificateBytes) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4 text-muted-foreground" />
          Uso e limites do plano
        </CardTitle>
        <CardDescription>Consumo atual frente aos limites contratados e métricas operacionais.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => {
            const percent = usagePercent(metric);
            const barClass = stateBarStyles[metric.state ?? "OK"] ?? stateBarStyles.OK;

            return (
              <div key={metric.key} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">{metric.label}</p>
                  {metric.state ? (
                    <span className="text-muted-foreground text-xs">{formatLabel(metric.state)}</span>
                  ) : null}
                </div>
                <p className="font-semibold text-xl tabular-nums">
                  {formatMetricValue(metric)}{" "}
                  <span className="font-normal text-muted-foreground text-sm">/ {formatMetricLimit(metric)}</span>
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", barClass)}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-muted-foreground text-xs">{percent}% do limite utilizado</p>
              </div>
            );
          })}
        </div>

        <div>
          <h3 className="mb-3 font-medium text-sm">Detalhes operacionais</h3>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {operationalRows.map((row) => (
              <div key={row.label} className="rounded-lg border bg-muted/15 px-3 py-2">
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">{row.label}</dt>
                <dd className="mt-1 font-medium text-sm tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
