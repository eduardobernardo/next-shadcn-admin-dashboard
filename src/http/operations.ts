import type { OperationsOverview } from "@/lib/operations-overview";

import { api } from "./api-client";

export async function getOperationsOverview() {
  return api.get("superadmin/operations/overview").json<OperationsOverview>();
}
