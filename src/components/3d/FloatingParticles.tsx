'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingParticlesProps {
    count?: number
    color?: string
    size?: number
    spread?: number
    speed?: number
}

export default function FloatingParticles({
    count = 150,
    color = '#00ffff',
    size = 0.03,
    spread = 40,
    speed = 0.02,
}: FloatingParticlesProps) {
    const ref = useRef<THREE.Points>(null!)

    // Generate random positions for particles
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            pos[i3] = (Math.random() - 0.5) * spread
            pos[i3 + 1] = (Math.random() - 0.5) * spread
            pos[i3 + 2] = (Math.random() - 0.5) * spread
        }
        return pos
    }, [count, spread])

    // Animation loop
    useFrame((state) => {
        if (ref.current) {
            // Slow rotation for ambient effect
            ref.current.rotation.x = state.clock.elapsedTime * speed
            ref.current.rotation.y = state.clock.elapsedTime * speed * 1.5

            // Slight wave motion
            ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
        }
    })

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={color}
                size={size}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.5}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    )
}
