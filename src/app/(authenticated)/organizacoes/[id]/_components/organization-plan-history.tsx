import { History } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrganizationDetail } from "@/lib/organization-detail";
import { formatDateTime, formatLabel } from "@/lib/saas-formatters";

type OrganizationPlanHistoryProps = {
  planHistory: OrganizationDetail["planHistory"];
};

export function OrganizationPlanHistory({ planHistory }: OrganizationPlanHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="size-4 text-muted-foreground" />
          Histórico de planos
        </CardTitle>
        <CardDescription>Mudanças de plano registradas para esta organização.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {planHistory.slice(0, 8).map((entry) => (
          <div key={entry.id} className="rounded-lg border px-3 py-2 text-sm">
            <p className="font-medium">
              {entry.fromPlanVersion.plan.slug} → {entry.toPlanVersion.plan.slug}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatLabel(entry.status)} · {formatDateTime(entry.effectiveAt)}
            </p>
          </div>
        ))}
        {planHistory.length === 0 ? (
          <p className="text-muted-foreground text-sm">Sem mudanças de plano registradas.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
