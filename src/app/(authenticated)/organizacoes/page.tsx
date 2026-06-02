import { FeedbackAlert } from "@/components/feedback-alert";
import { getSaasOrganizations } from "@/http/saas-billing";
import { parseOrganizationFiltersFromSearchParams } from "@/lib/organization-filters";
import { formatLabel, getFeedback } from "@/lib/saas-formatters";

import { OrganizationsList } from "./_components/organizations-list";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrganizacoesPage({ searchParams }: Props) {
  const [{ organizations }, resolvedSearchParams] = await Promise.all([
    getSaasOrganizations().catch(() => ({ organizations: [] })),
    searchParams ?? Promise.resolve({}),
  ]);

  const feedback = getFeedback(resolvedSearchParams);
  const initialFilters = parseOrganizationFiltersFromSearchParams(resolvedSearchParams);
  const hasActiveFilter = Boolean(initialFilters.status ?? initialFilters.access);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Organizações</h1>
        <p className="text-muted-foreground text-sm">
          {hasActiveFilter
            ? `Filtro ativo: ${[
                initialFilters.status ? `status ${formatLabel(initialFilters.status)}` : null,
                initialFilters.access ? `acesso ${formatLabel(initialFilters.access)}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}`
            : "Gerencie as organizações cadastradas na plataforma"}
        </p>
      </div>

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <OrganizationsList
        organizations={organizations}
        initialStatus={initialFilters.status}
        initialAccess={initialFilters.access}
      />
    </div>
  );
}
