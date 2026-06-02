"use client";
"use no memo";

import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

import { PaginatedDataTable } from "@/components/data-table/paginated-data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OperationsRecentJob } from "@/lib/operations-overview";
import { formatBytes, formatDateTime, formatLabel } from "@/lib/saas-formatters";

const columns: ColumnDef<OperationsRecentJob>[] = [
  {
    accessorKey: "title",
    header: "Mídia",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-sm">{row.original.title ?? "Sem título"}</p>
        <p className="truncate font-mono text-muted-foreground text-xs">{row.original.mediaId}</p>
      </div>
    ),
  },
  {
    accessorKey: "organizationName",
    header: "Organização",
    cell: ({ row }) => <span className="text-sm">{row.original.organizationName}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground">
        {formatLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "originalSizeBytes",
    header: "Tamanho",
    cell: ({ row }) => formatBytes(row.original.originalSizeBytes),
  },
  {
    accessorKey: "processingStartedAt",
    header: "Início",
    cell: ({ row }) => formatDateTime(row.original.processingStartedAt),
  },
  {
    accessorKey: "processingEndedAt",
    header: "Fim",
    cell: ({ row }) => formatDateTime(row.original.processingEndedAt),
  },
  {
    accessorKey: "processingError",
    header: "Erro",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-destructive text-xs">{row.original.processingError ?? "—"}</span>
    ),
  },
];

type RecentJobsTableProps = {
  jobs: OperationsRecentJob[];
};

export function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 8 },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">Jobs recentes de mídia</CardTitle>
        <CardDescription>Últimas mídias com atividade de upload ou processamento.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PaginatedDataTable
          table={table}
          emptyMessage="Nenhum job recente."
          rowsPerPageId="operations-recent-jobs-rows-per-page"
        />
      </CardContent>
    </Card>
  );
}
