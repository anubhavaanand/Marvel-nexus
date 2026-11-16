import { HeroProfileSkeleton } from '@/components/Skeleton'

export default function HeroLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <HeroProfileSkeleton />
    </main>
  )
}
