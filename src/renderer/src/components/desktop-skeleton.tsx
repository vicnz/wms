import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="h-full w-full bg-muted/30">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r bg-background p-4 lg:block">
          <Skeleton className="mb-8 h-8 w-32" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            <header className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-4 w-72" />
              </div>
              <Skeleton className="size-10 rounded-full" />
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-xl border bg-background p-5">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-xl border bg-background p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
                <Skeleton className="h-72 w-full" />
              </div>

              <div className="rounded-xl border bg-background p-6">
                <div className="mb-6 flex flex-col gap-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex flex-col gap-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-xl border bg-background p-6">
              <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-9 w-24" />
              </div>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
