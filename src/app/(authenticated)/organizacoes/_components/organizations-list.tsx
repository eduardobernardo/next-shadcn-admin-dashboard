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
import { formatLabel } from "@/lib/saas-formatters";

import { type OrganizationRow, organizationsColumns } from "./organizations-columns";

const ALL = "Todos";

function uniqueFilterValues(rows: OrganizationRow[], key: keyof OrganizationRow) {
  const values = new Set<string>();

  for (const row of rows) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      values.add(value);
    }
  }

  return [ALL, ...Array.from(values).sort()];
}

type OrganizationsListProps = {
  organizations: OrganizationRow[];
  initialStatus?: string;
  initialAccess?: string;
};

function buildInitialColumnFilters(initialStatus?: string, initialAccess?: string): ColumnFiltersState {
  const filters: ColumnFiltersState = [];

  if (initialStatus) {
    filters.push({ id: "subscriptionStatus", value: initialStatus });
  }

  if (initialAccess) {
    filters.push({ id: "accessMode", value: initialAccess });
  }

  return filters;
}

export function OrganizationsList({ organizations, initialStatus, initialAccess }: OrganizationsListProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() =>
    buildInitialColumnFilters(initialStatus, initialAccess),
  );
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({ search: false });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const statusOptions = React.useMemo(() => {
    const options = uniqueFilterValues(organizations, "subscriptionStatus");

    if (initialStatus && !options.includes(initialStatus)) {
      return [ALL, initialStatus, ...options.filter((option) => option !== ALL)];
    }

    return options;
  }, [organizations, initialStatus]);

  const accessOptions = React.useMemo(() => {
    const options = uniqueFilterValues(organizations, "accessMode");

    if (initialAccess && !options.includes(initialAccess)) {
      return [ALL, initialAccess, ...options.filter((option) => option !== ALL)];
    }

    return options;
  }, [organizations, initialAccess]);

  const table = useReactTable({
    data: organizations,
    columns: organizationsColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.organizationId,
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
  const statusFilter = (table.getColumn("subscriptionStatus")?.getFilterValue() as string) ?? ALL;
  const accessFilter = (table.getColumn("accessMode")?.getFilterValue() as string) ?? ALL;

  function setColumnSelectFilter(columnId: string, value: string) {
    table.getColumn(columnId)?.setFilterValue(value === ALL ? undefined : value);
    table.setPageIndex(0);
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl leading-none">Lista de organizações</CardTitle>
        <CardDescription className="max-w-lg leading-snug">
          Busque por nome ou ID e filtre por status de assinatura e modo de acesso.
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
              placeholder="Buscar organização..."
              value={searchQuery}
              onChange={(event) => {
                table.getColumn("search")?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
          </InputGroup>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={(value) => setColumnSelectFilter("subscriptionStatus", value)}>
              <SelectTrigger size="sm" className="min-w-[140px]">
                <span className="text-muted-foreground">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === ALL ? ALL : formatLabel(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={accessFilter} onValueChange={(value) => setColumnSelectFilter("accessMode", value)}>
              <SelectTrigger size="sm" className="min-w-[140px]">
                <span className="text-muted-foreground">Acesso:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {accessOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === ALL ? ALL : formatLabel(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <PaginatedDataTable
          table={table}
          emptyMessage="Nenhuma organização encontrada."
          rowsPerPageId="organizations-rows-per-page"
        />
      </CardContent>
    </Card>
  );
}
