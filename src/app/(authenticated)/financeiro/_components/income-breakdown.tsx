import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatFinanceCurrency } from "@/lib/finance-formatters";
import type { FinanceRevenueByPlan } from "@/lib/finance-overview";

const BAR_OPACITIES = ["bg-chart-3", "bg-chart-3/75", "bg-chart-3/50", "bg-chart-3/35"];

type IncomeBreakdownProps = {
  revenueByPlan: FinanceRevenueByPlan[];
};

export function IncomeBreakdown({ revenueByPlan }: IncomeBreakdownProps) {
  const items = revenueByPlan.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Receita por plano</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-1 md:grid-cols-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <section key={item.planSlug} className="isolate flex gap-[0.5px]">
              <Separator
                orientation="vertical"
                className="mb-1 h-auto self-auto border-muted-foreground/50 border-l border-dashed bg-transparent"
              />
              <div className="flex min-h-24 flex-1 flex-col justify-between">
                <div className="flex min-w-0 flex-col gap-1 px-1">
                  <p className="wrap-break-word text-muted-foreground text-xs leading-none">
                    {item.planName} · {item.sharePercent}%
                  </p>
                  <div className="text-lg leading-none tracking-tight">{formatFinanceCurrency(item.amountCents)}</div>
                </div>
                <div className={`-ml-0.5 h-5 rounded-sm ${BAR_OPACITIES[index] ?? BAR_OPACITIES[3]}`} />
              </div>
            </section>
          ))
        ) : (
          <p className="col-span-full text-muted-foreground text-sm">
            Nenhuma assinatura ativa com receita recorrente.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
