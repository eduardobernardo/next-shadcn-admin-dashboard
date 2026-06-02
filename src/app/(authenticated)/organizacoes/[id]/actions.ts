"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { HTTPError } from "ky";

import {
  applyImmediatePlanChange,
  createSaasOverride,
  createTrialOverride,
  deleteSaasOrganization,
  updateSaasOrganization,
} from "@/http/saas-billing";

function buildRedirectUrl(path: string, status: "success" | "error", message: string) {
  const params = new URLSearchParams({
    status,
    message,
  });

  return `${path}?${params.toString()}`;
}

async function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HTTPError) {
    const response = await error.response.json<{ message?: string }>().catch(() => null);
    return response?.message ?? fallback;
  }

  return fallback;
}

function parseOptionalUrl(rawValue: FormDataEntryValue | null) {
  const value = String(rawValue ?? "").trim();
  return value ? value : null;
}

function parseOptionalColor(rawValue: FormDataEntryValue | null) {
  const value = String(rawValue ?? "").trim();
  return value || null;
}

export async function updateOrganizationAction(id: string, formData: FormData) {
  const returnTo = `/organizacoes/${id}/edit`;
  let status: "success" | "error" = "success";
  let message = "Organização atualizada com sucesso.";

  try {
    await updateSaasOrganization(id, {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      logoUrl: parseOptionalUrl(formData.get("logoUrl")),
      primaryColor: parseOptionalColor(formData.get("primaryColor")),
      organizationProfileType: String(formData.get("organizationProfileType") ?? "OTHER"),
      learningMode: String(formData.get("learningMode") ?? "COMMERCE"),
    });

    revalidatePath("/organizacoes");
    revalidatePath(`/organizacoes/${id}`);
    revalidatePath(returnTo);
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível atualizar a organização.");
  }

  redirect(buildRedirectUrl(returnTo, status, message));
}

export async function deleteOrganizationAction(id: string, expectedSlug: string, formData: FormData) {
  const returnTo = `/organizacoes/${id}/edit`;
  const confirmation = String(formData.get("confirmation") ?? "").trim();

  if (confirmation !== expectedSlug) {
    redirect(
      buildRedirectUrl(returnTo, "error", `Digite exatamente o slug ${expectedSlug} para confirmar a exclusão.`),
    );
  }

  let status: "success" | "error" = "success";
  let message = "Organização excluída com sucesso.";

  try {
    await deleteSaasOrganization(id);

    revalidatePath("/organizacoes");
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível excluir a organização.");
  }

  redirect(buildRedirectUrl(status === "success" ? "/organizacoes" : returnTo, status, message));
}

export async function createOverrideAction(id: string, formData: FormData) {
  const returnTo = `/organizacoes/${id}`;
  let status: "success" | "error" = "success";
  let message = "Override criado com sucesso.";

  try {
    await createSaasOverride(id, {
      scopeType: String(formData.get("scopeType") ?? "BOOLEAN_ENTITLEMENT"),
      scopeKey: String(formData.get("scopeKey") ?? ""),
      value: JSON.parse(String(formData.get("valueJson") ?? "{}")),
      durationType: String(formData.get("durationType") ?? "PERMANENT"),
      reason: String(formData.get("reason") ?? ""),
    });

    revalidatePath(returnTo);
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível criar o override.");
  }

  redirect(buildRedirectUrl(returnTo, status, message));
}

export async function createTrialOverrideAction(id: string, formData: FormData) {
  const returnTo = `/organizacoes/${id}`;
  let status: "success" | "error" = "success";
  let message = "Override de trial criado com sucesso.";

  try {
    await createTrialOverride(id, {
      email: String(formData.get("email") ?? ""),
      reason: String(formData.get("reason") ?? ""),
    });

    revalidatePath(returnTo);
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível criar o override de trial.");
  }

  redirect(buildRedirectUrl(returnTo, status, message));
}

export async function applyImmediatePlanChangeAction(id: string, formData: FormData) {
  const returnTo = `/organizacoes/${id}`;
  let status: "success" | "error" = "success";
  let message = "Troca imediata de plano aplicada.";

  try {
    await applyImmediatePlanChange(id, {
      planSlug: String(formData.get("planSlug") ?? "growth"),
      billingCycle: String(formData.get("billingCycle") ?? "MONTHLY"),
    });

    revalidatePath("/organizacoes");
    revalidatePath(returnTo);
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível aplicar a troca de plano.");
  }

  redirect(buildRedirectUrl(returnTo, status, message));
}
