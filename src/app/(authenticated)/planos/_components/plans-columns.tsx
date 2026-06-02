"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import { publishPlanVersionAction } from "@/app/(authenticated)/planos/actions";
import { EntityRowActions } from "@/components/data-table/entity-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyFromCents } from "@/lib/saas-formatters";

export type PlanVersionRow = {
  id: string;
  versionNumber: number;
  status: string;
  monthlyPriceCents: number;
  annualPriceCents: number;
};

export type PlanRow = {
  id: string;
  name: string;
  slug: string;
  highlighted?: boolean;
  salesMode: string;
  visibility: string;
  versions: PlanVersionRow[];
};

export const plansColumns: ColumnDef<PlanRow>[] = [
  {
    id: "search",
    accessorFn: (row) => `${row.name} ${row.slug}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "Plano",
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/planos/${row.original.id}`} className="font-medium text-sm hover:underline">
            {row.original.name}
          </Link>
          {row.original.highlighted ? (
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-700">
              Destaque
            </Badge>
          ) : null}
        </div>
        <div className="text-muted-foreground text-xs">{row.original.slug}</div>
      </div>
    ),
  },
  {
    accessorKey: "visibility",
    header: "Visibilidade",
    filterFn: "equalsString",
    enableHiding: true,
  },
  {
    id: "config",
    header: "Configuração",
    accessorFn: (row) => `${row.salesMode} ${row.visibility}`,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        <div>{row.original.salesMode === "SELF_SERVICE" ? "Self service" : "Assistido"}</div>
        <div>{row.original.visibility === "PUBLIC" ? "Público" : "Oculto"}</div>
      </div>
    ),
  },
  {
    id: "latestVersion",
    header: "Última versão",
    accessorFn: (row) => row.versions[0]?.versionNumber ?? 0,
    cell: ({ row }) => {
      const latest = row.original.versions[0];

      if (!latest) {
        return <span className="text-muted-foreground text-sm">Sem versões</span>;
      }

      return (
        <div className="text-sm">
          <div className="font-medium">
            v{latest.versionNumber} · {latest.status === "DRAFT" ? "Rascunho" : "Publicada"}
          </div>
          <div className="text-muted-foreground">{formatCurrencyFromCents(latest.monthlyPriceCents)}/mês</div>
          <div className="text-muted-foreground">{formatCurrencyFromCents(latest.annualPriceCents)}/ano</div>
        </div>
      );
    },
  },
  {
    id: "publish",
    header: "Publicar",
    enableSorting: false,
    cell: ({ row }) => {
      const draftVersions = row.original.versions.filter((version) => version.status === "DRAFT");

      if (draftVersions.length === 0) {
        return <span className="text-muted-foreground text-sm">Sem rascunhos</span>;
      }

      return (
        <div className="flex flex-col gap-2">
          {draftVersions.map((version) => (
            <form key={version.id} action={publishPlanVersionAction}>
              <input type="hidden" name="planVersionId" value={version.id} />
              <input type="hidden" name="returnTo" value="/planos" />
              <Button variant="outline" size="sm" type="submit">
                Publicar v{version.versionNumber}
              </Button>
            </form>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => (
      <EntityRowActions
        entityLabel={row.original.name}
        viewHref={`/planos/${row.original.id}`}
        editHref={`/planos/${row.original.id}/edit`}
        deleteHref={`/planos/${row.original.id}/edit#danger-zone`}
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
