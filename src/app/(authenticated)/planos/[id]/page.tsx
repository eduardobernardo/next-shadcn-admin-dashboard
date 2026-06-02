import Link from "next/link";

import { ArrowLeft, Edit } from "lucide-react";

import { FeedbackAlert } from "@/components/feedback-alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSaasPlans } from "@/http/saas-billing";
import { formatBytes, formatCurrencyFromCents, formatDateTime, formatLabel, getFeedback } from "@/lib/saas-formatters";

import { publishPlanVersionAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlanoDetalhePage({ params, searchParams }: Props) {
  const [{ id }, { plans }, resolvedSearchParams] = await Promise.all([
    params,
    getSaasPlans().catch(() => ({ plans: [] })),
    searchParams ?? Promise.resolve({}),
  ]);

  const plan = plans.find((item: any) => item.id === id);
  const feedback = getFeedback(resolvedSearchParams);

  if (!plan) {
    return (
      <div className="flex flex-col gap-8">
        <Link
          href="/planos"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para Planos
        </Link>
        <p className="text-muted-foreground">Não foi possível carregar o plano.</p>
      </div>
    );
  }

  const draftVersions = plan.versions.filter((version: any) => version.status === "DRAFT");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Link
            href="/planos"
            className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar para Planos
          </Link>
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">{plan.name}</h1>
            <p className="text-muted-foreground text-sm">
              {plan.slug} • {plan.salesMode === "SELF_SERVICE" ? "Self Service" : "Assistido"} •{" "}
              {plan.visibility === "PUBLIC" ? "Público" : "Oculto"}
            </p>
          </div>
        </div>

        <Button asChild size="sm">
          <Link href={`/planos/${plan.id}/edit`}>
            <Edit className="mr-2 size-4" />
            Editar plano
          </Link>
        </Button>
      </div>

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <section>
        <h2 className="font-semibold text-base tracking-tight">Informações do plano</h2>
        <p className="mb-4 text-muted-foreground text-sm">Identidade e configuração do plano no catálogo.</p>

        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Slug</dt>
            <dd className="font-medium">{plan.slug}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Ordem</dt>
            <dd className="font-medium">{plan.displayOrder}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Modo de venda</dt>
            <dd className="font-medium">{formatLabel(plan.salesMode)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Visibilidade</dt>
            <dd className="font-medium">{formatLabel(plan.visibility)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wider">Destaque</dt>
            <dd className="font-medium">{plan.highlighted ? "Sim" : "Não"}</dd>
          </div>
        </dl>
      </section>

      <Separator />

      <section>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-base tracking-tight">Versões</h2>
            <p className="text-muted-foreground text-sm">
              {plan.versions.length} {plan.versions.length === 1 ? "versão" : "versões"} cadastradas
              {draftVersions.length > 0
                ? ` (${draftVersions.length} draft${draftVersions.length > 1 ? "s" : ""} pendente${draftVersions.length > 1 ? "s" : ""})`
                : ""}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {plan.versions.map((version: any) => (
            <article key={version.id} className="space-y-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">Versão {version.versionNumber}</h3>
                    <span className="rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground uppercase tracking-wider">
                      {version.status}
                    </span>
                    {version.immutableAfterUse ? (
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] text-sky-700 uppercase tracking-wider">
                        Travada por uso
                      </span>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground text-sm">{version.marketingDescription}</p>
                </div>

                {version.status === "DRAFT" ? (
                  <form action={publishPlanVersionAction}>
                    <input type="hidden" name="planVersionId" value={version.id} />
                    <input type="hidden" name="returnTo" value={`/planos/${plan.id}`} />
                    <Button variant="outline" size="sm" type="submit">
                      Publicar versão
                    </Button>
                  </form>
                ) : null}
              </div>

              <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Mensal</dt>
                  <dd className="font-medium">{formatCurrencyFromCents(version.monthlyPriceCents)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Anual</dt>
                  <dd className="font-medium">{formatCurrencyFromCents(version.annualPriceCents)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">CTA</dt>
                  <dd className="font-medium">{version.ctaLabel || "-"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Publicada em</dt>
                  <dd className="font-medium">{formatDateTime(version.publishedAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Membros</dt>
                  <dd className="font-medium">{version.membersLimit}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Admins</dt>
                  <dd className="font-medium">{version.adminsLimit}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Cursos</dt>
                  <dd className="font-medium">{version.coursesLimit}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Aulas</dt>
                  <dd className="font-medium">{version.lessonsLimit}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wider">Armazenamento</dt>
                  <dd className="font-medium">{formatBytes(version.storageBytesLimit)}</dd>
                </div>
              </dl>

              <div className="grid gap-4 xl:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Entitlements
                  </h4>
                  <pre className="overflow-auto whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 font-mono text-xs">
                    {JSON.stringify(version.entitlements, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Badges</h4>
                  <p className="text-muted-foreground text-sm">
                    {Array.isArray(version.publicBadges) && version.publicBadges.length > 0
                      ? version.publicBadges.join(", ")
                      : "Sem badges configuradas"}
                  </p>
                </div>
              </div>

              <Separator />
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="font-semibold text-base tracking-tight">Histórico de versões</h2>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                  Versão
                </TableHead>
                <TableHead className="font-semibold text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                  Mensal
                </TableHead>
                <TableHead className="font-semibold text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                  Anual
                </TableHead>
                <TableHead className="font-semibold text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                  Armazenamento
                </TableHead>
                <TableHead className="font-semibold text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                  Publicada em
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.versions.map((version: any) => (
                <TableRow key={version.id}>
                  <TableCell className="font-medium">v{version.versionNumber}</TableCell>
                  <TableCell>{version.status}</TableCell>
                  <TableCell>{formatCurrencyFromCents(version.monthlyPriceCents)}</TableCell>
                  <TableCell>{formatCurrencyFromCents(version.annualPriceCents)}</TableCell>
                  <TableCell>{formatBytes(version.storageBytesLimit)}</TableCell>
                  <TableCell>{formatDateTime(version.publishedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
