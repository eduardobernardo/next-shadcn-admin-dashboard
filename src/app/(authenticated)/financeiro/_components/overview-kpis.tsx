import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFinanceCurrency } from "@/lib/finance-formatters";
import type { FinanceOverviewKpis } from "@/lib/finance-overview";

type OverviewKpisProps = {
  kpis: FinanceOverviewKpis;
};

export function OverviewKpis({ kpis }: OverviewKpisProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="grid grid-cols-1 xl:grid-cols-8">
        <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 border-b ring-0 xl:col-span-4 xl:border-r">
          <CardHeader>
            <CardTitle className="font-normal">MRR estimado</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-3xl leading-none tracking-tight">
                {formatFinanceCurrency(kpis.estimatedMrrCents, true)}
              </div>
              <p className="text-muted-foreground text-xs">
                ARR {formatFinanceCurrency(kpis.estimatedArrCents, true)} · {kpis.trialingSubscriptions} em trial
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
              {kpis.activeSubscriptions} ativas
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 border-b ring-0 xl:col-span-4">
          <CardHeader>
            <CardTitle className="font-normal">Recebido no mês</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-3xl leading-none tracking-tight">
                {formatFinanceCurrency(kpis.paidThisMonthCents, true)}
              </div>
              <p className="text-muted-foreground text-xs">
                {kpis.paidThisMonthCount} {kpis.paidThisMonthCount === 1 ? "fatura paga" : "faturas pagas"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 ring-0 xl:col-span-4 xl:border-r">
          <CardHeader>
            <CardTitle className="font-normal">Pendente</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-3xl leading-none tracking-tight">
                {formatFinanceCurrency(kpis.pendingTotalCents, true)}
              </div>
              <p className="text-muted-foreground text-xs">
                {kpis.pendingCount} {kpis.pendingCount === 1 ? "fatura" : "faturas"} aguardando pagamento
              </p>
            </div>
            {kpis.pendingCount > 0 ? <Badge variant="outline">{kpis.pendingCount} em aberto</Badge> : null}
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 ring-0 xl:col-span-4">
          <CardHeader>
            <CardTitle className="font-normal">Em atraso</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-3xl leading-none tracking-tight">
                {formatFinanceCurrency(kpis.overdueTotalCents, true)}
              </div>
              <p className="text-muted-foreground text-xs">
                {kpis.overdueCount} {kpis.overdueCount === 1 ? "fatura vencida" : "faturas vencidas"}
              </p>
            </div>
            <Badge
              variant={kpis.overdueCount > 0 ? "destructive" : "default"}
              className={kpis.overdueCount > 0 ? "bg-destructive/10 text-destructive" : undefined}
            >
              {kpis.overdueCount > 0 ? "Atenção" : "OK"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
