'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function RestrictedAccessMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="glass-panel max-w-md w-full p-8 rounded-2xl text-center relative z-10 border-cyan-500/30"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {children}
    </motion.div>
  )
}
