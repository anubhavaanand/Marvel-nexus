'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ScrollCameraProps {
    scrollY?: number
    maxDistance?: number
    intensity?: number
}

export default function ScrollCamera({
    scrollY = 0,
    maxDistance = 5,
    intensity = 0.5,
}: ScrollCameraProps) {
    const { camera } = useThree()
    const targetPosition = useRef(new THREE.Vector3(0, 0, 10))
    const targetRotation = useRef(new THREE.Euler(0, 0, 0))

    useEffect(() => {
        // Calculate camera position based on scroll
        const normalizedScroll = Math.min(scrollY / 3000, 1)

        // Move camera forward/backward based on scroll
        targetPosition.current.z = 10 - normalizedScroll * maxDistance

        // Slight tilt based on scroll
        targetRotation.current.x = normalizedScroll * 0.1 * intensity
    }, [scrollY, maxDistance, intensity])

    useFrame(() => {
        // Smooth camera movement
        camera.position.lerp(targetPosition.current, 0.05)

        // Smooth rotation
        camera.rotation.x = THREE.MathUtils.lerp(
            camera.rotation.x,
            targetRotation.current.x,
            0.05
        )
    })

    return null
}

// Hook to track scroll position
export function useScrollPosition() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial value

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return scrollY
}
