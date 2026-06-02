import { getSaasDashboardOverview, getSaasOrganizations } from "@/http/saas-billing";

import { mapOrganizationsToCustomerRows } from "./_components/map-organizations";
import { MetricCards } from "./_components/metric-cards";
import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";

const RECENT_ORGANIZATIONS_LIMIT = 50;

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePeriodDays(value: string | string[] | undefined) {
  const raw = typeof value === "string" ? value : undefined;

  if (raw === "30") return 30;
  if (raw === "180") return 180;
  return 90;
}

function parseSegment(value: string | string[] | undefined): "all" | "paid" | "organic" {
  const raw = typeof value === "string" ? value : undefined;

  if (raw === "paid" || raw === "organic") {
    return raw;
  }

  return "all";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;
  const periodDays = parsePeriodDays(resolvedSearchParams.periodDays);
  const segment = parseSegment(resolvedSearchParams.segment);

  const [dashboardResult, organizationsResult] = await Promise.all([
    getSaasDashboardOverview({ periodDays, segment, granularity: "week" }).catch(() => null),
    getSaasOrganizations().catch(() => ({ organizations: [] })),
  ]);

  if (!dashboardResult) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        Não foi possível carregar o dashboard.
      </div>
    );
  }

  const customers = mapOrganizationsToCustomerRows(
    organizationsResult.organizations.slice(0, RECENT_ORGANIZATIONS_LIMIT),
  );

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <MetricCards kpis={dashboardResult.kpis} />
      <PerformanceOverview timeline={dashboardResult.activityTimeline} periodDays={periodDays} segment={segment} />
      <SubscriberOverview customers={customers} />
    </div>
  );
}
