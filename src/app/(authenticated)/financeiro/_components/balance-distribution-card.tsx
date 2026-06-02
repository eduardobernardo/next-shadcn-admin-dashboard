"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatFinanceCurrency, formatInvoiceStatus } from "@/lib/finance-formatters";
import type { FinanceInvoiceStatusSlice } from "@/lib/finance-overview";

const STATUS_COLORS: Record<string, string> = {
  PAID: "var(--chart-1)",
  PENDING: "var(--chart-2)",
  OVERDUE: "var(--chart-3)",
  FAILED: "var(--chart-4)",
  CANCELED: "var(--chart-5)",
};

type BalanceDistributionCardProps = {
  distribution: FinanceInvoiceStatusSlice[];
};

export function BalanceDistributionCard({ distribution }: BalanceDistributionCardProps) {
  const chartData = distribution.map((slice, index) => ({
    key: slice.status,
    account: formatInvoiceStatus(slice.status),
    amount: slice.amountCents / 100,
    percentage:
      distribution.reduce((total, item) => total + item.amountCents, 0) > 0
        ? Math.round((slice.amountCents / distribution.reduce((total, item) => total + item.amountCents, 0)) * 1000) /
          10
        : 0,
    fill: STATUS_COLORS[slice.status] ?? `var(--chart-${(index % 5) + 1})`,
  }));

  const chartConfig = chartData.reduce(
    (config, item) => {
      config[item.key] = { label: item.account, color: item.fill };
      return config;
    },
    { amount: { label: "Valor" } } as ChartConfig,
  );

  const totalBalance = distribution.reduce((total, item) => total + item.amountCents, 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Faturas por status</CardTitle>
        </CardHeader>
        <CardContent className="flex h-50 items-center justify-center text-muted-foreground text-sm">
          Sem faturas para exibir.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Faturas por status</CardTitle>
      </CardHeader>

      <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-50">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="w-52" nameKey="account" />}
            />
            <Pie
              cornerRadius={6}
              data={chartData}
              dataKey="amount"
              innerRadius={65}
              nameKey="account"
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                    return null;
                  }

                  return (
                    <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                      <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy ?? 0) - 8}>
                        Total
                      </tspan>
                      <tspan
                        className="fill-foreground font-medium text-lg tabular-nums"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                      >
                        {formatFinanceCurrency(totalBalance, true)}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex min-w-0 flex-col gap-3">
          {chartData.map((item) => (
            <div className="grid grid-cols-[1fr_auto] items-end gap-3" key={item.key}>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1">
                  <span aria-hidden="true" className="h-2 w-1 rounded-full" style={{ backgroundColor: item.fill }} />
                  <p className="truncate text-muted-foreground text-xs">{item.account}</p>
                </div>
                <p className="font-medium tabular-nums">{formatFinanceCurrency(item.amount * 100)}</p>
              </div>
              <div className="font-medium tabular-nums">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
