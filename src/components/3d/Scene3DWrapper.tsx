'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Preload, PerformanceMonitor, Stars, Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei'
import { Suspense, useState, useEffect, useCallback, ReactNode, useRef } from 'react'
import * as THREE from 'three'

interface Scene3DWrapperProps {
    children: ReactNode
    className?: string
}

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

function FloatingGeometry({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
    const groupRef = useRef<THREE.Group>(null!)
    const torusRef = useRef<THREE.Mesh>(null!)
    const sphereRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        if (groupRef.current) {
            const targetRotX = mouse.current.y * 0.05
            const targetRotY = mouse.current.x * 0.08
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x, targetRotX, 0.02
            )
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y, targetRotY, 0.02
            )
        }
        if (torusRef.current) {
            torusRef.current.rotation.x = state.clock.elapsedTime * 0.05
            torusRef.current.rotation.y = state.clock.elapsedTime * 0.08
        }
        if (sphereRef.current) {
            sphereRef.current.rotation.x = state.clock.elapsedTime * 0.03
            sphereRef.current.rotation.y = state.clock.elapsedTime * 0.05
        }
    })

    return (
        <group ref={groupRef}>
            <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.3}>
                <mesh ref={torusRef} position={[-3, 1, -8]}>
                    <torusGeometry args={[1.2, 0.3, 32, 64]} />
                    <MeshDistortMaterial
                        color="#0071e3"
                        emissive="#0071e3"
                        emissiveIntensity={0.15}
                        transparent
                        opacity={0.15}
                        wireframe
                        distort={0.1}
                        speed={0.5}
                    />
                </mesh>
            </Float>

            <Float speed={0.2} rotationIntensity={0.05} floatIntensity={0.2}>
                <mesh ref={sphereRef} position={[4, -2, -12]}>
                    <icosahedronGeometry args={[0.8, 1]} />
                    <MeshDistortMaterial
                        color="#60a5fa"
                        emissive="#60a5fa"
                        emissiveIntensity={0.1}
                        transparent
                        opacity={0.08}
                        wireframe
                        distort={0.05}
                        speed={0.3}
                    />
                </mesh>
            </Float>
        </group>
    )
}

function generateParticlePositions(count: number): Float32Array {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        pos[i3] = (Math.random() - 0.5) * 60
        pos[i3 + 1] = (Math.random() - 0.5) * 40
        pos[i3 + 2] = (Math.random() - 0.5) * 30 - 10
    }
    return pos
}

const PARTICLE_POSITIONS = generateParticlePositions(200)

function SoothingParticles() {
    const ref = useRef<THREE.Points>(null!)

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.008
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.02
        }
    })

    return (
        <Points ref={ref} positions={PARTICLE_POSITIONS} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#a1a1a6"
                size={0.04}
                sizeAttenuation
                depthWrite={false}
                opacity={0.4}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    )
}

function MinimalSceneContent({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.1} color="#0071e3" />
            <Stars
                radius={80}
                depth={40}
                count={300}
                factor={2}
                saturation={0}
                fade
                speed={0.3}
            />
            <SoothingParticles />
            <FloatingGeometry mouse={mouse} />
            <Preload all />
        </>
    )
}

export default function Scene3DWrapper({ children, className = '' }: Scene3DWrapperProps) {
    const [dpr, setDpr] = useState(1)
    const [webglSupported, setWebglSupported] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [mounted, setMounted] = useState(false)
    const mouse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true)
            setWebglSupported(isWebGLAvailable())
        })
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        }
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const handleIncline = useCallback(() => {
        setDpr(prev => Math.min(prev + 0.25, 1.5))
    }, [])

    const handleDecline = useCallback(() => {
        setDpr(prev => Math.max(prev - 0.25, 0.5))
    }, [])

    if (!mounted || !webglSupported || hasError) {
        return <div className={`relative ${className}`}>{children}</div>
    }

    return (
        <div className={`relative ${className}`}>
            <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
                <Canvas
                    dpr={dpr}
                    gl={{
                        antialias: false,
                        alpha: true,
                        powerPreference: 'low-power',
                        stencil: false,
                        depth: false,
                    }}
                    camera={{ position: [0, 0, 1], fov: 60, near: 0.1, far: 100 }}
                    onCreated={({ gl }) => {
                        const canvas = gl.domElement
                        canvas.addEventListener('webglcontextlost', (e) => {
                            e.preventDefault()
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
                        flipflops={3}
                        factor={0.5}
                    >
                        <Suspense fallback={null}>
                            <MinimalSceneContent mouse={mouse} />
                        </Suspense>
                    </PerformanceMonitor>
                </Canvas>
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
