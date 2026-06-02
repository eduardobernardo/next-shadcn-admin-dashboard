import Link from "next/link";

import { Building2, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatFinanceCurrency } from "@/lib/finance-formatters";
import type { FinanceTopOrganization } from "@/lib/finance-overview";
import { getInitials } from "@/lib/utils";

type WalletProps = {
  organizations: FinanceTopOrganization[];
};

export function Wallet({ organizations }: WalletProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Maiores receitas do mês</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {organizations.length > 0 ? (
          organizations.map((organization, index) => (
            <div key={organization.organizationId}>
              <Link
                href={`/organizacoes/${organization.organizationId}`}
                className="flex items-center justify-between gap-3 rounded-lg transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border bg-muted font-medium text-sm">
                    {getInitials(organization.organizationName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-sm">{organization.organizationName}</p>
                    <p className="text-muted-foreground text-xs">Organização</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium tabular-nums text-sm">
                    {formatFinanceCurrency(organization.paidCents)}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </Link>
              {index < organizations.length - 1 ? <Separator className="mt-4" /> : null}
            </div>
          ))
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <Building2 className="size-4" />
            Nenhum pagamento registrado neste mês.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
