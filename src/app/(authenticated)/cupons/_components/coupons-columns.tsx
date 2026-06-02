"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import { EntityRowActions } from "@/components/data-table/entity-row-actions";
import { Badge } from "@/components/ui/badge";
import { formatDateOnly, formatLabel } from "@/lib/saas-formatters";
import { cn } from "@/lib/utils";

export type CouponRow = {
  id: string;
  code: string;
  isActive: boolean;
  discountType: string;
  discountValue: number | string;
  durationType: string;
  validUntil?: string | null;
  redemptionCount: number;
  globalRedemptionLimit?: number | null;
};

export const couponsColumns: ColumnDef<CouponRow>[] = [
  {
    id: "search",
    accessorFn: (row) => row.code,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <div className="min-w-0">
        <Link href={`/cupons/${row.original.id}`} className="font-medium font-mono text-sm hover:underline">
          {row.original.code}
        </Link>
        <Badge
          variant="outline"
          className={cn(
            "mt-1 border px-2 py-0.5 font-medium text-[10px]",
            row.original.isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-muted-foreground/20 bg-muted/50 text-muted-foreground",
          )}
        >
          {row.original.isActive ? "Ativo" : "Inativo"}
        </Badge>
      </div>
    ),
  },
  {
    id: "isActive",
    accessorFn: (row) => (row.isActive ? "active" : "inactive"),
    filterFn: "equalsString",
    enableHiding: true,
  },
  {
    id: "discount",
    header: "Desconto",
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="font-medium">
          {formatLabel(row.original.discountType)} de {row.original.discountValue}
        </div>
        <div className="text-muted-foreground">{formatLabel(row.original.durationType)}</div>
      </div>
    ),
  },
  {
    accessorKey: "validUntil",
    header: "Validade",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{formatDateOnly(row.original.validUntil)}</span>,
  },
  {
    id: "usage",
    header: "Uso",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        <div>{row.original.redemptionCount} usos</div>
        <div>{row.original.globalRedemptionLimit ? `${row.original.globalRedemptionLimit} máx.` : "Sem limite"}</div>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => (
      <EntityRowActions
        entityLabel={row.original.code}
        viewHref={`/cupons/${row.original.id}`}
        editHref={`/cupons/${row.original.id}/edit`}
        deleteHref={`/cupons/${row.original.id}/edit#danger-zone`}
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
