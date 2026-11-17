import type { Metadata } from 'next'
import WatchOrderClient from '@/components/watch-order/WatchOrderClient'

export const metadata: Metadata = {
  title: 'Watch Order | Multiverse Archive',
  description:
    'The complete guide to watching the MCU and DC Universe in perfect chronological or release order.',
  openGraph: {
    title: 'Watch Order | Multiverse Archive',
    description: 'Watch the MCU and DC Universe in perfect order — chronological or release.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary',
    title: 'Watch Order | Multiverse Archive',
    description: 'Watch the MCU and DC Universe in perfect order.',
  },
}

export default function WatchOrderPage() {
  return <WatchOrderClient />
}
