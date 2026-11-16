import { Skeleton } from '@/components/Skeleton'

export default function WatchOrderLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="container-wide py-28 sm:py-36">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Skeleton className="h-6 w-40 mx-auto" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>
      </div>
      <div className="container-wide">
        <div className="max-w-4xl mx-auto space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-glass overflow-hidden p-4 flex gap-4">
              <Skeleton className="h-24 w-24 rounded-xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
