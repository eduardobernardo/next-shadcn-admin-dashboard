"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

interface StatCardSparklineProps {
  data: { value: number }[]
  isPositiveTrend: boolean
}

export function StatCardSparkline({ data, isPositiveTrend }: StatCardSparklineProps) {
  return (
    <div className="w-20 h-8 -mb-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositiveTrend ? "hsl(142 71% 45%)" : "hsl(var(--destructive))"}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
