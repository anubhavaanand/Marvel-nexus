'use client'

import { Canvas } from '@react-three/fiber'
import { Preload, PerformanceMonitor, Stars } from '@react-three/drei'
import { Suspense, useState, useEffect, useCallback, ReactNode, useMemo } from 'react'

interface Scene3DWrapperProps {
    children: ReactNode
    className?: string
}

// Check for WebGL support
function isWebGLAvailable(): boolean {
    if (typeof window === 'undefined') return false
    try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        return !!gl
    } catch {
        return false
    }
}

// Minimal 3D Scene content using drei's Stars component
function MinimalSceneContent() {
    return (
        <>
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.2} color="#00ffff" />
            <Stars
                radius={50}
                depth={30}
                count={200}
                factor={2}
                saturation={0}
                fade
                speed={0.5}
            />
            <Preload all />
        </>
    )
}

export default function Scene3DWrapper({ children, className = '' }: Scene3DWrapperProps) {
    const [dpr, setDpr] = useState(1)
    const [webglSupported, setWebglSupported] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setWebglSupported(isWebGLAvailable())
    }, [])

    const handleIncline = useCallback(() => {
        setDpr(prev => Math.min(prev + 0.25, 1.5))
    }, [])

    const handleDecline = useCallback(() => {
        setDpr(prev => Math.max(prev - 0.25, 0.5))
    }, [])

    // SSR or no WebGL support or error - just render children
    if (!mounted || !webglSupported || hasError) {
        return <div className={`relative ${className}`}>{children}</div>
    }

    return (
        <div className={`relative ${className}`}>
            {/* 3D Canvas - Fixed background with particles */}
            <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
                <Canvas
                    dpr={dpr}
                    gl={{
                        antialias: false,
                        alpha: true,
                        powerPreference: 'low-power',
                        stencil: false,
                        depth: false,
                        failIfMajorPerformanceCaveat: true,
                    }}
                    camera={{
                        position: [0, 0, 1],
                        fov: 60,
                        near: 0.1,
                        far: 100,
                    }}
                    onCreated={({ gl }) => {
                        // Handle context loss
                        const canvas = gl.domElement
                        canvas.addEventListener('webglcontextlost', (e) => {
                            e.preventDefault()
                            console.warn('WebGL context lost, disabling 3D')
                            setHasError(true)
                        })
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <PerformanceMonitor
                        onIncline={handleIncline}
                        onDecline={handleDecline}
                        flipflops={2}
                        factor={0.5}
                    >
                        <Suspense fallback={null}>
                            <MinimalSceneContent />
                        </Suspense>
                    </PerformanceMonitor>
                </Canvas>
            </div>

            {/* Content layer */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
