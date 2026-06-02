import { CircleDollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrganizationBillingOverview, OrganizationInvoice } from "@/lib/organization-detail";
import { formatCurrencyFromCents, formatDateTime, formatLabel } from "@/lib/saas-formatters";

function summarizeInvoices(invoices: OrganizationInvoice[]) {
  const overdue = invoices.filter((invoice) => invoice.status === "OVERDUE");
  const pending = invoices.filter((invoice) => invoice.status === "PENDING");
  const paid = invoices.filter((invoice) => invoice.status === "PAID");

  return {
    overdueCount: overdue.length,
    pendingCount: pending.length,
    paidCount: paid.length,
    overdueAmountCents: overdue.reduce((sum, invoice) => sum + invoice.netAmountCents, 0),
    pendingAmountCents: pending.reduce((sum, invoice) => sum + invoice.netAmountCents, 0),
  };
}

type OrganizationFinancialSectionProps = {
  overview: OrganizationBillingOverview;
};

export function OrganizationFinancialSection({ overview }: OrganizationFinancialSectionProps) {
  const invoices = overview.invoices ?? [];
  const summary = summarizeInvoices(invoices);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CircleDollarSign className="size-4 text-muted-foreground" />
          Situação financeira
        </CardTitle>
        <CardDescription>Plano contratado, ciclo de cobrança e saúde das faturas recentes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Plano</dt>
            <dd className="font-medium">{overview.planName}</dd>
            <dd className="text-muted-foreground text-xs">{overview.planSlug}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Ciclo</dt>
            <dd className="font-medium">{formatLabel(overview.billingCycle)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Pagamento</dt>
            <dd className="font-medium">{formatLabel(overview.defaultPaymentMethod)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Próximo ciclo</dt>
            <dd className="font-medium">{formatDateTime(overview.currentPeriodEndAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Fim do trial</dt>
            <dd className="font-medium">{formatDateTime(overview.trialEndsAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Carência até</dt>
            <dd className="font-medium">{formatDateTime(overview.graceEndsAt)}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2">
          <Badge variant={summary.overdueCount > 0 ? "destructive" : "outline"}>{summary.overdueCount} em atraso</Badge>
          <Badge variant="outline">{summary.pendingCount} pendentes</Badge>
          <Badge variant="outline">{summary.paidCount} pagas</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">Valor em atraso</p>
            <p className="mt-1 font-semibold text-lg">{formatCurrencyFromCents(summary.overdueAmountCents)}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">Valor pendente</p>
            <p className="mt-1 font-semibold text-lg">{formatCurrencyFromCents(summary.pendingAmountCents)}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium text-sm">Últimas faturas</h3>
          <div className="space-y-2">
            {invoices.slice(0, 6).map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <span className="font-medium">{formatCurrencyFromCents(invoice.netAmountCents)}</span>
                <Badge variant={invoice.status === "OVERDUE" ? "destructive" : "outline"}>
                  {formatLabel(invoice.status)}
                </Badge>
                <span className="text-muted-foreground text-xs">venc. {formatDateTime(invoice.dueAt)}</span>
              </div>
            ))}
            {invoices.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sem faturas registradas para esta organização.</p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
