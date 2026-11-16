import { Skeleton } from '@/components/Skeleton'

export default function AdminLoading() {
  return (
    <main className="min-h-screen px-4 sm:px-8 pt-8 pb-32 bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12 pt-8 space-y-4">
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
