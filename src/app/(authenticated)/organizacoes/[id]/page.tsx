import { FeedbackAlert } from "@/components/feedback-alert";
import { getSaasOrganizationDetail, getSaasPlans } from "@/http/saas-billing";
import { getFeedback } from "@/lib/saas-formatters";

import { OrganizationAdminActions } from "./_components/organization-admin-actions";
import { OrganizationControlMetrics } from "./_components/organization-control-metrics";
import { OrganizationDetailHeader } from "./_components/organization-detail-header";
import { OrganizationEntitlementsSection } from "./_components/organization-entitlements-section";
import { OrganizationFinancialSection } from "./_components/organization-financial-section";
import { OrganizationPlanHistory } from "./_components/organization-plan-history";
import { OrganizationTeamSection } from "./_components/organization-team-section";
import { OrganizationUsageSection } from "./_components/organization-usage-section";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrganizacaoDetalhePage({ params, searchParams }: Props) {
  const [{ id }, detail, { plans }, resolvedSearchParams] = await Promise.all([
    params,
    params.then(({ id: organizationId }) => getSaasOrganizationDetail(organizationId).catch(() => null)),
    getSaasPlans().catch(() => ({ plans: [] })),
    searchParams ?? Promise.resolve({}),
  ]);

  const feedback = getFeedback(resolvedSearchParams);

  if (!detail) {
    return (
      <div className="flex flex-col gap-8">
        <p className="text-muted-foreground">Não foi possível carregar a organização.</p>
      </div>
    );
  }

  const usageMetrics = detail.overview.usageSnapshot?.metrics ?? [];
  const entitlements = detail.overview.planEntitlements ?? [];

  return (
    <div className="flex flex-col gap-8">
      <OrganizationDetailHeader organizationId={id} detail={detail} />

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <OrganizationControlMetrics snapshot={detail.controlSnapshot} />

      <div className="grid gap-8 xl:grid-cols-2">
        <OrganizationTeamSection overview={detail.overview} team={detail.controlSnapshot.team} />
        <OrganizationFinancialSection overview={detail.overview} />
      </div>

      <OrganizationUsageSection metrics={usageMetrics} snapshot={detail.controlSnapshot} />

      {entitlements.length > 0 ? <OrganizationEntitlementsSection entitlements={entitlements} /> : null}

      <OrganizationPlanHistory planHistory={detail.planHistory} />

      <OrganizationAdminActions organizationId={id} overview={detail.overview} plans={plans} />
    </div>
  );
}
