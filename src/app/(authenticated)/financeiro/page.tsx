import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSaasFinanceOverview } from "@/http/saas-billing";

import { BalanceDistributionCard } from "./_components/balance-distribution-card";
import { FinanceNotification } from "./_components/finance-notification";
import { IncomeBreakdown } from "./_components/income-breakdown";
import { OverviewKpis } from "./_components/overview-kpis";
import { QuickActions } from "./_components/quick-actions";
import { TransactionsOverviewCard } from "./_components/transactions-overview-card";
import { UpcomingTransactions } from "./_components/upcoming-transactions";
import { Wallet } from "./_components/wallet";

export default async function FinanceiroPage() {
  const overview = await getSaasFinanceOverview().catch(() => null);
  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const updatedAt = overview ? format(new Date(overview.generatedAt), "HH:mm", { locale: ptBR }) : null;

  const upcomingTotalCents =
    overview?.upcomingInvoices.reduce((total, invoice) => total + invoice.netAmountCents, 0) ?? 0;

  if (!overview) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        Não foi possível carregar o painel financeiro.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground text-sm capitalize">{formattedDate}</p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList variant="line">
            <TabsTrigger value="overview">Visão geral</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
            <TabsTrigger value="projections">Projeções</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3">
            {updatedAt ? (
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <RotateCw className="size-4" />
                <span>Atualizado às {updatedAt}</span>
              </div>
            ) : null}
            <Button size="sm" variant="outline" asChild>
              <a href="/organizacoes">
                <Download />
                Ver organizações
              </a>
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <OverviewKpis kpis={overview.kpis} />
            </div>

            <div className="flex flex-col gap-4 xl:col-span-6">
              <IncomeBreakdown revenueByPlan={overview.revenueByPlan} />
              <FinanceNotification alert={overview.primaryAlert} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TransactionsOverviewCard timeline={overview.cashflowTimeline} />
            </div>
            <div className="xl:col-span-5">
              <BalanceDistributionCard distribution={overview.invoiceStatusDistribution} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <Wallet organizations={overview.topOrganizationsByPaidMonth} />
            </div>
            <div className="xl:col-span-4">
              <UpcomingTransactions invoices={overview.upcomingInvoices} totalCents={upcomingTotalCents} />
            </div>
            <div className="xl:col-span-4">
              <QuickActions />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <BalanceDistributionCard distribution={overview.invoiceStatusDistribution} />
            </div>
            <div className="xl:col-span-5">
              <UpcomingTransactions invoices={overview.upcomingInvoices} totalCents={upcomingTotalCents} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projections">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <OverviewKpis kpis={overview.kpis} />
            </div>
            <div className="xl:col-span-6">
              <IncomeBreakdown revenueByPlan={overview.revenueByPlan} />
            </div>
            <div className="col-span-full">
              <TransactionsOverviewCard timeline={overview.cashflowTimeline} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
