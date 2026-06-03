'use client'

import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

interface AnimeTitleProps {
  text: string
  className?: string
}

export default function AnimeTitle({ text, className = '' }: AnimeTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Wrap each letter in a span
    const textWrapper = containerRef.current.querySelector('.letters')
    if (textWrapper && textWrapper.textContent) {
      textWrapper.innerHTML = textWrapper.textContent.replace(
        /\S/g,
        "<span class='letter inline-block origin-bottom'>$&</span>"
      )
    }

    animate('.letters .letter', {
      translateY: [40, 0],
      opacity: [0, 1],
      scaleY: [0.3, 1],
      rotate: [15, 0],
      duration: 1200,
      delay: stagger(40)
    })
  }, [text])

  return (
    <h1
      ref={containerRef}
      className={`text-5xl sm:text-6xl md:text-7xl font-bold font-orbitron text-center mb-4 ${className}`}
    >
      <span className="text-wrapper relative inline-block overflow-hidden py-2">
        <span className="letters text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 text-glow">
          {text}
        </span>
      </span>
    </h1>
  )
}
