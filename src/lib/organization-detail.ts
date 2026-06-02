export type OrganizationTeamMember = {
  userId: string;
  accountId: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "MANAGER" | "BILLING";
  lastLoginAt: string | null;
};

export type OrganizationControlSnapshot = {
  team: {
    admins: OrganizationTeamMember[];
    managers: OrganizationTeamMember[];
    billingUsers: OrganizationTeamMember[];
  };
  counts: {
    totalUsers: number;
    members: number;
    admins: number;
    managers: number;
    billingUsers: number;
    courses: number;
    archivedCourses: number;
    lessons: number;
    videos: number;
    videosProcessed: number;
    videosProcessing: number;
    videosFailed: number;
    videosPending: number;
    enrollments: number;
    products: number;
    orders: number;
    attachments: number;
    certificatesIssued: number;
    pendingInvites: number;
  };
  storage: {
    mediaBytes: number;
    attachmentBytes: number;
    certificateBytes: number;
    totalBytes: number;
  };
};

export type PlanUsageMetric = {
  key: string;
  label: string;
  unit: "COUNT" | "BYTES";
  used: number | null;
  limit: number | null;
  remaining?: number | null;
  state?: string;
};

export type OrganizationBillingProfile = {
  nameOrCorporateName: string;
  cpfCnpj: string;
  financialEmail: string;
  phone: string;
  tradeName?: string | null;
};

export type OrganizationInvoice = {
  id: string;
  status: string;
  netAmountCents: number;
  dueAt: string | null;
  paidAt?: string | null;
};

export type OrganizationBillingOverview = {
  planSlug: string;
  planName: string;
  status: string;
  accessMode: string;
  billingCycle: string;
  trialEndsAt: string | null;
  currentPeriodEndAt: string | null;
  graceEndsAt?: string | null;
  defaultPaymentMethod: string | null;
  billingProfile: OrganizationBillingProfile | null;
  usageSnapshot?: {
    metrics: PlanUsageMetric[];
  };
  planEntitlements?: Array<{ key: string; label: string; included: boolean }>;
  invoices?: OrganizationInvoice[];
};

export type OrganizationDetail = {
  organization: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    primaryColor: string | null;
    organizationProfileType: string;
    learningMode: string;
    createdAt: string;
    updatedAt: string;
  };
  overview: OrganizationBillingOverview;
  controlSnapshot: OrganizationControlSnapshot;
  planHistory: Array<{
    id: string;
    status: string;
    effectiveAt: string;
    fromPlanVersion: { plan: { slug: string; name?: string } };
    toPlanVersion: { plan: { slug: string; name?: string } };
  }>;
};
