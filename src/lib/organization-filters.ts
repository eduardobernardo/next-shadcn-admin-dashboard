import type { FinanceAlert } from "@/lib/finance-overview";

export type OrganizationListFilters = {
  status?: string;
  access?: string;
};

export function buildOrganizationsHref(filters?: OrganizationListFilters) {
  const params = new URLSearchParams();

  if (filters?.status) {
    params.set("status", filters.status);
  }

  if (filters?.access) {
    params.set("acesso", filters.access);
  }

  const query = params.toString();
  return query ? `/organizacoes?${query}` : "/organizacoes";
}

export function resolveFinanceAlertActionHref(alert: FinanceAlert): string | null {
  if (alert.severity === "info") {
    return null;
  }

  const title = alert.title.toLowerCase();

  if (title.includes("carência")) {
    return buildOrganizationsHref({ status: "GRACE" });
  }

  if (title.includes("trial")) {
    return buildOrganizationsHref({ status: "TRIALING" });
  }

  return "/organizacoes";
}

export function parseOrganizationFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): OrganizationListFilters {
  const status = searchParams.status;
  const access = searchParams.acesso;

  return {
    status: typeof status === "string" && status.trim() ? status : undefined,
    access: typeof access === "string" && access.trim() ? access : undefined,
  };
}
