"use client";
"use no memo";

import * as React from "react";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Search,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { recentCustomersColumns } from "./columns";
import type { RecentCustomerRow } from "./schema";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "Subscribed", label: "Assinantes" },
  { value: "Inactive", label: "Inativos" },
  { value: "Unsubscribed", label: "Cancelados" },
] as const;

const billingOptions = [
  { value: "all", label: "Todos" },
  { value: "Paid", label: "Pagos" },
  { value: "Trial", label: "Trial" },
  { value: "Pending", label: "Pendentes" },
  { value: "Overdue", label: "Em atraso" },
] as const;

const joinedWindowOptions = [
  { value: "all", label: "Todo período" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
] as const;

type RecentCustomersTableProps = {
  data: RecentCustomerRow[];
};

export function RecentCustomersTable({ data }: RecentCustomersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "joined", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    search: false,
    joinedWindow: false,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const table = useReactTable({
    data,
    columns: recentCustomersColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.id,
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
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "all";
  const billingFilter = (table.getColumn("billing")?.getFilterValue() as string) ?? "all";
  const joinedWindowFilter = (table.getColumn("joinedWindow")?.getFilterValue() as string) ?? "all";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8"
            placeholder="Buscar organizações..."
            value={searchQuery}
            onChange={(event) => {
              table.getColumn("search")?.setFilterValue(event.target.value || undefined);
              table.setPageIndex(0);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value);
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger size="sm" className="min-w-[140px]">
              <UsersRound className="size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={billingFilter}
            onValueChange={(value) => {
              table.getColumn("billing")?.setFilterValue(value === "all" ? undefined : value);
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger size="sm" className="min-w-[140px]">
              <CreditCard className="size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Cobrança" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {billingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={joinedWindowFilter}
            onValueChange={(value) => {
              table.getColumn("joinedWindow")?.setFilterValue(value === "all" ? undefined : value);
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger size="sm" className="min-w-[160px]">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Entrada" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {joinedWindowOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={recentCustomersColumns.length} className="h-24 text-center text-muted-foreground">
                  Nenhuma organização encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground text-sm">{table.getFilteredRowModel().rows.length} organização(ões)</div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="dashboard-customers-page-size" className="text-sm">
              Linhas
            </Label>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger id="dashboard-customers-page-size" size="sm" className="w-18">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[8, 12, 20].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
