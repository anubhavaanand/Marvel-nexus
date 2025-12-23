import Link from 'next/link'
import { Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                {/* Glitch Effect Title */}
                <div className="relative mb-8">
                    <h1 className="text-8xl md:text-9xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyan-500">
                        404
                    </h1>
                    <div className="absolute inset-0 text-8xl md:text-9xl font-bold font-orbitron text-red-500/20 animate-pulse">
                        404
                    </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-red-950/30 border border-red-500/30">
                        <AlertTriangle className="w-12 h-12 text-red-400" />
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-orbitron text-white mb-4">
                    DIMENSION NOT FOUND
                </h2>

                <p className="text-neutral-400 max-w-md mx-auto mb-8 font-inter">
                    This reality appears to have been erased from the multiverse.
                    Perhaps it was a canon event that needed to happen.
                </p>

                {/* Glitch Text */}
                <div className="glitch-text text-sm mb-8">
                    ⚠️ REALITY BREACH DETECTED
                </div>

                {/* Action Button */}
                <Link href="/">
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-orbitron gap-2">
                        <Home className="w-4 h-4" />
                        Return to Archive
                    </Button>
                </Link>

                {/* Decorative Elements */}
                <div className="mt-12 flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-cyan-500/30"
                            style={{
                                animation: `pulse 2s ease-in-out ${i * 0.2}s infinite`
                            }}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}
