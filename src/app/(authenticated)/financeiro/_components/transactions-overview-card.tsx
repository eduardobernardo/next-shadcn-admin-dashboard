"use client";

import { parseISO } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatFinanceCurrency } from "@/lib/finance-formatters";
import type { FinanceCashflowPoint } from "@/lib/finance-overview";

const chartConfig = {
  paid: {
    label: "Recebido",
    color: "var(--chart-1)",
  },
  pending: {
    label: "Pendente",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type TransactionsOverviewCardProps = {
  timeline: FinanceCashflowPoint[];
};

export function TransactionsOverviewCard({ timeline }: TransactionsOverviewCardProps) {
  const chartData = timeline.map((point) => ({
    periodStart: point.periodStart,
    timestamp: parseISO(point.periodStart).getTime(),
    paid: point.paidCents / 100,
    pending: point.pendingCents / 100,
  }));

  const chartDomain = chartData.length
    ? [chartData[0].timestamp, chartData[chartData.length - 1].timestamp + 7 * 24 * 60 * 60 * 1000]
    : [0, 1];

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="leading-none">Fluxo de caixa</CardTitle>
        <CardAction>
          <span className="text-muted-foreground text-xs">Últimas 12 semanas</span>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />
            <XAxis
              axisLine={false}
              dataKey="timestamp"
              domain={chartDomain}
              scale="time"
              tickFormatter={(value) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              tickLine={false}
              tickMargin={10}
              type="number"
            />
            <YAxis hide axisLine={false} tickLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const point = payload?.[0]?.payload as { periodStart?: string } | undefined;
                    if (!point?.periodStart) return "";
                    return parseISO(point.periodStart).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                    });
                  }}
                  formatter={(value, name) => [
                    formatFinanceCurrency(Math.round(Number(value) * 100)),
                    name === "paid" ? "Recebido" : "Pendente",
                  ]}
                />
              }
            />
            <Line
              connectNulls
              dataKey="paid"
              dot={false}
              stroke="var(--color-paid)"
              strokeDasharray="5 5"
              strokeLinecap="round"
              strokeWidth={1}
              type="monotone"
            />
            <Line
              dataKey="pending"
              dot={false}
              stroke="var(--color-pending)"
              strokeLinecap="round"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
