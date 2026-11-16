import { TimelineSkeleton } from '@/components/Skeleton'

export default function TimelineLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <TimelineSkeleton count={5} />
    </main>
  )
}
