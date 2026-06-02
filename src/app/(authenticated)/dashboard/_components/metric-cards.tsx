import { DollarSign, TrendingDown, TrendingUp, UserPlus, Users, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardKpis } from "@/lib/dashboard-overview";

const numberFormatter = new Intl.NumberFormat("pt-BR");

type MetricCardsProps = {
  kpis: DashboardKpis;
};

function TrendBadge({ value }: { value: number }) {
  const isPositive = value >= 0;

  return (
    <Badge variant={isPositive ? "default" : "destructive"}>
      {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {isPositive ? "+" : ""}
      {value}%
    </Badge>
  );
}

export function MetricCards({ kpis }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <DollarSign className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Organizações</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {numberFormatter.format(kpis.totalOrganizations)}
            </div>
            <TrendBadge value={kpis.totalOrganizationsChangePercent} />
          </div>
          <p className="text-muted-foreground text-sm">{kpis.activeRate}% com assinatura ativa ou em trial</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <UserPlus className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Em trial</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {numberFormatter.format(kpis.trialingOrganizations)}
            </div>
            <Badge variant={kpis.trialingOrganizations === 0 ? "destructive" : "default"}>{kpis.trialShare}%</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Organizações no período de avaliação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Users className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Contas ativas</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {numberFormatter.format(kpis.activeOrganizations)}
            </div>
            <Badge>
              <TrendingUp className="size-3" />
              {kpis.activeRate}%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Assinaturas com status ACTIVE</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Waves className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Planos publicados</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">
              {numberFormatter.format(kpis.publishedPlans)}
            </div>
            <Badge>
              <TrendingUp className="size-3" />
              {kpis.publishedPlanShare}%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {kpis.totalPlans} {kpis.totalPlans === 1 ? "plano" : "planos"} · {kpis.activeCoupons} cupons ativos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
