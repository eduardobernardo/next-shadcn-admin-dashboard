"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { HTTPError } from "ky";

import {
  createSaasPlan,
  createSaasPlanVersion,
  deleteSaasPlan,
  publishSaasPlanVersion,
  updateSaasPlan,
  updateSaasPlanVersion,
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

function parseBooleanRecord(rawValue: FormDataEntryValue | null) {
  const parsed = JSON.parse(String(rawValue ?? "{}"));

  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("Entitlements precisam ser um objeto JSON.");
  }

  return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, Boolean(value)]));
}

function parseStringArray(rawValue: FormDataEntryValue | null) {
  return String(rawValue ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function createPlanAction(formData: FormData) {
  let status: "success" | "error" = "success";
  let message = "Família de plano criada com sucesso.";

  try {
    await createSaasPlan({
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      salesMode: String(formData.get("salesMode") ?? "SELF_SERVICE"),
      visibility: String(formData.get("visibility") ?? "PUBLIC"),
      displayOrder: Number(formData.get("displayOrder") ?? 0),
      highlighted: formData.get("highlighted") === "on",
    });

    revalidatePath("/planos");
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível criar o plano.");
  }

  redirect(buildRedirectUrl("/planos", status, message));
}

export async function createPlanVersionAction(formData: FormData) {
  let status: "success" | "error" = "success";
  let message = "Nova versão draft criada com sucesso.";
  const planId = String(formData.get("planId") ?? "");

  try {
    await createSaasPlanVersion(planId, {
      monthlyPriceCents: Number(formData.get("monthlyPriceCents") ?? 0),
      annualPriceCents: Number(formData.get("annualPriceCents") ?? 0),
      marketingDescription: String(formData.get("marketingDescription") ?? ""),
      ctaLabel: String(formData.get("ctaLabel") ?? "Teste gratis"),
      limits: {
        members: Number(formData.get("members") ?? 0),
        admins: Number(formData.get("admins") ?? 0),
        storageBytes: Number(formData.get("storageBytes") ?? 0),
        courses: Number(formData.get("courses") ?? 0),
        lessons: Number(formData.get("lessons") ?? 0),
      },
      entitlements: parseBooleanRecord(formData.get("entitlementsJson")),
      publicBadges: parseStringArray(formData.get("publicBadges")),
    });

    revalidatePath("/planos");
    revalidatePath(`/planos/${planId}`);
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível criar a versão do plano.");
  }

  redirect(buildRedirectUrl("/planos", status, message));
}

export async function publishPlanVersionAction(formData: FormData) {
  const returnTo = String(formData.get("returnTo") ?? "/planos");
  let status: "success" | "error" = "success";
  let message = "Versão publicada com sucesso.";

  try {
    await publishSaasPlanVersion(String(formData.get("planVersionId") ?? ""));

    revalidatePath("/planos");
    if (returnTo.startsWith("/planos/")) {
      revalidatePath(returnTo);
    }
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível publicar a versão.");
  }

  redirect(buildRedirectUrl(returnTo, status, message));
}

export async function updatePlanAction(planId: string, formData: FormData) {
  const returnTo = `/planos/${planId}/edit`;
  let status: "success" | "error" = "success";
  let message = "Família de plano atualizada.";

  try {
    await updateSaasPlan(planId, {
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      salesMode: String(formData.get("salesMode") ?? "SELF_SERVICE"),
      visibility: String(formData.get("visibility") ?? "PUBLIC"),
      displayOrder: Number(formData.get("displayOrder") ?? 0),
      highlighted: formData.get("highlighted") === "on",
    });

    revalidatePath("/planos");
    revalidatePath(`/planos/${planId}`);
    revalidatePath(returnTo);
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível atualizar o plano.");
  }

  redirect(buildRedirectUrl(returnTo, status, message));
}

export async function updatePlanVersionAction(planId: string, planVersionId: string, formData: FormData) {
  const returnTo = `/planos/${planId}/edit`;
  let status: "success" | "error" = "success";
  let message = "Versão do plano atualizada.";

  try {
    await updateSaasPlanVersion(planVersionId, {
      monthlyPriceCents: Number(formData.get("monthlyPriceCents") ?? 0),
      annualPriceCents: Number(formData.get("annualPriceCents") ?? 0),
      marketingDescription: String(formData.get("marketingDescription") ?? ""),
      ctaLabel: String(formData.get("ctaLabel") ?? "Teste gratis"),
      limits: {
        members: Number(formData.get("members") ?? 0),
        admins: Number(formData.get("admins") ?? 0),
        storageBytes: Number(formData.get("storageBytes") ?? 0),
        courses: Number(formData.get("courses") ?? 0),
        lessons: Number(formData.get("lessons") ?? 0),
      },
      entitlements: parseBooleanRecord(formData.get("entitlementsJson")),
      publicBadges: parseStringArray(formData.get("publicBadges")),
    });

    revalidatePath("/planos");
    revalidatePath(`/planos/${planId}`);
    revalidatePath(returnTo);
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível atualizar a versão do plano.");
  }

  redirect(buildRedirectUrl(returnTo, status, message));
}

export async function deletePlanAction(planId: string, expectedSlug: string, formData: FormData) {
  const returnTo = `/planos/${planId}/edit`;
  const confirmation = String(formData.get("confirmation") ?? "").trim();

  if (confirmation !== expectedSlug) {
    redirect(
      buildRedirectUrl(returnTo, "error", `Digite exatamente o slug ${expectedSlug} para confirmar a exclusão.`),
    );
  }

  let status: "success" | "error" = "success";
  let message = "Plano removido com sucesso.";

  try {
    await deleteSaasPlan(planId);

    revalidatePath("/planos");
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível excluir o plano.");
  }

  redirect(buildRedirectUrl(status === "success" ? "/planos" : returnTo, status, message));
}
