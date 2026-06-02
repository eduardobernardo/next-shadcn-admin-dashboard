"use server";

import { cookies } from "next/headers";

import { HTTPError } from "ky";

import { signInSuperadminWithPassword } from "@/http/sign-in-superadmin";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const { token } = await signInSuperadminWithPassword({ email, password });

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true as const };
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.response.status === 400 || error.response.status === 401) {
        return {
          success: false as const,
          message: "Falha no login. Verifique suas credenciais.",
        };
      }

      const response = await error.response.json<{ message?: string }>().catch(() => null);

      return {
        success: false as const,
        message: response?.message ?? "Não foi possível realizar login no momento.",
      };
    }

    return {
      success: false as const,
      message: "Não foi possível realizar login no momento.",
    };
  }
}
