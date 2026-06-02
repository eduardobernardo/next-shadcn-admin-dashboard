import { cn } from "@/lib/utils"

interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5
}

export function StatsGrid({ children, className, columns = 4, ...props }: StatsGridProps) {
  const gridCols = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  }

  return (
    <div
      className={cn(
        "grid border rounded-xl shadow-sm overflow-hidden bg-card divide-y md:divide-y-0 md:divide-x",
        gridCols[columns],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
