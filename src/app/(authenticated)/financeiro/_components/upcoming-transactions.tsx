"use client";

import Link from "next/link";

import { parseISO } from "date-fns";
import { CalendarClock, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { formatFinanceCurrency, formatInvoiceStatus } from "@/lib/finance-formatters";
import type { FinanceUpcomingInvoice } from "@/lib/finance-overview";
import { getInitials } from "@/lib/utils";

type UpcomingTransactionsProps = {
  invoices: FinanceUpcomingInvoice[];
  totalCents: number;
};

function formatDueDate(value: string | null) {
  if (!value) return "Sem vencimento";
  return parseISO(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UpcomingTransactions({ invoices, totalCents }: UpcomingTransactionsProps) {
  const [whole, fraction = "00"] = formatFinanceCurrency(totalCents).replace("R$", "").trim().split(",");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Próximos vencimentos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-baseline text-3xl leading-none tracking-tight">
              <span className="font-normal">R$ {whole}</span>
              <span className="text-muted-foreground text-xl">,{fraction}</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-none">
              Você tem <span className="font-medium text-foreground">{invoices.length}</span>{" "}
              {invoices.length === 1 ? "cobrança" : "cobranças"} nos próximos 30 dias
            </p>
          </div>
          {invoices[0] ? (
            <div className="flex w-max items-center gap-2 rounded-md border border-border bg-muted/50 px-2 py-1.5 text-sm">
              <CalendarClock className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Próxima cobrança:{" "}
                <span className="font-medium text-foreground">{formatDueDate(invoices[0].dueAt)}</span>
              </span>
            </div>
          ) : null}
        </div>

        <ItemGroup>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <Item key={invoice.id} variant="outline" size="xs" asChild>
                <Link href={`/organizacoes/${invoice.organizationId}`}>
                  <ItemMedia>
                    <div className="grid size-9 place-items-center rounded-md border bg-background font-medium text-xs">
                      {getInitials(invoice.organizationName)}
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{invoice.organizationName}</ItemTitle>
                    <ItemDescription>
                      {formatInvoiceStatus(invoice.status)} · {formatDueDate(invoice.dueAt)}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="font-medium text-sm tabular-nums">
                      {formatFinanceCurrency(invoice.netAmountCents)}
                    </span>
                    <ChevronRight className="size-5 text-muted-foreground" />
                  </ItemActions>
                </Link>
              </Item>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">Nenhuma cobrança pendente nos próximos 30 dias.</p>
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
