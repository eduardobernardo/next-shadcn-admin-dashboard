import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { RecentCustomerRow } from "./recent-customers-table/schema";
import { RecentCustomersTable } from "./recent-customers-table/table";

type SubscriberOverviewProps = {
  customers: RecentCustomerRow[];
};

export function SubscriberOverview({ customers }: SubscriberOverviewProps) {
  const countLabel = `${customers.length.toLocaleString("pt-BR")} ${
    customers.length === 1 ? "Organização" : "Organizações"
  }`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">{countLabel}</CardTitle>
        <CardDescription>
          Registros recentes com plano, cobrança, status e data de entrada na plataforma.
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link href="/organizacoes">
              Ver todas
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        <RecentCustomersTable data={customers} />
      </CardContent>
    </Card>
  );
}
