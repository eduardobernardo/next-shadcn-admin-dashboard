"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getProfile } from "@/http/get-profile";

export async function auth() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/auth/v2/login");
  }

  const profile = await getProfile().catch(() => null);
  if (profile?.account.platformRole !== "SUPERADMIN") {
    redirect("/auth/v2/login");
  }

  return profile;
}
