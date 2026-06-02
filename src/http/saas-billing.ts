import type { DashboardOverview, DashboardOverviewQuery } from "@/lib/dashboard-overview";
import type { FinanceOverview } from "@/lib/finance-overview";

import { api } from "./api-client";

export async function getSaasPlans() {
  return api.get("superadmin/saas-billing/plans").json<{ plans: any[] }>();
}

export async function createSaasPlan(input: any) {
  return api.post("superadmin/saas-billing/plans", { json: input }).json();
}

export async function updateSaasPlan(planId: string, input: any) {
  return api.patch(`superadmin/saas-billing/plans/${planId}`, { json: input }).json();
}

export async function deleteSaasPlan(planId: string) {
  await api.delete(`superadmin/saas-billing/plans/${planId}`);
}

export async function createSaasPlanVersion(planId: string, input: any) {
  return api.post(`superadmin/saas-billing/plans/${planId}/versions`, { json: input }).json();
}

export async function updateSaasPlanVersion(planVersionId: string, input: any) {
  return api.patch(`superadmin/saas-billing/plan-versions/${planVersionId}`, { json: input }).json();
}

export async function publishSaasPlanVersion(planVersionId: string) {
  return api.post(`superadmin/saas-billing/plan-versions/${planVersionId}/publish`).json();
}

export async function getSaasCoupons() {
  return api.get("superadmin/saas-billing/coupons").json<{ coupons: any[] }>();
}

export async function createSaasCoupon(input: any) {
  return api.post("superadmin/saas-billing/coupons", { json: input }).json();
}

export async function updateSaasCoupon(couponId: string, input: any) {
  return api.patch(`superadmin/saas-billing/coupons/${couponId}`, { json: input }).json();
}

export async function deleteSaasCoupon(couponId: string) {
  await api.delete(`superadmin/saas-billing/coupons/${couponId}`);
}

export async function getSaasOrganizations() {
  return api.get("superadmin/saas-billing/organizations").json<{ organizations: any[] }>();
}

export async function getSaasFinanceOverview() {
  return api.get("superadmin/saas-billing/finance-overview").json<FinanceOverview>();
}

export async function getSaasDashboardOverview(query: DashboardOverviewQuery = {}) {
  const searchParams = new URLSearchParams();

  if (query.periodDays) {
    searchParams.set("periodDays", String(query.periodDays));
  }

  if (query.granularity) {
    searchParams.set("granularity", query.granularity);
  }

  if (query.segment) {
    searchParams.set("segment", query.segment);
  }

  const suffix = searchParams.toString();
  const path = suffix
    ? `superadmin/saas-billing/dashboard-overview?${suffix}`
    : "superadmin/saas-billing/dashboard-overview";

  return api.get(path).json<DashboardOverview>();
}

export async function getSaasOrganizationDetail(id: string) {
  return api.get(`superadmin/saas-billing/organizations/${id}`).json<any>();
}

export async function updateSaasOrganization(id: string, input: any) {
  return api.patch(`superadmin/saas-billing/organizations/${id}`, { json: input }).json();
}

export async function deleteSaasOrganization(id: string) {
  await api.delete(`superadmin/saas-billing/organizations/${id}`);
}

export async function createSaasOverride(id: string, input: any) {
  return api.post(`superadmin/saas-billing/organizations/${id}/overrides`, { json: input }).json();
}

export async function createTrialOverride(id: string, input: any) {
  return api.post(`superadmin/saas-billing/organizations/${id}/trial-override`, { json: input }).json();
}

export async function applyImmediatePlanChange(id: string, input: any) {
  return api.post(`superadmin/saas-billing/organizations/${id}/plan-change`, { json: input }).json();
}
