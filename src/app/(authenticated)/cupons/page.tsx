import Link from "next/link";

import { Plus } from "lucide-react";

import { FeedbackAlert } from "@/components/feedback-alert";
import { Button } from "@/components/ui/button";
import { getSaasCoupons } from "@/http/saas-billing";
import { getFeedback } from "@/lib/saas-formatters";

import { CouponsList } from "./_components/coupons-list";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CuponsPage({ searchParams }: Props) {
  const [{ coupons }, resolvedSearchParams] = await Promise.all([
    getSaasCoupons().catch(() => ({ coupons: [] })),
    searchParams ?? Promise.resolve({}),
  ]);

  const feedback = getFeedback(resolvedSearchParams);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl tracking-tight">Cupons</h1>
          <p className="text-muted-foreground text-sm">Gerencie os cupons de desconto da plataforma</p>
        </div>
        <Button size="sm" className="h-8 gap-1" asChild>
          <Link href="/cupons/novo">
            <Plus className="size-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Novo cupom</span>
          </Link>
        </Button>
      </div>

      {feedback ? <FeedbackAlert status={feedback.status} message={feedback.message} /> : null}

      <CouponsList coupons={coupons} />
    </div>
  );
}
