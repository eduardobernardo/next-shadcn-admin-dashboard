import Image from "next/image";
import Link from "next/link";

import { ArrowLeft, Edit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrganizationDetail } from "@/lib/organization-detail";
import { formatDateOnly, formatLabel } from "@/lib/saas-formatters";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  ACTIVE:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  TRIALING: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  GRACE:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  PAST_DUE:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
  CANCELED: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  BLOCKED: "border-muted-foreground/20 bg-muted/50 text-muted-foreground",
};

type OrganizationDetailHeaderProps = {
  organizationId: string;
  detail: OrganizationDetail;
};

export function OrganizationDetailHeader({ organizationId, detail }: OrganizationDetailHeaderProps) {
  const { organization, overview } = detail;
  const statusKey = overview.status ?? "BLOCKED";
  const statusClassName = statusStyles[statusKey] ?? "border-muted-foreground/20 bg-muted/50 text-muted-foreground";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-3">
        <Link
          href="/organizacoes"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para Organizações
        </Link>

        <div className="flex items-start gap-4">
          {organization.logoUrl ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border bg-muted">
              <Image src={organization.logoUrl} alt={organization.name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-xl border font-semibold text-lg"
              style={
                organization.primaryColor
                  ? { backgroundColor: `${organization.primaryColor}20`, color: organization.primaryColor }
                  : undefined
              }
            >
              {organization.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-semibold text-2xl tracking-tight">{organization.name}</h1>
              <Badge className={cn("border px-2 py-0.5 font-medium", statusClassName)} variant="outline">
                {formatLabel(overview.status)}
              </Badge>
              <Badge variant="outline">{formatLabel(overview.accessMode)}</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {organization.slug} · {formatLabel(organization.organizationProfileType)} ·{" "}
              {formatLabel(organization.learningMode)}
            </p>
            <p className="font-mono text-muted-foreground text-xs">
              {organization.id} · criada em {formatDateOnly(organization.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <Button asChild size="sm" className="shrink-0">
        <Link href={`/organizacoes/${organizationId}/edit`}>
          <Edit className="mr-2 size-4" />
          Editar organização
        </Link>
      </Button>
    </div>
  );
}
