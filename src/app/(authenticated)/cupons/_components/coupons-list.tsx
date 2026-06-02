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

import { type CouponRow, couponsColumns } from "./coupons-columns";

const ALL = "Todos";

export function CouponsList({ coupons }: { coupons: CouponRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    search: false,
    isActive: false,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: coupons,
    columns: couponsColumns,
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
  const activeFilter = (table.getColumn("isActive")?.getFilterValue() as string) ?? ALL;

  function setActiveFilter(value: string) {
    if (value === ALL) {
      table.getColumn("isActive")?.setFilterValue(undefined);
    } else if (value === "Ativos") {
      table.getColumn("isActive")?.setFilterValue("active");
    } else {
      table.getColumn("isActive")?.setFilterValue("inactive");
    }
    table.setPageIndex(0);
  }

  const activeSelectValue = activeFilter === "active" ? "Ativos" : activeFilter === "inactive" ? "Inativos" : ALL;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl leading-none">Lista de cupons</CardTitle>
        <CardDescription className="max-w-lg leading-snug">
          Busque por código e filtre cupons ativos ou inativos.
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
              placeholder="Buscar cupom..."
              value={searchQuery}
              onChange={(event) => {
                table.getColumn("search")?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
          </InputGroup>

          <Select value={activeSelectValue} onValueChange={setActiveFilter}>
            <SelectTrigger size="sm" className="min-w-[140px]">
              <span className="text-muted-foreground">Situação:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                <SelectItem value={ALL}>{ALL}</SelectItem>
                <SelectItem value="Ativos">Ativos</SelectItem>
                <SelectItem value="Inativos">Inativos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <PaginatedDataTable
          table={table}
          emptyMessage='Nenhum cupom cadastrado. Clique em "Novo cupom" para começar.'
          rowsPerPageId="coupons-rows-per-page"
        />
      </CardContent>
    </Card>
  );
}
