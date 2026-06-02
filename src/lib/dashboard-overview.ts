export type DashboardActivityPoint = {
  periodStart: string;
  newOrganizations: number;
  activeSubscriptions: number;
  subscriptionRenewals: number;
};

export type DashboardKpis = {
  totalOrganizations: number;
  trialingOrganizations: number;
  activeOrganizations: number;
  activeRate: number;
  publishedPlans: number;
  totalPlans: number;
  activeCoupons: number;
  activeCouponRate: number;
  publishedPlanShare: number;
  trialShare: number;
  totalOrganizationsChangePercent: number;
};

export type DashboardOverview = {
  generatedAt: string;
  period: {
    start: string;
    end: string;
    days: number;
    granularity: "day" | "week";
    segment: "all" | "paid" | "organic";
  };
  kpis: DashboardKpis;
  activityTimeline: DashboardActivityPoint[];
};

export type DashboardOverviewQuery = {
  periodDays?: number;
  granularity?: "day" | "week";
  segment?: "all" | "paid" | "organic";
};
