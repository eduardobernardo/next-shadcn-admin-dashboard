import Link from "next/link";

import { AlertTriangle, ArrowLeft } from "lucide-react";

import { FeedbackAlert } from "@/components/feedback-alert";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getSaasPlans } from "@/http/saas-billing";
import { formatDateTime, getFeedback } from "@/lib/saas-formatters";

import { deletePlanAction, updatePlanAction, updatePlanVersionAction } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlanoEditPage({ params, searchParams }: Props) {
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
        <p className="text-muted-foreground">Não foi possível carregar o plano para edição.</p>
      </div>
    );
  }

  const editableVersion = plan.versions.find((version: any) => version.status === "DRAFT") ?? plan.versions[0] ?? null;

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Link
          href={`/planos/${plan.id}`}
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para detalhes
        </Link>
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Editar {plan.name}</h1>
          <p className="text-muted-foreground text-sm">Ajuste a configuração do plano, preços e limites.</p>
        </div>
      </div>

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <section>
        <h2 className="font-semibold text-base tracking-tight">Dados do plano</h2>
        <p className="mb-4 text-muted-foreground text-sm">Identidade comercial e posição no catálogo.</p>

        <form action={updatePlanAction.bind(null, plan.id)} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={plan.slug} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={plan.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="salesMode">Modo de venda</Label>
            <select
              id="salesMode"
              name="salesMode"
              defaultValue={plan.salesMode}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="SELF_SERVICE">Self Service</option>
              <option value="ASSISTED">Assistido</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="visibility">Visibilidade</Label>
            <select
              id="visibility"
              name="visibility"
              defaultValue={plan.visibility}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="PUBLIC">Público</option>
              <option value="HIDDEN">Oculto</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="displayOrder">Ordem</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={plan.displayOrder} />
          </div>
          <div className="flex items-center gap-2 self-end">
            <input
              id="highlighted"
              name="highlighted"
              type="checkbox"
              defaultChecked={plan.highlighted}
              className="size-4 rounded border border-input"
            />
            <Label htmlFor="highlighted">Destaque</Label>
          </div>
          <div>
            <Button type="submit" size="sm">
              Salvar dados do plano
            </Button>
          </div>
        </form>
      </section>

      <Separator />

      <section>
        <h2 className="font-semibold text-base tracking-tight">Versão operacional</h2>
        <p className="mb-4 text-muted-foreground text-sm">
          {editableVersion ? `Editando versão ${editableVersion.versionNumber}` : "Nenhuma versão disponível"}
        </p>

        {editableVersion ? (
          editableVersion.immutableAfterUse ? (
            <Alert>
              <AlertTriangle className="size-4" />
              <AlertTitle>Versão travada</AlertTitle>
              <AlertDescription>
                A versão {editableVersion.versionNumber} já foi usada em assinaturas e não pode ser alterada. Crie um
                novo draft na listagem para publicar uma nova configuração.
              </AlertDescription>
            </Alert>
          ) : (
            <form
              action={updatePlanVersionAction.bind(null, plan.id, editableVersion.id)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-muted-foreground text-sm">
                  Versão {editableVersion.versionNumber} • {editableVersion.status} • Publicada em{" "}
                  {formatDateTime(editableVersion.publishedAt)}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="monthlyPriceCents">Mensal (centavos)</Label>
                <Input
                  id="monthlyPriceCents"
                  name="monthlyPriceCents"
                  type="number"
                  defaultValue={editableVersion.monthlyPriceCents}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="annualPriceCents">Anual (centavos)</Label>
                <Input
                  id="annualPriceCents"
                  name="annualPriceCents"
                  type="number"
                  defaultValue={editableVersion.annualPriceCents}
                  required
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="marketingDescription">Descrição comercial</Label>
                <Textarea
                  id="marketingDescription"
                  name="marketingDescription"
                  defaultValue={editableVersion.marketingDescription}
                  className="min-h-28"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ctaLabel">Texto do botão</Label>
                <Input id="ctaLabel" name="ctaLabel" defaultValue={editableVersion.ctaLabel} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="publicBadges">Badges</Label>
                <Input
                  id="publicBadges"
                  name="publicBadges"
                  defaultValue={
                    Array.isArray(editableVersion.publicBadges) ? editableVersion.publicBadges.join(", ") : ""
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:grid-cols-5">
                <div className="space-y-1.5">
                  <Label htmlFor="members">Membros</Label>
                  <Input
                    id="members"
                    name="members"
                    type="number"
                    defaultValue={editableVersion.membersLimit}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admins">Admins</Label>
                  <Input id="admins" name="admins" type="number" defaultValue={editableVersion.adminsLimit} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="courses">Cursos</Label>
                  <Input
                    id="courses"
                    name="courses"
                    type="number"
                    defaultValue={editableVersion.coursesLimit}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lessons">Aulas</Label>
                  <Input
                    id="lessons"
                    name="lessons"
                    type="number"
                    defaultValue={editableVersion.lessonsLimit}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="storageBytes">Storage (bytes)</Label>
                  <Input
                    id="storageBytes"
                    name="storageBytes"
                    type="number"
                    defaultValue={editableVersion.storageBytesLimit}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="entitlementsJson">Entitlements (JSON)</Label>
                <Textarea
                  id="entitlementsJson"
                  name="entitlementsJson"
                  defaultValue={JSON.stringify(editableVersion.entitlements ?? {}, null, 2)}
                  className="min-h-40 font-mono text-xs"
                />
              </div>
              <div>
                <Button type="submit" size="sm">
                  Salvar versão
                </Button>
              </div>
            </form>
          )
        ) : (
          <Alert>
            <AlertTriangle className="size-4" />
            <AlertTitle>Sem versão</AlertTitle>
            <AlertDescription>
              Este plano ainda não possui versão. Crie um draft na listagem para iniciar a configuração.
            </AlertDescription>
          </Alert>
        )}
      </section>

      <Separator />

      <section id="danger-zone" className="space-y-4">
        <div>
          <h2 className="font-semibold text-base text-destructive tracking-tight">Zona de exclusão</h2>
          <p className="text-muted-foreground text-sm">
            A exclusão remove o plano inteiro. Planos com assinaturas ativas não podem ser excluídos.
          </p>
        </div>

        <form action={deletePlanAction.bind(null, plan.id, plan.slug)} className="flex flex-col gap-4 sm:max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="confirmation">Confirme digitando o slug do plano</Label>
            <Input id="confirmation" name="confirmation" placeholder={plan.slug} />
          </div>
          <Button type="submit" variant="destructive" size="sm" className="w-fit">
            Excluir plano
          </Button>
        </form>
      </section>
    </div>
  );
}
