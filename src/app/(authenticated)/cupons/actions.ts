"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { HTTPError } from "ky";

import { createSaasCoupon, deleteSaasCoupon, updateSaasCoupon } from "@/http/saas-billing";

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

function parseStringArray(rawValue: FormDataEntryValue | null) {
  return String(rawValue ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseOptionalDate(rawValue: FormDataEntryValue | null) {
  const value = String(rawValue ?? "").trim();
  return value ? new Date(value).toISOString() : null;
}

function parseCheckbox(formData: FormData, name: string, defaultValue: boolean) {
  const values = formData.getAll(name);

  if (values.length === 0) {
    return defaultValue;
  }

  const lastValue = String(values[values.length - 1] ?? "");
  return lastValue === "true" || lastValue === "on";
}

function buildCouponPayload(formData: FormData, defaultActive = true) {
  return {
    code: String(formData.get("code") ?? ""),
    discountType: String(formData.get("discountType") ?? "PERCENTAGE"),
    discountValue: Number(formData.get("discountValue") ?? 0),
    durationType: String(formData.get("durationType") ?? "FIRST_INVOICE"),
    durationCycles: formData.get("durationCycles") ? Number(formData.get("durationCycles")) : null,
    allowedPlanSlugs: parseStringArray(formData.get("allowedPlanSlugs")),
    allowedCycles: parseStringArray(formData.get("allowedCycles")),
    validFrom: parseOptionalDate(formData.get("validFrom")),
    validUntil: parseOptionalDate(formData.get("validUntil")),
    organizationReusePolicy: String(formData.get("organizationReusePolicy") ?? "SINGLE_USE"),
    globalRedemptionLimit: formData.get("globalRedemptionLimit") ? Number(formData.get("globalRedemptionLimit")) : null,
    isActive: parseCheckbox(formData, "isActive", defaultActive),
  };
}

export async function createCouponAction(formData: FormData) {
  let status: "success" | "error" = "success";
  let message = "Cupom criado com sucesso.";

  try {
    await createSaasCoupon(buildCouponPayload(formData));

    revalidatePath("/cupons");
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível criar o cupom.");
  }

  redirect(buildRedirectUrl("/cupons", status, message));
}

export async function updateCouponAction(couponId: string, formData: FormData) {
  const returnTo = `/cupons/${couponId}/edit`;
  let status: "success" | "error" = "success";
  let message = "Cupom atualizado com sucesso.";

  try {
    await updateSaasCoupon(couponId, buildCouponPayload(formData, false));

    revalidatePath("/cupons");
    revalidatePath(`/cupons/${couponId}`);
    revalidatePath(returnTo);
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível atualizar o cupom.");
  }

  redirect(buildRedirectUrl(returnTo, status, message));
}

export async function deleteCouponAction(couponId: string, expectedCode: string, formData: FormData) {
  const returnTo = `/cupons/${couponId}/edit`;
  const confirmation = String(formData.get("confirmation") ?? "")
    .trim()
    .toUpperCase();

  if (confirmation !== expectedCode.toUpperCase()) {
    redirect(
      buildRedirectUrl(returnTo, "error", `Digite exatamente o código ${expectedCode} para confirmar a exclusão.`),
    );
  }

  let status: "success" | "error" = "success";
  let message = "Cupom excluído com sucesso.";

  try {
    await deleteSaasCoupon(couponId);

    revalidatePath("/cupons");
  } catch (error) {
    status = "error";
    message = await getErrorMessage(error, "Não foi possível excluir o cupom.");
  }

  redirect(buildRedirectUrl(status === "success" ? "/cupons" : returnTo, status, message));
}
