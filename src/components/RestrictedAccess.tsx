import RestrictedAccessMotion from './RestrictedAccessMotion'
import { Lock, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * Server-rendered replacement screen for locked hero files.
 * Used after the server has verified that the visitor is not an admin, so no
 * protected fields ever reach the client.
 */
export default function RestrictedAccess() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(34,211,238,0.08) 0, rgba(34,211,238,0.08) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(34,211,238,0.08) 0, rgba(34,211,238,0.08) 1px, transparent 1px, transparent 40px)',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <RestrictedAccessMotion>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
            <Lock className="w-16 h-16 text-cyan-400 relative z-10" />
          </div>
        </div>

        <h1 className="text-3xl font-orbitron font-bold text-white mb-4">Restricted Access</h1>

        <p className="text-neutral-400 mb-8 font-inter">
          This character file is classified Level 10. Only authorized personnel with Admin clearance
          can view full details.
        </p>

        <div className="space-y-4">
          <Button
            className="w-full bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-400 border border-cyan-500/30"
            asChild
          >
            <Link href="/admin">
              <Shield className="w-4 h-4 mr-2" />
              Authenticate as Admin
            </Link>
          </Button>

          <Button variant="ghost" className="w-full text-neutral-500 hover:text-white" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Archive
            </Link>
          </Button>
        </div>
      </RestrictedAccessMotion>
    </main>
  )
}
