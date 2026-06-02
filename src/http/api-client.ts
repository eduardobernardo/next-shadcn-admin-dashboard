import { cookies } from "next/headers";

import ky from "ky";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333",
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = (await cookies()).get("token")?.value;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});
