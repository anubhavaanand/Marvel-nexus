'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ParallaxBackgroundProps {
    scrollY?: number
    layers?: number
    depth?: number
    color?: string
}

export default function ParallaxBackground({
    scrollY = 0,
    layers = 5,
    depth = 20,
    color = '#0891b2',
}: ParallaxBackgroundProps) {
    const groupRef = useRef<THREE.Group>(null!)
    const { viewport } = useThree()

    // Generate layer geometries
    const layerData = useMemo(() => {
        return Array.from({ length: layers }, (_, i) => ({
            z: -(i + 1) * (depth / layers),
            opacity: 0.1 - i * 0.015,
            scale: 1 + i * 0.5,
            speed: 0.02 / (i + 1),
        }))
    }, [layers, depth])

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle parallax based on mouse position
            const mouseX = state.pointer.x * 0.5
            const mouseY = state.pointer.y * 0.3

            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                mouseX * 0.1,
                0.02
            )
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                -mouseY * 0.1,
                0.02
            )
        }
    })

    return (
        <group ref={groupRef}>
            {layerData.map((layer, i) => (
                <mesh key={i} position={[0, 0, layer.z]}>
                    <planeGeometry args={[viewport.width * layer.scale * 2, viewport.height * layer.scale * 2]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={layer.opacity}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    )
}
