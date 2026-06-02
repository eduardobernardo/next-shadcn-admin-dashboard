import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OrganizationBillingOverview } from "@/lib/organization-detail";

import { applyImmediatePlanChangeAction, createOverrideAction, createTrialOverrideAction } from "../actions";

type SaasPlan = {
  id: string;
  slug: string;
  name: string;
};

type OrganizationAdminActionsProps = {
  organizationId: string;
  overview: OrganizationBillingOverview;
  plans: SaasPlan[];
};

export function OrganizationAdminActions({ organizationId, overview, plans }: OrganizationAdminActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ações administrativas</CardTitle>
        <CardDescription>Operações sensíveis de billing e exceções manuais.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div>
            <h3 className="font-medium text-sm">Troca de plano imediata</h3>
            <p className="text-muted-foreground text-sm">Aplica novo plano com ajuste no próximo ciclo.</p>
          </div>
          <form action={applyImmediatePlanChangeAction.bind(null, organizationId)} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="planSlug">Plano</Label>
              <select
                id="planSlug"
                name="planSlug"
                defaultValue={overview.planSlug}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.slug}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="billingCycle">Ciclo de cobrança</Label>
              <select
                id="billingCycle"
                name="billingCycle"
                defaultValue={overview.billingCycle}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="MONTHLY">Mensal</option>
                <option value="ANNUAL">Anual</option>
              </select>
            </div>
            <Button type="submit" size="sm" className="w-fit">
              Aplicar troca
            </Button>
          </form>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="font-medium text-sm">Override de trial</h3>
            <p className="text-muted-foreground text-sm">Libera trial manual para um e-mail específico.</p>
          </div>
          <form action={createTrialOverrideAction.bind(null, organizationId)} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="trial-email">E-mail</Label>
              <Input id="trial-email" name="email" placeholder="usuario@empresa.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="trial-reason">Motivo</Label>
              <Textarea id="trial-reason" name="reason" placeholder="Contexto da exceção aprovada." required />
            </div>
            <Button type="submit" size="sm" className="w-fit">
              Criar override
            </Button>
          </form>
        </section>

        <section className="space-y-4 lg:col-span-2">
          <div>
            <h3 className="font-medium text-sm">Override customizado</h3>
            <p className="text-muted-foreground text-sm">Use apenas quando o plano padrão não atende.</p>
          </div>
          <form action={createOverrideAction.bind(null, organizationId)} className="grid gap-4 lg:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="scopeType">Tipo de escopo</Label>
                <select
                  id="scopeType"
                  name="scopeType"
                  defaultValue="BOOLEAN_ENTITLEMENT"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="BOOLEAN_ENTITLEMENT">Booleano</option>
                  <option value="QUANTITATIVE_LIMIT">Limite quantitativo</option>
                  <option value="TRIAL_ELIGIBILITY">Elegibilidade de trial</option>
                  <option value="PLAN_LOCK">Bloqueio de plano</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scopeKey">Chave</Label>
                <Input id="scopeKey" name="scopeKey" placeholder="certificates" required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="valueJson">Valor (JSON)</Label>
                <Textarea
                  id="valueJson"
                  name="valueJson"
                  placeholder='{"enabled":true}'
                  defaultValue="{}"
                  className="min-h-32 font-mono text-xs"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="durationType">Duração</Label>
                <select
                  id="durationType"
                  name="durationType"
                  defaultValue="PERMANENT"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="PERMANENT">Permanente</option>
                  <option value="TEMPORARY">Temporário</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="override-reason">Motivo</Label>
                <Textarea id="override-reason" name="reason" placeholder="Explique a exceção." required />
              </div>
              <Button type="submit" size="sm" className="w-fit">
                Criar override
              </Button>
            </div>
          </form>
        </section>
      </CardContent>
    </Card>
  );
}
