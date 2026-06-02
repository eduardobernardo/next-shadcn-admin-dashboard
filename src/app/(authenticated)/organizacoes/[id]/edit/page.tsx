import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { FeedbackAlert } from "@/components/feedback-alert";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSaasOrganizationDetail } from "@/http/saas-billing";
import { formatLabel, getFeedback } from "@/lib/saas-formatters";

import { deleteOrganizationAction, updateOrganizationAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrganizacaoEditPage({ params, searchParams }: Props) {
  const [{ id }, detail, resolvedSearchParams] = await Promise.all([
    params,
    params.then(({ id: organizationId }) => getSaasOrganizationDetail(organizationId).catch(() => null)),
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
        <p className="text-muted-foreground">Não foi possível carregar a organização para edição.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Link
          href={`/organizacoes/${id}`}
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para detalhes
        </Link>
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Editar {detail.organization.name}</h1>
          <p className="text-muted-foreground text-sm">Ajuste identidade e configuração da organização.</p>
        </div>
      </div>

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <section>
        <h2 className="font-semibold text-base tracking-tight">Dados da organização</h2>
        <p className="mb-4 text-muted-foreground text-sm">Identificação, perfil e modo de aprendizagem.</p>

        <form action={updateOrganizationAction.bind(null, id)} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={detail.organization.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={detail.organization.slug} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="organizationProfileType">Perfil</Label>
            <select
              id="organizationProfileType"
              name="organizationProfileType"
              defaultValue={detail.organization.organizationProfileType}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="SCHOOL">Escola</option>
              <option value="COMPANY">Empresa</option>
              <option value="CREATOR">Criador</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="learningMode">Modo de aprendizagem</Label>
            <select
              id="learningMode"
              name="learningMode"
              defaultValue={detail.organization.learningMode}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="COMMERCE">Commerce</option>
              <option value="CORPORATE">Corporativo</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              defaultValue={detail.organization.logoUrl ?? ""}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="primaryColor">Cor primária</Label>
            <Input
              id="primaryColor"
              name="primaryColor"
              defaultValue={detail.organization.primaryColor ?? ""}
              placeholder="#111827"
            />
          </div>
          <div>
            <Button type="submit" size="sm">
              Salvar organização
            </Button>
          </div>
        </form>
      </section>

      <Alert>
        <AlertTitle>Estado atual da assinatura</AlertTitle>
        <AlertDescription>
          Plano {detail.overview.planName} em {formatLabel(detail.overview.status)} com acesso{" "}
          {formatLabel(detail.overview.accessMode)}. Para trocar plano ou revisar cobrança, acesse a página de detalhes.
        </AlertDescription>
      </Alert>

      <Separator />

      <section id="danger-zone" className="space-y-4">
        <div>
          <h2 className="font-semibold text-base text-destructive tracking-tight">Zona de exclusão</h2>
          <p className="text-muted-foreground text-sm">
            A exclusão só é liberada quando a assinatura já está cancelada ou bloqueada.
          </p>
        </div>

        <form
          action={deleteOrganizationAction.bind(null, id, detail.organization.slug)}
          className="flex flex-col gap-4 sm:max-w-md"
        >
          <div className="space-y-1.5">
            <Label htmlFor="confirmation">Confirme digitando o slug atual</Label>
            <Input id="confirmation" name="confirmation" placeholder={detail.organization.slug} />
          </div>
          <Button type="submit" variant="destructive" size="sm" className="w-fit">
            Excluir organização
          </Button>
        </form>
      </section>
    </div>
  );
}
