export type FinanceOverviewKpis = {
  estimatedMrrCents: number;
  estimatedArrCents: number;
  paidThisMonthCents: number;
  paidThisMonthCount: number;
  pendingTotalCents: number;
  pendingCount: number;
  overdueTotalCents: number;
  overdueCount: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  conversionRatePercent: number;
};

export type FinanceRevenueByPlan = {
  planSlug: string;
  planName: string;
  amountCents: number;
  subscriptions: number;
  sharePercent: number;
};

export type FinanceInvoiceStatusSlice = {
  status: string;
  count: number;
  amountCents: number;
};

export type FinanceCashflowPoint = {
  periodStart: string;
  paidCents: number;
  pendingCents: number;
};

export type FinanceUpcomingInvoice = {
  id: string;
  organizationId: string;
  organizationName: string;
  status: string;
  netAmountCents: number;
  dueAt: string | null;
};

export type FinanceTopOrganization = {
  organizationId: string;
  organizationName: string;
  paidCents: number;
};

export type FinanceAlert = {
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
};

export type FinanceOverview = {
  generatedAt: string;
  kpis: FinanceOverviewKpis;
  revenueByPlan: FinanceRevenueByPlan[];
  invoiceStatusDistribution: FinanceInvoiceStatusSlice[];
  cashflowTimeline: FinanceCashflowPoint[];
  upcomingInvoices: FinanceUpcomingInvoice[];
  topOrganizationsByPaidMonth: FinanceTopOrganization[];
  alerts: FinanceAlert[];
  primaryAlert: FinanceAlert | null;
};
