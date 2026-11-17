import { TimelineSkeleton } from '@/components/Skeleton'

export default function TimelineLoading() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]"
    >
      <TimelineSkeleton count={5} />
    </main>
  )
}
