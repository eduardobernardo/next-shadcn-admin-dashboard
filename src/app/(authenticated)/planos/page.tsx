import Link from "next/link";

import { Plus } from "lucide-react";

import { FeedbackAlert } from "@/components/feedback-alert";
import { Button } from "@/components/ui/button";
import { getSaasPlans } from "@/http/saas-billing";
import { getFeedback } from "@/lib/saas-formatters";

import { PlansList } from "./_components/plans-list";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlanosPage({ searchParams }: Props) {
  const [{ plans }, resolvedSearchParams] = await Promise.all([
    getSaasPlans().catch(() => ({ plans: [] })),
    searchParams ?? Promise.resolve({}),
  ]);

  const feedback = getFeedback(resolvedSearchParams);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl tracking-tight">Planos</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os planos de assinatura, preços e limites da plataforma
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
            <Link href="/planos/nova-versao">
              <Plus className="size-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Nova versão</span>
            </Link>
          </Button>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/planos/novo">
              <Plus className="size-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Novo plano</span>
            </Link>
          </Button>
        </div>
      </div>

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <PlansList plans={plans} />
    </div>
  );
}
