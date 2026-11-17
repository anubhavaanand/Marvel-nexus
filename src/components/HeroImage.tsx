import Image from 'next/image'
import HeroImageErrorHandler from './HeroImageErrorHandler'

interface HeroImageProps {
  imageUrl: string | null
  alias: string
  name?: string
  className?: string
  sizes?: string
  priority?: boolean
  /** #419: movie cards look up posters via the movie endpoint. */
  lookupType?: 'person' | 'movie'
}

export default function HeroImage({
  imageUrl,
  alias,
  name = '',
  className = '',
  sizes = '(max-width: 768px) 50vw, 25vw',
  priority = false,
  lookupType = 'person',
}: HeroImageProps) {
  if (!imageUrl) {
    return <HeroImagePlaceholder alias={alias} className={className} />
  }

  return (
    <HeroImageErrorHandler
      name={name}
      alias={alias}
      className={className}
      sizes={sizes}
      priority={priority}
      lookupType={lookupType}
    >
      <Image
        src={imageUrl}
        alt={alias}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    </HeroImageErrorHandler>
  )
}

function HeroImagePlaceholder({ alias, className }: { alias: string; className?: string }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-900 to-black ${className}`}
    >
      <span
        className="text-6xl font-bold opacity-[0.06] select-none"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {alias
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)}
      </span>
    </div>
  )
}
