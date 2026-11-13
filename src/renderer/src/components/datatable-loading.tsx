import { Skeleton } from '@/components/ui/skeleton'
import { FolderOpen } from 'lucide-react'

interface DataTableLoadingProps {
  isEmpty?: boolean
  emptyMessage?: string
  rowCount?: number
  columnCount?: number
}

export default function DataTableLoading({
  isEmpty = false,
  emptyMessage = 'No matching records found in the database.',
  rowCount = 5,
  columnCount = 4
}: DataTableLoadingProps) {
  // Render clean empty illustration if search parameters returned zero elements
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="bg-muted p-4 rounded-full text-muted-foreground mb-4">
          <FolderOpen className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h3 className="font-semibold text-lg text-foreground tracking-tight">Empty Dataset</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs sm:max-w-sm">{emptyMessage}</p>
      </div>
    )
  }

  // Otherwise, render a beautifully structured table loading skeleton shell
  return (
    <div className="w-full space-y-4 py-4 animate-pulse">
      {/* Fake Header/Search Action Row */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-72 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Grid Layout Table Wireframe Structure */}
      <div className="rounded-md border bg-card">
        {/* Fake Table Header */}
        <div
          className="grid border-b p-4 bg-muted/30"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <Skeleton key={`head-${colIdx}`} className="h-4 w-20" />
          ))}
        </div>

        {/* Dynamic Skeleton Data Row Items */}
        <div className="divide-y">
          {Array.from({ length: rowCount }).map((_, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className="grid p-4 items-center"
              style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
            >
              {Array.from({ length: columnCount }).map((_, colIdx) => (
                <Skeleton
                  key={`cell-${rowIdx}-${colIdx}`}
                  className="h-4"
                  style={{ width: `${Math.floor(Math.random() * (90 - 40 + 1) + 40)}%` }} // Random width for natural UI text variation
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Fake Pagination Layout Anchor */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}
