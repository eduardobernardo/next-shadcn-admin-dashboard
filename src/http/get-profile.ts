import { api } from "./api-client";

export interface SuperadminProfile {
  account: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    platformRole: "USER" | "SUPERADMIN";
  };
  user: null;
  organizations: { id: string; name: string; slug: string }[];
}

export async function getProfile() {
  return api.get("profile").json<SuperadminProfile>();
}
