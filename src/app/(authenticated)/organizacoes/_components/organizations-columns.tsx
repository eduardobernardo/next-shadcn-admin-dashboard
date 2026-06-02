"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import { EntityRowActions } from "@/components/data-table/entity-row-actions";
import { Badge } from "@/components/ui/badge";
import { formatLabel } from "@/lib/saas-formatters";
import { cn } from "@/lib/utils";

export type OrganizationRow = {
  organizationId: string;
  organizationName: string;
  organizationSlug?: string;
  createdAt?: string | null;
  financialEmail?: string | null;
  planSlug?: string | null;
  subscriptionStatus?: string | null;
  billingCycle?: string | null;
  accessMode?: string | null;
  trialEndsAt?: string | null;
  graceEndsAt?: string | null;
  latestInvoiceStatus?: string | null;
  latestInvoiceDueAt?: string | null;
};

const statusStyles: Record<string, string> = {
  ACTIVE:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  TRIALING: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  PAST_DUE:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  CANCELED: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
};

function StatusBadge({ status }: { status?: string | null }) {
  const label = formatLabel(status);
  const key = status ?? "";
  const className = statusStyles[key] ?? "border-muted-foreground/20 bg-muted/50 text-muted-foreground";

  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", className)} variant="outline">
      {label}
    </Badge>
  );
}

export const organizationsColumns: ColumnDef<OrganizationRow>[] = [
  {
    id: "search",
    accessorFn: (row) => `${row.organizationName} ${row.organizationId} ${row.planSlug ?? ""}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "organizationName",
    header: "Organização",
    cell: ({ row }) => (
      <div className="min-w-0">
        <Link
          href={`/organizacoes/${row.original.organizationId}`}
          className="truncate font-medium text-foreground text-sm hover:underline"
        >
          {row.original.organizationName}
        </Link>
        <div className="truncate font-mono text-muted-foreground text-xs">{row.original.organizationId}</div>
      </div>
    ),
  },
  {
    accessorKey: "planSlug",
    header: "Plano",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.planSlug ?? "—"}</span>,
  },
  {
    accessorKey: "subscriptionStatus",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => <StatusBadge status={row.original.subscriptionStatus} />,
  },
  {
    accessorKey: "accessMode",
    header: "Acesso",
    filterFn: "equalsString",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{formatLabel(row.original.accessMode)}</span>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => (
      <EntityRowActions
        entityLabel={row.original.organizationName}
        viewHref={`/organizacoes/${row.original.organizationId}`}
        editHref={`/organizacoes/${row.original.organizationId}/edit`}
        deleteHref={`/organizacoes/${row.original.organizationId}/edit#danger-zone`}
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
