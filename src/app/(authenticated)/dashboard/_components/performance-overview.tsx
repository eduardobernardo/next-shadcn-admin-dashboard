"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { format, parseISO } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DashboardActivityPoint } from "@/lib/dashboard-overview";

const chartConfig = {
  newCustomers: {
    label: "Novas organizações",
    color: "var(--chart-1)",
  },
  activeAccounts: {
    label: "Contas ativas",
    color: "var(--chart-2)",
  },
  returningUsers: {
    label: "Renovações",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type PerformanceOverviewProps = {
  timeline: DashboardActivityPoint[];
  periodDays: number;
  segment: "all" | "paid" | "organic";
};

function buildChartData(timeline: DashboardActivityPoint[]) {
  return timeline.map((point) => ({
    date: format(parseISO(point.periodStart), "yyyy-MM-dd"),
    newCustomers: point.newOrganizations,
    activeAccounts: point.activeSubscriptions,
    returningUsers: point.subscriptionRenewals,
  }));
}

export function PerformanceOverview({ timeline, periodDays, segment }: PerformanceOverviewProps) {
  const router = useRouter();
  const chartData = buildChartData(timeline);
  const hasActivity = chartData.some(
    (point) => point.newCustomers > 0 || point.activeAccounts > 0 || point.returningUsers > 0,
  );

  function updateFilters(next: { periodDays?: number; segment?: string }) {
    const params = new URLSearchParams();
    params.set("periodDays", String(next.periodDays ?? periodDays));
    params.set("segment", next.segment ?? segment);
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="leading-none">Atividade de assinaturas</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Novas organizações, contas ativas e renovações no período selecionado
          </span>
          <span className="@[540px]/card:hidden">Últimos {periodDays} dias</span>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Select value={String(periodDays)} onValueChange={(value) => updateFilters({ periodDays: Number(value) })}>
            <SelectTrigger size="sm" className="w-28">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Período</SelectLabel>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="90">3 meses</SelectItem>
                <SelectItem value="180">6 meses</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={segment} onValueChange={(value) => updateFilters({ segment: value })}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Segmentos</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="organic">Orgânicos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" asChild>
            <Link href="/organizacoes">Ver relatório</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 || !hasActivity ? (
          <div className="flex h-80 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
            Sem atividade de assinaturas no período.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
            <ComposedChart data={chartData} margin={{ top: 0 }}>
              <defs>
                <linearGradient id="fillNewCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-newCustomers)" stopOpacity={0.36} />
                  <stop offset="95%" stopColor="var(--color-newCustomers)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeOpacity={0.5} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={48}
                tickFormatter={(value) =>
                  parseISO(value).toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-50"
                    indicator="line"
                    labelFormatter={(value) => format(parseISO(String(value)), "d MMMM yyyy")}
                  />
                }
              />
              <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-5 justify-end" />} />

              <Area
                dataKey="newCustomers"
                type="natural"
                fill="url(#fillNewCustomers)"
                stroke="var(--color-newCustomers)"
                strokeWidth={1.25}
                dot={false}
                fillOpacity={1}
              />
              <Line
                dataKey="activeAccounts"
                type="natural"
                stroke="var(--color-activeAccounts)"
                strokeWidth={1.4}
                dot={false}
              />
              <Line
                dataKey="returningUsers"
                type="natural"
                stroke="var(--color-returningUsers)"
                strokeWidth={1.2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
