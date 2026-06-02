import { deriveOrganizationBillingLabel, mapSubscriptionStatusToTableLabel } from "@/lib/organization-billing";

import type { RecentCustomerRow } from "./recent-customers-table/schema";

export type OrganizationBillingRow = {
  organizationId: string;
  organizationName: string;
  financialEmail?: string | null;
  createdAt?: string | null;
  planSlug?: string | null;
  subscriptionStatus?: string | null;
  latestInvoiceStatus?: string | null;
};

export function mapOrganizationsToCustomerRows(organizations: OrganizationBillingRow[]): RecentCustomerRow[] {
  return organizations.map((organization) => ({
    id: organization.organizationId,
    name: organization.organizationName,
    email: organization.financialEmail?.trim() || "—",
    plan: organization.planSlug ?? "Sem plano",
    status: mapSubscriptionStatusToTableLabel(organization.subscriptionStatus),
    billing: deriveOrganizationBillingLabel(organization),
    joined: organization.createdAt?.slice(0, 10) ?? "",
  }));
}
