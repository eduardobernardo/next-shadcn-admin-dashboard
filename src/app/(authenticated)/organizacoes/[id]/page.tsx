import Link from "next/link";

import { ArrowLeft, Edit } from "lucide-react";

import { FeedbackAlert } from "@/components/feedback-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getSaasOrganizationDetail, getSaasPlans } from "@/http/saas-billing";
import { formatBytes, formatCurrencyFromCents, formatDateTime, formatLabel, getFeedback } from "@/lib/saas-formatters";

import { applyImmediatePlanChangeAction, createOverrideAction, createTrialOverrideAction } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrganizacaoDetalhePage({ params, searchParams }: Props) {
  const [{ id }, detail, { plans }, resolvedSearchParams] = await Promise.all([
    params,
    params.then(({ id: organizationId }) => getSaasOrganizationDetail(organizationId).catch(() => null)),
    getSaasPlans().catch(() => ({ plans: [] })),
    searchParams ?? Promise.resolve({}),
  ]);

  const feedback = getFeedback(resolvedSearchParams);

  if (!detail) {
    return (
      <div className="flex flex-col gap-8">
        <Link
          href="/organizacoes"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para Organizações
        </Link>
        <p className="text-muted-foreground">Não foi possível carregar a organização.</p>
      </div>
    );
  }

  const billingProfile = detail.overview.billingProfile;
  const usageMetrics = detail.overview.usageSnapshot?.metrics ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Link
            href="/organizacoes"
            className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar para Organizações
          </Link>
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">{detail.organization.name}</h1>
            <p className="text-muted-foreground text-sm">
              {detail.organization.slug} • {formatLabel(detail.organization.organizationProfileType)} •{" "}
              {formatLabel(detail.organization.learningMode)}
            </p>
          </div>
        </div>

        <Button asChild size="sm">
          <Link href={`/organizacoes/${id}/edit`}>
            <Edit className="mr-2 size-4" />
            Editar organização
          </Link>
        </Button>
      </div>

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <section>
        <h2 className="font-semibold text-base tracking-tight">Assinatura atual</h2>
        <p className="mb-4 text-muted-foreground text-sm">Estado comercial e financeiro da organização.</p>

        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Plano</dt>
            <dd className="font-medium">{detail.overview.planName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Status</dt>
            <dd className="font-medium">{formatLabel(detail.overview.status)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Acesso</dt>
            <dd className="font-medium">{formatLabel(detail.overview.accessMode)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Cobrança</dt>
            <dd className="font-medium">{formatLabel(detail.overview.billingCycle)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Pagamento</dt>
            <dd className="font-medium">{formatLabel(detail.overview.defaultPaymentMethod)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Fim do trial</dt>
            <dd className="font-medium">{formatDateTime(detail.overview.trialEndsAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Próximo corte</dt>
            <dd className="font-medium">{formatDateTime(detail.overview.currentPeriodEndAt)}</dd>
          </div>
        </dl>
      </section>

      {billingProfile ? (
        <>
          <Separator />
          <section>
            <h2 className="font-semibold text-base tracking-tight">Perfil de cobrança</h2>
            <div className="mt-3 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">Responsável</dt>
                <dd className="font-medium">{billingProfile.nameOrCorporateName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">Documento</dt>
                <dd className="font-medium">{billingProfile.cpfCnpj}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">Email financeiro</dt>
                <dd className="font-medium">{billingProfile.financialEmail}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">Telefone</dt>
                <dd className="font-medium">{billingProfile.phone}</dd>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <Separator />

      <section>
        <h2 className="font-semibold text-base tracking-tight">Uso dos recursos</h2>
        <p className="mb-4 text-muted-foreground text-sm">Consumo atual versus limites do plano.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {usageMetrics.map((metric: any) => (
            <div key={metric.key} className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">{metric.label}</p>
              <p className="font-semibold text-lg">
                {metric.unit === "BYTES" ? formatBytes(metric.used) : (metric.used ?? "-")}
              </p>
              <p className="text-muted-foreground text-sm">
                de {metric.unit === "BYTES" ? formatBytes(metric.limit) : (metric.limit ?? "-")}
              </p>
            </div>
          ))}
        </div>

        {detail.overview.planEntitlements?.length > 0 ? (
          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Benefícios incluídos
            </h3>
            <div className="flex flex-wrap gap-2">
              {detail.overview.planEntitlements.map((item: any) => (
                <span
                  key={item.key}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    item.included
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-border bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <Separator />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-semibold text-base tracking-tight">Troca de plano</h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Aplica novo plano imediatamente, com ajuste de cobrança no próximo ciclo.
          </p>

          <form action={applyImmediatePlanChangeAction.bind(null, id)} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="planSlug">Plano</Label>
              <select
                id="planSlug"
                name="planSlug"
                defaultValue={detail.overview.planSlug}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {plans.map((plan: any) => (
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
                defaultValue={detail.overview.billingCycle}
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

        <section>
          <h2 className="font-semibold text-base tracking-tight">Override de trial</h2>
          <p className="mb-4 text-muted-foreground text-sm">Libera trial manual para um email específico.</p>

          <form action={createTrialOverrideAction.bind(null, id)} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="usuario@empresa.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reason">Motivo</Label>
              <Textarea id="reason" name="reason" placeholder="Contexto da exceção aprovada." required />
            </div>
            <Button type="submit" size="sm" className="w-fit">
              Criar override
            </Button>
          </form>
        </section>
      </div>

      <section>
        <h2 className="font-semibold text-base tracking-tight">Override customizado</h2>
        <p className="mb-4 text-muted-foreground text-sm">Use apenas quando o plano padrão não atende a necessidade.</p>

        <form action={createOverrideAction.bind(null, id)} className="grid gap-4 lg:grid-cols-2">
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
              <Label htmlFor="reason">Motivo</Label>
              <Textarea id="reason" name="reason" placeholder="Explique a exceção." required />
            </div>
            <Button type="submit" size="sm" className="w-fit">
              Criar override
            </Button>
          </div>
        </form>
      </section>

      <Separator />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-semibold text-base tracking-tight">Últimas faturas</h2>

          <div className="space-y-3">
            {(detail.overview.invoices ?? []).slice(0, 5).map((invoice: any) => (
              <div key={invoice.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{formatCurrencyFromCents(invoice.netAmountCents)}</span>
                <span className="text-muted-foreground">{formatLabel(invoice.status)}</span>
                <span className="text-muted-foreground">{formatDateTime(invoice.dueAt)}</span>
              </div>
            ))}
            {(detail.overview.invoices ?? []).length === 0 ? (
              <p className="text-muted-foreground text-sm">Sem faturas registradas.</p>
            ) : null}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-base tracking-tight">Histórico de mudanças</h2>

          <div className="space-y-3">
            {detail.planHistory.slice(0, 5).map((entry: any) => (
              <div key={entry.id} className="text-sm">
                <p className="font-medium">
                  {entry.fromPlanVersion.plan.slug} → {entry.toPlanVersion.plan.slug}
                </p>
                <p className="text-muted-foreground">
                  {formatLabel(entry.status)} • {formatDateTime(entry.effectiveAt)}
                </p>
              </div>
            ))}
            {detail.planHistory.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sem mudanças de plano registradas.</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
