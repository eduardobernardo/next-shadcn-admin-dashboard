export type OrganizationBillingSource = {
  subscriptionStatus?: string | null;
  latestInvoiceStatus?: string | null;
};

export function deriveOrganizationBillingLabel(organization: OrganizationBillingSource) {
  if (organization.subscriptionStatus === "TRIALING") {
    return "Trial";
  }

  if (organization.latestInvoiceStatus === "OVERDUE") {
    return "Overdue";
  }

  if (organization.latestInvoiceStatus === "PENDING") {
    return "Pending";
  }

  if (organization.subscriptionStatus === "ACTIVE") {
    return "Paid";
  }

  return "Pending";
}

export function mapSubscriptionStatusToTableLabel(status?: string | null) {
  switch (status) {
    case "ACTIVE":
    case "TRIALING":
    case "GRACE":
      return "Subscribed";
    case "CANCELED":
      return "Unsubscribed";
    default:
      return "Inactive";
  }
}
