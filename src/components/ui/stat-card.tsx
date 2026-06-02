import { cn } from "@/lib/utils"
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react"
import { StatCardSparkline } from "./stat-card-sparkline"

interface StatCardProps {
  title: string
  value: string | number | null
  icon?: LucideIcon
  comparison?: string | null
  trend?: number // percentage change
  sparklineData?: { value: number }[] // simple array of values
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  comparison,
  trend,
  sparklineData,
  className,
}: StatCardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0
  const hasSparkline = sparklineData && sparklineData.length > 0

  return (
    <div
      className={cn(
        "relative p-6 flex flex-col justify-between min-h-[120px]",
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</div>
          {Icon && (
            <div className="p-1 rounded-md bg-muted/50">
              <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
            </div>
          )}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="text-3xl font-bold font-mono tracking-tighter text-foreground">{value}</div>
          {hasSparkline && (
            <StatCardSparkline data={sparklineData} isPositiveTrend={isPositiveTrend} />
          )}
        </div>
      </div>
      {(comparison || trend !== undefined) && (
        <div className="flex items-center gap-2 text-[11px] mt-3">
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 font-mono font-medium",
                isPositiveTrend
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {isPositiveTrend ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {isPositiveTrend ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
            </div>
          )}
          {comparison && (
            <span className="text-muted-foreground leading-tight">{comparison}</span>
          )}
        </div>
      )}
    </div>
  )
}
