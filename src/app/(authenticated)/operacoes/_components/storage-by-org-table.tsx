"use client";
"use no memo";

import Link from "next/link";

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { PaginatedDataTable } from "@/components/data-table/paginated-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OperationsStorageByOrganization } from "@/lib/operations-overview";
import { formatBytes } from "@/lib/saas-formatters";

const columns: ColumnDef<OperationsStorageByOrganization>[] = [
  {
    accessorKey: "organizationName",
    header: "Organização",
    cell: ({ row }) => (
      <div className="min-w-0">
        <Link
          href={`/organizacoes/${row.original.organizationId}`}
          className="truncate font-medium text-sm hover:underline"
        >
          {row.original.organizationName}
        </Link>
        <div className="truncate font-mono text-muted-foreground text-xs">{row.original.organizationId}</div>
      </div>
    ),
  },
  {
    accessorKey: "videoCount",
    header: "Vídeos",
    cell: ({ row }) => <span className="tabular-nums">{row.original.videoCount}</span>,
  },
  {
    accessorKey: "totalBytes",
    header: "Armazenamento",
    cell: ({ row }) => <span className="font-medium tabular-nums">{formatBytes(row.original.totalBytes)}</span>,
  },
  {
    id: "breakdown",
    header: "Composição",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        Vídeo {formatBytes(row.original.mediaBytes)} · anexos {formatBytes(row.original.attachmentBytes)} · cert.{" "}
        {formatBytes(row.original.certificateBytes)}
      </span>
    ),
  },
  {
    accessorKey: "storageLimitBytes",
    header: "Limite do plano",
    cell: ({ row }) =>
      row.original.storageLimitBytes ? (
        formatBytes(row.original.storageLimitBytes)
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "usagePercent",
    header: "Uso",
    cell: ({ row }) =>
      row.original.usagePercent !== null ? (
        <span className="tabular-nums">{row.original.usagePercent}%</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
];

type StorageByOrgTableProps = {
  rows: OperationsStorageByOrganization[];
};

export function StorageByOrgTable({ rows }: StorageByOrgTableProps) {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: "totalBytes", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">Armazenamento por organização</CardTitle>
        <CardDescription>Ranking por volume total registrado (vídeo original + anexos + certificados).</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PaginatedDataTable
          table={table}
          emptyMessage="Nenhum uso de armazenamento registrado."
          rowsPerPageId="operations-storage-rows-per-page"
        />
      </CardContent>
    </Card>
  );
}
