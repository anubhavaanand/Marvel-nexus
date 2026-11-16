import { HeroGridSkeleton } from '@/components/Skeleton'

export default function SearchLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <HeroGridSkeleton count={6} />
    </main>
  )
}
