import ky from "ky";

export async function signInSuperadminWithPassword(input: { email: string; password: string }) {
  return ky
    .post(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}/sessions/superadmin/password`, {
      json: input,
    })
    .json<{ token: string }>();
}
