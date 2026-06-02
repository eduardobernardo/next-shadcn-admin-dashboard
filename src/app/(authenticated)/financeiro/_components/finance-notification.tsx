import Link from "next/link";

import { AlertTriangle, ArrowRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { FinanceAlert } from "@/lib/finance-overview";
import { resolveFinanceAlertActionHref } from "@/lib/organization-filters";

type FinanceNotificationProps = {
  alert: FinanceAlert | null;
};

function AlertIcon({ severity }: { severity: FinanceAlert["severity"] }) {
  if (severity === "critical") return <AlertTriangle className="text-destructive" />;
  if (severity === "warning") return <AlertTriangle className="text-amber-600" />;
  return <Info />;
}

export function FinanceNotification({ alert }: FinanceNotificationProps) {
  if (!alert) return null;

  const actionHref = resolveFinanceAlertActionHref(alert);

  return (
    <Item className="rounded-xl" variant="outline">
      <ItemMedia variant="icon">
        <AlertIcon severity={alert.severity} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{alert.title}</ItemTitle>
        <ItemDescription>{alert.description}</ItemDescription>
      </ItemContent>
      {actionHref ? (
        <ItemActions>
          <Button size="sm" variant="outline" asChild>
            <Link href={actionHref}>
              Ver organizações
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </ItemActions>
      ) : null}
    </Item>
  );
}
