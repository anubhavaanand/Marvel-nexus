'use client'

import { motion } from 'framer-motion'

interface HomeClientProps {
  children: React.ReactNode
}

export default function HomeClient({ children }: HomeClientProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}

// Enhanced animated badge
export function AnimatedBadge({
  children,
  color = 'blue'
}: {
  children: React.ReactNode
  color?: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-[#0071e3]/10 border-[#0071e3]/20 text-[#0071e3]',
    yellow: 'bg-[#b45309]/10 border-[#b45309]/20 text-[#b45309]',
    red: 'bg-[#dc2626]/10 border-[#dc2626]/20 text-[#dc2626]',
    orange: 'bg-[#ea580c]/10 border-[#ea580c]/20 text-[#ea580c]',
    purple: 'bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#7c3aed]',
  }

  return (
    <motion.span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.span>
  )
}
