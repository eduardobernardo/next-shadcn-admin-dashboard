"use client";
"use no memo";

import * as React from "react";

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import { PaginatedDataTable } from "@/components/data-table/paginated-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { type PlanRow, plansColumns } from "./plans-columns";

const ALL = "Todos";

export function PlansList({ plans }: { plans: PlanRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    search: false,
    visibility: false,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: plans,
    columns: plansColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.id,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const visibilityFilter = (table.getColumn("visibility")?.getFilterValue() as string) ?? ALL;

  function setVisibilityFilter(value: string) {
    table.getColumn("visibility")?.setFilterValue(value === ALL ? undefined : value);
    table.setPageIndex(0);
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl leading-none">Lista de planos</CardTitle>
        <CardDescription className="max-w-lg leading-snug">
          Busque planos, filtre por visibilidade e publique versões em rascunho diretamente na tabela.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0 pt-6">
        <div className="flex flex-col gap-3 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <InputGroup className="h-8 w-full sm:max-w-xs">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-8"
              placeholder="Buscar plano..."
              value={searchQuery}
              onChange={(event) => {
                table.getColumn("search")?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
          </InputGroup>

          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger size="sm" className="min-w-[160px]">
              <span className="text-muted-foreground">Visibilidade:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                <SelectItem value={ALL}>{ALL}</SelectItem>
                <SelectItem value="PUBLIC">Público</SelectItem>
                <SelectItem value="HIDDEN">Oculto</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <PaginatedDataTable
          table={table}
          emptyMessage='Nenhum plano cadastrado. Clique em "Novo plano" para começar.'
          rowsPerPageId="plans-rows-per-page"
        />
      </CardContent>
    </Card>
  );
}
