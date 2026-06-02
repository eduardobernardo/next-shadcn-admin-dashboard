"use client";
"use no memo";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { differenceInCalendarDays, endOfToday, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleAlertIcon, CircleCheckIcon, Clock3Icon, LoaderIcon, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { RecentCustomerRow } from "./schema";

function billingIcon(billing: string) {
  switch (billing) {
    case "Paid":
      return <CircleCheckIcon className="fill-green-500 stroke-primary-foreground dark:fill-green-600" />;
    case "Pending":
      return <LoaderIcon />;
    case "Overdue":
      return <CircleAlertIcon className="text-amber-600 dark:text-amber-500" />;
    case "Trial":
      return <Clock3Icon className="text-muted-foreground" />;
    default:
      return null;
  }
}

export const recentCustomersColumns: ColumnDef<RecentCustomerRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todas as organizações desta página"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Selecionar ${row.original.name}`}
        />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Organização",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-md border bg-muted">
          <UserRound className="size-4 text-muted-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/organizacoes/${row.original.id}`}
            className="truncate font-medium text-sm leading-none hover:underline"
          >
            {row.original.name}
          </Link>
          <span className="truncate text-muted-foreground text-xs leading-none">{row.original.email}</span>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "search",
    accessorFn: (row) => `${row.id} ${row.name} ${row.email}`,
    filterFn: "includesString",
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "billing",
    header: "Cobrança",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {billingIcon(row.original.billing)}
        {row.original.billing}
      </Badge>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plano",
    cell: ({ row }) => <span className="text-sm">{row.original.plan}</span>,
  },
  {
    id: "joinedWindow",
    accessorFn: (row) => {
      if (!row.joined) return [];

      const daysSinceJoined = differenceInCalendarDays(endOfToday(), parseISO(row.joined));

      if (daysSinceJoined <= 30) return ["30", "90"];
      if (daysSinceJoined <= 90) return ["90"];
      return [];
    },
    filterFn: "arrIncludes",
    enableHiding: true,
  },
  {
    accessorKey: "joined",
    header: "Entrada",
    cell: ({ row }) => {
      if (!row.original.joined) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }

      const joinedAt = parseISO(row.original.joined);

      return (
        <div className="grid gap-0.5">
          <span className="text-sm">{format(joinedAt, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
        </div>
      );
    },
  },
];
