'use client'

import dynamic from 'next/dynamic'

// Lazy-load the recharts-backed chart so its bundle only loads when the radar
// is actually viewed (issue #355).
const PowerRadarChart = dynamic(() => import('@/components/PowerRadarChart'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-orbitron text-cyan-400 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" aria-hidden="true" />
        Power Analysis
      </h3>
      <div className="h-72 w-full h-full skeleton flex items-center justify-center">
        <span className="text-xs text-neutral-500 font-roboto-mono">
          INITIALIZING_DIAGNOSTICS...
        </span>
      </div>
    </div>
  ),
})

export default PowerRadarChart
